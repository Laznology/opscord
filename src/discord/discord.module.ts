import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { DomainModule } from 'src/domain/domain.module';
import { CloudflareModule } from 'src/cloudflare/cloudflare.module';
import { DrizzleModule } from 'src/db/db.module';
import { DnsCommand } from './dns.command';
import { DomainCommand } from './domain.command';
import { DNSListSelect } from 'src/components/discord/dns-list.select';
import { DNSDeleteRecordSelect } from 'src/components/discord/dns-delete-record.select';
import { DNSDeleteDomainSelect } from 'src/components/discord/dns-delete-domain.select';
import { DNSUpdateDomainSelect } from '../components/discord/dns-update-domain.select';
import { DNSUpdateRecordSelect } from '../components/discord/dns-update-record.select';
import { DNSUpdateRecordModal } from '../components/discord/dns-update-record.modal';
import { DomainListSelect } from 'src/components/discord/domain-list.select';
import { DomainRegisterModal } from 'src/components/discord/domain-register.modal';

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
    DomainCommand,
    DNSListSelect,
    DNSDeleteRecordSelect,
    DNSDeleteDomainSelect,
    DNSUpdateDomainSelect,
    DNSUpdateRecordSelect,
    DNSUpdateRecordModal,
    DomainListSelect,
    DomainRegisterModal,
  ],
})
export class DiscordModule {}
