'use client';

import { Button, Image } from '@nextui-org/react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import NextImage from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { type Destination } from '@/lib/db';
import { cn } from '@/lib/utils';

type ImageCarouselProps = {
  destination: Destination;
};
type ThumbProps = {
  selected: boolean;
  imageSrc: string;
  index: number;
  onClick: () => void;
};

function Thumb({ selected, imageSrc, index, onClick }: ThumbProps) {
  return (
    <div className='w-1/5 sm:w-1/6'>
      <Button
        className={cn(
          'm-0 block h-full w-full gap-0 bg-transparent p-0 opacity-50 blur-[2px] data-[focus-visible=true]:opacity-hover',
          selected && 'opacity-75 blur-none',
        )}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onClick();
        }}
      >
        <Image
          className='h-14 w-full'
          radius='md'
          as={NextImage}
          alt={index + ''}
          src={imageSrc}
          priority
          width={114}
          height={56}
        />
      </Button>
    </div>
  );
}

function ImageCarousel({ destination }: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainRef, mainAPI] = useEmblaCarousel({}, [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    WheelGesturesPlugin(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    Autoplay(),
  ]);
  const [thumbsRef, thumbsAPI] = useEmblaCarousel(
    {
      containScroll: 'keepSnaps',
      dragFree: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    [WheelGesturesPlugin()],
  );

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainAPI || !thumbsAPI) return;
      mainAPI.scrollTo(index);
    },
    [mainAPI, thumbsAPI],
  );

  const onSelect = useCallback(() => {
    if (!mainAPI || !thumbsAPI) return;
    setSelectedIndex(mainAPI.selectedScrollSnap());
    thumbsAPI.scrollTo(mainAPI.selectedScrollSnap());
  }, [mainAPI, thumbsAPI, setSelectedIndex]);

  useEffect(() => {
    if (!mainAPI) return;
    onSelect();
    mainAPI.on('select', onSelect);
    mainAPI.on('reInit', onSelect);
  }, [mainAPI, onSelect]);

  return (
    <div className='overflow-hidden'>
      <div className='mx-auto mb-8 max-w-3xl md:mb-16'>
        <div ref={mainRef}>
          <div className='-ml-4 flex touch-manipulation'>
            {destination.images.map((imageSrc, index) => (
              <div className='w-full flex-none pl-4' key={index}>
                <Image
                  className='h-auto w-full'
                  shadow='sm'
                  radius='none'
                  as={NextImage}
                  alt={destination.name + '' + index}
                  src={imageSrc}
                  priority
                  width={1300}
                  height={630}
                />
              </div>
            ))}
          </div>
        </div>
        <div className='mt-3 overflow-hidden' ref={thumbsRef}>
          <div className='flex flex-row gap-3 p-1'>
            {destination.images.map((imageSrc, index) => (
              <Thumb
                key={index}
                onClick={() => {
                  onThumbClick(index);
                  console.log('index', index);
                }}
                selected={index === selectedIndex}
                index={index}
                imageSrc={imageSrc}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ImageCarousel };
