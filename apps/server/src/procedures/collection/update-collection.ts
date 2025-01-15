import * as Yup from 'yup';
import { procedure } from '../procedure.js';
import { handleError } from '../middleware/handle-error.js';
import { prisma } from '../../config/prisma.js';
import { _collection } from '../../services/collection/index.js';
import { ApplicationError } from '../../errors/application-error.js';

const schema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().optional(),
});

export const updateCollection = procedure.input(schema).query(async ({ input, ctx }) => {
  try {
    const { name } = input;
    const { user } = ctx;

    const collection = await prisma.collection.findUniqueOrThrow({ where: { id: input.id } });
    const hasAccess = await _collection.canAccess(collection, user);
    if (!hasAccess) throw new ApplicationError('You do not have access to this collection!', 401);

    const updatedCollection = await prisma.collection.update({
      where: { id: collection.id },
      data: { name },
    });

    return updatedCollection;
  } catch (error) {
    return handleError(error, ctx, 'updateCollection');
  }
});
