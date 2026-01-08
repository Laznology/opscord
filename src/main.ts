import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserAuthGuard } from './common/guards/user-auth/user-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new UserAuthGuard());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
