import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class AllowNamespaceValidationPipe implements PipeTransform {
  private ALLOW_NAMESPACES: string;
  constructor(private readonly configService: ConfigService) {
    this.ALLOW_NAMESPACES = configService.get<string>('upload.allowNamespaces');
  }

  async transform(value: any) {
    if (!this.ALLOW_NAMESPACES.includes(value)) {
      throw new BadRequestException();
    }

    return value;
  }
}
