export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY belum di set' });

  try {
    const { prompt, system } = req.body;
    const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
    if (system) body.systemInstruction = { parts: [{ text: system }] };

    // MODEL TERBARU SESUAI ERROR LU
    const MODEL = "gemini-2.5-flash"; 
    // coba v1, lebih stabil dari v1beta
    const r = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    if (!r.ok) {
      // kalau 2.5 gak ada, coba 3.8 sesuai suruhan error lu
      if (data?.error?.message?.includes('not found')) {
        const r2 = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: body.contents, systemInstruction: body.systemInstruction })
        });
        const data2 = await r2.json();
        if (!r2.ok) return res.status(r2.status).json({ error: data2?.error?.message });
        return res.status(200).json(data2);
      }
      return res.status(r.status).json({ error: data?.error?.message });
    }
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
      }
