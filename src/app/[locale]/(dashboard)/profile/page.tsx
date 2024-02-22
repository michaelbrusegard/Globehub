import { Avatar } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import NextImage from 'next/image';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { redirect } from '@/lib/navigation';
import { validateProfile } from '@/lib/validation';

import { EditProfileModal } from '@/components/profile/EditProfileModal';

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

  if (!session?.user) {
    redirect('/');
  } else {
    return (
      <>
        <h1 className='my-4'>{t('myProfile')}</h1>
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
            src={session.user.image}
            isBordered
          />
          <div className='mt-4 flex-grow'>
            <div className='flex flex-row items-center justify-between'>
              <h2 className='text-2xl font-semibold'>{session.user.name}</h2>
              <EditProfileModal
                updateProfile={async (formData: FormData) => {
                  'use server';
                  if (!session.user) {
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

                  try {
                    await sql`
                    UPDATE users
                    SET bio = ${parsed.data.bio}
                    WHERE id = ${session.user.id}
                  `;
                  } catch (error) {
                    throw new Error('Failed to update profile');
                  }

                  revalidatePath('/[locale]/(dashboard)/profile');
                }}
                profile={{
                  bio: session.user.bio,
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
            {session.user.bio ? (
              <p className='mx-2 line-clamp-6 overflow-clip overflow-ellipsis sm:line-clamp-4'>
                {session.user.bio}
              </p>
            ) : (
              <p className='mx-2 italic text-default-400'>{t('emptyBio')}</p>
            )}
          </div>
        </div>
        {/* <h2 className='my-4 border-b border-divider pb-2 font-arimo text-3xl font-semibold tracking-tight'>
          Mine vurderinger
        </h2>
        <ul role='list' className='divide-y divide-gray-100'>
          {reviews.map((review) => (
            <Review
              profilepic={session.user.image}
              review={review}
              key={review.text}
            />
          ))}
        </ul> */}
      </>
    );
  }
}
