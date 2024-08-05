import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { fromService } from './infrastructure/configuration';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './infrastructure/setup/swagger.setup';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = fromService(app.get(ConfigService));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  setupSwagger(app);
  await app.listen(appConfig.port);
}
bootstrap();
