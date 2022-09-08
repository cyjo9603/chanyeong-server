import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MaxLength, IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import { connectionGenerator } from '@/common/schema/connection.schema';
import { DateTimeScalar } from '@/common/scalars/date-time.scalar';
import { ObjectIdScalar } from '@/common/scalars/mongo-object-id.scalar';

export type ExperienceDocument = Experience & Document;

@InputType({ isAbstract: true })
@ObjectType()
@Schema({ timestamps: true })
export class Experience {
  @Field(() => ObjectIdScalar)
  id: ObjectId;

  @MaxLength(50)
  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => String)
  @Prop({ required: true })
  content: string;

  @Field(() => DateTimeScalar)
  @Prop({ required: true })
  startedAt: Date;

  @IsOptional()
  @Field(() => DateTimeScalar, { nullable: true })
  @Prop()
  endedAt?: Date;

  @Field(() => DateTimeScalar)
  createdAt!: Date;

  @Field(() => DateTimeScalar)
  updatedAt!: Date;

  @Field(() => DateTimeScalar, { nullable: true })
  @Prop({})
  deletedAt!: Date;
}

@ObjectType()
export class ExperienceConnection extends connectionGenerator(Experience) {}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
