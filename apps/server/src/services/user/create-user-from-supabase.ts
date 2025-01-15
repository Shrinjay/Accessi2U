import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from 'database';
import { prisma } from '../../config/prisma.js';

export const createUserFromSupabase = async (supabaseUser: SupabaseUser, userParams: Partial<User>) => {
  const { id: supabaseUserId, email } = supabaseUser;

  return await prisma.user.create({
    data: {
      ...userParams,
      supabaseUserId,
      email,
    },
  });
};
