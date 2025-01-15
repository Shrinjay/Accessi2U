import * as Yup from 'yup';
import { procedure } from '../procedure.js';
import { prisma } from '../../config/prisma.js';
import { _collection } from '../../services/collection/index.js';
import { ApplicationError } from '../../errors/application-error.js';
import { handleError } from '../middleware/handle-error.js';

const schema = Yup.object({
  itemId: Yup.number().required(),
  fromCollectionId: Yup.number().required(),
  toCollectionId: Yup.number().required(),
});

export const moveToCollection = procedure.input(schema).query(async ({ input, ctx }) => {
  try {
    const { itemId, fromCollectionId, toCollectionId } = input;
    const { user } = ctx;

    const fromCollection = await prisma.collection.findUniqueOrThrow({ where: { id: fromCollectionId } });
    const toCollection = await prisma.collection.findUniqueOrThrow({ where: { id: toCollectionId } });
    const item = await prisma.item.findUniqueOrThrow({ where: { id: itemId } });

    const hasAccessFrom = await _collection.canAccess(fromCollection, user);
    const hasAccessTo = await _collection.canAccess(toCollection, user);
    if (!hasAccessFrom || !hasAccessTo) throw new ApplicationError('You do not have access to this collection!', 401);

    await _collection.removeFromCollection(fromCollection, item);
    return await _collection.addToCollection(toCollection, item);
  } catch (error) {
    return handleError(error, ctx, 'moveToCollection');
  }
});
