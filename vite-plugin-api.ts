import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

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
  const {
    handleAuthMe,
    handleAuthTelegram,
    handleFabricById,
    handleFabricsList,
  } = await import('./api/lib/handlers');

  if (pathname === '/api/fabrics' && req.method === 'GET') {
    const result = handleFabricsList();
    sendJson(res, result.status, result.body);
    return;
  }

  const fabricMatch = pathname.match(/^\/api\/fabrics\/([^/]+)$/);
  if (fabricMatch && req.method === 'GET') {
    const result = handleFabricById(decodeURIComponent(fabricMatch[1]));
    sendJson(res, result.status, result.body);
    return;
  }

  if (pathname === '/api/auth/telegram' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const result = handleAuthTelegram(body);
      sendJson(res, result.status, result.body);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      sendJson(res, 500, { error: message });
    }
    return;
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    try {
      const result = handleAuthMe(req.headers.authorization);
      sendJson(res, result.status, result.body);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      sendJson(res, 500, { error: message });
    }
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
