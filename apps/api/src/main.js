import { spawn } from 'child_process';
import { chmodSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from 'dotenv';
config({ path: new URL('../.env', import.meta.url).pathname });
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const PB_BINARY = join(ROOT, 'pocketbase');
const PB_PORT   = 17549;

// Data dir — uses env var in production (persists across deploys), fallback for local dev
const PB_DATA_DIR       = process.env.PB_DATA_DIR       || join(ROOT, 'pb_data');
const PB_MIGRATIONS_DIR = process.env.PB_MIGRATIONS_DIR || join(ROOT, 'pb_migrations');
const PB_HOOKS_DIR = process.env.PB_HOOKS_DIR || join(ROOT, 'pb_hooks');

// Make binary executable (required on Linux)
try { chmodSync(PB_BINARY, '755'); } catch (e) {}

console.log(`Starting PocketBase...`);
console.log(`  Data:       ${PB_DATA_DIR}`);
console.log(`  Migrations: ${PB_MIGRATIONS_DIR}`);
console.log(`  Hooks:      ${PB_HOOKS_DIR}`);

// Start PocketBase on internal port
const pb = spawn(PB_BINARY, [
  'serve',
  `--http=127.0.0.1:${PB_PORT}`,
  `--dir=${PB_DATA_DIR}`,
  `--migrationsDir=${PB_MIGRATIONS_DIR}`,
  `--hooksDir=${PB_HOOKS_DIR}`,
  '--origins=https://saferide.com.pk,http://localhost:3000,http://127.0.0.1:3000',
], { stdio: 'inherit', cwd: ROOT });

pb.on('error', (err) => { console.error('PocketBase failed to start:', err); });
pb.on('close', (code) => {
  console.log(`PocketBase exited with code ${code}`);
  process.exit(code);
});

// Wait for PocketBase to be ready then start Express proxy
setTimeout(() => {
  const app = express();

  app.use('/', createProxyMiddleware({
    target:      `http://127.0.0.1:${PB_PORT}`,
    changeOrigin: true,
    ws:           true,
    on: {
      error: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(502).json({ error: 'Backend temporarily unavailable' });
      }
    }
  }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Proxy running on port ${PORT} → PocketBase on ${PB_PORT}`);
  });
}, 3000);

process.on('SIGTERM', () => { console.log('Shutting down...'); pb.kill('SIGTERM'); });
process.on('SIGINT',  () => { console.log('Shutting down...'); pb.kill('SIGINT');  });
