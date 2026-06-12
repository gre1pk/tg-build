const handlers = require('./handlers');

async function routeApi({ method, pathname, authHeader, body }) {
  if (pathname === '/api/fabrics' && method === 'GET') {
    return handlers.handleFabricsList();
  }

  const fabricMatch = pathname.match(/^\/api\/fabrics\/([^/]+)$/);
  if (fabricMatch && method === 'GET') {
    return handlers.handleFabricById(decodeURIComponent(fabricMatch[1]));
  }

  if (pathname === '/api/portfolio' && method === 'GET') {
    return handlers.handlePortfolioList();
  }

  if (pathname === '/api/auth/telegram' && method === 'POST') {
    return handlers.handleAuthTelegram(body);
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    return handlers.handleAuthMe(authHeader);
  }

  if (pathname === '/api/admin/me' && method === 'GET') {
    return handlers.handleAdminMe(authHeader);
  }

  if (pathname === '/api/admin/fabrics' && method === 'POST') {
    return handlers.handleAdminCreateFabric(authHeader, body);
  }

  const adminFabricMatch = pathname.match(/^\/api\/admin\/fabrics\/([^/]+)$/);
  if (adminFabricMatch) {
    const id = decodeURIComponent(adminFabricMatch[1]);
    if (method === 'PUT') {
      return handlers.handleAdminUpdateFabric(authHeader, id, body);
    }
    if (method === 'DELETE') {
      return handlers.handleAdminDeleteFabric(authHeader, id);
    }
    return { status: 405, body: { error: 'Method not allowed' } };
  }

  if (pathname === '/api/admin/portfolio' && method === 'POST') {
    return handlers.handleAdminCreatePortfolio(authHeader, body);
  }

  const adminPortfolioMatch = pathname.match(/^\/api\/admin\/portfolio\/([^/]+)$/);
  if (adminPortfolioMatch) {
    const id = decodeURIComponent(adminPortfolioMatch[1]);
    if (method === 'PUT') {
      return handlers.handleAdminUpdatePortfolio(authHeader, id, body);
    }
    if (method === 'DELETE') {
      return handlers.handleAdminDeletePortfolio(authHeader, id);
    }
    return { status: 405, body: { error: 'Method not allowed' } };
  }

  if (pathname === '/api/admin/upload' && method === 'POST') {
    return handlers.handleAdminUpload(authHeader, body);
  }

  return { status: 404, body: { error: 'Not found' } };
}

module.exports = { routeApi };
