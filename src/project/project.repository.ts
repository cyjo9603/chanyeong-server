import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MongooseCommonRepository } from '@/common/repository/mongoose-common.repository';

import { Project, ProjectDocument } from './schema/project.schema';

@Injectable()
export class ProjectRepository extends MongooseCommonRepository<ProjectDocument> {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {
    super(projectModel);
  }
}
