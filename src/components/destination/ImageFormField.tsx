'use client';

import Close from '@material-symbols/svg-400/outlined/close.svg';
import Photo from '@material-symbols/svg-400/outlined/photo.svg';
import { Button, Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import NextImage from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { validateImageFile } from '@/lib/validation';

type ImageFormFieldProps = {
  imageUrls: string[];
  setImageUrls: (imageUrls: string[]) => void;
  imageFiles: File[];
  setImageFiles: (imageFiles: File[]) => void;
  handleBlur: () => void;
  errorMessage: string | false | undefined;
  isInvalid: boolean;
  t: {
    removeImage: string;
    PngJpg1MbMax: string;
    uploadAFile: string;
    orDragAndDrop: string;
    imageNameTooLong: string;
    imageTypeInvalid: string;
    imageSizeTooLarge: string;
    tooManyImages: string;
  };
};

type ImageInterfaceProps = {
  imageUrl: string;
  onPress: () => void;
  t: {
    removeImage: string;
  };
};

function ImageFormField({
  imageUrls,
  setImageUrls,
  imageFiles,
  setImageFiles,
  handleBlur,
  errorMessage,
  isInvalid,
  t,
}: ImageFormFieldProps) {
  const [dragging, setDragging] = useState(false);
  const [imageIsInvalid, setImageIsInvalid] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState('');

  function updateImageFileState(newImageFiles: File[]) {
    setImageFiles(newImageFiles);
    imageFiles = newImageFiles;
  }

  function updateImageUrlState(newImageUrls: string[]) {
    setImageUrls(newImageUrls);
    imageUrls = newImageUrls;
  }

  function handleFileChange(files: FileList | null) {
    if (!files) {
      return;
    }

    for (const file of files) {
      const result = validateImageFile({
        t: {
          imageNameTooLong: t.imageNameTooLong,
          imageTypeInvalid: t.imageTypeInvalid,
          imageSizeTooLarge: t.imageSizeTooLarge,
        },
      }).safeParse(file);

      if (!result.success) {
        setImageIsInvalid(true);
        setImageErrorMessage(
          result.error.errors.map((e) => e.message).join(', '),
        );
        return;
      } else {
        setImageIsInvalid(false);
        setImageErrorMessage('');
      }
    }

    const newImageFiles = Array.from(files);
    updateImageFileState([...imageFiles, ...newImageFiles]);
    updateImageUrlState(imageUrls);
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    handleFileChange(event.dataTransfer.files);
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    handleFileChange(event.target.files);
    event.target.value = '';
  }

  return (
    <div className='space-y-4'>
      <div>
        <Card
          className={cn(
            'mt-2 border-2 border-dashed px-2 py-4 transition-background',
            imageIsInvalid && 'border-danger',
            dragging && 'bg-primary-50 dark:bg-primary-100',
          )}
          shadow='none'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type='hidden'
            name='imageUrls'
            value={JSON.stringify(imageUrls)}
            onBlur={handleBlur}
          />
          <CardBody
            className='flex justify-center text-center'
            aria-describedby={imageIsInvalid ? 'image-files-error' : undefined}
            aria-invalid={imageIsInvalid}
          >
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
                  multiple
                  accept='.jpg,.png,.jpeg'
                  onChange={handleFileUpload}
                  aria-describedby={
                    imageIsInvalid ? 'image-files-error' : undefined
                  }
                  aria-invalid={imageIsInvalid}
                />
              </label>
              <p className='pl-1'>{t.orDragAndDrop}</p>
            </div>
          </CardBody>
          <CardFooter className='flex justify-center text-xs leading-5'>
            {t.PngJpg1MbMax}
          </CardFooter>
        </Card>
        {imageIsInvalid && (
          <div id='image-files-error' className='mt-1 text-tiny text-danger'>
            {imageErrorMessage}
          </div>
        )}
      </div>
      <div>
        <Card className='min-h-[136px]'>
          <CardBody
            className={cn(
              'flex flex-row flex-wrap gap-2',
              isInvalid && 'bg-danger-50',
            )}
            aria-describedby={isInvalid ? 'image-files-error' : undefined}
            aria-invalid={isInvalid}
          >
            {imageUrls.map((image) => (
              <ImageInterface
                key={image}
                imageUrl={image}
                onPress={() => {
                  updateImageUrlState(imageUrls.filter((url) => url !== image));
                }}
                t={{
                  removeImage: t.removeImage,
                }}
              />
            ))}
            {imageFiles.map((image, index) => (
              <ImageInterface
                key={URL.createObjectURL(image)}
                imageUrl={URL.createObjectURL(image)}
                onPress={() => {
                  updateImageFileState(
                    imageFiles.filter((_, imgIndex) => imgIndex !== index),
                  );
                }}
                t={{
                  removeImage: t.removeImage,
                }}
              />
            ))}
          </CardBody>
        </Card>
        {isInvalid && (
          <div id='image-urls-error' className='mt-1 text-tiny text-danger'>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

function ImageInterface({ imageUrl, onPress, t }: ImageInterfaceProps) {
  return (
    <div className='relative' key={imageUrl}>
      <Image
        className='aspect-video h-36 object-cover object-center'
        as={NextImage}
        alt={imageUrl}
        src={imageUrl}
        width={228}
        height={128}
      />
      <Button
        className='absolute right-1 top-1 z-10'
        isIconOnly
        size='sm'
        variant='solid'
        radius='lg'
        aria-label={t.removeImage}
        onPress={onPress}
      >
        <Close className='size-5 fill-foreground' aria-hidden='true' />
      </Button>
    </div>
  );
}

export { ImageFormField };
