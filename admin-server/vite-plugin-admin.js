/**
 * Vite plugin powering the local admin panel (/admin).
 *
 *  - Dev server only: exposes a small JSON API under /__admin/api that reads and
 *    writes src/content/content.json and stores uploads in public/uploads.
 *  - Dev + build: fills %TOKENS% in index.html (SEO title, description…) from content.json.
 *
 * Nothing here is included in the production bundle; the deployed site is static.
 * The API is protected by a username/password login (see scripts/set-admin-password.mjs).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const ROOT = process.cwd();
const CREDENTIALS_FILE = path.join(ROOT, 'admin-credentials.json');
const SESSION_COOKIE = 'admin_session';
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours
const MAX_FAILURES = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

/* ---------------- auth ---------------- */

const sessions = new Map(); // token → { username, expires }
const failures = new Map(); // ip → { count, until }

async function readCredentials() {
  try {
    const c = JSON.parse(await fs.readFile(CREDENTIALS_FILE, 'utf8'));
    return c.username && c.salt && c.hash ? c : null;
  } catch {
    return null;
  }
}

async function verifyLogin(username, password) {
  const creds = await readCredentials();
  if (!creds) return false;
  const expected = Buffer.from(creds.hash, 'hex');
  const actual = await scryptAsync(String(password), creds.salt, expected.length);
  const userOk =
    username.length === creds.username.length && timingSafeEqual(Buffer.from(username), Buffer.from(creds.username));
  // always compare the hash, so timing doesn't reveal whether the username was right
  return timingSafeEqual(actual, expected) && userOk;
}

function getCookie(req, name) {
  const header = req.headers.cookie || '';
  const match = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

function getSession(req) {
  const token = getCookie(req, SESSION_COOKIE);
  const s = token && sessions.get(token);
  if (!s) return null;
  if (s.expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { token, ...s };
}

const cookie = (value, maxAgeSec) =>
  `${SESSION_COOKIE}=${value}; Path=/__admin; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}`;

const clientIp = (req) => req.socket?.remoteAddress || 'local';
const CONTENT_FILE = path.join(ROOT, 'src/content/content.json');
const BACKUP_DIR = path.join(ROOT, 'src/content/.backups');
const UPLOAD_DIR = path.join(ROOT, 'public/uploads');
const MAX_UPLOAD = 15 * 1024 * 1024;
const KEEP_BACKUPS = 15;
const REQUIRED_KEYS = ['site', 'seo', 'theme', 'layout', 'hero', 'about', 'skills', 'experience', 'projects', 'services', 'process', 'contact', 'footer'];

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const KEEP_AS_IS_EXT = new Set(['.gif', '.pdf']);

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function readContent() {
  return JSON.parse(await fs.readFile(CONTENT_FILE, 'utf8'));
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error(`File is larger than ${Math.round(limit / 1024 / 1024)} MB.`), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/** Blocks requests from other websites: only same-origin requests carrying our header are accepted. */
function isTrusted(req) {
  if (req.headers['x-admin-request'] !== '1') return false;
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) return false;
    } catch {
      return false;
    }
  }
  return true;
}

function validate(content) {
  if (!content || typeof content !== 'object' || Array.isArray(content)) return 'Content must be a JSON object.';
  const missing = REQUIRED_KEYS.filter((k) => !(k in content));
  if (missing.length) return `Missing sections: ${missing.join(', ')}.`;
  if (!Array.isArray(content.layout)) return '"layout" must be a list.';
  const ids = content.projects?.items?.map((p) => p.id) ?? [];
  if (new Set(ids).size !== ids.length) return 'Two projects share the same id.';
  return null;
}

async function backupCurrent() {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  await fs.copyFile(CONTENT_FILE, path.join(BACKUP_DIR, `content-${stamp}.json`));
  const files = (await fs.readdir(BACKUP_DIR)).filter((f) => f.endsWith('.json')).sort();
  await Promise.all(files.slice(0, Math.max(0, files.length - KEEP_BACKUPS)).map((f) => fs.unlink(path.join(BACKUP_DIR, f))));
}

function safeBaseName(name) {
  const base = path.basename(String(name || 'file'), path.extname(String(name || '')));
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'file'
  );
}

