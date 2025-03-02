import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';

export const listFloors = procedure.query(async ({ ctx }) => {
  const floors = await prisma.floor.findMany();
  return floors;
});
