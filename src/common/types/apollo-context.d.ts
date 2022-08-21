import { Request, Response } from 'express';

export interface ApolloContext {
  req: Request & { user: { id: string } };
  res: Response;
}
