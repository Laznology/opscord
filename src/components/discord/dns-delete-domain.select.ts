import { Injectable } from '@nestjs/common';
import {
  MessageFlags,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from 'discord.js';
import { DomainService } from 'src/domain/domain.service';
import { DNSRecordService } from 'src/domain/records/records.service';
import {
  StringSelect,
  Context,
  SelectedStrings,
  type StringSelectContext,
} from 'necord';

@Injectable()
export class DNSDeleteDomainSelect {
  constructor(
    private dnsRecordService: DNSRecordService,
    private domainService: DomainService,
  ) {}

  @StringSelect('dns-delete:domain-select')
  public async onDomainSelect(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() selected: string[],
  ) {
    const selectedDomainValue = selected[0];
    try {
      const domain =
        (await this.domainService.findOne(selectedDomainValue)) ||
        (await this.domainService.findById(selectedDomainValue));
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

      const limitedRecords = records.slice(0, 25); // Discord allows 1-25 options
      const selectRecord = new StringSelectMenuBuilder()
        .setCustomId('dns-delete:record-select')
        .setPlaceholder('Select record to delete: ')
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
        content: `Selected domain: ${domain.name}`,
        flags: MessageFlags.Ephemeral,
        components: [row],
      });
    } catch {
      return interaction.editReply({
        content: 'Unknown Error',
      });
    }
  }
}
