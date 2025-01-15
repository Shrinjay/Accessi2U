import { NextFunction, Request, Response } from 'express';
import { logger } from '../../config/logger.js';

const resSendInterceptor =
  (res: Response & { contentBody?: unknown }, send: any) =>
  (content: unknown): any => {
    res.contentBody = content;
    res.send = send;
    res.send(content);
  };

export const logResponseTime = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
  const startHrTime = process.hrtime();
  res.send = resSendInterceptor(res, res.send);
  res.on('finish', () => {
    // Don't log health checks or tunnel requests
    if (req.path === '/health') return next();

    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    const isError = res.statusCode >= 400;

    const method = req.method;
    const code = res.statusCode;
    const time = `${elapsedTimeInMs.toFixed(3)}ms`;
    const path = req.path;
    const query = `req.query:${JSON.stringify(req.query, null)}`;
    const params = `req.params:${JSON.stringify(req.params, null)}`;
    const body = `req.body:${JSON.stringify(req.body, null)}`;
    const error = `error:${isError ? JSON.stringify((res as any).contentBody, null) : null}`;

    const message = `${method} ${code} ${time}\\t${path}\t${query}\t${params}\t${body} ${error}`;

    const level = isError ? 'error' : 'info';
    logger.log({ level, message, consoleLoggerOptions: { label: 'API' } });
  });

  next();
};
