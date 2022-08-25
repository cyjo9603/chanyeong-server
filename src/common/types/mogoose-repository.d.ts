import { Document, FilterQuery, SortOrder } from 'mongoose';

export interface FindOptions<T extends Document> {
  filterBy?: FilterQuery<T>;
  sort?: { [key: string]: SortOrder };
  limit?: number;
  skip?: number;
}
