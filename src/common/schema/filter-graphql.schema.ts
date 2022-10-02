import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { isObjectIdOrHexString } from 'mongoose';
import { ValidateIf } from 'class-validator';
import GraphqlJSON from 'graphql-type-json';

export enum FilterOperator {
  IN = '$in',
  NIN = '$nin',
  EQ = '$eq',
  NE = '$ne',
  GT = '$gt',
  GTE = '$gte',
  LT = '$lt',
  LTE = '$lte',
  EXISTS = '$exists',
}

registerEnumType(FilterOperator, { name: 'FilterOperator' });

@InputType()
export class InputFilter {
  @Field()
  name: string;

  @Field(() => FilterOperator)
  operator: FilterOperator;

  @Field(() => GraphqlJSON)
  value: string | number | boolean;

  @ValidateIf(({ isObjectId, value }) => (isObjectId ? isObjectIdOrHexString(value) : true))
  @Field(() => Boolean, { nullable: true })
  isObjectId?: boolean;
}
