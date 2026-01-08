import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DrizzleModule } from '../db/db.module';
import { DNSRecordService } from './records/records.service';
import { CloudflareModule } from '../cloudflare/cloudflare.module';

@Module({
  imports: [DrizzleModule, CloudflareModule],
  providers: [DomainService, DNSRecordService],
  exports: [DomainService, DNSRecordService],
})
export class DomainModule {}
