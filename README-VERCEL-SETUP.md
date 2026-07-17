# Wedding CMS on Vercel — Setup Guide

## Current Limitations

This is a basic Vercel serverless deployment. Vercel's ephemeral filesystem means:
- **Changes are NOT persisted** between deployments
- **Images cannot be uploaded** without external storage

## Required Setup for Production

Choose one approach:

### Option 1: Vercel KV (Redis) — Recommended ⭐

1. Create a KV database in Vercel:
   ```bash
   vercel env add KV_URL
   vercel env add KV_REST_API_URL
   vercel env add KV_REST_API_TOKEN
   ```

2. We'll update `/lib/storage.js` to use Vercel KV

### Option 2: Vercel Postgres

1. Add Postgres:
   ```bash
   vercel postgres connect
   ```

2. Update `/lib/storage.js` to use `@vercel/postgres`

### Option 3: MongoDB Atlas (Free Tier)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to Vercel environment:
   ```bash
   vercel env add MONGODB_URI
   ```

### Option 4: Supabase (PostgreSQL + Free Tier)

1. Create account at https://supabase.com
2. Create database
3. Add to Vercel environment:
   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_KEY
   ```

---

## Image Upload Setup

Choose one:

### A. Cloudinary (Easiest) ⭐

1. Create free account: https://cloudinary.com
2. Get credentials from dashboard
3. Add environment variables:
   ```bash
   vercel env add CLOUDINARY_CLOUD_NAME
   vercel env add CLOUDINARY_API_KEY
   vercel env add CLOUDINARY_API_SECRET
   ```

### B. Vercel Blob

1. In Vercel dashboard, add Blob storage
2. Connect to your project
3. Automatically adds `BLOB_READ_WRITE_TOKEN`

### C. AWS S3

1. Create S3 bucket
2. Add IAM credentials:
   ```bash
   vercel env add AWS_ACCESS_KEY_ID
   vercel env add AWS_SECRET_ACCESS_KEY
   vercel env add AWS_S3_BUCKET
   vercel env add AWS_S3_REGION
   ```

---

## Environment Variables Checklist

✅ Already configured:
- `ADMIN_USER` — admin username
- `ADMIN_PASS` — admin password

⚠️ Need to configure:
- [ ] Data storage (KV / Postgres / MongoDB)
- [ ] Image storage (Cloudinary / S3 / Vercel Blob)

---

## For Now (Development)

Your admin panel works! You can:
✅ Login with credentials
✅ Edit all text fields
✅ See changes in the form (not persisted)
✅ View the wedding site

You cannot:
❌ Upload images
❌ Persist changes after deployment

Implement the storage options above for full functionality.
