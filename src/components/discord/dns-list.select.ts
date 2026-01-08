import { Injectable } from '@nestjs/common';
import { MessageFlags } from 'discord.js';
import {
  Context,
  SelectedStrings,
  StringSelect,
  type StringSelectContext,
} from 'necord';
import { EmbedBuilder } from 'discord.js';
import { DomainService } from 'src/domain/domain.service';
import { DNSRecordService } from 'src/domain/records/records.service';

@Injectable()
export class DNSListSelect {
  constructor(
    private readonly domainService: DomainService,
    private readonly dnsRecordService: DNSRecordService,
  ) {}
  @StringSelect('dns-list:domain-select')
  public async onDomainSelect(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() selected: string[],
  ) {
    const domainName = selected[0];
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    try {
      const domain = await this.domainService.findOne(domainName);
      if (!domain) {
        return interaction.editReply({
          content: `Domain **${domainName}** nof found`,
        });
      }

      const records = await this.dnsRecordService.findRecordByZone(domain.id);

      if (!records || records.length === 0) {
        return interaction.editReply({
          content: `Domain **${domainName}** has no DNS records.`,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(`DNS Record for ${domainName}`)
        .setColor(0x00ffaa)
        .addFields(
          ...records.map((record, index) => ({
            name: `${index + 1}. ${record.type} ${record.name}`,
            value: record.content,
            inline: false,
          })),
        );

      return interaction.editReply({
        embeds: [embed],
      });
    } catch {
      return interaction.editReply({
        content: 'Unknown error',
      });
    }
  }
}
