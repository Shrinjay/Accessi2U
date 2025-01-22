import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from './env.js';

export const supabase = createClient(SUPABASE_URL as string, SUPABASE_SERVICE_KEY as string);
export const createSupabaseClient = () => createClient(SUPABASE_URL as string, SUPABASE_SERVICE_KEY as string);
