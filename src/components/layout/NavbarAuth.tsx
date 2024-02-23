import { Button, Link } from '@nextui-org/react';
import { getTranslations } from 'next-intl/server';

import { auth, signOut } from '@/lib/auth';
import { getInitials } from '@/lib/utils';

import { ProfileDropdown } from '@/components/layout/ProfileDropdown';

async function NavbarAuth() {
  const t = await getTranslations('layout');
  const session = await auth();
  const user = session?.user;
  return user ? (
    <ProfileDropdown
      initials={getInitials(user.name!)}
      imageSrc={user.image!}
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
