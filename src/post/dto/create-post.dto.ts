import { InputType, PickType } from '@nestjs/graphql';

import { Post } from '../schema/post.schema';

@InputType('CreatePostDto')
export class CreatePostDto extends PickType(Post, ['category', 'title', 'content', 'titleImage', 'tags'] as const) {}
