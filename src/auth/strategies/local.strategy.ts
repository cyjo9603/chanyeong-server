import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userId',
      passwordField: 'password',
    });
  }

  async validate(userId: string, password: string) {
    const user = await this.authService.validateUser(this.authService.decrypt(userId), this.authService.decrypt(password));

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user._id };
  }
}
