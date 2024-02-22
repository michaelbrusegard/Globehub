// import Search from '@material-symbols/svg-400/outlined/search.svg';
import {
  // Input,
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
        {/* <NavbarItem className='hidden md:block'>
          <Input
            classNames={{
              base: 'max-w-full sm:max-w-[10rem] h-10',
              mainWrapper: 'h-full',
              input: 'text-small',
              inputWrapper:
                'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            }}
            placeholder={t('searchPlaceholder')}
            size='sm'
            startContent={<Search className='h-5 w-5 fill-default-500' />}
            type='search'
          />
        </NavbarItem> */}
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
