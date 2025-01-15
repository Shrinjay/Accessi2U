import { getCollections } from './get-collections.js';
import { signup } from './signup.js';
import { createUserFromSupabase } from './create-user-from-supabase.js';
import { update } from './update.js';

export const _user = {
  signup,
  getCollections,
  createUserFromSupabase,
  update,
};
