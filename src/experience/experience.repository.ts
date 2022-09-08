import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MongooseCommonRepository } from '@/common/repository/mongoose-common.repository';

import { Experience, ExperienceDocument } from './schema/experience.schema';

@Injectable()
export class ExperienceRepository extends MongooseCommonRepository<ExperienceDocument> {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
  ) {
    super(experienceModel);
  }
}
