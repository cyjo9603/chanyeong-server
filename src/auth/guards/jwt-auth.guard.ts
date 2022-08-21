import { Injectable, Type, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

import { JwtTokenType } from '../types/token';

interface GenerateJwtAuthGuardOptions {
  type: JwtTokenType;
  name?: string;
}

const generateJwtAuthGuard = ({ type, name }: GenerateJwtAuthGuardOptions): Type<IAuthGuard> => {
  @Injectable()
  class JwtAuthGuard extends AuthGuard(name || `jwt-${type}`) {
    private TOKEN_HEADER_NAME: string;

    constructor(private readonly configService: ConfigService) {
      super();

      this.TOKEN_HEADER_NAME = configService.get(`auth.cookie.name.${type}`);
    }

    handleRequest(err: unknown, user: any, info: any) {
      if (err || !user) {
        throw err || new UnauthorizedException(info.message);
      }
      return user;
    }

    getRequest(context: ExecutionContext) {
      const gqlContext = GqlExecutionContext.create(context);
      const ctx = gqlContext.getContext();
      const token = ctx.req.cookies[this.TOKEN_HEADER_NAME];

      if (token) {
        ctx.req.headers.authorization = `Bearer ${token}`;
      }

      return ctx.req;
    }
  }

  return JwtAuthGuard;
};

export const AccessJwtAuthGuard = generateJwtAuthGuard({ type: JwtTokenType.ACCESS });
export const ExpiredAccessJwtAuthGuard = generateJwtAuthGuard({
  type: JwtTokenType.ACCESS,
  name: 'expired-access-jwt',
});
export const RefreshJwtAuthGuard = generateJwtAuthGuard({ type: JwtTokenType.REFRESH });
