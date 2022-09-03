import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MongooseCommonRepository } from '@/common/repository/mongoose-common.repository';

import { TechStack, TechStackDocument } from './schema/tech-stack.schema';

@Injectable()
export class TechStackRepository extends MongooseCommonRepository<TechStackDocument> {
  constructor(
    @InjectModel(TechStack.name)
    private readonly techStackModel: Model<TechStackDocument>,
  ) {
    super(techStackModel);
  }
}
