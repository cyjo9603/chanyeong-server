import { Document as MongooseDocument, Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { FindOptions } from '@/common/types/mongoose-repository';

export abstract class MongooseCommonRepository<Document extends MongooseDocument, CreateDto = any, UpdateDto = any> {
  private DELETED_FILTER: FindOptions<Document>['filterBy'];

  constructor(private readonly model: Model<Document>) {
    this.DELETED_FILTER = { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] };
  }

  async create(createPostDto: CreateDto): Promise<Document> {
    return this.model.create(createPostDto);
  }

  async updateOneById(id: ObjectId, updatePostDto: UpdateDto): Promise<Document> {
    return this.model.findByIdAndUpdate(id, updatePostDto, { new: true });
  }

  async deleteOneById(id: ObjectId): Promise<Document> {
    return this.model.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }

  async find({ filterBy, sort = { _id: -1 }, limit = 10, skip = 0 }: FindOptions<Document>) {
    return this.model
      .find({ ...this.DELETED_FILTER, ...filterBy })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findOne(filterBy: FindOptions<Document>['filterBy']) {
    return this.model.findOne({ ...this.DELETED_FILTER, ...filterBy });
  }

  async findById(id: ObjectId) {
    return this.model.findById(id);
  }

  async getCount(filterBy: FindOptions<Document>['filterBy']) {
    return this.model.countDocuments(filterBy);
  }
}
