import { Router } from 'express';

import * as AuthController from './auth/index.js';

const router = Router();

router.get('/auth/callback', AuthController.oAuthCallback);

export { router };
