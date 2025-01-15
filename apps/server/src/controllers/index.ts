import { Router } from 'express';

import * as AuthController from './auth/index.js';
import * as AiController from './ai/index.js';

const router = Router();

router.get('/auth/callback', AuthController.oAuthCallback);
router.post('/ai/ingest', AiController.ingest);

export { router };
