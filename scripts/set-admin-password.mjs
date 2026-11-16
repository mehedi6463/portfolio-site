/**
 * Creates or changes the admin login.
 *
 *   npm run admin:password                      → username "mehedi", random strong password
 *   npm run admin:password -- myname            → custom username, random password
 *   npm run admin:password -- myname MyPass123  → custom username and password
 *
 * Only a salted scrypt hash is stored (in admin-credentials.json, never committed).
 */
import { randomBytes, scryptSync } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const FILE = 'admin-credentials.json';
const [, , usernameArg, passwordArg] = process.argv;

const username = (usernameArg || 'mehedi').trim();
if (!/^[a-zA-Z0-9._-]{3,32}$/.test(username)) {
  console.error('Username must be 3–32 characters: letters, numbers, dot, dash or underscore.');
  process.exit(1);
}

function generatePassword(length = 16) {
  // no look-alike characters (0/O, 1/l/I)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length];
  return `${out.slice(0, 4)}-${out.slice(4, 8)}-${out.slice(8, 12)}-${out.slice(12)}`;
}

const password = passwordArg || generatePassword();
if (password.length < 10) {
  console.error('Password must be at least 10 characters.');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');

await writeFile(
  FILE,
  `${JSON.stringify({ username, salt, hash, algorithm: 'scrypt', updatedAt: new Date().toISOString() }, null, 2)}\n`,
);

console.log('\n  Admin login saved (only a hash is stored in admin-credentials.json)\n');
console.log(`  Username: ${username}`);
console.log(`  Password: ${password}\n`);
console.log('  Restart "npm run dev" if it is running, then sign in at http://localhost:5173/admin\n');
