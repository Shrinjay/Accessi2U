import { _collection } from '../../services/collection/index.js';
import { handleError } from '../middleware/handle-error.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const schema = Yup.object({
  name: Yup.string().required(),
});

export const searchCollection = procedure.input(schema).query(async ({ input, ctx }) => {
  try {
    const { name } = input;
    const { user } = ctx;

    const collections = await _collection.searchCollection({ name });
    const collectionsWithAccessPromises = await Promise.all(
      collections.map(async (collection) => _collection.canAccess(collection, user)),
    );
    const collectionsWithAccess = collections.filter((_, index) => collectionsWithAccessPromises[index]);

    return collectionsWithAccess;
  } catch (error) {
    return handleError(error, ctx, 'searchCollection');
  }
});
