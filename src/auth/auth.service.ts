import { Injectable } from '@nestjs/common';
import AES from 'crypto-js/aes';
import UTF8 from 'crypto-js/enc-utf8';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';

import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';

import { UserJwtToken, JwtTokenType } from './types/token';
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
    this.createAndSetToken(JwtTokenType.ACCESS, payload, res);
    const refreshToken = this.createAndSetToken(JwtTokenType.REFRESH, payload, res);

    return this.userRepository.updateRefreshToken(new ObjectId(payload.id), refreshToken);
  }

  private createAndSetToken(type: JwtTokenType, payload: UserJwtToken, res: Response) {
    const tokenName = type === JwtTokenType.ACCESS ? this.ACCESS_TOKEN_HEADER_NAME : this.REFRESH_TOKEN_HEADER_NAME;
    const expires = JwtTokenType.ACCESS ? this.JWT_ACCESS_EXPIRES : this.JWT_REFRESH_EXPIRES;

    const token = this.jwtService.sign({ ...payload, type }, { expiresIn: expires });
    res.cookie(tokenName, token, { httpOnly: true, secure: true, maxAge: this.COOKIE_MAX_AGE });

    return token;
  }

  async logout(id: ObjectId, res: Response) {
    const user = await this.userRepository.updateRefreshToken(id, null);
    this.clearCookieToken(res);

    return user;
  }

  private clearCookieToken(res: Response) {
    res.clearCookie(this.ACCESS_TOKEN_HEADER_NAME);
    res.clearCookie(this.REFRESH_TOKEN_HEADER_NAME);
  }

  encrypt(value: string) {
    return AES.encrypt(value, this.LOCAL_SECRET_KEY).toString();
  }

  decrypt(value: string) {
    return AES.decrypt(value, this.LOCAL_SECRET_KEY).toString(UTF8);
  }
}
