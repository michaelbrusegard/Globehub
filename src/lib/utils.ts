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

function formatRating(rating: number): string {
  const formattedRating = (rating / 2).toFixed(1);
  return formattedRating.endsWith('.0')
    ? formattedRating.slice(0, -2)
    : formattedRating;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed - 1) * 69000 - 420;
  return x - Math.floor(x);
}

export { cn, getInitials, formatRating, seededRandom };
