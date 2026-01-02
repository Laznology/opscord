import { Module } from '@nestjs/common';
import { TunnelService } from './tunnel.service';

@Module({
  providers: [TunnelService],
})
export class TunnelModule {}
