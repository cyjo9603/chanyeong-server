import { Resolver, Query, Directive, Args, Int, ResolveField, Parent, Context } from '@nestjs/graphql';
import { FilterQuery } from 'mongoose';

import { InputFilter } from '@/common/schema/filter-graphql.schema';
import { InputSort, GraphqlSort } from '@/common/schema/sort-graphql.schema';
import { AllowKeysValidationPipe } from '@/common/pipes/allow-keys.validate.pipe';
import { ApolloContext } from '@/common/types/apollo-context';
import { TechStack } from '@/tech-stack/schema/tech-stack.schema';
import { getDataLoader } from '@/common/dataloader/dataloader';
import { TechStackRepository } from '@/tech-stack/tech-stack.repository';

import { ProjectRepository } from './project.repository';
import { Project, ProjectConnection, ProjectDocument } from './schema/project.schema';

@Resolver(() => Project)
export class ProjectResolver {
  private static ALLOW_FILTER_KEY = ['_id', 'type', 'groupName', 'title', 'content', 'numId', 'pickedAt'];
  private static ALLOW_SORT_KEY = ['_id', 'numId', 'startedAt', 'endedAt', 'pickedAt', 'createdAt'];
  constructor(private readonly projectRepository: ProjectRepository, private readonly techStackRepository: TechStackRepository) {}

  @Directive('@filterConvert')
  @Directive('@sortConvert')
  @Query(() => ProjectConnection)
  async projects(
    @Args('filterBy', { type: () => [InputFilter], nullable: true }, AllowKeysValidationPipe(ProjectResolver.ALLOW_FILTER_KEY))
    filterBy?: FilterQuery<ProjectDocument>,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('sort', { type: () => [InputSort], nullable: true }, AllowKeysValidationPipe(ProjectResolver.ALLOW_SORT_KEY))
    sort?: GraphqlSort,
  ) {
    const projects = await this.projectRepository.find({ filterBy, skip, limit, sort });
    const totalCount = await this.projectRepository.getCount(filterBy);

    return {
      pageInfo: { hasNext: totalCount - limit - skip > 0 },
      edges: projects.map((node) => ({ node })),
      totalCount,
    };
  }

  @ResolveField(() => [TechStack], { nullable: true })
  techStack(@Parent() { techStackIds }: Project, @Context() { dataloaders }: ApolloContext) {
    return techStackIds ? getDataLoader(dataloaders, this.techStackRepository).loadMany(techStackIds.map((id) => id.toString())) : null;
  }
}
