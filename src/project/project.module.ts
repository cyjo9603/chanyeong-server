import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

import { Project, ProjectSchema } from './schema/project.schema';
import { ProjectResolver } from './project.resolver';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Project.name,
        useFactory: async (connection) => {
          const schema = ProjectSchema;
          const AutoIncrement = AutoIncrementFactory(connection);

          schema.plugin(AutoIncrement, { inc_field: 'numId', id: 'projectId' });

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [ProjectResolver, ProjectRepository, ProjectService],
})
export class ProjectModule {}
