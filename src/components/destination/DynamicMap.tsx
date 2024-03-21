import { Skeleton } from '@nextui-org/react';
import dynamic from 'next/dynamic';

import type { MapProps } from '@/components/destination/Map';

function Map({ location, popup }: MapProps) {
  const Map = dynamic(() => import('@/components/destination/Map'), {
    loading: () => <Skeleton className='aspect-video w-full rounded-md' />,
    ssr: false,
  });

  return <Map location={location} popup={popup} />;
}

export { Map };
