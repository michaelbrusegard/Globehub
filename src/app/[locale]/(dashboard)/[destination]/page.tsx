import { unstable_setRequestLocale } from 'next-intl/server';

export default function Destination({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <div></div>;
}
