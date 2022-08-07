import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Sample {
  @Field(() => String)
  value: string;
}
