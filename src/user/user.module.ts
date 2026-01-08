import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DrizzleModule } from '../db/db.module';

@Module({
  imports: [DrizzleModule],
  providers: [UserService],
})
export class UserModule {}
