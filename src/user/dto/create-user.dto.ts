import { InputType, PickType } from '@nestjs/graphql';

import { User } from '../schema/user.schema';

@InputType('CreateUserDto')
export class CreateUserDto extends PickType(User, [
  'userId',
  'password',
  'firstName',
  'lastName',
] as const) {}
