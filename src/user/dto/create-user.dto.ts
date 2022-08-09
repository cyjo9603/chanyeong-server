import { InputType, PickType } from '@nestjs/graphql';

import { User } from '../schema/user.schema';

@InputType()
export class CreateUserDto extends PickType(User, [
  'userId',
  'password',
  'firstName',
  'lastName',
]) {}
