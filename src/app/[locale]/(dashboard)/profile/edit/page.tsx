import { Avatar, Button, Input, Link } from '@nextui-org/react';

export default function EditableProfile() {
  return (
    <div className="className='h-[150vh] mx-auto">
      <div className='hidden shrink-0 py-2 sm:flex sm:flex-col sm:items-end'>
        <Button as={Link} href='/profile' variant='bordered'>
          Lagre
        </Button>
      </div>
      <h1 className='mb-4 mt-8 text-4xl font-bold'>Rediger profilen</h1>
      <div className='items-left flex justify-start'>
        <Avatar
          src='https://i.pravatar.cc/150?u=a04258114e29026708c'
          className='w-25 h-25 text-large'
        />

        <div className='flex w-full flex-wrap gap-4 md:flex-nowrap'>
          <Input type='name' label='Navn' defaultValue='Ola Nordmann'></Input>
        </div>
      </div>
    </div>
  );
}
