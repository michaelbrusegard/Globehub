import { cn } from '@/lib/utils';

type MainProps = {
  children?: React.ReactNode;
  className?: string;
};

function Main({ children, className }: MainProps) {
  return (
    <main className={cn('mx-auto w-full max-w-7xl flex-grow px-6', className)}>
      {children}
    </main>
  );
}

export { Main };
