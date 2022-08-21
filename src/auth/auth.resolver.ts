import { Resolver, Mutation, Context, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ApolloContext } from '@/common/types/apollo-context';
import { UserDto } from '@/user/dto/user.dto';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => UserDto)
  async signIn(
    @Args('signInDto', { type: () => SignInDto }) _: SignInDto,
    @Context() { req, res }: ApolloContext,
  ): Promise<UserDto> {
    return this.authService.signIn({ id: req.user.id }, res);
  }
}
