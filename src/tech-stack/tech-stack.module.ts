import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TechStack, TechStackSchema } from './schema/tech-stack.schema';
import { TechStackResolver } from './tech-stack.resolver';
import { TechStackService } from './tech-stack.service';
import { TechStackRepository } from './tech-stack.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: TechStack.name, schema: TechStackSchema }])],
  providers: [TechStackResolver, TechStackService, TechStackRepository],
})
export class TechStackModule {}
