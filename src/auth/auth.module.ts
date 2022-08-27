import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '@/user/user.module';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessJwtStrategy, ExpiredAccessJwtStrategy, RefreshJwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  providers: [AuthService, AuthResolver, LocalStrategy, AccessJwtStrategy, ExpiredAccessJwtStrategy, RefreshJwtStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
