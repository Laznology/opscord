import { Injectable, Logger } from '@nestjs/common';
import { dnsRecord, domain as domainTable, tunnelIngress } from 'src/db/schema';
import Cloudflare from 'cloudflare';
import { CLOUDFLARE_KEY } from 'src/constans';
import { DrizzleService } from 'src/db/db.service';
import { eq } from 'drizzle-orm';
import { CreateDnsRecordDto } from '../domain/records/record.dto';

export type DnsRecord = typeof dnsRecord.$inferSelect;
export type TunnelIngress = typeof tunnelIngress.$inferSelect;
@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);
  private readonly cfClient: Cloudflare;
  constructor(private drizzleService: DrizzleService) {
    if (!CLOUDFLARE_KEY) {
      throw new Error('CLOUDFLARE_API_KEY is not set');
    }
    this.cfClient = new Cloudflare({ apiToken: CLOUDFLARE_KEY });
  }

  async fetchDnsRecords(
    zoneId: string,
  ): Promise<Cloudflare.DNS.RecordResponse[]> {
    try {
      const response = await this.cfClient.dns.records.list({
        zone_id: zoneId,
      });
      return response.result;
    } catch (error) {
      this.logger.error(`Failed to fetch DNS Record for zone:${zoneId}`, Error);
      throw error;
    }
  }

  async syncDnsRecordForDomainName(domainName: string) {
    const [domain] = await this.drizzleService.db
      .select()
      .from(domainTable)
      .where(eq(domainTable.name, domainName))
      .limit(1);
    if (!domain) throw new Error(`Domain ${domainName} not found`);
    const records = await this.fetchDnsRecords(domain.cfZoneId);
    for (const record of records) {
      if (!record.id) continue;
      const content = (record as Cloudflare.DNS.Record).content ?? '';
      await this.drizzleService.db
        .insert(dnsRecord)
        .values({
          domainId: domain.id,
          cfRecordId: record.id,
          type: record.type,
          name: record.name,
          content: content,
          proxied: record.proxied ?? false,
        })
        .onConflictDoUpdate({
          target: dnsRecord.cfRecordId,
          set: {
            domainId: domain.id,
            type: record.type,
            name: record.name,
            content,
            proxied: record.proxied ?? false,
          },
        });
    }
    return {
      domainId: domain.id,
      domainName: domain.name,
      synced: records.length,
    };
  }

  async syncForAllDomains() {
    const domains = await this.drizzleService.db.select().from(domainTable);
    const results: { domainId: string; domainName: string; synced: number }[] =
      [];
    for (const domain of domains) {
      results.push(
        (await this.syncDnsRecordForDomainName(domain.name)) as {
          domainId: string;
          domainName: string;
          synced: number;
        },
      );
    }
    return results;
  }

  async fetchTunnelConfig(tunnelId: string, accountId: string) {
    try {
      const response =
        await this.cfClient.zeroTrust.tunnels.cloudflared.configurations.get(
          tunnelId,
          {
            account_id: accountId,
          },
        );
      const config = response.config as {
        ingress: Array<{ hostname: string; service: string; path: string }>;
      };
      return config.ingress ?? [];
    } catch (error) {
      this.logger.error(
        `Failed to fetch tunnel config for ${tunnelId} in account ${accountId}`,
        error,
      );
      throw error;
    }
  }
  async listTunnels(accountId: string) {
    try {
      const response = await this.cfClient.zeroTrust.tunnels.cloudflared.list({
        account_id: accountId,
      });
      return response.result.map((t) => ({ id: t.id, name: t.name }));
    } catch (error) {
      this.logger.error(
        `Failed to fetch list tunnels for account ${accountId}`,
        error,
      );
      throw error;
    }
  }
  async createDnsRecord(
    zoneId: string,
    domainId: string,
    record: CreateDnsRecordDto,
  ): Promise<DnsRecord> {
    const cfRecord = await this.cfClient.dns.records.create({
      zone_id: zoneId,
      name: record.name,
      content: record.content,
      type: record.type,
      proxied: record.proxied,
      ttl: 3600,
    });
    if (!cfRecord) throw new Error('Cloudflare returned no record');
    const [dbRecord] = await this.drizzleService.db
      .insert(dnsRecord)
      .values({
        domainId,
        cfRecordId: cfRecord.id,
        type: cfRecord.type,
        name: cfRecord.name,
        content: cfRecord.content!,
        proxied: cfRecord.proxied ?? false,
      })
      .returning();
    return dbRecord;
  }

  async updateDnsRecord(
    recordId: string,
    updates: Cloudflare.DNS.RecordUpdateParams,
  ): Promise<DnsRecord> {
    try {
      const cfRecord = await this.cfClient.dns.records.update(recordId, {
        ...updates,
      });
      const [dbUpdated] = await this.drizzleService.db
        .update(dnsRecord)
        .set({
          content: cfRecord.content,
          proxied: cfRecord.proxied,
        })
        .where(eq(dnsRecord.cfRecordId, recordId))
        .returning();
      return dbUpdated;
    } catch (error) {
      this.logger.error(`Failed to update DNS record ${recordId}`, error);
      throw error;
    }
  }

  async deleteDnsRecord(zoneId: string, recordId: string) {
    try {
      await this.cfClient.dns.records.delete(recordId, {
        zone_id: zoneId,
      });
      await this.drizzleService.db
        .delete(dnsRecord)
        .where(eq(dnsRecord.cfRecordId, recordId));
      this.logger.log(`Deleted DNS record ${recordId}`);
    } catch (error) {
      this.logger.error(`Failed to delete DNS record ${recordId}`, error);
      throw error;
    }
  }
}
