const { handleFabricsList } = require('../lib/handlers');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const result = handleFabricsList();
  return res.status(result.status).json(result.body);
};
