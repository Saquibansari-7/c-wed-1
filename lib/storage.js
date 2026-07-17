const { DEFAULT_DATA } = require('../public/data.js');

// Use Vercel KV (Redis) for persistent storage or fallback to environment variable
let data = DEFAULT_DATA;

function getContent() {
  // Try to get from environment variable (for small deployments)
  const envData = process.env.WEDDING_DATA;
  if (envData) {
    try {
      const stored = JSON.parse(envData);
      const merged = JSON.parse(JSON.stringify(DEFAULT_DATA));
      for (const key in stored) {
        if (
          typeof stored[key] === 'object' &&
          stored[key] !== null &&
          !Array.isArray(stored[key])
        ) {
          merged[key] = { ...merged[key], ...stored[key] };
        } else {
          merged[key] = stored[key];
        }
      }
      return merged;
    } catch (e) {
      console.error('Failed to parse WEDDING_DATA:', e.message);
    }
  }
  return DEFAULT_DATA;
}

function saveContent(newData) {
  // Note: This will only persist for the current function invocation
  // For production, use Vercel KV, Postgres, or another persistent storage
  data = newData;
  console.warn('[WARNING] Changes saved to memory only. For persistent storage, configure a database.');
  // To enable persistent storage, implement one of:
  // 1. Vercel KV (Redis): https://vercel.com/docs/storage/vercel-kv
  // 2. Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
  // 3. MongoDB Atlas or similar
}

const ALLOWED_MIME = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/gif', '.gif'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
  ['image/svg+xml', '.svg']
]);

async function uploadImage(file) {
  // For serverless, we need to upload to a service like Cloudinary, AWS S3, or Vercel Blob
  // For now, return a placeholder URL
  throw new Error('Image upload requires external storage (Cloudinary, S3, or Vercel Blob). See documentation.');
}

module.exports = { getContent, saveContent, uploadImage, ALLOWED_MIME };
