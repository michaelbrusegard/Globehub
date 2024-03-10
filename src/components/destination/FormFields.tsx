'use client';

import { Button, Input, Link, Textarea } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

import { type Destination } from '@/lib/db';

type FormFieldsProps = {
  destination: Destination;
  t: {
    title: string;
    content: string;
    exclusiveContent: string;
    cancel: string;
    update: string;
  };
};

function SubmitButton({ t }: { t: { update: string } }) {
  const { pending } = useFormStatus();
  return (
    <Button className='w-24' color='primary' type='submit' isLoading={pending}>
      {!pending && t.update}
    </Button>
  );
}

function FormFields({ destination, t }: FormFieldsProps) {
  return (
    <div className='space-y-4'>
      <Input
        labelPlacement='outside'
        name='title'
        size='lg'
        label={t.title}
        defaultValue={destination.name}
        isRequired
      />
      <Textarea
        labelPlacement='outside'
        minRows={12}
        name='content'
        size='lg'
        defaultValue={destination.content}
        label={t.content}
        isRequired
      />
      <Textarea
        labelPlacement='outside'
        minRows={12}
        name='exclusiveContent'
        size='lg'
        defaultValue={destination.exclusiveContent}
        label={t.exclusiveContent}
        isRequired
      />
      <div className='flex w-full justify-end gap-4'>
        <Button
          as={Link}
          href={'/' + destination.id}
          color='danger'
          variant='light'
        >
          {t.cancel}
        </Button>
        <SubmitButton t={{ update: t.update }} />
      </div>
    </div>
  );
}

export { FormFields };
