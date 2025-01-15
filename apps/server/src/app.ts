import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { router as trpcRouter } from './procedures/index.js';
import { createContext } from './context.js';
import cors from 'cors';
import { router as restRouter } from './controllers/index.js';
import { handleError } from './controllers/middleware/handle-error.js';
import { logResponseTime } from './controllers/middleware/log-response-time.js';
import { bodyParser } from './controllers/middleware/body-parser.js';

const app = express();

app.use(cors());
app.use(bodyParser);

app.use(logResponseTime);

app.use(restRouter);
app.use('/trpc', trpcExpress.createExpressMiddleware({ router: trpcRouter, createContext }));

app.use(handleError);

export { app };
