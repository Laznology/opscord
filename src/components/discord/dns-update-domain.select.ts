import { Injectable, Logger } from '@nestjs/common';
import {
  Context,
  SelectedStrings,
  StringSelect,
  type StringSelectContext,
} from 'necord';
import { StringSelectMenuBuilder } from 'discord.js';
import { ActionRowBuilder, MessageFlags } from 'discord.js';
import { DNSRecordService } from 'src/domain/records/records.service';
import { DomainService } from 'src/domain/domain.service';

@Injectable()
export class DNSUpdateDomainSelect {
  private logger = new Logger(DNSUpdateDomainSelect.name);
  constructor(
    private dnsRecordService: DNSRecordService,
    private domainService: DomainService,
  ) {}

  @StringSelect('dns-update-domain-select')
  public async onDomainSelect(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() selected: string[],
  ) {
    const selectedDomainValue = selected[0];
    this.logger.log(`Value selected domain ${selectedDomainValue}`);
    const domain = await this.domainService.findOne(selectedDomainValue);
    if (!domain) {
      return interaction.reply({
        content: `Domain ${selectedDomainValue} not found`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const domainId = domain.id;
    const records = await this.dnsRecordService.findRecordByZone(domainId);
    if (!records || records.length === 0) {
      return interaction.reply({
        content: `No DNS records found for ${domain.name}`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const limitedRecords = records.slice(0, 25);
    const selectRecord = new StringSelectMenuBuilder()
      .setCustomId('dns-update-record-select')
      .setPlaceholder('Select record to update')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        limitedRecords.map((record) => ({
          label:
            record.name.length > 25
              ? record.name.substring(0, 22) + '...'
              : record.name,
          value: record.id,
        })),
      );
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectRecord,
    );
    await interaction.reply({
      content: `Select record to update for ${domain.name}`,
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  }
}
