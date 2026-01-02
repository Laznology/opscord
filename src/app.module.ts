import { Module } from '@nestjs/common';
import { DrizzleModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { DomainModule } from './domain/domain.module';
import { TunnelModule } from './tunnel/tunnel.module';

@Module({
  imports: [DrizzleModule, UserModule, DomainModule, TunnelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
