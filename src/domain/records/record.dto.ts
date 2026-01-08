import {
  IsBoolean,
  IsFQDN,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { BooleanOption, IntegerOption, StringOption } from 'necord';
import { Transform } from 'class-transformer';

export class CreateDomainDto {
  @StringOption({
    name: 'name',
    description: 'Domain FQDN (e.g., example.com)',
    required: true,
  })
  @IsString()
  @IsFQDN({}, { message: '❌ Must be valid FQDN (e.g., example.com)' })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  name: string;

  @StringOption({
    name: 'zone_id',
    description: 'Cloudflare Zone ID (32 characters)',
    required: true,
  })
  @IsString()
  @Length(32, 32, { message: '❌ Zone ID must be exactly 32 characters' })
  @Matches(/^[a-f0-9]{32}$/, {
    message: '❌ Zone ID must be hexadecimal (0-9, a-f)',
  })
  cfZoneId: string;
}

export class UpdateDomainDto {
  @StringOption({
    name: 'name',
    description: 'Domain FQDN',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsFQDN({}, { message: '❌ Must be valid FQDN' })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  name?: string;

  @StringOption({
    name: 'zone_id',
    description: 'Cloudflare Zone ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(32, 32, { message: '❌ Zone ID must be 32 chars' })
  @Matches(/^[a-f0-9]{32}$/, {
    message: '❌ Zone ID must be hexadecimal',
  })
  cfZoneId?: string;
}

export class CreateDnsRecordDto {
  @StringOption({
    name: 'fqdn',
    description: 'Domain FQDN',
    required: true,
  })
  @IsString()
  domainName: string;

  @StringOption({
    name: 'type',
    description: 'DNS record type',
    required: true,
    choices: [
      { name: 'A (IPv4 address)', value: 'A' },
      { name: 'AAAA (IPv6 address)', value: 'AAAA' },
      { name: 'CNAME (Alias)', value: 'CNAME' },
      { name: 'TXT (Text)', value: 'TXT' },
      { name: 'MX (Mail)', value: 'MX' },
      { name: 'SRV (Service)', value: 'SRV' },
      { name: 'NS (Nameserver)', value: 'NS' },
    ],
  })
  @IsString()
  @IsIn(['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS', 'SRV'], {
    message: '❌ Invalid DNS record type',
  })
  type:
    | 'A'
    | 'AAAA'
    | 'CNAME'
    | 'MX'
    | 'NS'
    | 'OPENPGPKEY'
    | 'PTR'
    | 'TXT'
    | 'CAA'
    | 'CERT'
    | 'DNSKEY'
    | 'DS'
    | 'HTTPS'
    | 'LOC'
    | 'NAPTR'
    | 'SMIMEA'
    | 'SRV'
    | 'SSHFP'
    | 'SVCB'
    | 'TLSA'
    | 'URI';

  @StringOption({
    name: 'name',
    description: 'Record name (e.g., @ for root, api for api.domain.com)',
    required: true,
  })
  @IsString()
  @Length(1, 255, {
    message: '❌ Record name must be 1-255 characters',
  })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  name: string;

  @StringOption({
    name: 'content',
    description: 'Record content (IP address, CNAME target, etc.)',
    required: true,
  })
  @IsString()
  @Length(1, 2048, {
    message: '❌ Content must be 1-2048 characters',
  })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  content: string;

  @BooleanOption({
    name: 'proxied',
    description: 'Enable Cloudflare proxy (orange cloud)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  proxied?: boolean;

  @IntegerOption({
    name: 'ttl',
    description: 'TTL in seconds (1 = auto, 120-86400 for manual)',
    required: false,
    min_value: 1,
    max_value: 86400,
  })
  @IsInt()
  @IsOptional()
  @Min(1, { message: '❌ TTL must be at least 1 (auto)' })
  @Max(86400, { message: '❌ TTL max 86400 seconds (24 hours)' })
  ttl?: number;

  @StringOption({
    name: 'priority',
    description: 'Priority for MX/SRV records (0-65535)',
    required: false,
  })
  @IsOptional()
  @ValidateIf((o: CreateDnsRecordDto) => ['MX', 'SRV'].includes(o.type))
  @IsInt({ message: '❌ Priority must be a number' })
  @Min(0)
  @Max(65535)
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  priority?: number;
}

export class UpdateDnsRecordDto {
  @StringOption({
    name: 'content',
    description: 'New record content (IP, CNAME target, etc.)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 2048, {
    message: '❌ Content must be 1-2048 characters',
  })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  content?: string;

  @BooleanOption({
    name: 'proxied',
    description: 'Toggle Cloudflare proxy',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  proxied?: boolean;

  @IntegerOption({
    name: 'ttl',
    description: 'TTL in seconds (1 = auto)',
    required: false,
    min_value: 1,
    max_value: 86400,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(86400)
  ttl?: number;
}
