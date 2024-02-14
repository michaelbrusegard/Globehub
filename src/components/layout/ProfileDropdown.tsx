'use client';

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import NextImage from 'next/image';

import { Link } from '@/lib/navigation';

type ProfileDropdownProps = {
  imageSrc: string;
  initials: string;
  signOut: () => void;
  t: {
    profileMenu: string;
    chooseOption: string;
    profile: string;
    signOut: string;
  };
};

function ProfileDropdown({
  imageSrc,
  initials,
  signOut,
  t,
}: ProfileDropdownProps) {
  return (
    <Dropdown
      classNames={{
        content: 'min-w-24',
      }}
      offset={12}
      placement='bottom-end'
    >
      <DropdownTrigger>
        <Avatar
          classNames={{
            name: 'font-arimo font-semibold',
          }}
          as='button'
          ImgComponent={NextImage}
          imgProps={{
            width: 32,
            height: 32,
          }}
          isBordered
          size='sm'
          radius='sm'
          name={initials}
          src={imageSrc}
          aria-label={t.profileMenu}
        />
      </DropdownTrigger>
      <DropdownMenu as='div' aria-label={t.chooseOption}>
        <DropdownItem as={Link} href='/profile'>
          {t.profile}
        </DropdownItem>
        <DropdownItem
          className='text-left'
          color='danger'
          as='button'
          onClick={() => {
            signOut();
          }}
        >
          {t.signOut}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export { ProfileDropdown };
