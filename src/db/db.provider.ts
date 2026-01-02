import { Provider } from '@nestjs/common';
import { Database } from 'bun:sqlite';
import { schema } from './schema';
import { drizzle } from 'drizzle-orm/bun-sqlite';
export const DRIZZLE_CONNECTION = 'DRIZZLE_CONNECTION';
export const DrizzleProvider: Provider = {
  provide: DRIZZLE_CONNECTION,
  useFactory: () => {
    const sqlite = new Database('./data/sqlite.db');
    return drizzle(sqlite, { schema, logger: true });
  },
};
