import { Resolver, Directive, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FilterQuery, SortOrder } from 'mongoose';
import { ObjectId } from 'mongodb';

import { InputFilter } from '@/common/schema/filter-graphql.schema';
import { InputSort } from '@/common/schema/sort-graphql.schema';
import { AllowKeysValidationPipe } from '@/common/pipes/allow-keys.validate.pipe';
import { AccessJwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ObjectIdScalar } from '@/common/scalars/mongo-object-id.scalar';

import { ExperienceRepository } from './experience.repository';
import { Experience, ExperienceDocument, ExperienceConnection } from './schema/experience.schema';
import { UpsertExperienceDto } from './dto/upsert-experience.dto';

@Resolver(() => Experience)
export class ExperienceResolver {
  private static ALLOW_FILTER_KEY = ['_id', 'title', 'content'];
  private static ALLOW_SORT_KEY = ['_id', 'startedAt', 'endedAt', 'createdAt'];
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  @Directive('@filterConvert')
  @Directive('@sortConvert')
  @Query(() => ExperienceConnection)
  async experiences(
    @Args('filterBy', { type: () => [InputFilter], nullable: true }, AllowKeysValidationPipe(ExperienceResolver.ALLOW_FILTER_KEY))
    filterBy?: FilterQuery<ExperienceDocument>,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('sort', { type: () => [InputSort], nullable: true }, AllowKeysValidationPipe(ExperienceResolver.ALLOW_SORT_KEY))
    sort?: { [key: string]: SortOrder },
  ): Promise<ExperienceConnection> {
    const experiences = await this.experienceRepository.find({ filterBy, skip, limit, sort });
    const totalCount = await this.experienceRepository.getCount(filterBy);

    return {
      pageInfo: { hasNext: totalCount - limit - skip > 0 },
      edges: experiences.map((node) => ({ node })),
      totalCount,
    };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => Experience)
  async createExperience(@Args('upsertExperienceDto') upsertExperienceDto: UpsertExperienceDto) {
    return this.experienceRepository.create(upsertExperienceDto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => Experience)
  async updateExperience(
    @Args('id', { type: () => ObjectIdScalar }) id: ObjectId,
    @Args('upsertExperienceDto') upsertExperienceDto: UpsertExperienceDto,
  ) {
    return this.experienceRepository.updateOneById(id, upsertExperienceDto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => Experience)
  async deleteExperience(@Args('id', { type: () => ObjectIdScalar }) id: ObjectId) {
    return this.experienceRepository.deleteOneById(id);
  }
}
