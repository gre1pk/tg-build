import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react-swc';

import { apiDevPlugin } from './vite-plugin-api';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const scssMixinsPath = path.resolve(projectRoot, 'src/styles/mixins').replace(/\\/g, '/');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (value && !process.env[key]) {
      process.env[key] = value;
    }
  }

  return {
  base: '/',
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        api: 'modern',
        additionalData(source, filename) {
          if (filename.includes(`${path.sep}styles${path.sep}`)) {
            return source;
          }
          return `@use "${scssMixinsPath}" as *;\n${source}`;
        },
      },
    },
  },
  plugins: [react(), tsconfigPaths(), apiDevPlugin(), process.env.HTTPS && mkcert()],
  build: {
    target: 'esnext',
  },
  publicDir: './public',
  server: {
    host: true,
    open: true,
  },
};
});
