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

type FormProps = {
  updateDestination: (formData: FormData) => void;
  destination?: Destination;
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
    latitudePlaceholder: string;
    latitudeInvalid: string;
    latitudeDecimalsInvalid: string;
    longitudePlaceholder: string;
    longitudeInvalid: string;
    longitudeDecimalsInvalid: string;
    worldRegionInvalid: string;
    worldRegionPlaceholder: string;
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

function Form({ updateDestination, destination, worldRegions, t }: FormProps) {
  const coordinates = destination?.location.slice(1, -1).split(',');
  const [longitude, latitude] = coordinates ?? ['', ''];

  const { Field, handleSubmit, useStore } = useForm({
    defaultValues: {
      title: destination?.name ?? '',
      content: destination?.content ?? '',
      exclusiveContent: destination?.exclusiveContent ?? '',
      latitude: destination ? latitude : '',
      longitude: destination ? longitude : '',
      worldRegion: destination?.worldRegion ?? '',
    },
  });

  const canSubmit = useStore((state) => state.canSubmit);
  const submissionAttempts = useStore((state) => state.submissionAttempts);

  return (
    <form
      className='space-y-4'
      action={(formData: FormData) => {
        if (!canSubmit) return;
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
              state.meta.errors &&
              typeof state.meta.errors[0] === 'string' &&
              state.meta.errors[0].split(', ')[0]
            }
            isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
            isRequired
          />
        )}
      </Field>
      <div>
        <h2 className='mb-1 max-w-full overflow-hidden text-ellipsis text-medium text-foreground subpixel-antialiased'>
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
              defaultSelectedKeys={[state.value]}
              onChange={(e) => {
                handleChange(e.target.value);
              }}
              onBlur={handleBlur}
              errorMessage={
                submissionAttempts > 0 &&
                state.meta.errors &&
                typeof state.meta.errors[0] === 'string' &&
                state.meta.errors[0].split(', ')[0]
              }
              isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
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
              type='number'
              onChange={(e) => {
                handleChange(e.target.value);
              }}
              onBlur={handleBlur}
              value={state.value}
              errorMessage={
                submissionAttempts > 0 &&
                state.meta.errors &&
                typeof state.meta.errors[0] === 'string' &&
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
              type='number'
              onChange={(e) => {
                handleChange(e.target.value);
              }}
              onBlur={handleBlur}
              value={state.value}
              errorMessage={
                submissionAttempts > 0 &&
                state.meta.errors &&
                typeof state.meta.errors[0] === 'string' &&
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
            errorMessage={
              submissionAttempts > 0 &&
              state.meta.errors &&
              typeof state.meta.errors[0] === 'string' &&
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
            errorMessage={
              submissionAttempts > 0 &&
              state.meta.errors &&
              typeof state.meta.errors[0] === 'string' &&
              state.meta.errors[0].split(', ')[0]
            }
            isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
            isRequired
          />
        )}
      </Field>
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
    </form>
  );
}

export { Form };
