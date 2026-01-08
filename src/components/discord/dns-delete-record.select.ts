import { Injectable, Logger } from '@nestjs/common';
import {
  Context,
  SelectedStrings,
  StringSelect,
  type StringSelectContext,
} from 'necord';
import { MessageFlags } from 'discord.js';
import { DNSRecordService } from 'src/domain/records/records.service';

@Injectable()
export class DNSDeleteRecordSelect {
  private logger = new Logger(DNSDeleteRecordSelect.name);
  constructor(private dnsRecordService: DNSRecordService) {}

  @StringSelect('dns-delete:record-select')
  public async onRecordSelect(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() record: string[],
  ) {
    const selectedRecord = record[0];
    try {
      const result = await this.dnsRecordService.deleteRecord(selectedRecord);
      return interaction.reply({
        content: `${result.recordName} successfully deleted`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      this.logger.error('Error record delete: ', error);
      await interaction.reply({
        content: 'Unknown error',
      });
    }
  }
}
