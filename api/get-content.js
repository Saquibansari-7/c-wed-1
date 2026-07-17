const { getContent } = require('../lib/storage');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const content = getContent();
    res.status(200).json(content);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
