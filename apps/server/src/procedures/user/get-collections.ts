import { _user } from '../../services/user/index.js';
import { handleError } from '../middleware/handle-error.js';
import { procedure } from '../procedure.js';

export const getCollections = procedure.query(async ({ ctx }) => {
  try {
    const { user } = ctx;

    const collections = await _user.getCollections(user);

    return collections;
  } catch (error) {
    return handleError(error, ctx, 'getCollections');
  }
});
