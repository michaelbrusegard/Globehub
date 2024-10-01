'use client';

import { env } from '@/env';
import { Button, Image } from '@nextui-org/react';
import { type EmblaCarouselType, type EmblaEventType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import NextImage from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type Destination } from '@/lib/db';
import { cn } from '@/lib/utils';

const TWEEN_FACTOR_BASE = 0.5;

type ImageCarouselProps = {
  className?: string;
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
    <div className='shrink-0'>
      <Button
        className={cn(
          'm-0 block h-full w-fit gap-0 bg-transparent p-0 opacity-50 blur-[2px] transition-opacity data-[focus-visible=true]:opacity-hover',
          selected && 'opacity-75 blur-none',
        )}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onClick();
        }}
        onPress={onClick}
      >
        <Image
          className='aspect-video h-14 object-cover'
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

function ImageCarousel({ className, destination }: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainRef, mainApi] = useEmblaCarousel({}, [
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
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.parallax')!;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === 'scroll';

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex]!;

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current[slideIndex]!;
          tweenNode.style.transform = `translateX(${translate}%)`;
        });
      });
    },
    [],
  );

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbsAPI) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbsAPI],
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbsAPI) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbsAPI.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbsAPI, setSelectedIndex]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    setTweenNodes(mainApi);
    setTweenFactor(mainApi);
    tweenParallax(mainApi);

    mainApi
      .on('select', onSelect)
      .on('reInit', onSelect)
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax);
  }, [mainApi, onSelect, tweenParallax, setTweenNodes, setTweenFactor]);

  return (
    <div
      className={cn('mx-auto max-w-3xl overflow-hidden rounded-md', className)}
    >
      <div ref={mainRef}>
        <div className='-ml-4 flex touch-manipulation'>
          {destination.images.map((imageSrc, index) => (
            <div className='w-full flex-none pl-4' key={index}>
              <div className='overflow-hidden rounded-md'>
                <div className='parallax'>
                  <Image
                    className='h-auto w-full'
                    shadow='sm'
                    radius='none'
                    as={NextImage}
                    alt={destination.name + ' ' + index}
                    src={env.NEXT_PUBLIC_STORAGE_URL + '/' + imageSrc}
                    priority
                    width={1300}
                    height={630}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='mt-3 flex justify-center overflow-hidden' ref={thumbsRef}>
        <div className='flex flex-row gap-3 p-1'>
          {destination.images.map((imageSrc, index) => (
            <Thumb
              key={index}
              onClick={() => {
                onThumbClick(index);
              }}
              selected={index === selectedIndex}
              index={index}
              imageSrc={env.NEXT_PUBLIC_STORAGE_URL + '/' + imageSrc}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { ImageCarousel };
