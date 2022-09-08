import DataLoader from 'dataloader';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

export interface ApolloContext {
  req: Request & { user: { id: ObjectId } };
  res: Response;
  dataloaders: Record<string, DataLoader<string, any>>;
}
