import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { DomainModule } from 'src/domain/domain.module';
import { CloudflareModule } from 'src/cloudflare/cloudflare.module';
import { DrizzleModule } from 'src/db/db.module';
import { DnsCommand } from './dns.command';
import { DNSListSelect } from 'src/components/discord/dns-list.select';
import { DNSDeleteRecordSelect } from 'src/components/discord/dns-delete-record.select';
import { DNSDeleteDomainSelect } from 'src/components/discord/dns-delete-domain.select';
import { DNSUpdateDomainSelect } from '../components/discord/dns-update-domain.select';
import { DNSUpdateRecordSelect } from '../components/discord/dns-update-record.select';
import { DNSUpdateRecordModal } from '../components/discord/dns-update-record.modal';

@Module({
  imports: [
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN!,
      intents: [IntentsBitField.Flags.Guilds],
      development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID!],
    }),
    DomainModule,
    CloudflareModule,
    DrizzleModule,
  ],
  providers: [
    DnsCommand,
    DNSListSelect,
    DNSDeleteRecordSelect,
    DNSDeleteDomainSelect,
    DNSUpdateDomainSelect,
    DNSUpdateRecordSelect,
    DNSUpdateRecordModal,
  ],
})
export class DiscordModule {}
