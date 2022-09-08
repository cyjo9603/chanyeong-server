import { Resolver, Mutation, Context, Args } from '@nestjs/graphql';
import { UseGuards, UsePipes } from '@nestjs/common';

import { ApolloContext } from '@/common/types/apollo-context';
import { UserDto } from '@/user/dto/user.dto';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { AccessJwtAuthGuard, ExpiredAccessJwtAuthGuard, RefreshJwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshValidationPipe } from './pipes/refresh.validate.pipe';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => UserDto)
  async signIn(@Args('signInDto', { type: () => SignInDto }) _: SignInDto, @Context() { req, res }: ApolloContext): Promise<UserDto> {
    return this.authService.signIn({ id: req.user.id.toHexString() }, res);
  }

  @UseGuards(ExpiredAccessJwtAuthGuard, RefreshJwtAuthGuard)
  @UsePipes(RefreshValidationPipe)
  @Mutation(() => UserDto)
  async refresh(@Context() { req, res }: ApolloContext) {
    return this.authService.signIn({ id: req.user.id.toHexString() }, res);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => UserDto)
  async logout(@Context() { req, res }: ApolloContext) {
    return this.authService.logout(req.user.id, res);
  }
}
