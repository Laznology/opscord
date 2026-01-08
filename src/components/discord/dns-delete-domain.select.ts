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
    const selectedDomain = selected[0];
    try {
      const records =
        await this.dnsRecordService.findRecordByZone(selectedDomain);
      const selectRecord = new StringSelectMenuBuilder()
        .setCustomId('dns-delete:record-select')
        .setPlaceholder('Select record to delete: ')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
          records.map((record) => ({
            label: record.name,
            value: record.id,
          })),
        );
      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectRecord,
      );
      await interaction.reply({
        content: `Selected: ${selectedDomain}`,
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
