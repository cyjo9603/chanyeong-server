import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  static hashPassword(password: string) {
    const BCRYPT_SALT = 10 as const;

    return bcrypt.hashSync(password, BCRYPT_SALT);
  }

  comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
