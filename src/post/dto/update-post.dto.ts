import { InputType, IntersectionType, PartialType, PickType } from '@nestjs/graphql';

import { Post } from '../schema/post.schema';

@InputType('UpdatePostDto')
export class UpdatePostDto extends IntersectionType(
  PartialType(PickType(Post, ['category', 'title', 'content', 'titleImage', 'tags', 'pickedAt'] as const)),
  PickType(Post, ['id']),
) {}
