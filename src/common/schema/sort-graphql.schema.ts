import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { SortOrder } from 'mongoose';

export enum SortDirection {
  ASC = 1,
  DESC = -1,
}

registerEnumType(SortDirection, { name: 'SortDirection' });

@InputType()
export class InputSort {
  @Field()
  name: string;

  @Field(() => SortDirection)
  direction: SortDirection;
}

export type GraphqlSort = { [key: string]: SortOrder };
