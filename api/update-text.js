const { isAuthed } = require('../lib/auth');
const { saveContent } = require('../lib/storage');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthed(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    saveContent(data);
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Save error:', e);
    res.status(500).json({ error: e.message });
  }
}
