'use client';

import { Button, type ButtonProps, cn } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

function SignInButton({ className, startContent, ...props }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn('w-fit', className)}
      isLoading={pending}
      startContent={!pending && startContent}
      variant='ghost'
      size='lg'
      type='submit'
      {...props}
    />
  );
}

export { SignInButton };
