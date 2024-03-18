'use client';

import Close from '@material-symbols/svg-400/outlined/close.svg';
import Photo from '@material-symbols/svg-400/outlined/photo.svg';
import { Button, Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import NextImage from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type ImageFormFieldProps = {
  currentImageUrls: string[];
  handleImageUrlsChange: (imageUrls: string[]) => void;
  currentImageFiles: File[];
  handleImageFilesChange: (imageFiles: File[]) => void;
  t: {
    removeImage: string;
    PngJpg1MbMax: string;
    uploadAFile: string;
    orDragAndDrop: string;
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
  currentImageUrls,
  handleImageUrlsChange,
  currentImageFiles,
  handleImageFilesChange,
  t,
}: ImageFormFieldProps) {
  const [imageUrls, setImagesUrls] = useState<string[]>(currentImageUrls);
  const [imageFiles, setImageFiles] = useState<File[]>(currentImageFiles);
  const [dragging, setDragging] = useState(false);

  function handleFileChange(files: FileList | null) {
    if (files) {
      const newImageFiles = Array.from(files);
      const updatedImageFiles = [...currentImageFiles, ...newImageFiles];
      handleImageFilesChange(updatedImageFiles);
      setImageFiles(updatedImageFiles);
    }
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
      <Card
        className={cn(
          'mt-2 border-2 border-dashed px-2 py-4 transition-background',
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
        />
        <CardBody className='flex justify-center text-center'>
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
                name='imageFiles'
                type='file'
                multiple
                accept='.jpg,.png,.jpeg'
                onChange={handleFileUpload}
              />
            </label>
            <p className='pl-1'>{t.orDragAndDrop}</p>
          </div>
        </CardBody>
        <CardFooter className='flex justify-center text-xs leading-5'>
          {t.PngJpg1MbMax}
        </CardFooter>
      </Card>
      <Card className='min-h-[136px]'>
        <CardBody className='flex flex-row flex-wrap gap-2'>
          {imageUrls.map((image) => (
            <ImageInterface
              key={image}
              imageUrl={image}
              onPress={() => {
                const newImageUrls = imageUrls.filter((url) => url !== image);
                handleImageUrlsChange(newImageUrls);
                currentImageUrls = newImageUrls;
                setImagesUrls(newImageUrls);
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
                const newImageFiles = imageFiles.filter(
                  (_, imgIndex) => imgIndex !== index,
                );
                handleImageFilesChange(newImageFiles);
                currentImageFiles = newImageFiles;
                setImageFiles(newImageFiles);
              }}
              t={{
                removeImage: t.removeImage,
              }}
            />
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

function ImageInterface({ imageUrl, onPress, t }: ImageInterfaceProps) {
  return (
    <div className='relative' key={imageUrl}>
      <Image
        className='aspect-video h-28 object-cover object-center'
        as={NextImage}
        alt={imageUrl}
        src={imageUrl}
        width={199}
        height={112}
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
