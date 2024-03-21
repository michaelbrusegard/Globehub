import EditSquare from '@material-symbols/svg-400/outlined/edit_square.svg';
import { Button, Link } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { auth } from '@/lib/auth';

type HomeHeaderProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function HomeHeader({
  children,
  params: { locale },
}: HomeHeaderProps) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('home');
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='my-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
          {t('title')}
        </h1>
        {user && (
          <Button
            as={Link}
            href={'/new'}
            color='warning'
            radius='sm'
            startContent={
              <EditSquare
                className='size-5 fill-warning-foreground'
                aria-hidden='true'
              />
            }
          >
            {t('new')}
          </Button>
        )}
      </div>
      <p className='my-4 text-content2-foreground'>{t('description')}</p>
      {children}
    </>
  );
}
