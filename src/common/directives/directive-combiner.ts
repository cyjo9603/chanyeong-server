import { GraphQLSchema } from 'graphql';

interface Directive {
  transformer: (schema: GraphQLSchema, name: string) => GraphQLSchema;
  name: string;
}

export const directiveCombiner = (schema: GraphQLSchema, directives: Directive[]) => {
  return directives.reduce<GraphQLSchema>(
    (currentSchema, { transformer, name }) => transformer(currentSchema, name),
    schema,
  );
};
