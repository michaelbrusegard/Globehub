import { Button, Link } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { auth, signOut } from '@/lib/auth';

import { ProfileDropdown } from '@/components/layout/ProfileDropdown';

function getInitials(name: string) {
  const parts = name.split(' ');
  let initials = '';
  for (const part of parts) {
    if (part.length > 0 && part !== '') {
      initials += part[0];
    }
  }
  return initials.toUpperCase();
}

async function NavbarAuth() {
  const t = useTranslations('layout');
  const session = await auth();
  const initials = session?.user ? getInitials(session.user.name!) : undefined;
  return session?.user ? (
    <ProfileDropdown
      initials={initials!}
      imageSrc={session.user.image!}
      signOut={async () => {
        'use server';
        await signOut();
      }}
      t={{
        profile: t('profile'),
        profileMenu: t('profileMenu'),
        chooseOption: t('chooseOption'),
        signOut: t('signOut'),
      }}
    />
  ) : (
    <Button as={Link} color='primary' href='/signin' variant='flat'>
      {t('signIn')}
    </Button>
  );
}

export { NavbarAuth };
