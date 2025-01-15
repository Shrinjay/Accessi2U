import * as Yup from 'yup';
import { procedure } from '../procedure.js';
import { handleError } from '../middleware/handle-error.js';
import { prisma } from '../../config/prisma.js';
import { _collection } from '../../services/collection/index.js';
import { ApplicationError } from '../../errors/application-error.js';

const schema = Yup.object({
  collectionId: Yup.number().required(),
  itemId: Yup.number().required(),
});

export const removeFromCollection = procedure.input(schema).query(async ({ input, ctx }) => {
  try {
    const { collectionId, itemId } = input;
    const { user } = ctx;

    const collection = await prisma.collection.findUniqueOrThrow({ where: { id: collectionId } });

    const hasAccess = await _collection.canAccess(collection, user);
    if (!hasAccess) throw new ApplicationError('You do not have access to this collection!', 401);

    const item = await prisma.item.findUniqueOrThrow({ where: { id: itemId } });

    return await _collection.removeFromCollection(collection, item);
  } catch (error) {
    return handleError(error, ctx, 'removeFromCollection');
  }
});
