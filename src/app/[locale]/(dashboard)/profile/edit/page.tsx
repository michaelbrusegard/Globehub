
import { Button, Input, Avatar } from '@nextui-org/react';

export default function EditableProfile(){

  return (
    <div className="className='h-[150vh] mx-auto">
    <Button size='sm' color='primary' variant='light'> Lagre </Button>
    <h1 className="text-4xl font-bold mt-8 mb-4">Rediger profilen</h1>
    <div className="flex items-left justify-start"> 
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-25 h-25 text-large" />

        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input type="name" label="Navn" defaultValue = "Ola Nordmann"></Input>
        </div>
    </div>
    </div>
  );
}