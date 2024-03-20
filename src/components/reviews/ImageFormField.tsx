'use client';

import Photo from '@material-symbols/svg-400/outlined/photo.svg';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { ImageInterface } from '@/components/reusables/ImageInterface';

type ImageFormFieldProps = {
  imageFile: File | undefined;
  setImageFile: (imageFile: File | undefined) => void;
  handleBlur: () => void;
  errorMessage: string | false | undefined;
  isInvalid: boolean;
  t: {
    removeImage: string;
    PngJpg1MbMax: string;
    uploadAFile: string;
    orDragAndDrop: string;
  };
};

function ImageFormField({
  imageFile,
  setImageFile,
  handleBlur,
  errorMessage,
  isInvalid,
  t,
}: ImageFormFieldProps) {
  const [dragging, setDragging] = useState(false);

  function handleFileChange(file: File | undefined) {
    if (!file) {
      return;
    }

    setImageFile(file);
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length > 0) {
      handleFileChange(event.dataTransfer.files[0]);
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      handleFileChange(event.target.files[0]);
    }
    event.target.value = '';
  }

  return (
    <div className='space-y-4'>
      <div>
        <Card
          className={cn(
            'mt-2 border-2 border-dashed px-2 py-4 transition-background',
            imageFile && 'border-transparent',
            isInvalid && 'border-danger',
            dragging && 'bg-primary-50 dark:bg-primary-100',
          )}
          shadow='none'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CardBody
            className='flex justify-center text-center'
            aria-describedby={isInvalid ? 'image-file-error' : undefined}
            aria-invalid={isInvalid}
          >
            <div className={cn(imageFile && 'hidden')}>
              <Photo
                className='mx-auto size-12 fill-default-700'
                aria-hidden='true'
              />
              <div className='mt-4 flex justify-center text-sm leading-6'>
                <label
                  className='relative cursor-pointer rounded-md font-semibold text-primary-600 subpixel-antialiased outline-none transition-opacity tap-highlight-transparent transition-transform-colors-opacity focus-within:z-10 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus hover:opacity-hover active:scale-[0.97] active:opacity-disabled motion-reduce:transition-none'
                  htmlFor='file-upload'
                >
                  <span>{t.uploadAFile}</span>
                  <input
                    className='sr-only'
                    id='file-upload'
                    type='file'
                    accept='.jpg,.png,.jpeg'
                    onChange={handleFileUpload}
                    aria-describedby={
                      isInvalid ? 'image-file-error' : undefined
                    }
                    aria-invalid={isInvalid}
                    onBlur={handleBlur}
                  />
                </label>
                <p className='pl-1'>{t.orDragAndDrop}</p>
              </div>
            </div>
            {imageFile && (
              <div className='relative'>
                <ImageInterface
                  imageUrl={URL.createObjectURL(imageFile)}
                  onPress={() => setImageFile(undefined)}
                  t={{ removeImage: t.removeImage }}
                />
              </div>
            )}
          </CardBody>
          <CardFooter className='flex justify-center text-xs leading-5'>
            {!imageFile && t.PngJpg1MbMax}
          </CardFooter>
        </Card>
        {isInvalid && (
          <div id='image-file-error' className='mt-1 text-tiny text-danger'>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export { ImageFormField };
