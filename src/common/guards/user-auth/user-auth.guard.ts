import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NecordContextType, NecordExecutionContext } from 'necord';
import { BaseInteraction } from 'discord.js';

@Injectable()
export class UserAuthGuard implements CanActivate {
  private readonly WHITELIST_IDS = new Set<string>(
    process.env.DISCORD_OWNER_ID ? [process.env.DISCORD_OWNER_ID] : [],
  );

  canActivate(context: ExecutionContext): boolean {
    if (context.getType<NecordContextType>() !== 'necord') return true;
    const necordContext = NecordExecutionContext.create(context);
    const [interaction] = necordContext.getContext() as [BaseInteraction];

    const userId = interaction.user?.id;

    if (!userId) return false;
    return this.WHITELIST_IDS.has(userId);
  }
}
