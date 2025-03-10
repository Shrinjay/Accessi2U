import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const input = Yup.object({
  buildingId: Yup.number().optional(),
});

export const listFloors = procedure.input(input).query(async ({ ctx, input }) => {
  const { buildingId } = input;
  const floors = await prisma.floor.findMany({
    where: {
      ...(buildingId && { building_id: buildingId }),
    },
  });
  return floors;
});
