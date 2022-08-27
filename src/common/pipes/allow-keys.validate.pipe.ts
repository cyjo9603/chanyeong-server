import { PipeTransform, Injectable, Scope, Type, BadRequestException } from '@nestjs/common';

export const AllowKeysValidationPipe = (keys: string[]): Type<PipeTransform> => {
  @Injectable({ scope: Scope.REQUEST })
  class _AllowKeysValidationPipe implements PipeTransform {
    transform(value: any) {
      if (value && typeof value !== 'object') {
        throw new BadRequestException();
      }

      if (value && !Object.keys(value).every((valueKey) => [...keys].includes(valueKey))) {
        throw new BadRequestException();
      }

      return value;
    }
  }

  return _AllowKeysValidationPipe;
};
