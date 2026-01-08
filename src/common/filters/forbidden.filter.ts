import { ArgumentsHost, Catch, ForbiddenException } from '@nestjs/common';
import { NecordArgumentsHost } from 'necord';
import { BaseInteraction, EmbedBuilder, MessageFlags } from 'discord.js';

@Catch(ForbiddenException)
export class ForbiddenErrorFilter {
  public catch(exception: ForbiddenException, host: ArgumentsHost) {
    const necordHost = NecordArgumentsHost.create(host);
    const [interaction] = necordHost.getContext() as [BaseInteraction];
    if (!interaction.isRepliable() || interaction.replied) {
      return;
    }
    const embed = new EmbedBuilder()
      .setTitle('Access Denied')
      .setDescription('You dont have access to this bot command')
      .setColor('Red')
      .setTimestamp();
    return interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [embed],
    });
  }
}
