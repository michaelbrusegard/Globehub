'use client';

import { Button } from '@nextui-org/react';

import { Link } from '@/lib/navigation';

function GoHomeButton({ t }: { t: { goToHome: string } }) {
  return (
    <Button className='w-full xs:w-auto' as={Link} href='/'>
      {t.goToHome}
    </Button>
  );
}

export { GoHomeButton };
