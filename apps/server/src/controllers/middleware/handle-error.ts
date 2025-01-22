import { NextFunction, Request, Response } from 'express';
import { ApplicationError } from '../../errors/application-error.js';
import { APP_ENV } from '../../config/env.js';

export const handleError = async (err: ApplicationError | any, req: Request, res: Response, next: NextFunction) => {
  if (APP_ENV === 'dev') console.error(err);

  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const message = err?.meta?.cause ?? err?.message ?? err?.error?.message ?? 'Something went wrong';

  if (status !== 404) {
    console.error(`Error in ${req.path}`, err);
  }

  return res.status(err.status || 500).json({ success: false, message });
};
