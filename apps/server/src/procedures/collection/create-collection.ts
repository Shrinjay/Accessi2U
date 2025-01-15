import { EVENTS, eventEmitter } from '../../config/event-emitter.js';
import { prisma } from '../../config/prisma.js';
import { _collection } from '../../services/collection/index.js';
import { handleError } from '../middleware/handle-error.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const schema = Yup.object({
  name: Yup.string().required(),
  items: Yup.array().of(Yup.string().required()),
});

export const createCollection = procedure.input(schema).mutation(async ({ input, ctx }) => {
  try {
    const { name, items } = input;
    const { user } = ctx;

    const collection = await _collection.createCollection({ name });
    await _collection.addUserToCollection(collection, user);

    await Promise.all(
      items.map(async (itemId) => {
        const item = await prisma.item.findUniqueOrThrow({ where: { externalId: itemId } });
        await _collection.addToCollection(collection, item);
      }),
    );

    eventEmitter.emit(EVENTS.COLLECTION_CREATED, { collection, user });

    return await prisma.collection.findUniqueOrThrow({ where: { id: collection.id } });
  } catch (error) {
    return handleError(error, ctx, 'createCollection');
  }
});
