import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { DrizzleService } from 'src/db/db.service';
import { user } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(private drizzleService: DrizzleService) {}
  async create(createUserDto: CreateUserDto) {
    const [newUser] = await this.drizzleService.db
      .insert(user)
      .values(createUserDto)
      .returning();
    return newUser;
  }

  async findAll() {
    const users = await this.drizzleService.db.select().from(user);
    return users;
  }

  async findOne(id: string) {
    const [oneUser] = await this.drizzleService.db
      .select()
      .from(user)
      .where(eq(user.id, id));
    return oneUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const [updated] = await this.drizzleService.db
      .update(user)
      .set(updateUserDto)
      .where(eq(user.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    await this.drizzleService.db.delete(user).where(eq(user.id, id));
  }
}
