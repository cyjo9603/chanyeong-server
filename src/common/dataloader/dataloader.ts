import * as DataLoader from 'dataloader';
import { Document, FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb';
import { indexBy } from '@fxts/core';

import { MongooseCommonRepository } from '../repository/mongoose-common.repository';
import { ApolloContext } from '../types/apollo-context';

export const createDefaultBatchFunction = <T extends Document>(repository: MongooseCommonRepository<T>) => {
  return async (ids: string[]) => {
    const filterBy: FilterQuery<any> = { _id: { $in: ids.map((id) => new ObjectId(id)) } };
    const entities = await repository.find({ filterBy, limit: ids.length });

    const entityMap = indexBy((entity) => entity._id.toString(), entities);

    return ids.map((id) => entityMap[id] ?? null);
  };
};

export interface GetDataLoaderOptions {
  name?: string;
  customDataLoader?: DataLoader<string, any>;
}

export const getDataLoader = <T extends Document>(
  dataloaders: ApolloContext['dataloaders'],
  repository: MongooseCommonRepository<T>,
  options?: GetDataLoaderOptions,
) => {
  const dataloaderName = options?.name || repository.constructor.name.toLocaleLowerCase().replace('repository', '') + 'Loader';

  if (!dataloaders[dataloaderName]) {
    dataloaders[dataloaderName] = options?.customDataLoader || new DataLoader<string, T>(createDefaultBatchFunction(repository));
  }
  return dataloaders[dataloaderName];
};
