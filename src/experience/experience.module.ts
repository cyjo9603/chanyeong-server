import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Experience, ExperienceSchema } from './schema/experience.schema';
import { ExperienceResolver } from './experience.resolver';
import { ExperienceRepository } from './experience.repository';
import { ExperienceService } from './experience.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Experience.name, schema: ExperienceSchema }])],
  providers: [ExperienceResolver, ExperienceRepository, ExperienceService],
})
export class ExperienceModule {}
