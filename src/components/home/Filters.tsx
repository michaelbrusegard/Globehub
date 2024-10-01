'use client';

import {
  Autocomplete,
  AutocompleteItem,
  Chip,
  Select,
  SelectItem,
  Spacer,
} from '@nextui-org/react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';

import { type Keyword } from '@/lib/db';

type FilterProps = {
  keywords: Keyword[];
  worldRegions: Record<string, string>;
  t: {
    keywords: string;
    selectKeywords: string;
    selectWorldRegion: string;
    worldRegion: string;
    noKeywordsFound: string;
  };
};

function Filters({ keywords, worldRegions, t }: FilterProps) {
  const [keyword, setKeyword] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useQueryState(
    t.keywords,
    parseAsArrayOf<string>(parseAsString, ';').withOptions({
      shallow: false,
    }),
  );
  const [worldRegion, setWorldRegion] = useQueryState(
    t.worldRegion,
    parseAsString
      .withDefault('')
      .withOptions({ shallow: false, clearOnDefault: true }),
  );

  function handleKeywordChange(key?: string) {
    const newKeyword = key ?? keyword;
    if (!keywords.map((k) => k.name).includes(newKeyword)) {
      return;
    }
    void setSelectedKeywords((prev) => {
      if (prev === null) {
        return [newKeyword];
      }

      if (!prev.includes(newKeyword)) {
        return [...prev, newKeyword];
      }
      return prev;
    });
    setTimeout(() => {
      setKeyword('');
    }, 0);
    setKeyword('');
  }

  return (
    <>
      <div className='mb-2 flex flex-col gap-2 sm:flex-row'>
        <Select
          className='w-2/3'
          label={t.worldRegion}
          placeholder={t.selectWorldRegion}
          size='sm'
          onChange={(e) => {
            void setWorldRegion(e.target.value);
          }}
          selectionMode='single'
          defaultSelectedKeys={worldRegion ? [worldRegion] : undefined}
        >
          {Object.entries(worldRegions).map(([_, value]) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </Select>
        <Autocomplete
          label={t.keywords}
          listboxProps={{
            emptyContent: t.noKeywordsFound,
          }}
          placeholder={t.selectKeywords}
          size='sm'
          inputValue={keyword}
          onInputChange={(keyword) => {
            setKeyword(keyword);
          }}
          onSelectionChange={(key) => {
            handleKeywordChange(key as string);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleKeywordChange();
            }
          }}
        >
          {keywords.map((keyword) => (
            <AutocompleteItem key={keyword.name}>
              {keyword.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
      <div className='flex w-full flex-wrap gap-2'>
        {selectedKeywords?.map((keyword) => (
          <Chip
            key={keyword}
            size='md'
            onClose={() => {
              void setSelectedKeywords((prev) => {
                const newKeywords = prev?.filter((k) => k !== keyword);
                return newKeywords && newKeywords.length > 0
                  ? newKeywords
                  : null;
              });
            }}
          >
            {keyword}
          </Chip>
        ))}
        {!selectedKeywords && <Spacer className='mb-[3px]' y={6} />}
      </div>
    </>
  );
}

export { Filters };
