import { Avatar, Button, Link } from '@nextui-org/react';
import { unstable_setRequestLocale } from 'next-intl/server';

const reviews = [
  {
    dest: 'Milano',
    text: "Min ferie i Milano var fantastisk! Byen pulserte av liv og energi, og jeg ble overveldet av den imponerende arkitekturen og kulturelle rikdommen. Shoppingopplevelsene var en drøm med luksuriøse butikker og trendy boutiques. Maten var en høydepunkt, med deilige italienske retter som pasta, pizza og gelato. Besøket til ikoniske steder som Duomo-katedralen og Leonardo da Vinci's Nattverden var uforglemmelig. Milano kombinerte perfekt moderne stil med historisk sjarm, og jeg forlot byen med uforglemmelige minner og en dypere kjærlighet for italiensk kultur.",
    stars: 5,
  },
  {
    dest: 'Shanghai',
    text: 'Min tid i Shanghai var en utrolig opplevelse! Byen imponerte meg med sin blendende skyline og futuristiske arkitektur. Å utforske den pulserende gatenan og nattmarkedene ga meg et autentisk innblikk i den lokale kulturen. Shanghai Tower og The Bund var spektakulære, spesielt om natten når lysene skapte en fantastisk atmosfære. Maten var en smakfull reise med dim sum, dumplings og deilig street food. Jeg nøt også å utforske de historiske områdene som Yuyuan-hagen og Jade Buddha-tempelet. Shanghai kombinerte moderne livsstil med kulturell rikdom på en unik måte, og jeg forlot byen med en dypere forståelse og beundring for den pulserende metropolen.',
    stars: 4,
  },
  {
    dest: 'hhh',
    text: 'minhkdjfu',
    stars: 3,
  },
];

const user = { name: 'Ola Nordmann', mail: 'ola@epost.no' };

export default function Profile({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <div>
      <div className='hidden shrink-0 py-2 sm:flex sm:flex-col sm:items-end'>
        <Button as={Link} href='/profile/edit' variant='bordered'>
          Rediger
        </Button>
      </div>
      <div className='h-[150vh]'>
        <h1 className='text-left text-4xl text-blue-500'>Min Profil</h1>
        <div className='items-left flex justify-start py-4'>
          <Avatar
            src='https://i.pravatar.cc/150?u=a04258114e29026708c'
            className='w-25 h-25 text-large'
          />
        </div>
        <p>Brukernavn:</p>
        <p>E-post:</p>

        <br />

        <h3 className='text-left text-2xl text-blue-500'>Mine vurderinger</h3>
        <ul role='list' className='divide-y divide-gray-100'>
          {reviews.map((reviews) => (
            <li
              key={reviews.text}
              className='flex justify-between gap-x-6 py-5'
            >
              <div className='flex min-w-0 gap-x-4'>
                <div className='min-w-0 flex-auto'>
                  <p className='text-sm font-semibold leading-6'>
                    {reviews.dest + '  ' + reviews.stars + '/5'}
                  </p>
                  <p className='mt-1 truncate text-xs leading-5 text-gray-500'>
                    {reviews.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
