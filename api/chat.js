// api/chat.js - FIX
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY belum di set di Vercel Variable' });

  try {
    const { prompt, system } = req.body;
    const body = { 
      contents: [{ role: 'user', parts: [{ text: prompt }] }] 
    };
    if (system) body.systemInstruction = { parts: [{ text: system }] };

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    
    if (!r.ok) {
      // INI FIX BIAR GAK [object Object]
      const msg = data?.error?.message || JSON.stringify(data);
      return res.status(r.status).json({ error: msg });
    }

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
      }
