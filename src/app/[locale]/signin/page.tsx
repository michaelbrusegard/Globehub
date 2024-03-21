import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

import { signIn } from '@/lib/auth';
import { auth } from '@/lib/auth';

import { GitHubLogo } from '@/components/assets/GitHubLogo';
import { GoogleLogo } from '@/components/assets/GoogleLogo';
import { SignInButton } from '@/components/auth/SignInButton';
import { Logo } from '@/components/layout/Logo';
import { Main } from '@/components/layout/Main';

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

export default async function SignIn({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('signIn');
  const session = await auth();

  if (session?.user) {
    redirect('/');
  } else {
    return (
      <Main className='flex h-full items-center justify-center'>
        <Card className='m-2 h-64 w-full max-w-md p-2 xs:m-8'>
          <CardHeader className='flex items-center justify-center p-4'>
            <Logo />
          </CardHeader>
          <Divider />
          <CardBody className='flex items-center justify-center gap-4'>
            <form
              action={async () => {
                'use server';
                await signIn('google', { redirectTo: '/' });
              }}
            >
              <SignInButton color='warning' startContent={<GoogleLogo />}>
                {t('signInWith', { provider: 'Google' })}
              </SignInButton>
            </form>
            <form
              action={async () => {
                'use server';
                await signIn('github', { redirectTo: '/' });
              }}
            >
              <SignInButton color='secondary' startContent={<GitHubLogo />}>
                {t('signInWith', { provider: 'GitHub' })}
              </SignInButton>
            </form>
          </CardBody>
        </Card>
      </Main>
    );
  }
}
