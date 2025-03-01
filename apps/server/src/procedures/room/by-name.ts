import * as Yup from 'yup';
import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';

const input = Yup.object({
  name: Yup.string().required()
});

export const roomByName = procedure.input(input).query(async ({ ctx, input }) => {
  const { name } = input;
  return await prisma.room.findFirstOrThrow({
    where: {
        name: name,
    },
  });
});
