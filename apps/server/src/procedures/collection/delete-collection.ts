import * as Yup from 'yup';
import { procedure } from '../procedure.js';
import { handleError } from '../middleware/handle-error.js';
import { prisma } from '../../config/prisma.js';
import { _collection } from '../../services/collection/index.js';
import { ApplicationError } from '../../errors/application-error.js';

const schema = Yup.object({
  id: Yup.number().required(),
});

export const deleteCollection = procedure.input(schema).mutation(async ({ input, ctx }) => {
  try {
    const { id } = input;
    const { user } = ctx;

    const collection = await prisma.collection.findUniqueOrThrow({ where: { id } });
    const hasAccess = await _collection.canAccess(collection, user);
    if (!hasAccess) throw new ApplicationError('You do not have access to this collection!', 401);

    return await prisma.collection.delete({ where: { id } });
  } catch (error) {
    return handleError(error, ctx, 'deleteCollection');
  }
});
