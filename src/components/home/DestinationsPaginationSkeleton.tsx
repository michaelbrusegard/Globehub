'use client';

import { Pagination } from '@nextui-org/react';
import { useEffect, useState } from 'react';

function DestinationsPaginationSkeleton() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    function checkWindowSize() {
      setIsCompact(window.matchMedia('(max-width: 768px)').matches);
    }

    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  return (
    <Pagination
      className='my-6'
      total={5}
      showControls
      isDisabled
      color='secondary'
      isCompact={isCompact}
    />
  );
}

export { DestinationsPaginationSkeleton };
