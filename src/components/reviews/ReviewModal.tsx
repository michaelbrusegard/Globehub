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

import { type Review } from '@/lib/db';
import { cn } from '@/lib/utils';
import { validateReview } from '@/lib/validation';

import { AddRating } from '@/components/reviews/AddRating';
import { ImageFormField } from '@/components/reviews/ImageFormField';
import { DeleteModal } from '@/components/settings/DeleteModal';

type ReviewModalProps = {
  className?: string;
  updateReview: (formData: FormData) => void;
  deleteReview: () => void;
  review?: Review;
  t: {
    editReview: string;
    writeReview: string;
    cancel: string;
    update: string;
    create: string;
    commentTooLong: string;
    writeComment: string;
    ratingInvalid: string;
    ratingRequired: string;
    delete: string;
    deleteConfirmation: string;
    deleteReview: string;
    imageNameTooLong: string;
    imageTypeInvalid: string;
    imageSizeTooLarge: string;
    removeImage: string;
    PngJpg1MbMax: string;
    uploadAFile: string;
    orDragAndDrop: string;
  };
};

type FormProps = {
  updateReview: (formData: FormData) => void;
  deleteReview: () => void;
  onClose: () => void;
  review?: Review;
  t: {
    cancel: string;
    update: string;
    create: string;
    commentTooLong: string;
    writeComment: string;
    ratingInvalid: string;
    ratingRequired: string;
    delete: string;
    deleteConfirmation: string;
    deleteReview: string;
    imageNameTooLong: string;
    imageTypeInvalid: string;
    imageSizeTooLarge: string;
    removeImage: string;
    PngJpg1MbMax: string;
    uploadAFile: string;
    orDragAndDrop: string;
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

function Form({ updateReview, deleteReview, onClose, review, t }: FormProps) {
  const { Field, handleSubmit, useStore } = useForm({
    defaultValues: {
      rating: review ? review.rating : 0,
      comment: review ? review.comment : '',
      imageFile: undefined as File | undefined,
    },
  });

  const canSubmit = useStore((state) => state.canSubmit);
  const submissionAttempts = useStore((state) => state.submissionAttempts);

  return (
    <form
      action={(formData: FormData) => {
        if (!canSubmit) return;
        updateReview(formData);
        onClose();
      }}
      onSubmit={handleSubmit}
    >
      <ModalBody>
        <Field
          name='imageFile'
          validatorAdapter={zodValidator}
          validators={{
            onChange: validateReview({
              t: {
                imageNameTooLong: t.imageNameTooLong,
                imageTypeInvalid: t.imageTypeInvalid,
                imageSizeTooLarge: t.imageSizeTooLarge,
              },
            }).pick({ imageFile: true }).shape.imageFile,
          }}
        >
          {({ state, handleChange, handleBlur }) => (
            <ImageFormField
              imageFile={state.value}
              setImageFile={handleChange}
              handleBlur={handleBlur}
              errorMessage={
                submissionAttempts > 0 &&
                state.meta.errors &&
                typeof state.meta.errors[0] === 'string' &&
                state.meta.errors[0].split(', ')[0]
              }
              isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
              t={{
                removeImage: t.removeImage,
                PngJpg1MbMax: t.PngJpg1MbMax,
                uploadAFile: t.uploadAFile,
                orDragAndDrop: t.orDragAndDrop,
              }}
            />
          )}
        </Field>
        <Field
          name='rating'
          validatorAdapter={zodValidator}
          validators={{
            onChange: validateReview({
              t: {
                ratingInvalid: t.ratingInvalid,
                ratingRequired: t.ratingRequired,
              },
            }).pick({ rating: true }).shape.rating,
          }}
        >
          {({ state, handleChange, handleBlur }) => (
            <AddRating
              setRating={(rating) => {
                handleChange(rating);
              }}
              rating={state.value}
              handleBlur={handleBlur}
              errorMessage={
                submissionAttempts > 0 &&
                state.meta.errors &&
                typeof state.meta.errors[0] === 'string' &&
                state.meta.errors[0].split(', ')[0]
              }
              isInvalid={submissionAttempts > 0 && state.meta.errors.length > 0}
            />
          )}
        </Field>
        <Field
          name='comment'
          validatorAdapter={zodValidator}
          validators={{
            onChange: validateReview({
              t: {
                commentTooLong: t.commentTooLong,
              },
            }).pick({ comment: true }).shape.comment,
          }}
        >
          {({ state, handleChange, handleBlur }) => (
            <Textarea
              minRows={5}
              placeholder={t.writeComment}
              name='comment'
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
            />
          )}
        </Field>
      </ModalBody>
      <ModalFooter className={cn('flex', review && 'justify-between')}>
        {review && (
          <DeleteModal
            action={deleteReview}
            t={{
              delete: t.delete,
              cancel: t.cancel,
              description: t.deleteConfirmation,
              buttonText: t.deleteReview,
            }}
          />
        )}
        <div className='flex gap-2'>
          <Button
            color='danger'
            variant='light'
            type='button'
            onPress={onClose}
          >
            {t.cancel}
          </Button>
          <SubmitButton
            canSubmit={canSubmit || submissionAttempts === 0}
            t={{ update: t.update }}
          />
        </div>
      </ModalFooter>
    </form>
  );
}

function ReviewModal({
  className,
  updateReview,
  deleteReview,
  review,
  t,
}: ReviewModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button className={className} onPress={onOpen} variant='bordered'>
        {review ? t.editReview : t.writeReview}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                {review ? t.editReview : t.writeReview}
              </ModalHeader>
              <Form
                updateReview={updateReview}
                onClose={onClose}
                review={review}
                deleteReview={deleteReview}
                t={{
                  cancel: t.cancel,
                  update: t.update,
                  create: t.create,
                  commentTooLong: t.commentTooLong,
                  writeComment: t.writeComment,
                  ratingInvalid: t.ratingInvalid,
                  ratingRequired: t.ratingRequired,
                  delete: t.delete,
                  deleteConfirmation: t.deleteConfirmation,
                  deleteReview: t.deleteReview,
                  imageNameTooLong: t.imageNameTooLong,
                  imageTypeInvalid: t.imageTypeInvalid,
                  imageSizeTooLarge: t.imageSizeTooLarge,
                  removeImage: t.removeImage,
                  PngJpg1MbMax: t.PngJpg1MbMax,
                  uploadAFile: t.uploadAFile,
                  orDragAndDrop: t.orDragAndDrop,
                }}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export { ReviewModal };
