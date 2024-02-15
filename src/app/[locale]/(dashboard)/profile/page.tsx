import { Avatar } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import NextImage from 'next/image';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { redirect } from '@/lib/navigation';
import { validateProfile } from '@/lib/validation';

import { EditProfileModal } from '@/components/profile/EditProfileModal';

const reviews = [
  {
    dest: 'Milano',
    text: "Min ferie i Milano var fantastisk! Byen pulserte av liv og energi, og jeg ble overveldet av den imponerende arkitekturen og kulturelle rikdommen. Shoppingopplevelsene var en drøm med luksuriøse butikker og trendy boutiques. Maten var en høydepunkt, med deilige italienske retter som pasta, pizza og gelato. Besøket til ikoniske steder som Duomo-katedralen og Leonardo da Vinci's Nattverden var uforglemmelig. Milano kombinerte perfekt moderne stil med historisk sjarm, og jeg forlot byen med uforglemmelige minner og en dypere kjærlighet for italiensk kultur.",
    stars: 5,
    date: '03.06.20',
  },
  {
    dest: 'Shanghai',
    text: 'Min tid i Shanghai var en utrolig opplevelse! Byen imponerte meg med sin blendende skyline og futuristiske arkitektur. Å utforske den pulserende gatenan og nattmarkedene ga meg et autentisk innblikk i den lokale kulturen. Shanghai Tower og The Bund var spektakulære, spesielt om natten når lysene skapte en fantastisk atmosfære. Maten var en smakfull reise med dim sum, dumplings og deilig street food. Jeg nøt også å utforske de historiske områdene som Yuyuan-hagen og Jade Buddha-tempelet. Shanghai kombinerte moderne livsstil med kulturell rikdom på en unik måte, og jeg forlot byen med en dypere forståelse og beundring for den pulserende metropolen.',
    stars: 4,
    date: '26.05.18',
  },
  {
    dest: 'hhh',
    text: 'minhkdjfu',
    stars: 3,
    date: '09.12.23',
  },
];

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
        <h1 className='my-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-black tracking-tight text-transparent lg:text-5xl'>
          {t('myProfile')}
        </h1>
        <div className='mb-10 flex flex-col sm:flex-row'>
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
            src={session.user.image!}
            isBordered
          />
          <div className='flex flex-grow flex-row justify-between'>
            <div className='mt-4 space-y-1'>
              <h2 className='ml-1 text-2xl font-semibold'>
                {session.user.name}
              </h2>
              {session.user.bio ? (
                <p className='ml-4'>{session.user.bio}</p>
              ) : (
                <p className='ml-4 italic text-default-400'>{t('emptyBio')}</p>
              )}
            </div>
            <EditProfileModal
              className='mt-4'
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
                    WHERE id = ${session.user.id!}
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
        </div>
        <h2 className='my-4 border-b border-divider pb-2 font-arimo text-3xl font-semibold tracking-tight'>
          Mine vurderinger
        </h2>
        <ul role='list' className='divide-y divide-gray-100'>
          {reviews.map((reviews) => (
            <li
              key={reviews.text}
              className='flex justify-between gap-x-6 py-5'
            >
              <div className='flex min-w-0 gap-x-4'>
                {/* <img
                  className='h-12 w-12 flex-none rounded-full bg-gray-50'
                  src={session.user.image}
                  alt=''
                /> */}
                <div className='min-w-0 flex-auto'>
                  <p className='text-sm font-semibold leading-6'>
                    {reviews.dest + '  ' + reviews.stars + '/5'}
                  </p>
                  <p className='mt-1 text-xs leading-5 text-gray-500'>
                    {reviews.text}
                  </p>
                </div>
              </div>
              <div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
                <p className='mt-1 text-xs leading-5 text-gray-500'>
                  {reviews.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
