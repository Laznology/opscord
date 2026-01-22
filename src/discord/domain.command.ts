import {
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  EmbedBuilder,
} from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import { MessageFlags, TextInputStyle } from 'discord.js';
import {
  Context,
  Options,
  SlashCommand,
  StringOption,
  type SlashCommandContext,
} from 'necord';
import { DomainService } from 'src/domain/domain.service';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';

class DeleteDomainOptions {
  @StringOption({
    name: 'domain_name',
    description: 'Domain name to delete',
    required: true,
    autocomplete: true,
  })
  domainName: string;
}

class SyncDomainOptions {
  @StringOption({
    name: 'domain_name',
    description: 'Domain name to sync (leave empty for all domains)',
    required: false,
    autocomplete: true,
  })
  domainName?: string;
}

@Injectable()
export class DomainCommand {
  constructor(
    private domainService: DomainService,
    private cloudflareService: CloudflareService,
  ) {}
  @SlashCommand({
    name: 'list-domain',
    description: 'List domain in Database ()',
  })
  public async listDomain(@Context() [interaction]: SlashCommandContext) {
    try {
      const domains = await this.domainService.findAll();
      const domainSelect = new StringSelectMenuBuilder()
        .setCustomId('domain-list-domain-select')
        .setPlaceholder('List registered domain')
        .setMinValues(1)
        .setMaxValues(1)
        .setOptions(
          domains.map((domain) => ({
            label: domain.name,
            value: domain.id,
          })),
        );
      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        domainSelect,
      );
      return interaction.reply({
        content: 'List of your registered domain',
        components: [row],
        flags: MessageFlags.Ephemeral,
      });
    } catch {
      return interaction.reply({
        content: 'An error occurred while processing your request.',
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  @SlashCommand({
    name: 'register-domain',
    description: 'Register a new domain',
  })
  public async registerDomain(@Context() [interaction]: SlashCommandContext) {
    const modal = new ModalBuilder()
      .setCustomId('domain-register-modal')
      .setTitle('Register New Domain');

    const domainNameInput = new TextInputBuilder()
      .setCustomId('domain_name')
      .setLabel('Domain Name (FQDN)')
      .setPlaceholder('example.com')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(255);

    const zoneIdInput = new TextInputBuilder()
      .setCustomId('zone_id')
      .setLabel('Cloudflare Zone ID')
      .setPlaceholder('32 character Zone ID')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(32)
      .setMaxLength(32);

    const firstRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      domainNameInput,
    );
    const secondRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      zoneIdInput,
    );

    modal.addComponents(firstRow, secondRow);

    return interaction.showModal(modal);
  }

  @SlashCommand({
    name: 'delete-domain',
    description: 'Delete a domain from database',
  })
  public async deleteDomain(
    @Context() [interaction]: SlashCommandContext,
    @Options() { domainName }: DeleteDomainOptions,
  ) {
    try {
      const existingDomain = await this.domainService.findOne(domainName);

      if (!existingDomain) {
        return interaction.reply({
          content: `Domain **${domainName}** not found in database.`,
          flags: MessageFlags.Ephemeral,
        });
      }

      await this.domainService.remove(domainName);

      return interaction.reply({
        content: `Domain **${domainName}** has been successfully deleted.`,
        flags: MessageFlags.Ephemeral,
      });
    } catch {
      return interaction.reply({
        content: 'An error occurred while deleting the domain.',
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  @SlashCommand({
    name: 'sync-domain',
    description: 'Manually sync DNS records from Cloudflare',
  })
  public async syncDomain(
    @Context() [interaction]: SlashCommandContext,
    @Options() { domainName }: SyncDomainOptions,
  ) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      if (domainName) {
        // Sync specific domain
        const domain = await this.domainService.findOne(domainName);
        if (!domain) {
          return interaction.editReply({
            content: `❌ Domain **${domainName}** not found in database.`,
          });
        }

        const result =
          await this.cloudflareService.syncDnsRecordForDomainName(domainName);

        const embed = new EmbedBuilder()
          .setTitle('✅ Sync Completed')
          .setColor(0x57f287)
          .addFields(
            { name: '🌐 Domain', value: result.domainName, inline: true },
            {
              name: '📝 Records Synced',
              value: `${result.synced}`,
              inline: true,
            },
          )
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      } else {
        // Sync all domains
        const results = await this.cloudflareService.syncForAllDomains();

        const embed = new EmbedBuilder()
          .setTitle('✅ Bulk Sync Completed')
          .setColor(0x57f287)
          .setDescription(
            results
              .map(
                (r, idx) =>
                  `**${idx + 1}.** ${r.domainName} - ${r.synced} record(s)`,
              )
              .join('\n'),
          )
          .setFooter({
            text: `Total: ${results.length} domain(s), ${results.reduce((sum, r) => sum + r.synced, 0)} record(s)`,
          })
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return interaction.editReply({
        content: `Sync failed: ${message}`,
      });
    }
  }
}
