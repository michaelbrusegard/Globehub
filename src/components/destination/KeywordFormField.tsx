'use client';

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Chip,
} from '@nextui-org/react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { validateKeyword } from '@/lib/validation';

type KeywordFormFieldProps = {
  currentKeywords: string[];
  allKeywords: string[];
  handleChange: (keywords: string[]) => void;
  handleBlur: () => void;
  errorMessage: string | false | undefined;
  isInvalid: boolean;
  t: {
    keywordsLabel: string;
    keywordsPlaceholder: string;
    add: string;
    keywordTooShort: string;
    keywordTooLong: string;
    keywordNoSpaces: string;
    keywordDuplicate: string;
    keywordFirstLetterCapital: string;
  };
};

function KeywordFormField({
  currentKeywords,
  allKeywords,
  handleChange,
  handleBlur,
  errorMessage,
  isInvalid,
  t,
}: KeywordFormFieldProps) {
  const [selectedKeywords, setSelectedKeywords] =
    useState<string[]>(currentKeywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [autoCompleteInvalid, setAutoCompleteInvalid] = useState(false);
  const [autoCompleteErrorMessage, setAutoCompleteErrorMessage] = useState('');

  function handleNewKeywordChange() {
    if (selectedKeywords.includes(newKeyword)) {
      setAutoCompleteInvalid(true);
      setAutoCompleteErrorMessage(t.keywordDuplicate);
      return;
    }

    const result = validateKeyword({
      t: {
        keywordTooShort: t.keywordTooShort,
        keywordTooLong: t.keywordTooLong,
        keywordNoSpaces: t.keywordNoSpaces,
        keywordFirstLetterCapital: t.keywordFirstLetterCapital,
      },
    }).safeParse(newKeyword);

    if (!result.success) {
      setAutoCompleteInvalid(true);
      setAutoCompleteErrorMessage(
        result.error.errors.map((e) => e.message).join(', '),
      );
    } else {
      setSelectedKeywords([...selectedKeywords, newKeyword]);
      setNewKeyword('');
      handleChange(selectedKeywords);
      setAutoCompleteInvalid(false);
      setAutoCompleteErrorMessage('');
    }
  }
  return (
    <div className='space-y-4'>
      <div className='flex items-end justify-between gap-4'>
        <input
          type='hidden'
          name='keywords'
          value={JSON.stringify(selectedKeywords)}
        />
        <Autocomplete
          label={t.keywordsLabel}
          placeholder={t.keywordsPlaceholder}
          size='md'
          labelPlacement='outside'
          onBlur={handleBlur}
          allowsCustomValue
          inputValue={newKeyword}
          onInputChange={(value) => {
            setNewKeyword(value);
            const result = validateKeyword({
              t: {
                keywordTooShort: t.keywordTooShort,
                keywordTooLong: t.keywordTooLong,
                keywordNoSpaces: t.keywordNoSpaces,
                keywordFirstLetterCapital: t.keywordFirstLetterCapital,
              },
            }).safeParse(newKeyword);
            if (result.success) {
              setAutoCompleteInvalid(false);
              setAutoCompleteErrorMessage('');
            }
          }}
          isInvalid={autoCompleteInvalid}
          errorMessage={autoCompleteErrorMessage.split(', ')[0]}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleNewKeywordChange();
            }
          }}
        >
          {allKeywords.map((keyword) => (
            <AutocompleteItem key={keyword} value={keyword}>
              {keyword}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Button
          className={cn(autoCompleteInvalid && 'mb-6')}
          size='md'
          variant='faded'
          onPress={handleNewKeywordChange}
        >
          {t.add}
        </Button>
      </div>
      <div>
        <Card
          className='min-h-[52px]'
          aria-describedby={isInvalid ? 'keywords-error' : undefined}
          aria-invalid={isInvalid}
        >
          <CardBody
            className={cn(
              'flex flex-row flex-wrap gap-2',
              isInvalid && 'bg-danger-50',
            )}
          >
            {selectedKeywords.map((keyword) => (
              <Chip
                key={keyword}
                size='md'
                onClose={() =>
                  setSelectedKeywords(
                    selectedKeywords.filter((k) => k !== keyword),
                  )
                }
              >
                {keyword}
              </Chip>
            ))}
          </CardBody>
        </Card>

        {isInvalid && (
          <div id='keywords-error' className='mt-1 text-tiny text-danger'>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
export { KeywordFormField };
