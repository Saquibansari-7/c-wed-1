const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { DEFAULT_DATA } = require('../public/data.js');

const DATA_FILE = path.join(process.cwd(), 'tmp', 'data.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function getContent() {
  let stored = {};
  try {
    if (fs.existsSync(DATA_FILE)) {
      stored = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) || {};
    }
  } catch (e) {
    console.error('Failed to read data.json:', e.message);
  }
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
}

function saveContent(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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
  const ext = ALLOWED_MIME.get(file.mimetype) || '.bin';
  const filename = Date.now() + '-' + uuidv4().slice(0, 8) + ext;
  const filepath = path.join(UPLOAD_DIR, filename);

  // Write file to public/uploads
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(filepath, data);

  // Clean up temp file
  fs.unlinkSync(file.filepath);

  return `/uploads/${filename}`;
}

module.exports = { getContent, saveContent, uploadImage };
