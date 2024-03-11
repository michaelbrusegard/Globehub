'use client';

import HeartIcon from '@material-symbols/svg-400/outlined/favorite.svg';
import { Button } from '@nextui-org/react';
import { startTransition, useOptimistic } from 'react';

type FavoriteButtonProps = {
  favorite: boolean;
  updateFavorite: () => Promise<void>;
  t: {
    favorite: string;
  };
};

function FavoriteButton({ favorite, updateFavorite, t }: FavoriteButtonProps) {
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    favorite,
    (_, newFavorite: boolean) => {
      return newFavorite;
    },
  );

  async function handlePress() {
    startTransition(() => {
      setOptimisticFavorite(!optimisticFavorite);
    });
    await updateFavorite().catch(() => {
      startTransition(() => {
        setOptimisticFavorite(optimisticFavorite);
      });
    });
  }

  return (
    <Button
      isIconOnly
      color={optimisticFavorite ? 'danger' : 'default'}
      radius='sm'
      aria-label={t.favorite}
      onPress={handlePress}
    >
      <HeartIcon className='size-5 fill-danger-foreground' />
    </Button>
  );
}

export { FavoriteButton };
