const { isAuthed } = require('../lib/auth');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (isAuthed(req)) {
    return res.status(200).json({ authed: true });
  }

  res.status(401).json({ authed: false });
}
