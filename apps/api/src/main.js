import { spawn } from 'child_process';
import { chmodSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PB_BINARY = join(ROOT, 'pocketbase');
const PORT = process.env.PORT || 8090;

try { chmodSync(PB_BINARY, '755'); } catch (e) { console.log('chmod skip:', e.message); }

console.log(`Starting PocketBase on port ${PORT}...`);

const pb = spawn(PB_BINARY, [
  'serve',
  `--http=0.0.0.0:${PORT}`,
  `--dir=${join(ROOT, 'pb_data')}`,
  `--migrationsDir=${join(ROOT, 'pb_migrations')}`,
], { stdio: 'inherit', cwd: ROOT });

pb.on('error', (err) => { console.error('Failed to start PocketBase:', err); process.exit(1); });
pb.on('close', (code) => { console.log(`PocketBase exited with code ${code}`); process.exit(code); });
process.on('SIGTERM', () => pb.kill('SIGTERM'));
process.on('SIGINT', () => pb.kill('SIGINT'));