async function handleUpload(req, res, url) {
  const original = url.searchParams.get('name') || 'upload';
  const ext = path.extname(original).toLowerCase();
  if (!IMAGE_EXT.has(ext) && !KEEP_AS_IS_EXT.has(ext)) {
    return send(res, 415, { error: 'Unsupported file type. Use PNG, JPG, WebP, AVIF, GIF or PDF.' });
  }
  const body = await readBody(req, MAX_UPLOAD);
  if (!body.length) return send(res, 400, { error: 'The file is empty.' });

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const stamp = Date.now().toString(36);
  const base = `${safeBaseName(original)}-${stamp}`;

  if (IMAGE_EXT.has(ext)) {
    // Optimise: cap width, convert to WebP.
    const { default: sharp } = await import('sharp');
    const maxWidth = Math.min(Number(url.searchParams.get('maxWidth')) || 1800, 3000);
    const file = `${base}.webp`;
    const info = await sharp(body)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(UPLOAD_DIR, file));
    return send(res, 200, { url: `/uploads/${file}`, width: info.width, height: info.height, size: info.size });
  }

  if (ext === '.pdf' && body.subarray(0, 5).toString() !== '%PDF-') {
    return send(res, 415, { error: 'That file does not look like a PDF.' });
  }
  const file = `${base}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, file), body);
  return send(res, 200, { url: `/uploads/${file}`, size: body.length });
}

export default function adminPlugin() {
  return {
    name: 'portfolio-admin',

    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const c = await readContent();
        const siteUrl = (c.seo?.siteUrl || '/').replace(/\/?$/, '/');
        return html
          .replaceAll('%SEO_TITLE%', escapeHtml(c.seo?.title || c.site?.name))
          .replaceAll('%SEO_DESCRIPTION%', escapeHtml(c.seo?.description))
          .replaceAll('%SITE_NAME%', escapeHtml(c.site?.name))
          .replaceAll('%SITE_URL%', escapeHtml(siteUrl))
          .replaceAll('%DEFAULT_THEME%', ['dark', 'light', 'system'].includes(c.theme?.defaultMode) ? c.theme.defaultMode : 'dark');
      },
    },

    configureServer(server) {
      server.middlewares.use('/__admin/api', async (req, res) => {
        try {
          if (!isTrusted(req)) return send(res, 403, { error: 'Forbidden.' });
          const url = new URL(req.url, 'http://localhost');

          /* ---- auth routes (no session needed) ---- */
          if (url.pathname === '/auth/session' && req.method === 'GET') {
            const s = getSession(req);
            return send(res, 200, {
              configured: Boolean(await readCredentials()),
              authenticated: Boolean(s),
              username: s?.username ?? null,
            });
          }

          if (url.pathname === '/auth/login' && req.method === 'POST') {
            const ip = clientIp(req);
            const f = failures.get(ip);
            if (f?.until > Date.now()) {
              const mins = Math.ceil((f.until - Date.now()) / 60000);
              return send(res, 429, { error: `Too many failed attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.` });
            }
            if (!(await readCredentials())) {
              return send(res, 503, { error: 'No admin login has been created yet. Run “npm run admin:password”.' });
            }
            let body;
            try {
              body = JSON.parse((await readBody(req, 10 * 1024)).toString('utf8'));
            } catch {
              return send(res, 400, { error: 'Invalid request.' });
            }
            const username = String(body.username || '').trim();
            const password = String(body.password || '');
            if (!(await verifyLogin(username, password))) {
              const count = (f && f.until <= Date.now() && f.count >= MAX_FAILURES ? 0 : f?.count || 0) + 1;
              failures.set(ip, { count, until: count >= MAX_FAILURES ? Date.now() + LOCKOUT_MS : 0 });
              const left = MAX_FAILURES - count;
              return send(res, 401, {
                error: left > 0 ? `Incorrect username or password. ${left} attempt${left === 1 ? '' : 's'} left.` : 'Too many failed attempts. Try again in 5 minutes.',
              });
            }
            failures.delete(ip);
            const token = randomBytes(32).toString('hex');
            sessions.set(token, { username, expires: Date.now() + SESSION_TTL });
            res.setHeader('Set-Cookie', cookie(token, SESSION_TTL / 1000));
            return send(res, 200, { ok: true, username });
          }

          if (url.pathname === '/auth/logout' && req.method === 'POST') {
            const s = getSession(req);
            if (s) sessions.delete(s.token);
            res.setHeader('Set-Cookie', cookie('', 0));
            return send(res, 200, { ok: true });
          }

          /* ---- everything below requires a signed-in session ---- */
          const session = getSession(req);
          if (!session) return send(res, 401, { error: 'Your session has expired. Please sign in again.' });
          session.expires = Date.now() + SESSION_TTL; // sliding expiry
          sessions.set(session.token, { username: session.username, expires: session.expires });

          if (url.pathname === '/content' && req.method === 'GET') {
            return send(res, 200, await readContent());
          }

          if (url.pathname === '/content' && req.method === 'PUT') {
            const raw = await readBody(req, 5 * 1024 * 1024);
            let next;
            try {
              next = JSON.parse(raw.toString('utf8'));
            } catch {
              return send(res, 400, { error: 'Invalid JSON.' });
            }
            const problem = validate(next);
            if (problem) return send(res, 422, { error: problem });
            await backupCurrent();
            await fs.writeFile(CONTENT_FILE, `${JSON.stringify(next, null, 2)}\n`);
            return send(res, 200, { ok: true, savedAt: new Date().toISOString() });
          }

          if (url.pathname === '/upload' && req.method === 'POST') {
            return await handleUpload(req, res, url);
          }

          return send(res, 404, { error: 'Not found.' });
        } catch (err) {
          server.config.logger.error(`[admin] ${err.message}`);
          return send(res, err.status || 500, { error: err.message || 'Server error.' });
        }
      });
    },
  };
}
