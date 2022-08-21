import { Injectable, Type, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

import { JwtTokenType } from '../types/token';

const generateJwtAuthGuard = (type: JwtTokenType): Type<IAuthGuard> => {
  @Injectable()
  class JwtAuthGuard extends AuthGuard('jwt') {
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

export const AccessJwtAuthGuard = generateJwtAuthGuard(JwtTokenType.ACCESS);
