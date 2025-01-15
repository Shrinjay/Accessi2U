import { Request, Response } from 'express';
import { supabase } from '../../config/supabase.js';

type RequestParams = {
  code: string;
  next?: string;
};

export const oAuthCallback = async (req: Request<unknown, unknown, unknown, RequestParams>, res: Response) => {
  const code = req.query.code;
  const next = req.query.next ?? '/';

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  res.redirect(303, `/${next.slice(1)}`);
};
