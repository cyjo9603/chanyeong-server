import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import hpp from 'hpp';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  const env = configService.get('env');

  app.use(cookieParser());
  app.use(compression());
  if (env === 'production') {
    app.use(hpp());
    app.use(helmet());
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('port'), '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
