import { Field, ID, Int, ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MaxLength, IsUrl } from 'class-validator';
import { Document } from 'mongoose';

import { connectionGenerator } from '@/common/schema/connection.schema';
import { DateTimeScalar } from '@/common/scalars/date-time.scalar';

export enum TechStackCategory {
  FRONT_END = 'FRONT_END',
  BACK_END = 'BACK_END',
  INFRA = 'INFRA',
}

registerEnumType(TechStackCategory, { name: 'TechStackCategory' });

export type TechStackDocument = TechStack & Document;

@InputType({ isAbstract: true })
@ObjectType()
@Schema({ timestamps: true })
export class TechStack {
  @Field(() => ID)
  id: string;

  @Field(() => TechStackCategory)
  @Prop({
    type: String,
    required: true,
    enum: [TechStackCategory.FRONT_END, TechStackCategory.BACK_END, TechStackCategory.INFRA],
    index: true,
  })
  category: TechStackCategory;

  @MaxLength(30)
  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => Int)
  @Prop({ required: true })
  level: number;

  @MaxLength(50)
  @Field(() => String)
  @Prop({ required: true })
  description: string;

  @MaxLength(200)
  @IsUrl()
  @Field(() => String)
  @Prop({ required: true })
  icon: string;

  @Field(() => Int)
  @Prop({ required: true, index: true })
  order: number;

  @Field(() => DateTimeScalar)
  createdAt!: Date;

  @Field(() => DateTimeScalar)
  updatedAt!: Date;

  @Field(() => DateTimeScalar, { nullable: true })
  @Prop({})
  deletedAt!: Date;
}

@ObjectType()
export class TechStackConnection extends connectionGenerator(TechStack) {}

export const TechStackSchema = SchemaFactory.createForClass(TechStack);
