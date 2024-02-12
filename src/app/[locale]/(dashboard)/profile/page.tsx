import { Button, Divider, Avatar, Input, Link } from '@nextui-org/react';
import { unstable_setRequestLocale } from 'next-intl/server';




export default function Profile({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);


  return (
    <div className='h-[150vh] mx-auto'> 
    <Button size='sm' color='primary' variant='light' > Rediger </Button>
    <h1 className="text-4xl font-bold text-left text-hvite-900 mt-8">Min profil</h1>
    <div className="container justify-center mx-auto mt-8 p-4">
      <div className="max-w-md bg-black shadow-md rounded-lg overflow-hidden">
        <div className="flex items-left justify-start"> 
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-25 h-25 text-large" />
        </div>
        <div className="text-left mt-8 mb-8"> 
          <h1 className="text-xl font-semibold text-blue-500">{"user.name"}</h1>{}
          <p className="text-lg text-blue-700 mt-1">{"user.email"}</p>
        </div>
        <div className='mt-8 mb-8'></div>
        <Divider/>
          <h1 className="text-3xl font-bold text-left text-hvite-900 mt-8 mb-4">Mine vurderinger</h1>
          <ul>
            <li>Vurdering 1</li>
            <li>Vurdering 2</li>
            <li>Vurdering 3</li>
          </ul>
      </div>
    </div>
    <div className="className='h-[150vh] mx-auto">
    <Button size='sm' color='primary' variant='light'> Lagre </Button>
    <h1 className="text-4xl font-bold mt-8 mb-4">Rediger profilen</h1>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input type="name" label="Navn" defaultValue = "Ola Nordmann"></Input>
        </div>
    </div>
  </div>

  );
}
