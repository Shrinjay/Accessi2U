import { _search } from '../../services/search/index.js';
import { handleError } from '../middleware/handle-error.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const schema = Yup.object({
  query: Yup.string().required(),
});

export const search = procedure.input(schema).mutation(async ({ input, ctx }) => {
  try {
    const { query } = input;
    const { user } = ctx;

    const searchResults = await _search.create({ query }, user);

    return searchResults;
  } catch (error) {
    return handleError(error, ctx, 'search');
  }
});
