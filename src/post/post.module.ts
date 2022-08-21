import { Module } from '@nestjs/common';

import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';

@Module({
  providers: [PostResolver, PostService, PostRepository],
})
export class PostModule {}
