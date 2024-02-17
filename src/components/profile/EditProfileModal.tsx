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
import { useState } from 'react';
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
    bioErrorMessage: string;
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
    bioErrorMessage: string;
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

function Form({ updateProfile, onClose, profile, t }: FormProps) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);
  function validate(e: React.ChangeEvent<HTMLInputElement>) {
    const newProfile = { ...currentProfile, [e.target.name]: e.target.value };
    setCurrentProfile(newProfile);
    const parsed = validateProfile(newProfile);
    setIsInvalid(!parsed.success);
  }
  return (
    <form
      action={(formData: FormData) => {
        if (isInvalid) return;
        updateProfile(formData);
        onClose();
      }}
    >
      <ModalBody>
        <Textarea
          minRows={5}
          placeholder={t.writeBio}
          name='bio'
          defaultValue={profile.bio}
          errorMessage={isInvalid && t.bioErrorMessage}
          isInvalid={isInvalid}
          onChange={validate}
        />
      </ModalBody>
      <ModalFooter>
        <Button color='danger' variant='light' type='button' onPress={onClose}>
          {t.cancel}
        </Button>
        <SubmitButton t={{ update: t.update }} />
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
                  bioErrorMessage: t.bioErrorMessage,
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
