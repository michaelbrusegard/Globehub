import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { Divider } from '@nextui-org/react';
import { Link } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Logo } from '@/components/layout/Logo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('signIn'),
  };
}

export default function SignIn({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card className=' h-64 w-96 shadow-lg'>
        <CardHeader className=' flex items-center justify-center'>
          <div className='flex flex-col items-center'>
            <Logo className='mb-4' />
            <p className='text-9x1 mb-3'>Velkommen </p>
            <p className='text-sm text-default-500'>
              {' '}
              Logg inn for å få fordeler og en enda enklere reise{' '}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>content</CardBody>
        <Divider />
        <CardFooter className='flex items-center justify-center'>
          <p className='mr-2 text-sm'>Har du ikke noen konto? </p>
          <Link
            href='https://accounts.google.com/v3/signin/identifier?continue=http%3A%2F%2Fsupport.google.com%2Faccounts%2Fanswer%2F27441%3Fhl%3Dno&ec=GAZAdQ&hl=no&passive=true&sjid=5028291945462972803-EU&ifkv=ATuJsjx-4Le1ZYQZKPYhIGIO1rj8-jUiPIW0WZ8HcvpQ9Wn8L9df8DiIWyKn4dNmUQgpMgM8-VV8&theme=glif&flowName=GlifWebSignIn&flowEntry=ServiceLogin'
            underline='always'
            target='_blank'
          >
            Registrer deg
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
