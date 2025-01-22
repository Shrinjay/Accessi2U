import { _user } from '../../services/user/index.js';
import { handleError } from '../middleware/handle-error.js';
import { procedure } from '../procedure.js';
import Yup from 'yup';

const schema = Yup.object({
  email: Yup.string().email(),
  name: Yup.string(),
});

export const updateUser = procedure.input(schema).mutation(async ({ ctx, input: user }) => {
  try {
    return await _user.update(ctx.user.id, user);
  } catch (error) {
    return handleError(error, ctx, 'update');
  }
});
