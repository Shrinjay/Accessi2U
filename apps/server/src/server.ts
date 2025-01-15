import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';

import { app } from './app.js';
import { PORT } from './config/env.js';
import { prisma } from './config/prisma.js';
import { createContext } from './context.js';
import { Router, router } from './procedures/index.js';

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const wss = new WebSocketServer({ server });
const handler = applyWSSHandler<Router>({ wss, createContext, router });

export type TrpcRouter = typeof router;

wss.on('connection', (ws) => {
  console.log(`+ Connection (${wss.clients.size})`);

  ws.once('close', () => {
    console.log(`- Connection (${wss.clients.size})`);
  });
});

console.log(`✅ WebSocket Server listening on ws://localhost:${wss.options.port}`);

process.on('SIGTERM', async () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
  await prisma.$disconnect();
});
