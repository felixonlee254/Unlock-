import crypto from 'crypto';

const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE;

function valid(uid, gross, ref, sig) {
  const want = crypto.createHmac('sha256', process.env.POSTBACK_SECRET)
    .update(`${uid}${gross}${ref}`).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(want), Buffer.from(sig || ''));
}

export default async function handler(req, res) {
  const { uid, gross, ref, sig } = req.query;
  if (!uid || !gross || !sig || !valid(uid, gross, ref || '', sig))
    return res.status(401).json({ ok: false });

  const r = await fetch(`${SB}/rest/v1/rpc/credit_offer`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_user: uid, p_gross: Number(gross), p_ref: ref || '' })
  });
  res.status(r.ok ? 200 : 500).json({ ok: r.ok });
}
