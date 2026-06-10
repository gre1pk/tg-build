import type { VercelRequest, VercelResponse } from '@vercel/node';

import { handleAuthMe } from '../lib/handlers';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = handleAuthMe(req.headers.authorization);
    return res.status(result.status).json(result.body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}
