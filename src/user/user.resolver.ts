import { Resolver, Mutation, Directive, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DeactivateGuard } from '@/common/guard/deactivated.guard';

import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userRepository: UserRepository) {}

  /** @deprecated */
  @UseGuards(DeactivateGuard)
  @Directive('@deprecated(reason: "deactivated graphql request")')
  @Mutation(() => User)
  async signup(
    @Args('createUserDto', { type: () => CreateUserDto })
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.create(createUserDto);

    return user;
  }
}
