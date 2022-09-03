import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MongooseCommonRepository } from '@/common/repository/mongoose-common.repository';

import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostRepository extends MongooseCommonRepository<PostDocument, CreatePostDto, UpdatePostDto> {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {
    super(postModel);
  }
}
