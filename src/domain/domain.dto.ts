import { IsFQDN, IsOptional, IsString, Length } from 'class-validator';
import { StringOption } from 'necord';

export class CreateDomainDto {
  @StringOption({
    name: 'name',
    description: 'Domain FQDN',
    required: true,
    autocomplete: true,
  })
  @IsString()
  @IsFQDN({}, { message: 'Must be valid FQDN' })
  name: string;

  @StringOption({
    name: 'zone_id',
    description: 'Cloudflare Zone ID',
    required: true,
    autocomplete: true,
  })
  @IsString()
  @Length(32, 32, { message: 'Zone ID must be 32 chars' })
  cfZoneId: string;
}

export class UpdateDomainDto {
  @StringOption({
    name: 'name',
    description: 'Domain FQDN',
    required: false,
    autocomplete: true,
  })
  @IsString()
  @IsOptional()
  @IsFQDN({}, { message: 'Must be valid FQDN' })
  name?: string;

  @StringOption({
    name: 'zone_id',
    description: 'Cloudflare Zone ID',
    required: false,
    autocomplete: true,
  })
  @IsString()
  @IsOptional()
  @Length(32, 32, { message: 'Zone ID must be 32 chars' })
  cfZoneId?: string;
}
