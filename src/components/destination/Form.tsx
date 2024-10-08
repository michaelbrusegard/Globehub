'use client';

import {
  Button,
  Input,
  Link,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useFormStatus } from 'react-dom';

import { type Destination } from '@/lib/db';
import { validateDestination } from '@/lib/validation';

import { ImageFormField } from '@/components/destination/ImageFormField';
import { KeywordFormField } from '@/components/destination/KeywordFormField';
import { DeleteModal } from '@/components/settings/DeleteModal';

type FormProps = {
  updateDestination: (formData: FormData) => void;
  deleteDestination?: () => void;
  destination?: Destination & {
    keywords: string[];
  };
  allKeywords: string[];
  worldRegions: Record<string, string>;
  t: {
    details: string;
    title: string;
    writeTitle: string;
    content: string;
    writeContent: string;
    exclusiveContent: string;
    writeExclusiveContent: string;
    cancel: string;
    submit: string;
    latitude: string;
    longitude: string;
    worldRegion: string;
    titleTooLong: string;
    titleTooShort: string;
    contentTooShort: string;
    contentTooLong: string;
    exclusiveContentTooShort: string;
    exclusiveContentTooLong: string;
    youCanUseMarkdown: string;
    latitudePlaceholder: string;
    latitudeInvalid: string;
    latitudeDecimalsInvalid: string;
    longitudePlaceholder: string;
    longitudeInvalid: string;
    longitudeDecimalsInvalid: string;
    worldRegionInvalid: string;
    worldRegionPlaceholder: string;
    keywordsLabel: string;
    keywordsPlaceholder: string;
    add: string;
    keywordTooShort: string;
    keywordTooLong: string;
    keywordNoSpaces: string;
    keywordDuplicate: string;
    keywordsRequired: string;
    keywordsMax: string;
    keywordFirstLetterCapital: string;
    images: string;
    removeImage: string;
    PngJpg1MbMax: string;
    uploadAFile: string;
    orDragAndDrop: string;
    imageNameTooLong: string;
    imageTypeInvalid: string;
    imageSizeTooLarge: string;
    tooFewImages: string;
    tooManyImages: string;
    delete: string;
    deleteConfirmation: string;
    deleteDestination: string;
    noKeywordsFound: string;
    uploadedImage: string;
  };
};

function SubmitButton({
  canSubmit,
  t,
}: {
  canSubmit: boolean;
  t: { submit: string };
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      className='w-24'
      color='primary'
      type='submit'
      isLoading={pending}
      isDisabled={!canSubmit}
    >
      {!pending && t.submit}
    </Button>
  );
}

