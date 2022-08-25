import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

import { InputSort } from '../schema/sort-graphql.schema';

export function sortConvertDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const [sortConvertDirective] = getDirective(schema, fieldConfig, directiveName) || [];

      if (sortConvertDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, { sort: _sort, ...restArgs }, context, info) {
          const sort = convertSort(_sort);

          return resolve(source, { ...restArgs, sort }, context, info);
        };
        return fieldConfig;
      }
    },
  });
}

export async function convertSort(sorts?: InputSort[]) {
  return sorts?.reduce(
    (currentSort, sort) => ({
      ...currentSort,
      [sort.name]: sort.direction,
    }),
    {},
  );
}
