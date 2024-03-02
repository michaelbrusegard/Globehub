import dynamic from 'next/dynamic';

import type { MapProps } from '@/components/destination/Map';

function Map({ coordinates, popup }: MapProps) {
  const Map = dynamic(() => import('@/components/destination/Map'), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
  });

  return <Map coordinates={coordinates} popup={popup} />;
}

export { Map };
