import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('TagWithCount')
export class TagWithCount {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  count: number;
}
