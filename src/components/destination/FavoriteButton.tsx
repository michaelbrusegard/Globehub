'use client';

import HeartIcon from '@material-symbols/svg-400/outlined/favorite.svg';
import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { type User } from '@/lib/db';

type FavoriteButtonProps = {
  user: User | undefined;
  favorite: boolean;
  updateFavorite: (favorite: boolean) => void;
};

function FavoriteButton({
  user,
  favorite,
  updateFavorite,
}: FavoriteButtonProps) {
  const t = useTranslations('destination');

  return (
    <Button
      isIconOnly
      color={favorite ? 'danger' : 'default'}
      radius='sm'
      aria-label={t('favorite')}
      onPress={() => {
        if (!user) {
          throw new Error('You must be signed in to perform this action');
        }

        updateFavorite(favorite);
      }}
    >
      <HeartIcon className='size-5 fill-danger-foreground' />
    </Button>
  );
}

export { FavoriteButton };
