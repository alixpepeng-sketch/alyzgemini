// api/chat.js - ANTI HIGH DEMAND
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY belum di set' });

  const { prompt, system } = req.body;
  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  };
  if (system) payload.systemInstruction = { parts: [{ text: system }] };

  const MODELS_TO_TRY = [
    "gemini-3.8-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash"
  ];

  for (const MODEL of MODELS_TO_TRY) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await r.json();
      
      if (r.ok) return res.status(200).json(data);
      
      // kalau overload / not found, lanjut coba model berikutnya
      if (data?.error?.message?.toLowerCase().includes('high demand') || 
          data?.error?.message?.toLowerCase().includes('not found') ||
          data?.error?.message?.toLowerCase().includes('no longer available')) {
        console.log(`Model ${MODEL} gagal: ${data.error.message}, coba model lain...`);
        continue;
      }
      
      return res.status(r.status).json({ error: data?.error?.message });
    } catch (e) {
      continue;
    }
  }

  return res.status(503).json({ error: 'Semua model Gemini lagi rame banget, coba lagi 20 detik lagi.' });
                                        }
