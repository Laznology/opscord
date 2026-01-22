import { Injectable } from '@nestjs/common';
import { Context, Modal, type ModalContext } from 'necord';
import { EmbedBuilder, MessageFlags } from 'discord.js';
import { DomainService } from 'src/domain/domain.service';

@Injectable()
export class DomainRegisterModal {
  constructor(private domainService: DomainService) {}

  @Modal('domain-register-modal')
  public async onModalSubmit(@Context() [interaction]: ModalContext) {
    try {
      const domainName = interaction.fields.getTextInputValue('domain_name');
      const zoneId = interaction.fields.getTextInputValue('zone_id');

      const existingDomain = await this.domainService.findOne(domainName);
      if (existingDomain) {
        return interaction.reply({
          content: `Domain **${domainName}** is already registered.`,
          flags: MessageFlags.Ephemeral,
        });
      }

      const newDomain = await this.domainService.create({
        name: domainName,
        cfZoneId: zoneId,
      });

      const embed = new EmbedBuilder()
        .setTitle('Domain Registered Successfully')
        .setColor(0x57f287)
        .addFields(
          { name: 'Domain Name', value: newDomain.name, inline: true },
          { name: 'Domain ID', value: newDomain.id, inline: true },
          {
            name: 'Cloudflare Zone ID',
            value: newDomain.cfZoneId,
            inline: false,
          },
        )
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    } catch {
      return interaction.reply({
        content: 'An error occurred while registering the domain.',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
