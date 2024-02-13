import NextAuth from 'next-auth';
import type { NextAuthConfig, User } from 'next-auth';
import Google from 'next-auth/providers/google';

import { PostgresAdapter } from '@/lib/postgresAdapter';

declare module 'next-auth' {
  interface Session {
    user: {
      picture?: string;
    } & Omit<User, 'id'>;
  }
}

export const authConfig = {
  adapter: PostgresAdapter(),
  providers: [Google],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
