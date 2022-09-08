import { InputType, PickType } from '@nestjs/graphql';

import { Experience } from '../schema/experience.schema';

@InputType('UpsertExperienceDto')
export class UpsertExperienceDto extends PickType(Experience, ['title', 'content', 'startedAt', 'endedAt'] as const) {}
