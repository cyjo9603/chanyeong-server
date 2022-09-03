import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { FileUpload } from 'graphql-upload';

import { UploadResponse } from './types/upload-response';

@Injectable()
export class UploadService {
  private readonly DEFAULT_NAMESPACE = 'common';
  private readonly UPLOAD_API_PATH: string;
  private readonly APP_KEY: string;

  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
    this.UPLOAD_API_PATH = configService.get<string>('upload.path.upload');
    this.APP_KEY = configService.get<string>('upload.appKey');
  }

  async upload(file: FileUpload, nameSpace: string = this.DEFAULT_NAMESPACE) {
    const { filename } = file;

    const filePath = `/${nameSpace}/${+new Date()}_${filename}`;
    const { data } = await lastValueFrom(
      this.httpService.put<UploadResponse>(
        `${this.UPLOAD_API_PATH.replace('{appKey}', this.APP_KEY)}?path=${filePath}&overwrite=true`,
        file.createReadStream(),
        { headers: { 'Content-Type': 'application/octet-stream' } },
      ),
    );

    if (!data.file?.url) {
      throw new InternalServerErrorException('failed upload');
    }

    return this.httpsTransducer(data.file.url);
  }

  private httpsTransducer(url: string) {
    const protocol = new URL(url).protocol;

    return url.replace(protocol, 'https:');
  }
}
