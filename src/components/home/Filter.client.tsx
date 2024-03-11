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
  Select,
  SelectItem,
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

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className='mb-2'>
      <div className='flex items-center space-x-2'>
        <Autocomplete
          label='Velg filtre'
          size='sm'
          onSelectionChange={(selected: React.Key) => {
            if (selected && !activeFilters?.includes(selected as string)) {
              activeFilters
                ? void setActiveFilters([...activeFilters, selected as string])
                : void setActiveFilters([selected as string]);
            }
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
        <WorldRegion />
        <Button color='primary' onClick={handleReload}>
          Søk
        </Button>
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
                  : [];
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

const WorldRegion: React.FC = () => {
  const worldRegions = [
    { key: 'africa', value: 'Afrika' },
    { key: 'asia', value: 'Asia' },
    { key: 'europe', value: 'Europa' },
    { key: 'northAmerica', value: 'Nord-Amerika' },
    { key: 'southAmerica', value: 'Sør-Amerika' },
    { key: 'oceania', value: 'Oseania' },
  ];
  // <DropdownItem key='africa'>Afrika</DropdownItem>
  // <DropdownItem key='asia'>Asia</DropdownItem>
  //<DropdownItem key='europe'>Europa</DropdownItem>
  // <DropdownItem key='northAmerica'>Nord-Amerika</DropdownItem>
  //<DropdownItem key='southAmerica'>Sør-Amerika</DropdownItem>
  // <DropdownItem key='oceania'>Oseania</DropdownItem>

  const [worldRegion, setWorldRegion] = useQueryState(
    'world_region',
    parseAsString.withDefault(''),
  );

  const handleWorldRegionChange = (selectedValue: {
    target: { value: string | ((old: string) => string | null) | null };
  }) => {
    void setWorldRegion(selectedValue.target.value);
  };

  return (
    <div className='flex w-full max-w-xs flex-wrap gap-4 md:flex-nowrap'>
      <Select
        label='Velg verdensdel'
        size='sm'
        value={worldRegion}
        onChange={handleWorldRegionChange}
        defaultSelectedKeys={worldRegion ? [worldRegion] : undefined}
      >
        {worldRegions.map((worldRegions) => (
          <SelectItem key={worldRegions.key} value={worldRegions.key}>
            {worldRegions.value}
          </SelectItem>
        ))}
      </Select>
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
