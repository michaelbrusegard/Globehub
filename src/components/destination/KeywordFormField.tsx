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
  keywords: string[];
  allKeywords: string[];
  setKeywords: (keywords: string[]) => void;
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
  keywords,
  allKeywords,
  setKeywords,
  handleBlur,
  errorMessage,
  isInvalid,
  t,
}: KeywordFormFieldProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const [inputIsInvalid, setInputIsInvalid] = useState(false);
  const [autoCompleteErrorMessage, setAutoCompleteErrorMessage] = useState('');

  function updateState(newKeywords: string[]) {
    setKeywords(newKeywords);
    keywords = newKeywords;
  }

  function handleNewKeywordChange() {
    if (keywords.includes(newKeyword)) {
      setInputIsInvalid(true);
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
      setInputIsInvalid(true);
      setAutoCompleteErrorMessage(
        result.error.errors.map((e) => e.message).join(', '),
      );
    } else {
      updateState([...keywords, newKeyword]);
      setNewKeyword('');
      setInputIsInvalid(false);
      setAutoCompleteErrorMessage('');
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-end justify-between gap-4'>
        <input type='hidden' name='keywords' value={JSON.stringify(keywords)} />
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
              setInputIsInvalid(false);
              setAutoCompleteErrorMessage('');
            }
          }}
          isInvalid={inputIsInvalid}
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
          className={cn(inputIsInvalid && 'mb-6')}
          size='md'
          variant='faded'
          onPress={handleNewKeywordChange}
        >
          {t.add}
        </Button>
      </div>
      <div>
        <Card className='min-h-[52px]'>
          <CardBody
            className={cn(
              'flex flex-row flex-wrap gap-2',
              isInvalid && 'bg-danger-50',
            )}
            aria-describedby={isInvalid ? 'keywords-error' : undefined}
            aria-invalid={isInvalid}
          >
            {keywords.map((keyword) => (
              <Chip
                key={keyword}
                size='md'
                onClose={() => {
                  updateState(keywords.filter((k) => k !== keyword));
                }}
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
