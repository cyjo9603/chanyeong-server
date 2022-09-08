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

  async findAllTagsWithCount() {
    return this.postModel.aggregate([
      { $match: { tags: { $exists: true } } },
      { $project: { _id: 0, tags: 1 } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);
  }
}
