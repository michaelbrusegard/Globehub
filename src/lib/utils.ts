import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getInitials(name: string) {
  const parts = name.split(' ');
  let initials = '';
  for (const part of parts) {
    if (part.length > 0 && part !== '') {
      initials += part[0];
    }
  }
  return initials.toUpperCase();
}

export { cn, getInitials };
