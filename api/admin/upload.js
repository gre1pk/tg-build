const { handleAdminUpload } = require('../lib/handlers');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await handleAdminUpload(req.headers.authorization, req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
};
