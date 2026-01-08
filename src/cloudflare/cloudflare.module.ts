import { Module } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import { DrizzleModule } from '../db/db.module';

@Module({
  imports: [DrizzleModule],
  providers: [CloudflareService],
  exports: [CloudflareService],
})
export class CloudflareModule {}
