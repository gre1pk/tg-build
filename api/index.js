const { routeApi } = require('./lib/router');

function getPathname(req) {
  const route = req.query.route;
  if (typeof route === 'string' && route.length > 0) {
    return `/api/${decodeURIComponent(route)}`;
  }

  const pathSegments = req.query.path;
  if (pathSegments) {
    const segments = Array.isArray(pathSegments) ? pathSegments : [pathSegments];
    if (segments.length > 0) {
      return `/api/${segments.map((s) => decodeURIComponent(String(s))).join('/')}`;
    }
  }

  const urlPath = (req.url ?? '').split('?')[0];
  if (urlPath.startsWith('/api/') && urlPath.length > '/api/'.length) {
    return urlPath;
  }

  const invokePath = req.headers['x-vercel-invoke-path'];
  if (typeof invokePath === 'string' && invokePath.startsWith('/api/')) {
    return invokePath.split('?')[0];
  }

  return urlPath || '/api';
}

module.exports = async function handler(req, res) {
  const pathname = getPathname(req);

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
