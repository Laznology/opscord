import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_CONNECTION } from './db.provider';
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { schema } from './schema';

@Injectable()
export class DrizzleService {
  constructor(
    @Inject(DRIZZLE_CONNECTION)
    readonly db: BunSQLiteDatabase<typeof schema>,
  ) {}
}
