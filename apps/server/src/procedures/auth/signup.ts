import { _user } from '../../services/user/index.js';
import { supabase } from '../../config/supabase.js';
import { handleError } from '../middleware/handle-error.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const schema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  name: Yup.string().required(),
});

export const signup = procedure.input(schema).mutation(async ({ input, ctx }) => {
  try {
    const { email, password, name } = input;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {},
    });

    if (error) {
      throw new Error(error.message);
    }

    const { user } = data;

    await _user.createUserFromSupabase(user, { name });

    const { data: generateLinkResponse } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });
    const authUrl = generateLinkResponse?.properties?.action_link;

    return { success: true, authUrl };
  } catch (error) {
    return handleError(error, ctx, 'signup');
  }
});
