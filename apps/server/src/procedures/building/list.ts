import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';

export const listBuildings = procedure.query(async ({ ctx }) => {
  const buildings = await prisma.building.findMany();
  return buildings;
});
