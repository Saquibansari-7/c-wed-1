const crypto = require('crypto');

const SALT = crypto.randomBytes(16);
const SESSION_TTL = 1000 * 60 * 60 * 8;
const SESSIONS = new Map();

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

function hashPass(p) {
  return crypto.scryptSync(p, SALT, 64).toString('hex');
}

const ADMIN_PASS_HASH = hashPass(ADMIN_PASS);

function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie;
  if (!raw) return out;
  raw.split(';').forEach((c) => {
    const i = c.indexOf('=');
    if (i === -1) return;
    const k = c.slice(0, i).trim();
    const v = c.slice(i + 1).trim();
    out[k] = decodeURIComponent(v);
  });
  return out;
}

function isAuthed(req) {
  const token = parseCookies(req).admin_session;
  if (!token) return false;
  const s = SESSIONS.get(token);
  if (!s) return false;
  if (s.expires < Date.now()) {
    SESSIONS.delete(token);
    return false;
  }
  return true;
}

module.exports = { isAuthed, parseCookies, SESSIONS, SESSION_TTL, ADMIN_USER, ADMIN_PASS_HASH };
