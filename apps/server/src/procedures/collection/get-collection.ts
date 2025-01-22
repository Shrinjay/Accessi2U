import { ApplicationError } from '../../errors/application-error.js';
import { _collection } from '../../services/collection/index.js';
import { handleError } from '../middleware/handle-error.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const schema = Yup.object({
  id: Yup.number().required(),
});

export const getCollection = procedure.input(schema).query(async ({ input, ctx }) => {
  try {
    const { id } = input;
    const { user } = ctx;

    const collection = await _collection.getCollection({ id }, user);

    const hasAccess = _collection.canAccess(collection, user);
    if (!hasAccess) throw new ApplicationError('You do not have access to this collection!', 401);

    return collection;
  } catch (error) {
    return handleError(error, ctx, 'getCollection');
  }
});
