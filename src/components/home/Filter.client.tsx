'use client';

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

import { type Keyword } from '@/lib/db';

type KeywordProps = {
  keywords: Keyword[];
};

const AddFilter: React.FC<KeywordProps> = ({ keywords }) => {
  const [activeFilters, setActiveFilters] = useQueryState(
    'filters',
    parseAsArrayOf<string>(parseAsString, ';'),
  );

  return (
    <div className='mb-2'>
      <div className='flex space-x-2'>
        <Autocomplete
          label='Select filters'
          size='sm'
          onSelectionChange={(selected: React.Key) => {
            activeFilters
              ? void setActiveFilters([...activeFilters, selected as string])
              : void setActiveFilters([selected as string]);
          }}
          disableSelectorIconRotation={true}
        >
          <AutocompleteSection showDivider title='Tag'>
            {keywords.map((keyword) => (
              <AutocompleteItem key={keyword.name}>
                {keyword.name}
              </AutocompleteItem>
            ))}
          </AutocompleteSection>
        </Autocomplete>
      </div>
      <div className='w-95 flex-wrap'>
        {activeFilters?.map((filter) => (
          <Chip
            key={filter.toString()}
            style={{ margin: '5px' }}
            size='lg'
            onClose={() => {
              void setActiveFilters((prev) => {
                return prev
                  ? prev.filter((prevFilter) => prevFilter !== filter)
                  : null;
              });
            }}
          >
            {filter}
          </Chip>
        ))}
      </div>
    </div>
  );
};

const SortBy: React.FC = () => {
  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button
            radius='sm'
            size='lg'
            style={{ fontSize: '15px' }}
            variant='flat'
          >
            {'Sort by'}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Sort by'
          disallowEmptySelection
          selectionMode='single'
        >
          <DropdownItem key='Rating'>Rating</DropdownItem>
          <DropdownItem key='Name'>Name</DropdownItem>
          <DropdownItem key='Something'>Something</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export { AddFilter, SortBy };
