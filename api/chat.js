// api/chat.js - FINAL FIX
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY belum di set di Vercel' });

  try {
    const { prompt, system } = req.body;
    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };
    if (system) payload.systemInstruction = { parts: [{ text: system }] };

    const MODEL = "gemini-3.8-flash";
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`;

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || JSON.stringify(data) });
    
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
