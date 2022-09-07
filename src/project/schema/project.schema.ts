import { Field, ID, Int, ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MaxLength, IsUrl, IsOptional } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { connectionGenerator } from '@/common/schema/connection.schema';
import { DateTimeScalar } from '@/common/scalars/date-time.scalar';

export enum ProjectType {
  PERSONAL = 'PERSONAL',
  GROUP = 'GROUP',
}

registerEnumType(ProjectType, { name: 'ProjectType' });

export type ProjectDocument = Project & Document;

@InputType({ isAbstract: true })
@ObjectType()
@Schema({ timestamps: true })
export class Project {
  @Field(() => ID)
  id: string;

  @Field(() => ProjectType)
  @Prop({ type: String, required: true, enum: [ProjectType.PERSONAL, ProjectType.GROUP] })
  type: ProjectType;

  @Field(() => Int)
  @Prop({ index: true })
  numId: number;

  @MaxLength(30)
  @Field(() => String, { nullable: true })
  @Prop()
  groupName?: string;

  @MaxLength(50)
  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => String)
  @Prop({ required: true })
  description: string;

  @Field(() => String)
  @Prop({ required: true })
  content: string;

  @Field(() => DateTimeScalar)
  @Prop({ required: true })
  startedAt: Date;

  @Field(() => DateTimeScalar, { nullable: true })
  @Prop()
  endedAt?: Date;

  @MaxLength(200)
  @Field(() => String, { nullable: true })
  @Prop()
  githubAddr?: string;

  @Field(() => Int, { nullable: true })
  @Prop()
  contribution?: number;

  @MaxLength(200)
  @IsUrl()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Prop({})
  titleImage?: string;

  @Field(() => [ID], { nullable: true })
  @Prop({ type: [MongooseSchema.Types.ObjectId] })
  techStackIds?: string[];

  @Field(() => DateTimeScalar, { nullable: true })
  @Prop({ index: true })
  pickedAt!: Date;

  @Field(() => DateTimeScalar)
  createdAt!: Date;

  @Field(() => DateTimeScalar)
  updatedAt!: Date;

  @Field(() => DateTimeScalar, { nullable: true })
  @Prop({})
  deletedAt!: Date;
}

@ObjectType()
export class ProjectConnection extends connectionGenerator(Project) {}

export const ProjectSchema = SchemaFactory.createForClass(Project);
