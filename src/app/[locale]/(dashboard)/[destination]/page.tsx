import { unstable_setRequestLocale } from 'next-intl/server';

export default async function Destination({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <>
      <h1></h1>
    </>
  );
}
