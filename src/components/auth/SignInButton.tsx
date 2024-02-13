'use client';

import { Button, type ButtonProps, cn } from '@nextui-org/react';

type SignInButtonProps = {
  signIn: () => void;
} & ButtonProps;

function SignInButton({ className, signIn, ...props }: SignInButtonProps) {
  return (
    <Button
      className={cn('w-fit', className)}
      onClick={() => {
        signIn();
      }}
      variant='ghost'
      size='lg'
      {...props}
    />
  );
}

export { SignInButton };
