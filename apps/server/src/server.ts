import { app } from './app.js';
import { PORT } from './config/env.js';
import { router } from './procedures/index.js';

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export type TrpcRouter = typeof router;
