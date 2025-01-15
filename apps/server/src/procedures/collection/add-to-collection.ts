import { procedure } from '../procedure.js';
import { _collection } from '../../services/collection/index.js';
import { handleError } from '../middleware/handle-error.js';
import * as Yup from 'yup';
import { prisma } from '../../config/prisma.js';
import { ApplicationError } from '../../errors/application-error.js';

const schema = Yup.object({
  collectionId: Yup.number().required(),
  itemId: Yup.string().required(),
});

export const addToCollection = procedure.input(schema).mutation(async ({ input, ctx }) => {
  try {
    const { collectionId, itemId } = input;
    const { user } = ctx;

    const collection = await prisma.collection.findUniqueOrThrow({ where: { id: collectionId } });
    const item = await prisma.item.findUniqueOrThrow({ where: { externalId: itemId } });

    const hasAccess = _collection.canAccess(collection, user);
    if (!hasAccess) throw new ApplicationError('You do not have access to this collection!', 401);

    const nextCollection = await _collection.addToCollection(collection, item);

    return nextCollection;
  } catch (error) {
    return handleError(error, ctx, 'addToCollection');
  }
});
