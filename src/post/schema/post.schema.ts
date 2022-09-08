import { Field, Int, ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MaxLength, IsUrl, IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import { connectionGenerator } from '@/common/schema/connection.schema';
import { DateTimeScalar } from '@/common/scalars/date-time.scalar';
import { ObjectIdScalar } from '@/common/scalars/mongo-object-id.scalar';

export enum PostCategory {
  DIARY = 'DIARY',
  DEV = 'DEV',
}

registerEnumType(PostCategory, { name: 'PostCategory' });

export type PostDocument = Post & Document;

@InputType({ isAbstract: true })
@ObjectType()
@Schema({ timestamps: true })
export class Post {
  @Field(() => ObjectIdScalar)
  id: ObjectId;

  @Field(() => PostCategory)
  @Prop({ type: String, required: true, enum: [PostCategory.DEV, PostCategory.DIARY] })
  category: PostCategory;

  @Field(() => Int)
  @Prop({ index: true })
  numId: number;

  @MaxLength(50)
  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => String)
  @Prop({ required: true })
  content: string;

  @MaxLength(200)
  @IsUrl()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Prop({})
  titleImage?: string;

  @MaxLength(20, { each: true })
  @IsOptional()
  @Field(() => [String], { nullable: true })
  @Prop({ index: true })
  tags: string[];

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
export class PostConnection extends connectionGenerator(Post) {}

export const PostSchema = SchemaFactory.createForClass(Post);
