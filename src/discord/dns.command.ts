import { Injectable, Logger } from '@nestjs/common';
import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from 'necord';
import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
} from 'discord.js';
import { DomainService } from 'src/domain/domain.service';
import { CreateDnsRecordDto } from '../domain/records/record.dto';
import { DNSRecordService } from '../domain/records/records.service';

@Injectable()
export class DnsCommand {
  private readonly logger = new Logger(DnsCommand.name);

  constructor(
    private readonly domainService: DomainService,
    private recordService: DNSRecordService,
  ) {}

  @SlashCommand({ name: 'list-records', description: 'List domain records' })
  public async listRecords(@Context() [interaction]: SlashCommandContext) {
    try {
      this.logger.log('Executing list-records command');
      const domains = await this.domainService.findAll();
      this.logger.log(`Found ${domains?.length || 0} domains`);

      if (!domains || domains.length === 0) {
        return interaction.reply({
          content: 'No domains found in database (sync first use /sync)',
          flags: MessageFlags.Ephemeral,
        });
      }

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('dns-list:domain-select')
        .setPlaceholder('Select a domain')
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(
          domains.map((domain) => ({
            label: domain.name,
            value: domain.name,
          })),
        );
      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectMenu,
      );

      this.logger.log('Sending reply with select menu');
      return interaction.reply({
        content: 'Select a domain to view DNS records:',
        components: [row],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      this.logger.error('Error in list-records command:', error);
      if (!interaction.replied && !interaction.deferred) {
        return interaction.reply({
          content: 'An error occurred while processing your request.',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }

  @SlashCommand({ name: 'create-dns-record', description: 'Create DNS Record' })
  public async onCreate(
    @Context() [interaction]: SlashCommandContext,
    @Options() options: CreateDnsRecordDto,
  ) {
    const result = await this.recordService.createRecord(options);
    const embed = new EmbedBuilder()
      .setTitle(`DNS Record ${result.name} created`)
      .setColor('Green')
      .setDescription('Successfully created')
      .setTimestamp();
    return await interaction.reply({
      content: 'Create DNS record',
      embeds: [embed],
    });
  }

  @SlashCommand({ name: 'delete-dns-record', description: 'Delete DNS record' })
  public async onDelete(@Context() [interaction]: SlashCommandContext) {
    const domains = await this.domainService.findAll();
    const selectDomain = new StringSelectMenuBuilder()
      .setCustomId('dns-delete:domain-select')
      .setPlaceholder('Select domain to delete the record')
      .setMinValues(1)
      .setMaxValues(1)
      .setOptions(
        domains.map((domain) => ({
          label: domain.name,
          value: domain.id,
        })),
      );
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectDomain,
    );

    return interaction.reply({
      content: 'Select a domain to delete Record:',
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  }
}
