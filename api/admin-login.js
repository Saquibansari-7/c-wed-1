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

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, pass } = req.body || {};
  const userOk = user === ADMIN_USER;
  const passOk = pass && crypto.timingSafeEqual(
    Buffer.from(hashPass(pass), 'hex'),
    Buffer.from(ADMIN_PASS_HASH, 'hex')
  );

  console.log(`[login] user=${JSON.stringify(user)} userOk=${userOk} passOk=${!!passOk}`);

  if (userOk && passOk) {
    const token = crypto.randomBytes(32).toString('hex');
    SESSIONS.set(token, { user, expires: Date.now() + SESSION_TTL });
    
    const secure = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', `admin_session=${token}; Path=/; Max-Age=${SESSION_TTL}; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`);
    
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
}
