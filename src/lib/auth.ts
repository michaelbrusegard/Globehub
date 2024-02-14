import PostgresAdapter from '@auth/pg-adapter';
import NextAuth from 'next-auth';
import type { NextAuthConfig, User } from 'next-auth';
import github from 'next-auth/providers/github';
import google from 'next-auth/providers/google';
import type postgres from 'postgres';

import { defaultLocale, pathnames } from '@/lib/config';
import { sql } from '@/lib/db';

declare module 'next-auth' {
  interface Session {
    user: {
      role: string;
    } & Omit<User, 'id'>;
  }
}

function createPgWrapper(sqlClient: postgres.Sql<Record<string, unknown>>) {
  return {
    async query(queryString: string, params: unknown[]) {
      const processedParams = params.map((param) =>
        param === undefined ? null : param,
      );
      const result = await sqlClient.unsafe(queryString, processedParams);
      return { rows: result, rowCount: result.length };
    },
  };
}

const client = createPgWrapper(sql);

export const authConfig = {
  adapter: PostgresAdapter(client),
  providers: [google, github],
  pages: {
    signIn: pathnames['/signin'][defaultLocale],
    signOut: pathnames['/not-found'][defaultLocale],
    error: pathnames['/error'][defaultLocale],
    verifyRequest: '/not-found',
    newUser: '/not-found',
  },
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
