import { z } from 'zod';

function validateProfile({ bio }: { bio?: string }) {
  const profileSchema = z.object({
    bio: z.string().max(200),
  });

  return profileSchema.safeParse({ bio });
}

function validateDestination(
  {
    title,
    content,
    exclusiveContent,
    latitude,
    longitude,
    worldRegion,
  }: {
    title: string;
    content: string;
    exclusiveContent: string;
    latitude: string;
    longitude: string;
    worldRegion: string;
  },
  worldRegions: string[],
) {
  const worldRegionEnum = z.enum(worldRegions as [string, ...string[]]);

  const latitudeRegex = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{3,}$/,
    longitudeRegex = /^-?((([1-9]?[0-9]|1[0-7][0-9])\.{1}\d{3,})|180\.0000)$/;

  const destinationSchema = z.object({
    title: z.string().min(2).max(100),
    content: z.string().min(1000).max(10000),
    exclusiveContent: z.string().min(1000).max(10000),
    latitude: z.string().regex(latitudeRegex),
    longitude: z.string().regex(longitudeRegex),
    worldRegion: worldRegionEnum,
  });

  return destinationSchema.safeParse({
    title,
    content,
    exclusiveContent,
    latitude,
    longitude,
    worldRegion,
  });
}

export { validateProfile, validateDestination };
