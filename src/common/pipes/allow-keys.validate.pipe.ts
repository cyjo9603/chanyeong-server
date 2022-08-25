import { PipeTransform, Injectable, Scope, Type, BadRequestException } from '@nestjs/common';

export const AllowKeysValidationPipe = (keys: string[]): Type<PipeTransform> => {
  @Injectable({ scope: Scope.REQUEST })
  class _AllowKeysValidationPipe implements PipeTransform {
    transform(value: any) {
      if (typeof value !== 'object') {
        throw new BadRequestException();
      }

      const valueKeys = Object.keys(value);
      if (!valueKeys.every((valueKey) => keys.includes(valueKey))) {
        throw new BadRequestException();
      }

      return value;
    }
  }

  return _AllowKeysValidationPipe;
};
