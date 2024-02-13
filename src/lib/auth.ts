import NextAuth from 'next-auth';
import type { NextAuthConfig, User } from 'next-auth';
import github from 'next-auth/providers/github';
import google from 'next-auth/providers/google';

import { adapter } from '@/lib/adapter';
import { defaultLocale, pathnames } from '@/lib/config';

declare module 'next-auth' {
  interface Session {
    user: {
      role: string;
    } & Omit<User, 'id'>;
  }
}

export const authConfig = {
  debug: process.env.NODE_ENV === 'development',
  adapter: adapter,
  providers: [google, github],
  pages: {
    signIn: pathnames['/signin'][defaultLocale],
    signOut: pathnames['/signout'][defaultLocale],
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
