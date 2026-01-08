import { Injectable } from '@nestjs/common';
import { CreateDomainDto, UpdateDomainDto } from './domain.dto';
import { DrizzleService } from 'src/db/db.service';
import { domain } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DomainService {
  constructor(private drzzleService: DrizzleService) {}
  async create(createDomainDto: CreateDomainDto) {
    const [newDomain] = await this.drzzleService.db
      .insert(domain)
      .values(createDomainDto)
      .returning();
    return newDomain;
  }

  async findAll() {
    const domains = await this.drzzleService.db
      .select({ id:domain.id , name: domain.name })
      .from(domain);
    return domains;
  }

  async findOne(name: string) {
    const [oneDomain] = await this.drzzleService.db
      .select()
      .from(domain)
      .where(eq(domain.name, name));
    return oneDomain;
  }

  async update(name: string, updateDomainDto: UpdateDomainDto) {
    const [updated] = await this.drzzleService.db
      .update(domain)
      .set(updateDomainDto)
      .where(eq(domain.name, name))
      .returning();
    return updated;
  }

  async remove(name: string) {
    await this.drzzleService.db
      .delete(domain)
      .where(eq(domain.name, name))
      .returning();
  }
}
