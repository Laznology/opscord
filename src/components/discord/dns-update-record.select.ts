import { Injectable, Logger } from '@nestjs/common';
import {
  Context,
  SelectedStrings,
  StringSelect,
  type StringSelectContext,
} from 'necord';
import { DNSRecordService } from 'src/domain/records/records.service';
import {
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

@Injectable()
export class DNSUpdateRecordSelect {
  private logger = new Logger(DNSUpdateRecordSelect.name);
  constructor(private dnsRecordService: DNSRecordService) {}
  @StringSelect('dns-update-record-select')
  public async onRecordSelect(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() selected: string[],
  ) {
    const selectedRecord = selected[0];
    this.logger.log(`Selected record value: ${selectedRecord}`);
    const [recordData] = await this.dnsRecordService.getOne(selectedRecord);
    if (!recordData) {
      await interaction.reply({
        content: 'DNS Record dose not found in Database',
        flags: MessageFlags.Ephemeral,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId('dns-update-record')
      .setTitle('DNS Update Record');

    const idInput = new TextInputBuilder()
      .setCustomId('dns-update:record-id')
      .setLabel('Record ID (do not edit)')
      .setPlaceholder('Record ID')
      .setStyle(TextInputStyle.Short)
      .setValue(selectedRecord)
      .setRequired(true);
    const idLabelInput = new LabelBuilder()
      .setLabel('Record ID')
      .setTextInputComponent(idInput);
    const nameInput = new TextInputBuilder()
      .setCustomId('dns-update:name-input')
      .setPlaceholder('Record name')
      .setStyle(TextInputStyle.Short)
      .setValue(recordData.name)
      .setRequired(false);
    const nameLabelInput = new LabelBuilder()
      .setLabel('Record name')
      .setTextInputComponent(nameInput);

    const typeInput = new TextInputBuilder()
      .setCustomId('dns-update:type-input')
      .setPlaceholder('Record type')
      .setStyle(TextInputStyle.Short)
      .setValue(recordData.type)
      .setRequired(false);
    const typeLabelInput = new LabelBuilder({})
      .setLabel('Record type')
      .setTextInputComponent(typeInput);

    const contentInput = new TextInputBuilder()
      .setCustomId('dns-update:content-input')
      .setPlaceholder('Record content')
      .setStyle(TextInputStyle.Paragraph)
      .setValue(recordData.content)
      .setRequired(false);
    const contentLabelInput = new LabelBuilder()
      .setLabel('Record content')
      .setTextInputComponent(contentInput);
    const proxiedInput = new TextInputBuilder()
      .setCustomId('dns-update:proxied-input')
      .setPlaceholder('Y(true)/N(false)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);
    const proxiedLabelInput = new LabelBuilder()
      .setLabel('Record proxied')
      .setTextInputComponent(proxiedInput);

    modal.addLabelComponents(
      idLabelInput,
      nameLabelInput,
      typeLabelInput,
      contentLabelInput,
      proxiedLabelInput,
    );

    await interaction.showModal(modal);
  }
}
