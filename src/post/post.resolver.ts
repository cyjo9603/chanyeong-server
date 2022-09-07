import { Resolver, Query, Args, Int, Directive, Mutation, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FilterQuery, SortOrder } from 'mongoose';

import { InputFilter } from '@/common/schema/filter-graphql.schema';
import { InputSort } from '@/common/schema/sort-graphql.schema';
import { AllowKeysValidationPipe } from '@/common/pipes/allow-keys.validate.pipe';
import { AccessJwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

import { Post, PostConnection, PostDocument } from './schema/post.schema';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Resolver(() => Post)
export class PostResolver {
  private static ALLOW_FILTER_KEY = ['_id', 'title', 'content', 'numId', 'category', 'tags', 'pickedAt'];
  private static ALLOW_SORT_KEY = ['_id', 'numId', 'tags', 'createdAt', 'pickedAt'];
  constructor(private readonly postRepository: PostRepository) {}

  @Directive('@filterConvert')
  @Directive('@sortConvert')
  @Query(() => PostConnection)
  async posts(
    @Args('filterBy', { type: () => [InputFilter], nullable: true }, AllowKeysValidationPipe(PostResolver.ALLOW_FILTER_KEY))
    filterBy?: FilterQuery<PostDocument>,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('sort', { type: () => [InputSort], nullable: true }, AllowKeysValidationPipe(PostResolver.ALLOW_SORT_KEY))
    sort?: { [key: string]: SortOrder },
  ): Promise<PostConnection> {
    const posts = await this.postRepository.find({ filterBy, skip, limit, sort });
    const totalCount = await this.postRepository.getCount(filterBy);

    return {
      pageInfo: { hasNext: totalCount - limit - skip > 0 },
      edges: posts.map((node) => ({ node })),
      totalCount,
    };
  }

  @Directive('@filterConvert')
  @Query(() => Post)
  async post(
    @Args('filterBy', { type: () => [InputFilter], nullable: true }, AllowKeysValidationPipe(PostResolver.ALLOW_FILTER_KEY))
    filterBy?: FilterQuery<PostDocument>,
  ) {
    return this.postRepository.findOne(filterBy);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => Post)
  async createPost(@Args('createPostDto') createPostDto: CreatePostDto) {
    return this.postRepository.create(createPostDto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => Post)
  async updatePost(@Args('id', { type: () => ID }) id: string, @Args('updatePostDto') updatePostDto: UpdatePostDto) {
    return this.postRepository.updateOneById(id, updatePostDto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => Post)
  async deletePost(@Args('id', { type: () => ID }) id: string) {
    return this.postRepository.deleteOneById(id);
  }
}
