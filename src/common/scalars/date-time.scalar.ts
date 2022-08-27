import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime')
export class DateTimeScalar implements CustomScalar<string, Date> {
  public description = 'Date custom scalar type';

  // value from the client
  parseValue(value: string): Date {
    // client에서 요청하는 시점의 시간을 $now로 입력 시 server측에서 현재 시간으로 변경해 줌
    if (value === '$now') {
      return new Date();
    }
    return new Date(value);
  }

  // value sent to the client
  serialize(value: Date): string {
    if (value && typeof value.toISOString === 'function') {
      return value.toISOString();
    }
    return new Date(value || 0).toISOString();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    } else if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
}