function Form({
  updateDestination,
  deleteDestination,
  destination,
  allKeywords,
  worldRegions,
  t,
}: FormProps) {
  const coordinates = destination?.location.slice(1, -1)?.split(',');
  const [longitude, latitude] = coordinates ?? ['', ''];

  const { Field, handleSubmit, useStore } = useForm({
    defaultValues: {
      title: destination?.name ?? '',
      content: destination?.content ?? '',
      exclusiveContent: destination?.exclusiveContent ?? '',
      latitude: destination ? latitude : '',
      longitude: destination ? longitude : '',
      worldRegion: destination?.worldRegion ?? '',
      keywords: destination?.keywords ?? [],
      imageUrls: destination?.images ?? [],
      imageFiles: [] as File[],
    },
  });

  const canSubmit = useStore((state) => state.canSubmit);
  const submissionAttempts = useStore((state) => state.submissionAttempts);
  const imageFiles = useStore((state) => state.values.imageFiles);

  return (
    <form
      className='mb-12 space-y-4'
      action={(formData: FormData) => {
        if (!canSubmit) return;

        imageFiles.forEach((file, index) => {
          formData.append(`imageFiles[${index}]`, file);
        });

        updateDestination(formData);
      }}
      onSubmit={handleSubmit}
    >
      <Field
        name='title'
        validatorAdapter={zodValidator}
        validators={{
          onChange: validateDestination({
            t: {
              titleTooLong: t.titleTooLong,
              titleTooShort: t.titleTooShort,
            },
          }).pick({ title: true }).shape.title,
        }}
      >
        {({ state, handleChange, handleBlur }) => (
          <Input
            labelPlacement='outside'
            name='title'
            size='lg'
            placeholder={t.writeTitle}
            label={t.title}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            onBlur={handleBlur}
            value={state.value}
            errorMessage={
              submissionAttempts > 0 &&
              state.meta.errors[0] &&
              state.meta.errors[0].split(', ')[0]
            }
            isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
            isRequired
          />
        )}
      </Field>
      <div>
        <h2 className="mb-1 max-w-full overflow-hidden text-ellipsis text-small text-foreground subpixel-antialiased after:ml-0.5 after:text-danger after:content-['*']">
          {t.details}
        </h2>
        <Field
          name='worldRegion'
          validatorAdapter={zodValidator}
          validators={{
            onChange: validateDestination({
              worldRegions: Object.keys(worldRegions),
              t: {
                worldRegionInvalid: t.worldRegionInvalid,
              },
            }).pick({ worldRegion: true }).shape.worldRegion,
          }}
        >
          {({ state, handleChange, handleBlur }) => (
            <Select
              className='max-w-[336px]'
              name='worldRegion'
              label={t.worldRegion}
              selectionMode='single'
              placeholder={t.worldRegionPlaceholder}
              defaultSelectedKeys={state.value ? [state.value] : undefined}
              onChange={(e) => {
                handleChange(e.target.value);
              }}
              onBlur={handleBlur}
              errorMessage={
                submissionAttempts > 0 &&
                state.meta.errors[0] &&
                state.meta.errors[0].split(', ')[0]
              }
              isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
              isRequired
            >
              {Object.entries(worldRegions).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <div className='flex gap-4'>
        <Field
          name='latitude'
          validatorAdapter={zodValidator}
          validators={{
            onChange: validateDestination({
              t: {
                latitudeInvalid: t.latitudeInvalid,
                latitudeDecimalsInvalid: t.latitudeDecimalsInvalid,
              },
            }).pick({ latitude: true }).shape.latitude,
          }}
        >
          {({ state, handleChange, handleBlur }) => (
            <Input
              className='max-w-40'
              labelPlacement='inside'
              name='latitude'
              size='md'
              label={t.latitude}
              placeholder={t.latitudePlaceholder}
              type='text'
              onChange={(e) => {
                e.target.value = e.target.value.replace(',', '.');
                handleChange(e.target.value);
              }}
              onBlur={handleBlur}
              value={state.value}
              errorMessage={
                submissionAttempts > 0 &&
                state.meta.errors[0] &&
                state.meta.errors[0].split(', ')[0]
              }
              isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
              isRequired
            />
          )}
        </Field>
        <Field
          name='longitude'
          validatorAdapter={zodValidator}
          validators={{
            onChange: validateDestination({
              t: {
                longitudeInvalid: t.longitudeInvalid,
                longitudeDecimalsInvalid: t.longitudeDecimalsInvalid,
              },
            }).pick({ longitude: true }).shape.longitude,
          }}
        >
          {({ state, handleChange, handleBlur }) => (
            <Input
              className='max-w-40'
              labelPlacement='inside'
              name='longitude'
              size='md'
              placeholder={t.longitudePlaceholder}
              label={t.longitude}
              type='text'
              onChange={(e) => {
                e.target.value = e.target.value.replace(',', '.');
                handleChange(e.target.value);
              }}
              onBlur={handleBlur}
              value={state.value}
              errorMessage={
                submissionAttempts > 0 &&
                state.meta.errors[0] &&
                state.meta.errors[0].split(', ')[0]
              }
              isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
              isRequired
            />
          )}
        </Field>
      </div>
      <Field
        name='content'
        validatorAdapter={zodValidator}
        validators={{
          onChange: validateDestination({
            t: {
              contentTooLong: t.contentTooLong,
              contentTooShort: t.contentTooShort,
            },
          }).pick({ content: true }).shape.content,
        }}
      >
        {({ state, handleChange, handleBlur }) => (
          <Textarea
            classNames={{
              input: 'h-48',
            }}
            minRows={12}
            placeholder={t.writeContent}
            labelPlacement='outside'
            name='content'
            size='lg'
            label={t.content}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            onBlur={handleBlur}
            value={state.value}
            description={t.youCanUseMarkdown}
            errorMessage={
              submissionAttempts > 0 &&
              state.meta.errors[0] &&
              state.meta.errors[0].split(', ')[0]
            }
            isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
            isRequired
          />
        )}
      </Field>
      <Field
        name='exclusiveContent'
        validatorAdapter={zodValidator}
        validators={{
          onChange: validateDestination({
            t: {
              exclusiveContentTooLong: t.exclusiveContentTooLong,
              exclusiveContentTooShort: t.exclusiveContentTooShort,
            },
          }).pick({ exclusiveContent: true }).shape.exclusiveContent,
        }}
      >
        {({ state, handleChange, handleBlur }) => (
          <Textarea
            classNames={{
              input: 'h-48',
            }}
            minRows={12}
            placeholder={t.writeExclusiveContent}
            labelPlacement='outside'
            name='exclusiveContent'
            size='lg'
            label={t.exclusiveContent}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            onBlur={handleBlur}
            value={state.value}
            description={t.youCanUseMarkdown}
            errorMessage={
              submissionAttempts > 0 &&
              state.meta.errors[0] &&
              state.meta.errors[0].split(', ')[0]
            }
            isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
            isRequired
          />
        )}
      </Field>
      <Field
        name='keywords'
        validatorAdapter={zodValidator}
        validators={{
          onChange: validateDestination({
            t: {
              keywordTooShort: t.keywordTooShort,
              keywordTooLong: t.keywordTooLong,
              keywordNoSpaces: t.keywordNoSpaces,
              keywordDuplicate: t.keywordDuplicate,
              keywordsRequired: t.keywordsRequired,
              keywordsMax: t.keywordsMax,
              keywordFirstLetterCapital: t.keywordFirstLetterCapital,
            },
          }).pick({ keywords: true }).shape.keywords,
        }}
      >
        {({ state, handleChange, handleBlur }) => (
          <KeywordFormField
            keywords={state.value}
            setKeywords={handleChange}
            allKeywords={allKeywords}
            handleBlur={handleBlur}
            t={{
              keywordsLabel: t.keywordsLabel,
              keywordsPlaceholder: t.keywordsPlaceholder,
              add: t.add,
              keywordTooShort: t.keywordTooShort,
              keywordTooLong: t.keywordTooLong,
              keywordDuplicate: t.keywordDuplicate,
              keywordNoSpaces: t.keywordNoSpaces,
              keywordFirstLetterCapital: t.keywordFirstLetterCapital,
              noKeywordsFound: t.noKeywordsFound,
            }}
            errorMessage={
              submissionAttempts > 0 &&
              state.meta.errors[0] &&
              state.meta.errors[0].split(', ')[0]
            }
            isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
          />
        )}
      </Field>
      <div>
        <h2 className="mb-1.5 max-w-full overflow-hidden text-ellipsis text-small text-foreground subpixel-antialiased after:ml-0.5 after:text-danger after:content-['*']">
          {t.images}
        </h2>
        <Field
          name='imageUrls'
          validatorAdapter={zodValidator}
          validators={{
            onChange: validateDestination({
              imageUrls: destination?.images ?? [],
              imageFilesLength: imageFiles.length,
              t: {
                tooFewImages: t.tooFewImages,
                tooManyImages: t.tooManyImages,
              },
            }).pick({ imageUrls: true }).shape.imageUrls,
          }}
        >
          {({ state: imageUrlsState, handleChange: handleImageUrlsChange }) => (
            <Field name='imageFiles'>
              {({
                state: imageFilesState,
                handleChange: handleImageFilesChange,
                handleBlur,
              }) => (
                <ImageFormField
                  imageUrls={imageUrlsState.value}
                  setImageUrls={handleImageUrlsChange}
                  imageFiles={imageFilesState.value}
                  setImageFiles={handleImageFilesChange}
                  handleBlur={handleBlur}
                  errorMessage={
                    submissionAttempts > 0 &&
                    imageUrlsState.meta.errors &&
                    typeof imageUrlsState.meta.errors[0] === 'string' &&
                    imageUrlsState.meta.errors[0].split(', ')[0]
                  }
                  isInvalid={
                    submissionAttempts > 0 &&
                    imageUrlsState.meta.errors.length > 0
                  }
                  t={{
                    removeImage: t.removeImage,
                    PngJpg1MbMax: t.PngJpg1MbMax,
                    uploadAFile: t.uploadAFile,
                    orDragAndDrop: t.orDragAndDrop,
                    imageNameTooLong: t.imageNameTooLong,
                    imageTypeInvalid: t.imageTypeInvalid,
                    imageSizeTooLarge: t.imageSizeTooLarge,
                    tooManyImages: t.tooManyImages,
                    uploadedImage: t.uploadedImage,
                  }}
                />
              )}
            </Field>
          )}
        </Field>
      </div>
      <div className='flex w-full justify-between gap-4'>
        {destination && (
          <DeleteModal
            className='w-40'
            action={deleteDestination}
            t={{
              delete: t.delete,
              cancel: t.cancel,
              description: t.deleteConfirmation,
              buttonText: t.deleteDestination,
            }}
          />
        )}
        <div className='flex w-full justify-end gap-4'>
          <Button
            as={Link}
            href={destination ? `/${destination.id}` : '/'}
            color='danger'
            variant='light'
          >
            {t.cancel}
          </Button>
          <SubmitButton
            t={{ submit: t.submit }}
            canSubmit={canSubmit || submissionAttempts === 0}
          />
        </div>
      </div>
    </form>
  );
}

export { Form };
