export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Set-Cookie', 'admin_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
  res.status(200).json({ ok: true });
}
