'use client';

import { Pagination, type PaginationProps } from '@nextui-org/react';
import { parseAsInteger, useQueryState } from 'nuqs';

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

  return (
    <Pagination
      page={page}
      onChange={(page) => {
        if (page === 0) return;
        void setPage(page);
      }}
      {...props}
    />
  );
}

export { DestinationsPagination };
