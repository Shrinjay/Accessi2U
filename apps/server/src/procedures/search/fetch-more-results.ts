import * as Yup from 'yup';
import { procedure } from '../procedure.js';
import { _search } from '../../services/search/index.js';
import { handleError } from '../middleware/handle-error.js';
import { prisma } from '../../config/prisma.js';

const schema = Yup.object({
  searchId: Yup.number().required(),
});

export const fetchMoreResults = procedure.input(schema).mutation(async ({ input, ctx }) => {
  try {
    const { searchId } = input;

    const search = await prisma.search.findUniqueOrThrow({ where: { id: searchId } });
    const searchResults = await _search.fetchMore(search);

    return searchResults;
  } catch (error) {
    return handleError(error, ctx, 'fetchMoreResults');
  }
});
