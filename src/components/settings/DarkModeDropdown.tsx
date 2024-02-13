'use client';

import DarkMode from '@material-symbols/svg-400/outlined/dark_mode.svg';
import LightMode from '@material-symbols/svg-400/outlined/light_mode.svg';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useTheme } from 'next-themes';

type DarkModeDropdownProps = {
  t: {
    toggleTheme: string;
    selectTheme: string;
    light: string;
    dark: string;
    system: string;
  };
};

function DarkModeDropdown({ t }: DarkModeDropdownProps) {
  const { setTheme } = useTheme();
  return (
    <Dropdown
      classNames={{
        content: 'min-w-24',
      }}
      placement='bottom-end'
    >
      <DropdownTrigger>
        <Button isIconOnly variant='faded' aria-label={t.toggleTheme}>
          <LightMode className='h-5 w-5 rotate-0  scale-100 fill-default-500 transition-transform dark:-rotate-90 dark:scale-0' />
          <DarkMode className='absolute h-5 w-5 rotate-90 scale-0 fill-default-500 transition-transform dark:rotate-0 dark:scale-100' />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(key) => setTheme(String(key))}
        aria-label={t.selectTheme}
      >
        <DropdownItem key='light'>{t.light}</DropdownItem>
        <DropdownItem key='dark'>{t.dark}</DropdownItem>
        <DropdownItem key='system'>{t.system}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export { DarkModeDropdown };
