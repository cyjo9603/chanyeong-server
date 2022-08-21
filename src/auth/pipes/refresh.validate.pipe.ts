import { PipeTransform, Injectable, Scope, Inject, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { UserRepository } from '@/user/user.repository';
import { ApolloContext } from '@/common/types/apollo-context';

@Injectable({ scope: Scope.REQUEST })
export class RefreshValidationPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly context: ApolloContext,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async transform(value: any) {
    const { user: userContext, cookies } = this.context.req;
    const user = await this.userRepository.findById(userContext.id);

    if (user.refreshToken !== cookies[this.configService.get<string>('auth.cookie.name.refresh')]) {
      throw new UnauthorizedException();
    }

    return value;
  }
}
