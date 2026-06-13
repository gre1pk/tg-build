import { createRequire } from 'node:module';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

const require = createRequire(import.meta.url);
const { routeApi } = require('./api/lib/router.js');

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

async function handleApiRequest(req: IncomingMessage, res: ServerResponse, url: string) {
  const [pathname, search = ''] = url.split('?');
  const query = Object.fromEntries(new URLSearchParams(search).entries());

  const needsBody =
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'PATCH';

  const body = needsBody ? await readJsonBody(req) : undefined;

  const result = await routeApi({
    method: req.method ?? 'GET',
    pathname,
    authHeader: req.headers.authorization,
    body,
    query,
    headers: req.headers,
  });

  sendJson(res, result.status, result.body);
}

export function apiDevPlugin(): Plugin {
  return {
    name: 'tg-build-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '';
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
