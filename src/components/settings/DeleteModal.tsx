'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

type DeleteModalProps = {
  action?: () => void;
  t: {
    delete: string;
    cancel: string;
    description: string;
    deleteDestination: string;
  };
};

type DeleteButtonProps = {
  t: { delete: string };
};

function DeleteButton({ t }: DeleteButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className='w-24'
      color='danger'
      variant='flat'
      isLoading={pending}
      type='submit'
    >
      {!pending && t.delete}
    </Button>
  );
}

function DeleteModal({ action, t }: DeleteModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        className='w-40'
        onPress={onOpen}
        variant='bordered'
        color='default'
      >
        {t.deleteDestination}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader />
              <ModalBody>
                <p>{t.description}</p>
              </ModalBody>
              <ModalFooter>
                <Button color='success' variant='light' onPress={onClose}>
                  {t.cancel}
                </Button>
                <form action={action}>
                  <DeleteButton
                    t={{
                      delete: t.delete,
                    }}
                  />
                </form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export { DeleteModal };
