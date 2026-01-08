import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';

@Injectable()
export class CloudflareSyncCron {
  private readonly logger = new Logger(CloudflareSyncCron.name);
  private isSyncing = false;

  constructor(private cloudflareService: CloudflareService) {}

  @Cron(CronExpression.EVERY_11_HOURS)
  async handleCron() {
    if (this.isSyncing) {
      this.logger.warn('Sync already in progress, skipping...');
      return;
    }

    this.isSyncing = true;
    this.logger.log('Starting Cloudflare DNS sync for all domains...');

    try {
      await this.cloudflareService.syncForAllDomains();
      this.logger.log('Cloudflare DNS sync completed successfully.');
    } catch (error) {
      this.logger.error('Cloudflare DNS sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }
}
