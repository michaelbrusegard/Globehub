import { Avatar } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import NextImage from 'next/image';

import { auth } from '@/lib/auth';
import { type Destination, sql } from '@/lib/db';
import { redirect } from '@/lib/navigation';
import { validateProfile } from '@/lib/validation';

import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

// import { Review } from '@/components/reviews/Review';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('myProfile'),
  };
}

export default async function Profile({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('profile');
  const session = await auth();
  const user = session?.user;
  const favorites: Destination[] = await sql`
    SELECT destinations.*
    FROM destinations
    INNER JOIN user_favorites ON destinations.id = user_favorites.destination_id
    WHERE user_favorites.user_id = ${user?.id ?? 0};
  `;
  if (!user) {
    redirect('/signin');
  } else {
    return (
      <>
        <h1 className='my-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
          {t('myProfile')}
        </h1>
        <div className='mb-10 flex flex-col gap-0 sm:flex-row sm:gap-3'>
          <Avatar
            className='mx-auto h-40 w-40 flex-shrink-0 sm:mx-0'
            classNames={{
              name: 'font-arimo font-semibold',
            }}
            ImgComponent={NextImage}
            imgProps={{
              width: 160,
              height: 160,
              fetchPriority: 'high',
              loading: 'eager',
            }}
            src={user.image}
            isBordered
          />
          <div className='mt-4 flex-grow'>
            <div className='flex flex-row items-center justify-between'>
              <h2 className='truncate text-2xl font-semibold'>{user.name}</h2>
              <EditProfileModal
                updateProfile={async (formData: FormData) => {
                  'use server';

                  if (!user) {
                    throw new Error(
                      'You must be signed in to perform this action',
                    );
                  }

                  const parsed = validateProfile(
                    Object.fromEntries(formData) as { bio: string },
                  );

                  if (!parsed.success) {
                    return;
                  }

                  await sql`
                    UPDATE users
                    SET bio = ${parsed.data.bio}
                    WHERE id = ${user.id}
                  `;

                  revalidatePath('/[locale]/(dashboard)/profile');
                }}
                profile={{
                  bio: user.bio,
                }}
                t={{
                  edit: t('edit'),
                  editBio: t('editBio'),
                  cancel: t('cancel'),
                  update: t('update'),
                  writeBio: t('writeBio'),
                  bioErrorMessage: t('bioErrorMessage'),
                }}
              />
            </div>
            {user.bio ? (
              <p className='mx-2 line-clamp-6 overflow-clip overflow-ellipsis sm:line-clamp-4'>
                {user.bio}
              </p>
            ) : (
              <p className='mx-2 italic text-default-400'>{t('emptyBio')}</p>
            )}
          </div>
        </div>
        <div className='flex w-full flex-col'>
          <ProfileTabs favorites={favorites} />
        </div>
      </>
    );
  }
}
