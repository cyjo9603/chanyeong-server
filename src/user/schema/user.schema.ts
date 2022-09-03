import { Field, ID, ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MaxLength, MinLength, IsJWT, IsAlphanumeric } from 'class-validator';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
}

export type UserDocument = User & Document;

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => UserRole)
  @Prop({
    type: String,
    required: true,
    enum: [UserRole.ADMIN],
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @MaxLength(20)
  @MinLength(4)
  @IsAlphanumeric()
  @Field(() => String)
  @Prop({ type: String, required: true, index: true, unique: true })
  userId: string;

  @MaxLength(200)
  @Field(() => String)
  @Prop({ type: String, required: true })
  password: string;

  @MaxLength(20)
  @Field(() => String)
  @Prop({ type: String, required: true })
  firstName: string;

  @MaxLength(15)
  @Field(() => String)
  @Prop({ type: String, required: true })
  lastName: string;

  @IsJWT()
  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
