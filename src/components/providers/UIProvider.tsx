'use client';

import { NextUIProvider } from '@nextui-org/react';

import { useRouter } from '@/lib/navigation';

type UIProviderProps = {
  children: React.ReactNode;
  className?: string;
};

function UIProvider({ className, children }: UIProviderProps) {
  const router = useRouter();
  return (
    <NextUIProvider
      className={className}
      // @ts-expect-error difficult type to infer when using next-intl
      navigate={(path: string) => router.push(path)}
    >
      {children}
    </NextUIProvider>
  );
}

export { UIProvider };
