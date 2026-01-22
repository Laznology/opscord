import { Injectable, Logger } from '@nestjs/common';
import { Context, Modal, type ModalContext } from 'necord';
import { MessageFlags } from 'discord.js';
import { DNSRecordService } from 'src/domain/records/records.service';
import { UpdateDnsRecordDto } from 'src/domain/records/record.dto';

@Injectable()
export class DNSUpdateRecordModal {
  private logger = new Logger(DNSUpdateRecordModal.name);

  constructor(private dnsRecordService: DNSRecordService) {}

  @Modal('dns-update-record')
  public async onSubmit(@Context() [interaction]: ModalContext) {
    try {
      const recordId = interaction.fields.getTextInputValue(
        'dns-update:record-id',
      );
      const name = interaction.fields.getTextInputValue(
        'dns-update:name-input',
      );
      const type = interaction.fields.getTextInputValue(
        'dns-update:type-input',
      );
      const content = interaction.fields.getTextInputValue(
        'dns-update:content-input',
      );
      const proxiedRaw = interaction.fields.getTextInputValue(
        'dns-update:proxied-input',
      );

      const proxied = proxiedRaw
        ? ['y', 'yes', 'true', '1'].includes(proxiedRaw.toLowerCase())
        : undefined;

      const updateDto: UpdateDnsRecordDto = {
        name,
        type: type as 'A' | 'AAAA' | 'CNAME',
        content,
        proxied,
      };
      const result = await this.dnsRecordService.updateRecord(
        recordId,
        updateDto,
      );

      return interaction.reply({
        content: `Record ${result.name} updated`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      this.logger.error('Failed to update record from modal', error);
      if (!interaction.replied && !interaction.deferred) {
        return interaction.reply({
          content: 'Failed to update DNS record',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }
}
