import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/db/db.service';
import { dnsRecord } from 'src/db/schema';
import { CreateDnsRecordDto, UpdateDnsRecordDto } from './record.dto';
import { domain as domainTable } from '../../db/schema';
import { CloudflareService } from '../../cloudflare/cloudflare.service';
import Cloudflare from 'cloudflare';

@Injectable()
export class DNSRecordService {
  constructor(
    private drizzleService: DrizzleService,
    private cloudflareService: CloudflareService,
  ) {}
  async findRecordByZone(domainId: string) {
    return this.drizzleService.db
      .select()
      .from(dnsRecord)
      .where(eq(dnsRecord.domainId, domainId));
  }
  async getOne(recordId: string) {
    return this.drizzleService.db
      .select()
      .from(dnsRecord)
      .where(eq(dnsRecord.id, recordId));
  }
  async createRecord(createDto: CreateDnsRecordDto) {
    const { domainName } = createDto;
    const [domain] = await this.drizzleService.db
      .select()
      .from(domainTable)
      .where(eq(domainTable.name, domainName));
    if (!domain) {
      throw new Error(`Domain ${domainName} not found`);
    }
    return this.cloudflareService.createDnsRecord(
      domain.cfZoneId,
      domain.id,
      createDto,
    );
  }

  async updateRecord(recordId: string, updateDto: UpdateDnsRecordDto) {
    const [record] = await this.drizzleService.db
      .select()
      .from(dnsRecord)
      .where(eq(dnsRecord.id, recordId));
    if (!record) throw new Error(`Record with ID ${recordId} not found`);
    const [domain] = await this.drizzleService.db
      .select()
      .from(domainTable)
      .where(eq(domainTable.id, record.domainId));
    if (!domain) throw new Error('Domain not found');
    return this.cloudflareService.updateDnsRecord(
      recordId,
      updateDto as Cloudflare.DNS.RecordUpdateParams,
    );
  }

  async deleteRecord(recordId: string) {
    const [record] = await this.drizzleService.db
      .select()
      .from(dnsRecord)
      .where(eq(dnsRecord.id, recordId));
    if (!record) throw new Error(`Record with ID ${recordId} not found`);
    const [domain] = await this.drizzleService.db
      .select()
      .from(domainTable)
      .where(eq(domainTable.id, record.domainId));
    if (!domain) throw new Error('Domain not found');
    await this.cloudflareService.deleteDnsRecord(
      domain.cfZoneId,
      record.cfRecordId!,
    );
    return {
      recordName: record.name,
    };
  }
}
