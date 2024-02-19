import { z } from 'zod';

function validateProfile({ bio }: { bio?: string }) {
  const profileSchema = z.object({
    bio: z.string().max(200),
  });

  return profileSchema.safeParse({ bio });
}

export { validateProfile };
