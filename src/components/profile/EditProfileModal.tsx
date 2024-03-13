'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useFormStatus } from 'react-dom';

import { validateProfile } from '@/lib/validation';

type EditProfileModalProps = {
  className?: string;
  updateProfile: (formData: FormData) => void;
  profile: { bio?: string };
  t: {
    edit: string;
    editBio: string;
    cancel: string;
    update: string;
    writeBio: string;
    bioTooLong: string;
  };
};

type FormProps = {
  updateProfile: (formData: FormData) => void;
  onClose: () => void;
  profile: { bio?: string };
  t: {
    cancel: string;
    update: string;
    writeBio: string;
    bioTooLong: string;
  };
};

function SubmitButton({
  canSubmit,
  t,
}: {
  canSubmit: boolean;
  t: { update: string };
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
      {!pending && t.update}
    </Button>
  );
}

function Form({ updateProfile, onClose, profile, t }: FormProps) {
  const { Field, handleSubmit, useStore } = useForm({
    defaultValues: {
      bio: '',
    },
  });

  const submissionAttempts = useStore((state) => state.submissionAttempts);
  const canSubmit = useStore((state) => state.canSubmit);

  return (
    <form
      action={(formData: FormData) => {
        if (!canSubmit) return;
        updateProfile(formData);
        onClose();
      }}
      onSubmit={handleSubmit}
    >
      <ModalBody>
        <Field
          name='bio'
          validatorAdapter={zodValidator}
          validators={{
            onChange: validateProfile({
              bioTooLong: t.bioTooLong,
            }).pick({ bio: true }).shape.bio,
          }}
        >
          {({ state, handleChange, handleBlur }) => (
            <Textarea
              minRows={5}
              placeholder={t.writeBio}
              name='bio'
              onChange={(e) => {
                handleChange(e.target.value);
              }}
              onBlur={handleBlur}
              value={state.value}
              defaultValue={profile.bio}
              errorMessage={
                state.meta.errors &&
                typeof state.meta.errors[0] === 'string' &&
                state.meta.errors[0].split(', ')[0]
              }
              isInvalid={state.meta.errors.length > 0}
            />
          )}
        </Field>
      </ModalBody>
      <ModalFooter>
        <Button color='danger' variant='light' type='button' onPress={onClose}>
          {t.cancel}
        </Button>
        <SubmitButton canSubmit={canSubmit} t={{ update: t.update }} />
      </ModalFooter>
    </form>
  );
}

function EditProfileModal({
  className,
  updateProfile,
  profile,
  t,
}: EditProfileModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button className={className} onPress={onOpen} variant='bordered'>
        {t.edit}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                {t.editBio}
              </ModalHeader>
              <Form
                updateProfile={updateProfile}
                onClose={onClose}
                profile={profile}
                t={{
                  cancel: t.cancel,
                  update: t.update,
                  writeBio: t.writeBio,
                  bioTooLong: t.bioTooLong,
                }}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export { EditProfileModal };
