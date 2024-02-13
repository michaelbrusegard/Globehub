import NextAuth from 'next-auth';
import type { NextAuthConfig, User } from 'next-auth';
import github from 'next-auth/providers/github';
import google from 'next-auth/providers/google';

import { sql } from '@/lib/db';
import { PostgresAdapter } from '@/lib/postgresAdapter';

declare module 'next-auth' {
  interface Session {
    user: {
      role: string;
    } & Omit<User, 'id'>;
  }
}

export const authConfig = {
  adapter: PostgresAdapter(sql),
  providers: [google, github],
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authConfig);
