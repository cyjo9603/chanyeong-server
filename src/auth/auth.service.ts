import { Injectable } from '@nestjs/common';
import AES from 'crypto-js/aes';
import UTF8 from 'crypto-js/enc-utf8';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';

import { UserJwtToken } from './types/token';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private LOCAL_SECRET_KEY: string;
  private JWT_ACCESS_EXPIRES: string;
  private JWT_REFRESH_EXPIRES: string;
  private ACCESS_TOKEN_HEADER_NAME: string;
  private REFRESH_TOKEN_HEADER_NAME: string;
  private COOKIE_MAX_AGE: number;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.LOCAL_SECRET_KEY = configService.get('auth.aes.secret');
    this.JWT_ACCESS_EXPIRES = configService.get('auth.jwt.expires.access');
    this.JWT_REFRESH_EXPIRES = configService.get('auth.jwt.expires.refresh');
    this.ACCESS_TOKEN_HEADER_NAME = configService.get('auth.cookie.name.access');
    this.REFRESH_TOKEN_HEADER_NAME = configService.get('auth.cookie.name.refresh');
    this.COOKIE_MAX_AGE = configService.get('auth.cookie.maxAge');
  }

  async validateUser(userId: string, password: string) {
    const user = await this.userRepository.findOneByUserId(userId);
    const isCompared = this.userService.comparePassword(password, user.password);

    if (!isCompared || !user) {
      return null;
    }

    return user;
  }

  async signIn(payload: UserJwtToken, res: Response) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: this.JWT_ACCESS_EXPIRES });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: this.JWT_REFRESH_EXPIRES });

    res.cookie(this.ACCESS_TOKEN_HEADER_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: this.COOKIE_MAX_AGE,
    });
    res.cookie(this.REFRESH_TOKEN_HEADER_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: this.COOKIE_MAX_AGE,
    });

    return this.userRepository.updateRefreshToken(payload.id, refreshToken);
  }

  encrypt(value: string) {
    return AES.encrypt(value, this.LOCAL_SECRET_KEY).toString();
  }

  decrypt(value: string) {
    return AES.decrypt(value, this.LOCAL_SECRET_KEY).toString(UTF8);
  }
}