import { IntlErrorProvider } from '@/components/providers/IntlErrorProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { UIProvider } from '@/components/providers/UIProvider';

type RootProvidersProps = {
  className?: string;
  children: React.ReactNode;
  locale: string;
};

function RootProviders({ className, children, locale }: RootProvidersProps) {
  return (
    <UIProvider className={className}>
      <ThemeProvider>
        <IntlErrorProvider locale={locale}>{children}</IntlErrorProvider>
      </ThemeProvider>
    </UIProvider>
  );
}

export { RootProviders };
