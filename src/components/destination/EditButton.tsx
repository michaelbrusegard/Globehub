'use client';

import EditSquare from '@material-symbols/svg-400/outlined/edit_square.svg';
import { Button } from '@nextui-org/react';

import { Link } from '@/lib/navigation';

type EditButtonProps = {
  destinationId: number;
  t: {
    edit: string;
  };
};
function EditButton({ destinationId, t }: EditButtonProps) {
  return (
    <Button
      as={Link}
      // @ts-expect-error difficult type to infer when using next-intl
      href={{
        pathname: '/[destination]/edit',
        params: { destination: destinationId },
      }}
      color='warning'
      radius='sm'
      startContent={
        <EditSquare
          className='size-5 fill-warning-foreground'
          aria-hidden='true'
        />
      }
    >
      {t.edit}
    </Button>
  );
}

export { EditButton };
