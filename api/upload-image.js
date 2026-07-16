const { isAuthed } = require('../lib/auth');
const { uploadImage } = require('../lib/storage');
const { IncomingForm } = require('formidable');

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/svg+xml'
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthed(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);

    const imageFiles = files.image || [];
    if (imageFiles.length === 0) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    const file = imageFiles[0];

    if (!ALLOWED_MIME.has(file.mimetype)) {
      return res.status(400).json({ error: 'Only image files are allowed.' });
    }

    const url = await uploadImage(file);
    res.status(200).json({ ok: true, url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
