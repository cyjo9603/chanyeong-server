import { InputType, PickType } from '@nestjs/graphql';

import { User } from '@/user/schema/user.schema';

@InputType('SignInDto')
export class SignInDto extends PickType(User, ['userId', 'password']) {}
