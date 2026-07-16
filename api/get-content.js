const { getContent } = require('../lib/storage');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const content = getContent();
  res.status(200).json(content);
}
