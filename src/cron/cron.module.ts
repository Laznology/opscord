import { Module } from '@nestjs/common';
import { CloudflareSyncCron } from './cloudflare.sync';
import { DrizzleModule } from '../db/db.module';
import { CloudflareModule } from '../cloudflare/cloudflare.module';

@Module({
  imports: [DrizzleModule, CloudflareModule],
  providers: [CloudflareSyncCron],
})
export class CronModule {}
