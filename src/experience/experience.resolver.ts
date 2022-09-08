import { Resolver } from '@nestjs/graphql';
import { ExperienceRepository } from './experience.repository';

import { Experience } from './schema/experience.schema';

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly experienceRepository: ExperienceRepository) {}
}
