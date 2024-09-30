import { env } from '@/env';
import Close from '@material-symbols/svg-400/outlined/close.svg';
import { Button, Image, type ImageProps } from '@nextui-org/react';
import NextImage from 'next/image';

type ImageInterfaceProps = {
  imageUrl: string;
  onPress: () => void;
  t: {
    removeImage: string;
    uploadedImage: string;
  };
} & ImageProps;

function ImageInterface({
  imageUrl,
  onPress,
  t,
  ...props
}: ImageInterfaceProps) {
  return (
    <div className='relative'>
      <Image
        className='aspect-video h-36 object-cover object-center'
        as={NextImage}
        alt={t.uploadedImage}
        src={
          env.NEXT_PUBLIC_SITE_URL +
          '/' +
          env.NEXT_PUBLIC_STORAGE_PATH +
          '/' +
          imageUrl
        }
        width={228}
        height={128}
        {...props}
      />
      <Button
        className='absolute right-1 top-1 z-10'
        isIconOnly
        size='sm'
        variant='solid'
        radius='lg'
        aria-label={t.removeImage}
        onPress={onPress}
      >
        <Close className='size-5 fill-foreground' aria-hidden='true' />
      </Button>
    </div>
  );
}

export { ImageInterface };
