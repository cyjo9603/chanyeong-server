import { Directive, Resolver, Query, Args, Int, Mutation, ID } from '@nestjs/graphql';
import { FilterQuery } from 'mongoose';

import { InputFilter } from '@/common/schema/filter-graphql.schema';
import { InputSort, GraphqlSort } from '@/common/schema/sort-graphql.schema';
import { AllowKeysValidationPipe } from '@/common/pipes/allow-keys.validate.pipe';

import { TechStack, TechStackConnection, TechStackDocument } from './schema/tech-stack.schema';
import { TechStackRepository } from './tech-stack.repository';
import { UseGuards } from '@nestjs/common';
import { AccessJwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UpsertTechStackDto } from './dto/upsert-tech-stack.dto';

@Resolver(() => TechStack)
export class TechStackResolver {
  private static ALLOW_FILTER_KEY = ['_id', 'category', 'name'];
  private static ALLOW_SORT_KEY = ['_id', 'level', 'order', 'createdAt'];

  constructor(private readonly techStackRepository: TechStackRepository) {}

  @Directive('@filterConvert')
  @Directive('@sortConvert')
  @Query(() => TechStackConnection)
  async techStack(
    @Args('filterBy', { type: () => [InputFilter], nullable: true }, AllowKeysValidationPipe(TechStackResolver.ALLOW_FILTER_KEY))
    filterBy?: FilterQuery<TechStackDocument>,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('sort', { type: () => [InputSort], nullable: true }, AllowKeysValidationPipe(TechStackResolver.ALLOW_SORT_KEY))
    sort?: GraphqlSort,
  ): Promise<TechStackConnection> {
    const techStack = await this.techStackRepository.find({ filterBy, skip, limit, sort });
    const totalCount = await this.techStackRepository.getCount(filterBy);

    return {
      pageInfo: { hasNext: totalCount - limit - skip > 0 },
      edges: techStack.map((node) => ({ node })),
      totalCount,
    };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => TechStack)
  async createTechStack(@Args('upsertTechStackDto') upsertTechStackDto: UpsertTechStackDto) {
    return this.techStackRepository.create(upsertTechStackDto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => TechStack)
  async updateTechStack(@Args('id', { type: () => ID }) id: string, @Args('upsertTechStackDto') upsertTechStackDto: UpsertTechStackDto) {
    return this.techStackRepository.updateOneById(id, upsertTechStackDto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => TechStack)
  async deleteTechStack(@Args('id', { type: () => ID }) id: string) {
    return this.techStackRepository.deleteOneById(id);
  }
}
