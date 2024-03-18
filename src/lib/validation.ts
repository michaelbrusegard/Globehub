import { z } from 'zod';

type validateDestinationProps = {
  imageUrls?: string[];
  worldRegions?: string[];
  imageFilesLength?: number;
  t?: {
    titleTooShort?: string;
    titleTooLong?: string;
    contentTooShort?: string;
    contentTooLong?: string;
    exclusiveContentTooShort?: string;
    exclusiveContentTooLong?: string;
    latitudeInvalid?: string;
    latitudeDecimalsInvalid?: string;
    longitudeInvalid?: string;
    longitudeDecimalsInvalid?: string;
    worldRegionInvalid?: string;
    keywordTooShort?: string;
    keywordTooLong?: string;
    keywordNoSpaces?: string;
    keywordDuplicate?: string;
    keywordsRequired?: string;
    keywordsMax?: string;
    keywordFirstLetterCapital?: string;
    imageNameTooLong?: string;
    imageTypeInvalid?: string;
    imageSizeTooLarge?: string;
    tooFewImages?: string;
    tooManyImages?: string;
  };
};

type validateKeywordProps = {
  t?: {
    keywordTooShort?: string;
    keywordTooLong?: string;
    keywordNoSpaces?: string;
    keywordFirstLetterCapital?: string;
  };
};

type validateImageFileProps = {
  t?: {
    imageNameTooLong?: string;
    imageTypeInvalid?: string;
    imageSizeTooLarge?: string;
  };
};

function validateProfile({ t }: { t?: { bioTooLong?: string } } = {}) {
  return z.object({
    bio: z.string().max(200, t?.bioTooLong),
  });
}

function validateKeyword({ t }: validateKeywordProps = {}) {
  return z
    .string()
    .min(2, t?.keywordTooShort)
    .max(50, t?.keywordTooLong)
    .refine((keyword) => !keyword.includes(' '), t?.keywordNoSpaces)
    .refine(
      (keyword) => keyword && keyword.startsWith(keyword[0]!.toUpperCase()),
      t?.keywordFirstLetterCapital,
    );
}

function validateImageFile({ t }: validateImageFileProps = {}) {
  return z.object({
    name: z.string().max(100, t?.imageNameTooLong),
    type: z
      .string()
      .regex(/(image\/jpeg|image\/png|image\/jpg)$/, t?.imageTypeInvalid),
    size: z.number().max(1048576, t?.imageSizeTooLarge),
    lastModified: z.number(),
  });
}

function validateDestination({
  imageFilesLength = 0,
  imageUrls,
  worldRegions,
  t,
}: validateDestinationProps = {}) {
  return z.object({
    title: z.string().min(2, t?.titleTooShort).max(100, t?.titleTooLong),
    content: z
      .string()
      .min(1000, t?.contentTooShort)
      .max(10000, t?.contentTooLong),
    exclusiveContent: z
      .string()
      .min(1000, t?.exclusiveContentTooShort)
      .max(10000, t?.exclusiveContentTooLong),
    latitude: z
      .string()
      .regex(/^-?([1-8]?[1-9]|[1-9]0)\.\d{3,6}$/, t?.latitudeDecimalsInvalid)
      .refine((value) => {
        const num = parseFloat(value);
        return num >= -90 && num <= 90;
      }, t?.latitudeInvalid),
    longitude: z
      .string()
      .regex(
        /^-?((([1-9]?[0-9]|1[0-7][0-9])\.\d{3,6})|180\.000)$/,
        t?.longitudeDecimalsInvalid,
      )
      .refine((value) => {
        const num = parseFloat(value);
        return num >= -180 && num <= 180;
      }, t?.longitudeInvalid),
    worldRegion: z
      .string()
      .refine((value) => worldRegions?.includes(value), t?.worldRegionInvalid),
    keywords: z
      .array(
        validateKeyword({
          t: {
            keywordTooShort: t?.keywordTooShort,
            keywordTooLong: t?.keywordTooLong,
            keywordNoSpaces: t?.keywordNoSpaces,
            keywordFirstLetterCapital: t?.keywordFirstLetterCapital,
          },
        }),
      )
      .min(1, t?.keywordsRequired)
      .max(20, t?.keywordsMax)
      .refine((keywords) => {
        const uniqueKeywords = new Set(keywords);
        return uniqueKeywords.size === keywords.length;
      }, t?.keywordDuplicate),
    imageUrls: z
      .array(z.string().refine((value) => imageUrls?.includes(value)))
      .refine(
        (imageUrls) => imageUrls.length >= 3 - imageFilesLength,
        t?.tooFewImages,
      )
      .refine(
        (imageUrls) => imageUrls.length <= 10 - imageFilesLength,
        t?.tooManyImages,
      ),
    imageFiles: z.array(
      validateImageFile({
        t: {
          imageNameTooLong: t?.imageNameTooLong,
          imageTypeInvalid: t?.imageTypeInvalid,
          imageSizeTooLarge: t?.imageSizeTooLarge,
        },
      }),
    ),
  });
}

export {
  validateProfile,
  validateDestination,
  validateKeyword,
  validateImageFile,
};
