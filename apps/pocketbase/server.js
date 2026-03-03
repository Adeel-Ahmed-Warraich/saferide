/**
 * SafeRide — PocketBase Launcher for Hostinger Node.js
 * Hostinger requires a Node.js entry point — this script
 * simply spawns the PocketBase binary as a child process.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 8090;
const PB_BINARY = path.join(__dirname, 'pocketbase');

// Make sure binary is executable
try {
  fs.chmodSync(PB_BINARY, '755');
} catch (e) {
  console.log('Note: Could not chmod pocketbase binary:', e.message);
}

console.log(`Starting PocketBase on port ${PORT}...`);

const pb = spawn(PB_BINARY, [
  'serve',
  '--http', `0.0.0.0:${PORT}`,
], {
  stdio: 'inherit',
  cwd: __dirname,
});

pb.on('error', (err) => {
  console.error('Failed to start PocketBase:', err);
  process.exit(1);
});

pb.on('close', (code) => {
  console.log(`PocketBase exited with code ${code}`);
  process.exit(code);
});

// Forward kill signals
process.on('SIGTERM', () => pb.kill('SIGTERM'));
process.on('SIGINT', () => pb.kill('SIGINT'));