import PostgresAdapter from '@auth/pg-adapter';
import type postgres from 'postgres';

import { sql } from '@/lib/db';

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

// @ts-expect-error - This is a valid adapter after the wrapper is used
const adapter = PostgresAdapter(client);

export { adapter };
