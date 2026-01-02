import { integer } from 'drizzle-orm/sqlite-core';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  discordId: text('discord_id').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['ENGINEER', 'ADMIN'] }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
});

export const tunnel = sqliteTable('tunnel', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  cfTunnelId: text('cf_tunnel_id'),
  cfAccountId: text('cf_account_id'),
});

export const domain = sqliteTable('domain', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  cfZoneId: text('cf_zone_id').notNull(),
});

export const schema = { user, domain, tunnel };
