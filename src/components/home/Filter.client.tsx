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
import React from 'react';

import { type Keyword } from '@/lib/db';

interface KeywordProps {
  keywords: Keyword[];
}

interface ActiveFilterProps {
  filters: string[];
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddFilter: React.FC<KeywordProps> = ({ keywords }) => {
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

  return (
    <div className='mb-2'>
      <div className='flex space-x-2'>
        <Autocomplete
          label='Select filters'
          size='sm'
          onSelectionChange={(selected: React.Key) => {
            if (selected === null) {
              return;
            }
            const selectedkeyword = selected.toString();
            if (
              selectedkeyword &&
              !activeFilters.some((filter) => filter === selectedkeyword)
            ) {
              setActiveFilters([...activeFilters, selectedkeyword]);
            }
            return selected;
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
      <div className='flex'>
        <SelectedFilters
          filters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
      </div>
    </div>
  );
};

const SortBy: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Sort by']));
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
            {selectedKeys}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Sort by'
          disallowEmptySelection
          selectionMode='single'
          onSelectionChange={(newSelectedKeys) => {
            setSelectedKeys(newSelectedKeys);
            return newSelectedKeys;
          }}
        >
          <DropdownItem key='Rating'>Rating</DropdownItem>
          <DropdownItem key='Name'>Name</DropdownItem>
          <DropdownItem key='Something'>Something</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

const SelectedFilters: React.FC<ActiveFilterProps> = ({
  filters,
  setActiveFilters,
}) => {
  return (
    <div className='w-95 mt-2 flex-wrap'>
      {filters.map((filter) => (
        <Chip
          key={filter.toString()}
          style={{ margin: '5px' }}
          size='lg'
          onClose={() => {
            setActiveFilters(filters.filter((f) => f !== filter));
          }}
        >
          {filter}
        </Chip>
      ))}
    </div>
  );
};

export { AddFilter, SortBy };
