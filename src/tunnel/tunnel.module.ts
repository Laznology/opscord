import { Module } from '@nestjs/common';
import { TunnelService } from './tunnel.service';
import { DrizzleModule } from '../db/db.module';

@Module({
  imports: [DrizzleModule],
  providers: [TunnelService],
})
export class TunnelModule {}
