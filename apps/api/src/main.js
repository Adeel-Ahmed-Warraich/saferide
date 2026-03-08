import { spawn } from 'child_process';
import { chmodSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from 'dotenv';
import claudeProxy from './routes/claude-proxy.js';
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

  // ── CORS: must be first so ALL responses carry the header, including errors ──
  // Without this, any Express-level error (body-parse crash, proxy error) would
  // have no CORS header and the browser reports a misleading CORS error.
  app.use((req, res, next) => {
    const allowed = ['https://saferide.com.pk', 'http://localhost:3000', 'http://127.0.0.1:3000'];
    const origin  = req.headers.origin;
    if (origin && allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin',  origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
    next();
  });

  // ── Claude chatbot router — mounted at /api ─────────────────────────────────
  // express.json() is applied inside claude-proxy.js at route level, NOT globally.
  // Global body parsing would consume the stream before the PocketBase proxy
  // can forward POST bodies (auth-with-password, payments, etc.) → 500 errors.
  app.use('/api', claudeProxy);

  // ── PocketBase catch-all proxy — handles ALL other requests ─────────────────
  app.use('/', createProxyMiddleware({
    target:      `http://127.0.0.1:${PB_PORT}`,
    changeOrigin: true,
    ws:           true,
    on: {
      error: (err, req, res) => {
        console.error('Proxy error:', err.message);
        if (!res.headersSent) res.status(502).json({ error: 'Backend temporarily unavailable' });
      }
    }
  }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Proxy running on port ${PORT} → PocketBase on ${PB_PORT}`);
    console.log(`   Claude chat proxy: POST /api/chat ✓`);
  });
}, 3000);

process.on('SIGTERM', () => { console.log('Shutting down...'); pb.kill('SIGTERM'); });
process.on('SIGINT',  () => { console.log('Shutting down...'); pb.kill('SIGINT');  });