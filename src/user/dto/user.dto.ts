import { ObjectType, Field } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from '@/common/scalars/mongo-object-id.scalar';

import { UserRole } from '../schema/user.schema';

@ObjectType()
export class UserDto {
  @Field(() => ObjectIdScalar)
  id: ObjectId;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  userId: string;
}
