import { spawn } from 'child_process';
import { chmodSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PB_BINARY = join(ROOT, 'pocketbase');
const PB_PORT = 17549;

// Make binary executable
try { chmodSync(PB_BINARY, '755'); } catch (e) {}

// Start PocketBase on internal port
const PB_DATA_DIR = process.env.PB_DATA_DIR || join(ROOT, 'pb_data');

const pb = spawn(PB_BINARY, [
  'serve',
  `--http=127.0.0.1:${PB_PORT}`,
  `--dir=${PB_DATA_DIR}`,
  `--migrationsDir=${join(ROOT, 'pb_migrations')}`,
  '--origins=https://saferide.com.pk,http://localhost:3000,http://127.0.0.1:3000',
], { stdio: 'inherit', cwd: ROOT });

pb.on('error', (err) => { console.error('PocketBase error:', err); });
pb.on('close', (code) => { console.log(`PocketBase exited: ${code}`); process.exit(code); });

// Wait for PocketBase to start then launch Express proxy
setTimeout(() => {
  const app = express();

  // Proxy everything to PocketBase
  app.use('/', createProxyMiddleware({
    target: `http://127.0.0.1:${PB_PORT}`,
    changeOrigin: true,
    ws: true,
  }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT} → PocketBase on ${PB_PORT}`);
  });
}, 3000);

process.on('SIGTERM', () => pb.kill('SIGTERM'));
process.on('SIGINT', () => pb.kill('SIGINT'));