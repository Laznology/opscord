import { Module } from '@nestjs/common';
import { DrizzleProvider } from './db.provider';
import { DrizzleService } from './db.service';

@Module({
  providers: [DrizzleProvider, DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
