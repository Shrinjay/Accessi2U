import { createSupabaseClient } from '../../config/supabase.js';
import { ApplicationError } from '../../errors/application-error.js';
import { prisma } from '../../config/prisma.js';

type SignupParams = {
  name: string;
  email: string;
  password: string;
};

export const signup = async (params: SignupParams) => {
  const { name, email, password } = params;

  const supabase = createSupabaseClient();
  const { error, data } = await supabase.auth.admin.createUser({ email, password });
  if (error) throw new ApplicationError(error.message, 400);
  if (!data) throw new ApplicationError('Failed to create user', 500);

  const { user: supabaseUser } = data;
  const supabaseUserId = supabaseUser?.id;
  if (!supabaseUserId) throw new ApplicationError('Failed to create user', 500);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      supabaseUserId,
    },
  });

  return user;
};
