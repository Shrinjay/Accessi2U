import baseBodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';

export const bodyParser = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
) => {
  return baseBodyParser.json()(req, res, next);
};
