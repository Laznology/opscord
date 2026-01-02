import { IsString, IsUUID, Length, Matches, IsOptional } from 'class-validator';
import { StringOption } from 'necord';

export class CreateTunnelDto {
  @StringOption({
    name: 'name',
    description: 'Cloudflare Tunnel name (slug-case)',
    required: true,
    autocomplete: true,
  })
  @IsString()
  @Length(3, 30)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug case',
  })
  name: string;

  @StringOption({
    name: 'tunnel_id',
    description: 'Cloudflare Tunnel ID',
    required: true,
    autocomplete: true,
  })
  @IsUUID('4', { message: 'Must be valid UUID v4 format' })
  cfTunnelId: string;

  @StringOption({
    name: 'account_id',
    description: 'Cloudflare Account ID',
    required: true,
    autocomplete: true,
  })
  @IsString()
  @Length(32, 32, {
    message: 'Must be 32 char length',
  })
  cfAccountId: string;
}

export class UpdateTunnelDto {
  @StringOption({
    name: 'target_tunnel',
    description: 'Alias name tunnle will be update',
    required: true,
    autocomplete: true,
  })
  targetName: string;

  @StringOption({
    name: 'new_name',
    description: 'New rename alias (Optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 30)
  @Matches(/^[a-z0-9-]+$/)
  name?: string;

  @StringOption({
    name: 'new_tunnel_id',
    description: 'New CF Tunnel UUID (Optional)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  cfTunnelId?: string;

  @StringOption({
    name: 'new_account_id',
    description: 'New CF Account ID (Optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(32, 32)
  cfAccountId?: string;
}
