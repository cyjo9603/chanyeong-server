import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType()
export class PageInfo {
  @Field()
  hasNext: boolean;
}

export function connectionGenerator<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`)
  abstract class Edge {
    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class Connection {
    @Field(() => [Edge], { nullable: true })
    edges: Edge[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }

  return Connection;
}
