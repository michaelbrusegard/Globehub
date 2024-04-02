'use client';

import { Pagination, type PaginationProps } from '@nextui-org/react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

type DestinationsPaginationProps = {
  t: {
    page: string;
  };
} & PaginationProps;
function DestinationsPagination({ t, ...props }: DestinationsPaginationProps) {
  const [page, setPage] = useQueryState(
    t.page,
    parseAsInteger
      .withDefault(1)
      .withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    function checkWindowSize() {
      setIsCompact(window.matchMedia('(max-width: 640px)').matches);
    }

    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  return (
    <Pagination
      page={page}
      onChange={(page) => {
        if (page === 0) return;
        void setPage(page);
      }}
      isCompact={isCompact}
      {...props}
    />
  );
}

export { DestinationsPagination };
