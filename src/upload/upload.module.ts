import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UploadService } from './upload.service';
import { UploadResolver } from './upload.resolver';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 5000,
        baseURL: configService.get<string>('upload.apiUri'),
        headers: {
          Authorization: configService.get<string>('upload.secretKey'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UploadResolver, UploadService],
})
export class UploadModule {}
