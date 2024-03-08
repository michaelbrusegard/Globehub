import React from 'react';

import { type Keyword, sql } from '@/lib/db';

import { AddFilter } from '@/components/home/Filter.client';

async function SearchBar() {
  const keywords: Keyword[] = await sql`
      SELECT keywords.*
      FROM keywords;
    `;

  return (
    <div>
      <div>
        <AddFilter keywords={keywords} />
      </div>
    </div>
  );
}

export { SearchBar };
