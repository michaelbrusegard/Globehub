import { Image } from '@nextui-org/react';

interface Props {
  images: string[];
}

function DestinationPhotos({ images }: Props) {
  return <Image width={300} height={200} src={images[0]} />;
}

export { DestinationPhotos };
