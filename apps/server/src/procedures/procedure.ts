import { trpc } from '../trpc.js';
import { authInfoMiddleware } from './middleware/auth-info.js';

// Register middleware here
export const procedure = trpc.procedure;
