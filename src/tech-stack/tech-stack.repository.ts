import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FindOptions } from '@/common/types/mogoose-repository';

import { TechStack, TechStackDocument } from './schema/tech-stack.schema';

@Injectable()
export class TechStackRepository {
  private DELETED_FILTER: FindOptions<TechStackDocument>['filterBy'];
  constructor(
    @InjectModel(TechStack.name)
    private readonly postModel: Model<TechStackDocument>,
  ) {
    this.DELETED_FILTER = { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] };
  }

  async find({ filterBy, sort = { _id: -1 }, limit = 10, skip = 0 }: FindOptions<TechStackDocument>) {
    return this.postModel
      .find({ ...this.DELETED_FILTER, ...filterBy })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findOne(filterBy: FindOptions<TechStackDocument>['filterBy']) {
    return this.postModel.findOne({ ...this.DELETED_FILTER, ...filterBy });
  }

  async getCount(filterBy: FindOptions<TechStackDocument>['filterBy']) {
    return this.postModel.countDocuments(filterBy);
  }
}
