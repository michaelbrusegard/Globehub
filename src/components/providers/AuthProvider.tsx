'use client';

import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

function AuthProvider({
  children,
  session,
}: React.PropsWithChildren<{ session: Session }>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export { AuthProvider };
