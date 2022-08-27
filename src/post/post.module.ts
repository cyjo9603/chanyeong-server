import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

import { Post, PostSchema } from './schema/post.schema';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: async (connection) => {
          const schema = PostSchema;
          const AutoIncrement = AutoIncrementFactory(connection);

          schema.plugin(AutoIncrement, { inc_field: 'numId', id: 'postId' });

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [PostResolver, PostService, PostRepository],
})
export class PostModule {}
