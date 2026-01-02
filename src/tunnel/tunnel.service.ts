import { Injectable } from '@nestjs/common';
import { CreateTunnelDto, UpdateTunnelDto } from './tunnel.dto';
import { DrizzleService } from 'src/db/db.service';
import { tunnel } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TunnelService {
  constructor(private drizzleService: DrizzleService) {}
  async create(createTunnelDto: CreateTunnelDto) {
    const [newTunnel] = await this.drizzleService.db
      .insert(tunnel)
      .values(createTunnelDto)
      .returning();
    return newTunnel;
  }

  async findAll() {
    const tunnels = await this.drizzleService.db
      .select({ name: tunnel.name })
      .from(tunnel);
    return tunnels;
  }

  async findOne(name: string) {
    const [oneTunnel] = await this.drizzleService.db
      .select({ name: tunnel.name })
      .from(tunnel)
      .where(eq(tunnel.name, name));
    return oneTunnel;
  }

  async update(name: string, updateTunnelDto: UpdateTunnelDto) {
    const [updated] = await this.drizzleService.db
      .update(tunnel)
      .set(updateTunnelDto)
      .where(eq(tunnel.name, name))
      .returning();
    return updated;
  }

  async remove(name: string) {
    await this.drizzleService.db
      .delete(tunnel)
      .where(eq(tunnel.name, name))
      .returning();
  }
}
