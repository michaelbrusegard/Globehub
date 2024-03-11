'use client';

import HeartIcon from '@material-symbols/svg-400/outlined/favorite.svg';
import { Button } from '@nextui-org/react';

type FavoriteButtonProps = {
  favorite: boolean;
  updateFavorite: (favorite: boolean) => void;
};

function FavoriteButton({ favorite, updateFavorite }: FavoriteButtonProps) {
  return (
    <Button
      isIconOnly
      color={favorite ? 'danger' : 'default'}
      radius='sm'
      onPress={() => {
        updateFavorite(favorite);
      }}
    >
      <HeartIcon className='size-5 fill-danger-foreground' />
    </Button>
  );
}

export { FavoriteButton };
