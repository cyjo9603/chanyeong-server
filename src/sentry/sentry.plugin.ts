// For plugin definition see the docs: https://www.apollographql.com/docs/apollo-server/integrations/plugins/

import * as Sentry from '@sentry/node';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';

export const sentryPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors({ request: { query, operationName, variables }, operation, errors }) {
        Sentry.withScope((scope: any) => {
          scope.setTags({
            graphql: (operation || { operation: null }).operation || 'parse_err',
            graphqlName: operationName,
          });
          errors.forEach((error) => {
            scope.setExtra('operationName', operationName);
            scope.setExtra('query', query);
            scope.setExtra('variables', JSON.stringify(variables, null, 2));

            console.log(error);

            if (error.path || error.name !== 'GraphQLError') {
              scope.setExtras({
                path: error.path,
              });
              Sentry.captureException(error);
            } else {
              scope.setExtras({});
              Sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`);
            }
          });
        });
      },
    };
  },
};
