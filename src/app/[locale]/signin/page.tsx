import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

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
    <div>
      <h1>Sign In</h1>
    </div>
  );
}
