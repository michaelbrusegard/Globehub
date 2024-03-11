'use client';

import {
  Button,
  Input,
  Link,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

import { type Destination } from '@/lib/db';

type FormFieldsProps = {
  destination?: Destination;
  worldRegions: Record<string, string>;
  t: {
    title: string;
    content: string;
    exclusiveContent: string;
    cancel: string;
    submit: string;
    latitude: string;
    longitude: string;
    worldRegion: string;
  };
};

function SubmitButton({ t }: { t: { submit: string } }) {
  const { pending } = useFormStatus();
  return (
    <Button className='w-24' color='primary' type='submit' isLoading={pending}>
      {!pending && t.submit}
    </Button>
  );
}

function FormFields({ destination, worldRegions, t }: FormFieldsProps) {
  const coordinates = destination?.location.slice(1, -1).split(',');
  const [longitude, latitude] = coordinates ?? ['', ''];
  return (
    <div className='space-y-4'>
      <Input
        labelPlacement='outside'
        name='title'
        size='lg'
        label={t.title}
        defaultValue={destination?.name}
        isRequired
      />
      <Textarea
        classNames={{
          input: 'h-48',
        }}
        minRows={12}
        labelPlacement='outside'
        name='content'
        size='lg'
        defaultValue={destination?.content}
        label={t.content}
        isRequired
      />
      <Textarea
        classNames={{
          input: 'h-48',
        }}
        minRows={12}
        labelPlacement='outside'
        name='exclusiveContent'
        size='lg'
        defaultValue={destination?.exclusiveContent}
        label={t.exclusiveContent}
        isRequired
      />
      <div className='flex gap-4'>
        <Input
          className='max-w-40'
          labelPlacement='inside'
          name='latitude'
          size='md'
          label={t.latitude}
          defaultValue={location ? latitude : ''}
          type='number'
          isRequired
        />
        <Input
          className='max-w-40'
          labelPlacement='inside'
          name='longitude'
          size='md'
          label={t.longitude}
          defaultValue={location ? longitude : ''}
          type='number'
          isRequired
        />
      </div>
      <Select
        className='max-w-xs'
        name='worldRegion'
        isRequired
        disallowEmptySelection
        label={t.worldRegion}
        selectionMode='single'
        defaultSelectedKeys={
          destination ? [destination.worldRegion] : undefined
        }
      >
        {Object.entries(worldRegions).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value}
          </SelectItem>
        ))}
      </Select>
      <div className='flex w-full justify-end gap-4'>
        <Button
          as={Link}
          href={destination ? `/${destination.id}` : '/'}
          color='danger'
          variant='light'
        >
          {t.cancel}
        </Button>
        <SubmitButton t={{ submit: t.submit }} />
      </div>
    </div>
  );
}

export { FormFields };
