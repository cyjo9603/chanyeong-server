import { Resolver, Mutation, Directive, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { DeactivateGuard } from '@/common/guard/deactivated.guard';
import { AccessJwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ApolloContext } from '@/common/types/apollo-context';

import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(private readonly userRepository: UserRepository) {}

  /** @deprecated */
  @UseGuards(DeactivateGuard)
  @Directive('@deprecated(reason: "deactivated graphql request")')
  @Mutation(() => UserDto)
  async signup(
    @Args('createUserDto', { type: () => CreateUserDto })
    createUserDto: CreateUserDto,
  ): Promise<UserDto> {
    const user = await this.userRepository.create(createUserDto);

    return user;
  }

  @UseGuards(AccessJwtAuthGuard)
  @Query(() => UserDto)
  async me(@Context() { req }: ApolloContext): Promise<UserDto> {
    return this.userRepository.findById(req.user.id);
  }
}
