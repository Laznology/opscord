import { Module } from '@nestjs/common';
import { DrizzleModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { DomainModule } from './domain/domain.module';
import { TunnelModule } from './tunnel/tunnel.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { DiscordModule } from './discord/discord.module';
import { APP_FILTER } from '@nestjs/core';
import { ForbiddenErrorFilter } from './common/filters/forbidden.filter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DrizzleModule,
    UserModule,
    DomainModule,
    TunnelModule,
    CronModule,
    DiscordModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ForbiddenErrorFilter,
    },
  ],
})
export class AppModule {}
