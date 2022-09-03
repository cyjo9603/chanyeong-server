import { InputType, PickType } from '@nestjs/graphql';

import { TechStack } from '../schema/tech-stack.schema';

@InputType('UpsertTechStackDto')
export class UpsertTechStackDto extends PickType(TechStack, ['name', 'category', 'level', 'description', 'icon', 'order'] as const) {}
