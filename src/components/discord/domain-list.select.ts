import { Injectable } from '@nestjs/common';
import {
  Context,
  SelectedStrings,
  StringSelect,
  type StringSelectContext,
} from 'necord';
import { EmbedBuilder, MessageFlags } from 'discord.js';
import { DomainService } from 'src/domain/domain.service';
import { DNSRecordService } from 'src/domain/records/records.service';

@Injectable()
export class DomainListSelect {
  constructor(
    private domainService: DomainService,
    private dnsRecordService: DNSRecordService,
  ) {}
  @StringSelect('domain-list-domain-select')
  public async onDomainSelect(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() selected: string[],
  ) {
    const domainId = selected[0];
    const selectedDomain = await this.domainService.findById(domainId);
    const records = await this.dnsRecordService.findRecordByZone(domainId);

    const embed = new EmbedBuilder()
      .setTitle('Domain Details')
      .setColor(0x5865f2)
      .addFields(
        { name: 'Domain Name', value: selectedDomain.name, inline: true },
        { name: 'Domain ID', value: selectedDomain.id, inline: true },
        {
          name: 'Cloudflare Zone ID',
          value: selectedDomain.cfZoneId,
          inline: false,
        },
        {
          name: 'Total Records',
          value: `${records.length} record(s)`,
          inline: true,
        },
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  }
}
