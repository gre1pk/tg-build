import { createRequire } from 'node:module';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

const require = createRequire(import.meta.url);
const handlers = require('./api/lib/handlers.js');

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) {
    return {};
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function handleApiRequest(req: IncomingMessage, res: ServerResponse, pathname: string) {
  const authHeader = req.headers.authorization;

  if (pathname === '/api/fabrics' && req.method === 'GET') {
    const result = await handlers.handleFabricsList();
    sendJson(res, result.status, result.body);
    return;
  }

  const fabricMatch = pathname.match(/^\/api\/fabrics\/([^/]+)$/);
  if (fabricMatch && req.method === 'GET') {
    const result = await handlers.handleFabricById(decodeURIComponent(fabricMatch[1]));
    sendJson(res, result.status, result.body);
    return;
  }

  if (pathname === '/api/portfolio' && req.method === 'GET') {
    const result = await handlers.handlePortfolioList();
    sendJson(res, result.status, result.body);
    return;
  }

  if (pathname === '/api/auth/telegram' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const result = handlers.handleAuthTelegram(body);
    sendJson(res, result.status, result.body);
    return;
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const result = handlers.handleAuthMe(authHeader);
    sendJson(res, result.status, result.body);
    return;
  }

  if (pathname === '/api/admin/me' && req.method === 'GET') {
    const result = handlers.handleAdminMe(authHeader);
    sendJson(res, result.status, result.body);
    return;
  }

  if (pathname === '/api/admin/fabrics' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const result = await handlers.handleAdminCreateFabric(authHeader, body);
    sendJson(res, result.status, result.body);
    return;
  }

  const adminFabricMatch = pathname.match(/^\/api\/admin\/fabrics\/([^/]+)$/);
  if (adminFabricMatch) {
    const id = decodeURIComponent(adminFabricMatch[1]);
    if (req.method === 'PUT') {
      const body = await readJsonBody(req);
      const result = await handlers.handleAdminUpdateFabric(authHeader, id, body);
      sendJson(res, result.status, result.body);
      return;
    }
    if (req.method === 'DELETE') {
      const result = await handlers.handleAdminDeleteFabric(authHeader, id);
      sendJson(res, result.status, result.body);
      return;
    }
  }

  if (pathname === '/api/admin/portfolio' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const result = await handlers.handleAdminCreatePortfolio(authHeader, body);
    sendJson(res, result.status, result.body);
    return;
  }

  const adminPortfolioMatch = pathname.match(/^\/api\/admin\/portfolio\/([^/]+)$/);
  if (adminPortfolioMatch) {
    const id = decodeURIComponent(adminPortfolioMatch[1]);
    if (req.method === 'PUT') {
      const body = await readJsonBody(req);
      const result = await handlers.handleAdminUpdatePortfolio(authHeader, id, body);
      sendJson(res, result.status, result.body);
      return;
    }
    if (req.method === 'DELETE') {
      const result = await handlers.handleAdminDeletePortfolio(authHeader, id);
      sendJson(res, result.status, result.body);
      return;
    }
  }

  if (pathname === '/api/admin/upload' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const result = await handlers.handleAdminUpload(authHeader, body);
    sendJson(res, result.status, result.body);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

export function apiDevPlugin(): Plugin {
  return {
    name: 'tg-build-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';
        if (!url.startsWith('/api/')) {
          next();
          return;
        }

        void handleApiRequest(req, res, url).catch((err) => {
          const message = err instanceof Error ? err.message : 'Internal server error';
          sendJson(res, 500, { error: message });
        });
      });
    },
  };
}
