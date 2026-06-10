import type { VercelRequest, VercelResponse } from '@vercel/node';

import { handleFabricsList } from '../lib/handlers';

export const config = {
  runtime: 'nodejs',
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const result = handleFabricsList();
  return res.status(result.status).json(result.body);
}
