import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { Logo } from '@/components/layout/Logo';
import { NavbarAuth } from '@/components/layout/NavbarAuth';
import { DarkModeDropdown } from '@/components/settings/DarkModeDropdown';

function Header() {
  const t = useTranslations('layout');
  return (
    <Navbar
      className='shadow-sm'
      classNames={{
        wrapper: 'max-w-7xl',
      }}
      isBordered
      as='div'
    >
      <NavbarBrand>
        <Logo />
      </NavbarBrand>
      <NavbarContent justify='end'>
        <NavbarItem>
          <DarkModeDropdown
            t={{
              dark: t('dark'),
              light: t('light'),
              system: t('system'),
              selectTheme: t('selectTheme'),
              toggleTheme: t('toggleTheme'),
            }}
          />
        </NavbarItem>
        <NavbarItem>
          <Suspense>
            <NavbarAuth />
          </Suspense>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export { Header };
