import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { StringOption } from 'necord';
import { user } from 'src/db/schema';
export type newUser = typeof user.$inferInsert;
export type User = typeof user.$inferSelect;
export enum UserRole {
  ENGINEER = 'ENGINEER',
  ADMIN = 'ADMIN',
}
export class CreateUserDto {
  @StringOption({
    name: 'name',
    description: 'User name',
    required: true,
    autocomplete: true,
  })
  @IsString()
  @Length(3, 50)
  name: string;

  @StringOption({
    name: 'discord_id',
    description: 'Discord user id',
    required: true,
    autocomplete: true,
  })
  @IsString()
  @Matches(/^\d{17, 20}$/, {
    message: 'Format Discord ID salah (harus angka 17-20 digit)',
  })
  discordId: string;

  @StringOption({
    name: 'role',
    description: 'Access level',
    required: true,
    autocomplete: true,
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto {
  @StringOption({
    name: 'name',
    description: 'User name',
    required: false,
    autocomplete: true,
  })
  @IsString()
  @IsOptional()
  @Length(3, 50)
  name?: string;

  @StringOption({
    name: 'discord_id',
    description: 'Discord user id',
    required: false,
    autocomplete: true,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{17, 20}$/, {
    message: 'Format Discord ID salah (harus angka 17-20 digit)',
  })
  discordId?: string;

  @StringOption({
    name: 'role',
    description: 'Access level',
    required: false,
    autocomplete: true,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
