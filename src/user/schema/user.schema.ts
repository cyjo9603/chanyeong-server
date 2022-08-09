import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
}

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
@Schema()
export class User {
  @Field(() => UserRole)
  @Prop({ type: String, required: true, enum: [UserRole.ADMIN] })
  role: UserRole;

  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  password: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  firstName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
