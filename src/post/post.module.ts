import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Post, PostSchema } from './schema/post.schema';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  providers: [PostResolver, PostService, PostRepository],
})
export class PostModule {}
