import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { Post } from '../schema/post.schema';

@InputType('UpdatePostDto')
export class UpdatePostDto extends PartialType(
  PickType(Post, ['category', 'title', 'content', 'titleImage', 'tags', 'pickedAt'] as const),
) {}
