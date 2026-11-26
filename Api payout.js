const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE;
const RESERVE = Number(process.env.RESERVE_CENTS || 30000);

export default async function handler(req, res) {
  const q = `withdrawals?status=eq.requested&order=created_at.asc&select=id,user_id,amount,address,network`;
  const rows = await (await fetch(`${SB}/rest/v1/${q}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  })).json();

  if (!rows.length) return res.json({ sent: 0 });

  const total = rows.reduce((a, r) => a + r.amount, 0);
  const payable = [];
  let run = 0;
  for (const r of rows) {
    if (run + r.amount > RESERVE) break;
    run += r.amount; payable.push(r);
  }

  const batch = crypto.randomUUID();
  await fetch(`${SB}/rest/v1/withdrawals?id=in.(${payable.map(r => r.id).join(',')})`, {
    method: 'PATCH',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'queued', batch_id: batch })
  });

  const lines = payable.map(r => `${(r.amount/100).toFixed(2)} USDT → ${r.address}`).join('\n');
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT,
      text: `PAYOUT ${batch}\n${payable.length} users, $${(run/100).toFixed(2)}\n\n${lines}`
    })
  });

  res.json({ batch, queued: payable.length, total: run, rolled: rows.length - payable.length });
  }
