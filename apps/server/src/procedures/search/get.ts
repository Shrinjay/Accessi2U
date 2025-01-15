import { _search } from '../../services/search/index.js';
import { handleError } from '../middleware/handle-error.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const schema = Yup.object({
  id: Yup.number().required(),
});

export const getSearch = procedure.input(schema).query(async ({ input }) => {
  try {
    const { id } = input;
    return await _search.get({ id });
  } catch (error) {
    return handleError(error, {}, 'getSearch');
  }
});
