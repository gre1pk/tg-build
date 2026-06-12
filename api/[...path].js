const { routeApi } = require('./lib/router');

function buildPathname(pathQuery) {
  const segments = Array.isArray(pathQuery) ? pathQuery : pathQuery ? [pathQuery] : [];
  return `/api/${segments.map((s) => decodeURIComponent(String(s))).join('/')}`;
}

module.exports = async function handler(req, res) {
  const pathname = buildPathname(req.query.path);

  try {
    const result = await routeApi({
      method: req.method,
      pathname,
      authHeader: req.headers.authorization,
      body: req.body,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
};
