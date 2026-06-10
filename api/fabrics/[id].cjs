const { handleFabricById } = require('../lib/handlers.cjs');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = req.query.id;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Fabric id is required' });
  }

  const result = handleFabricById(id);
  return res.status(result.status).json(result.body);
};
