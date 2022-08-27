import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { FindOptions } from '@/common/types/mogoose-repository';

import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostDocument> {
    return this.postModel.create(createPostDto);
  }

  async updateOneById(id: string, updatePostDto: Omit<UpdatePostDto, 'id'>): Promise<PostDocument> {
    return this.postModel.findByIdAndUpdate(new ObjectId(id), updatePostDto);
  }

  async find({ filterBy, sort = { _id: -1 }, limit = 10, skip = 0 }: FindOptions<PostDocument>) {
    return this.postModel.find(filterBy).sort(sort).skip(skip).limit(limit).exec();
  }

  async findOne(filterBy: FindOptions<PostDocument>['filterBy']) {
    return this.postModel.findOne(filterBy);
  }

  async getCount(filterBy: FindOptions<PostDocument>['filterBy']) {
    return this.postModel.countDocuments(filterBy);
  }
}
