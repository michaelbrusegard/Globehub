import React from 'react';
import { useState } from 'react';

import { type Keyword, sql } from '@/lib/db';

import { AddFilter, SortBy } from '@/components/home/Filter.client';

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
