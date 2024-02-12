import { unstable_setRequestLocale } from 'next-intl/server';

export default function Destination({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <div>
      <h1>Destinaion</h1>
    </div>
  );
}
