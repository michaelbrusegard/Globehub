'use client';

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import NextImage from 'next/image';

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
        <DropdownItem href='/profile'>{t.profile}</DropdownItem>
        <DropdownItem
          href='#'
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
