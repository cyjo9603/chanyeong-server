import { ObjectType, Field, ID } from '@nestjs/graphql';

import { UserRole } from '../schema/user.schema';

@ObjectType()
export class UserDto {
  @Field(() => ID)
  id: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  userId: string;
}
