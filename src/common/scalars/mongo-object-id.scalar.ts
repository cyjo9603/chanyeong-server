import { BadRequestException } from '@nestjs/common';
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { isObjectIdOrHexString } from 'mongoose';
import { ObjectId } from 'mongodb';

@Scalar('ObjectId')
export class ObjectIdScalar implements CustomScalar<string, ObjectId> {
  public description = 'mongodb objectid custom scalar type';

  // value sent to the client
  serialize(value: ObjectId): string {
    return value?.toHexString?.() || value?.toString?.() || null;
  }

  // value from the client
  parseValue(value: string): ObjectId {
    if (!isObjectIdOrHexString(value)) {
      throw new BadRequestException();
    }

    return new ObjectId(value);
  }

  parseLiteral(ast: ValueNode): ObjectId {
    if (ast.kind !== Kind.STRING || !isObjectIdOrHexString(ast.value)) {
      throw new BadRequestException();
    }
    return new ObjectId(ast.value);
  }
}
