const { handleAdminDeleteFabric, handleAdminUpdateFabric } = require('../../lib/handlers');

module.exports = async function handler(req, res) {
  const id = req.query.id;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Fabric id is required' });
  }

  try {
    if (req.method === 'PUT') {
      const result = await handleAdminUpdateFabric(req.headers.authorization, id, req.body);
      return res.status(result.status).json(result.body);
    }

    if (req.method === 'DELETE') {
      const result = await handleAdminDeleteFabric(req.headers.authorization, id);
      return res.status(result.status).json(result.body);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
};
