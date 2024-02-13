/* eslint-disable */
import type {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from '@auth/core/adapters';

import { sql } from '@/lib/db';

function PostgresAdapter(): Adapter {
  return {
    async createVerificationToken(
      verificationToken: VerificationToken,
    ): Promise<VerificationToken> {
      const { identifier, expires, token } = verificationToken;
      await sql`
        INSERT INTO verification_token (identifier, expires, token) 
        VALUES (${identifier}, ${expires}, ${token})
          `;
      return verificationToken;
    },

    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }): Promise<VerificationToken> {
      const result = await sql`delete from verification_token
        where identifier = ${identifier} and token = ${token}
        RETURNING identifier, expires, token`;
      return result.rowCount !== 0 ? result.rows[0] : null;
    },

    async createUser(user: Omit<AdapterUser, 'id'>) {
      const { name, email, emailVerified, image } = user;
      const result = await sql`
        INSERT INTO users (name, email, "emailVerified", image) 
        VALUES (${name}, ${email}, ${emailVerified}, ${image}) 
        RETURNING id, name, email, "emailVerified", image`;
      return result.rows[0];
    },

    async getUser(id) {
      try {
        const result = await sql`select * from users where id = ${id}`;
        return result.rowCount === 0 ? null : result.rows[0];
      } catch (e) {
        return null;
      }
    },

    async getUserByEmail(email) {
      const result = await sql`select * from users where email = ${email}`;
      return result.rowCount !== 0 ? result.rows[0] : null;
    },

    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser | null> {
      const result = await sql`
        select u.* from users u join accounts a on u.id = a."userId"
        where 
        a.provider = ${provider}
        and 
        a."providerAccountId" = ${providerAccountId}`;
      return result.rowCount !== 0 ? result.rows[0] : null;
    },

    async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
      const query1 = await sql`select * from users where id = ${user.id}`;
      const oldUser = query1.rows[0];

      const newUser = {
        ...oldUser,
        ...user,
      };

      const { id, name, email, emailVerified, image } = newUser;
      const query2 = await sql`
        UPDATE users set
        name = ${name}, email = ${email}, "emailVerified" = ${emailVerified}, image = ${image}
        where id = ${id}
        RETURNING name, id, email, "emailVerified", image`;
      return query2.rows[0];
    },

    async linkAccount(account) {
      const result = await sql`
        insert into accounts 
        (
          "userId", 
          provider, 
          type, 
          "providerAccountId", 
          access_token,
          expires_at,
          refresh_token,
          id_token,
          scope,
          session_state,
          token_type
        )
        values (${account.userId}, ${account.provider}, ${account.type}, ${account.providerAccountId}, ${account.access_token}, ${account.expires_at}, ${account.refresh_token}, ${account.id_token}, ${account.scope}, ${account.session_state}, ${account.token_type})
        returning
          id,
          "userId", 
          provider, 
          type, 
          "providerAccountId", 
          access_token,
          expires_at,
          refresh_token,
          id_token,
          scope,
          session_state,
          token_type
        `;
      return mapExpiresAt(result.rows[0]);
    },

    async createSession({ sessionToken, userId, expires }) {
      if (userId === undefined) {
        throw Error(`userId is undef in createSession`);
      }
      const result =
        await sql`insert into sessions ("userId", expires, "sessionToken")
        values (${userId}, ${expires}, ${sessionToken})
        RETURNING id, "sessionToken", "userId", expires`;
      return result.rows[0];
    },

    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession;
      user: AdapterUser;
    } | null> {
      if (sessionToken === undefined) {
        return null;
      }
      const result1 =
        await sql`select * from sessions where "sessionToken" = ${sessionToken}`;
      if (result1.rowCount === 0) {
        return null;
      }
      const session: AdapterSession = result1.rows[0];

      const result2 =
        await sql`select * from users where id = ${session.userId}`;
      if (result2.rowCount === 0) {
        return null;
      }
      const user = result2.rows[0];
      return {
        session,
        user,
      };
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
    ): Promise<AdapterSession | null | undefined> {
      const { sessionToken } = session;
      const result1 =
        await sql`select * from sessions where "sessionToken" = ${sessionToken}`;
      if (result1.rowCount === 0) {
        return null;
      }
      const originalSession: AdapterSession = result1.rows[0];

      const newSession: AdapterSession = {
        ...originalSession,
        ...session,
      };
      const result = await sql`
        UPDATE sessions set
        expires = ${newSession.expires}
        where "sessionToken" = ${newSession.sessionToken}`;
      return result.rows[0];
    },

    async deleteSession(sessionToken) {
      await sql`delete from sessions where "sessionToken" = ${sessionToken}`;
    },

    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount;
      await sql`delete from accounts where "providerAccountId" = ${providerAccountId} and provider = ${provider}`;
    },

    async deleteUser(userId: string) {
      await sql`delete from users where id = ${userId}`;
      await sql`delete from sessions where "userId" = ${userId}`;
      await sql`delete from accounts where "userId" = ${userId}`;
    },
  };
}

export { PostgresAdapter };
