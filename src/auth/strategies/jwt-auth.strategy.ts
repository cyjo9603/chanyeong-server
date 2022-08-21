import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserJwtToken, JwtTokenType } from '../types/token';

const generateJwtStrategy = (type: JwtTokenType): Type<Strategy> => {
  @Injectable()
  class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get<string>('auth.jwt.secret'),
      });
    }

    validate(payload: UserJwtToken) {
      if (payload.type !== type) {
        throw new UnauthorizedException();
      }

      return { id: payload.id };
    }
  }

  return JwtStrategy;
};

export const AccessJwtStrategy = generateJwtStrategy(JwtTokenType.ACCESS);
