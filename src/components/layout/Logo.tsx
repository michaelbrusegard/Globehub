import { Link, cn } from '@nextui-org/react';

function Logo({ className }: { className?: string }) {
  return (
    <Link
      className={cn(
        'z-0 box-border inline-flex h-unit-10 min-w-unit-20 select-none appearance-none items-center justify-center overflow-hidden whitespace-nowrap rounded-medium px-unit-2 font-arimo text-2xl font-semibold no-underline subpixel-antialiased outline-none transition-opacity tap-highlight-transparent transition-transform-colors-opacity hover:opacity-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:scale-[0.97] active:opacity-disabled motion-reduce:transition-none',
        className,
      )}
      href='/'
    >
      <span className='px-0.5 text-foreground'>Globe</span>
      <span className='rounded-sm bg-primary-400 p-0.5 leading-none text-foreground dark:bg-primary-500 dark:text-background'>
        hub
      </span>
    </Link>
  );
}

export { Logo };
