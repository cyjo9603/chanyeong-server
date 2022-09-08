import { InputType, PickType } from '@nestjs/graphql';

import { Project } from '../schema/project.schema';

@InputType('UpsertProjectDto')
export class UpsertProjectDto extends PickType(Project, [
  'type',
  'groupName',
  'title',
  'content',
  'description',
  'startedAt',
  'endedAt',
  'githubAddr',
  'titleImage',
  'contribution',
  'techStackIds',
] as const) {}
