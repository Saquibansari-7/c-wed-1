const { isAuthed } = require('../lib/auth');
const { ALLOWED_MIME } = require('../lib/storage');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthed(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    return res.status(501).json({ 
      error: 'Image uploads require external storage setup (Cloudinary, AWS S3, or Vercel Blob). See documentation for setup instructions.' 
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
