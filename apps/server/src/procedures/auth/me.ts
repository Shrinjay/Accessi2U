import { handleError } from '../middleware/handle-error.js';
import { procedure } from '../procedure.js';

export const me = procedure.query(async ({ ctx }) => {
  try {
    return ctx.user;
  } catch (error) {
    return handleError(error, ctx, 'me');
  }
});
