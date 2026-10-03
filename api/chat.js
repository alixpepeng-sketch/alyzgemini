export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ text: 'HALO SAYA ADALAH GROQ AI ALYZ - API JALAN' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(200).json({ text: 'HALO SAYA ADALAH GROQ AI ALYZ' });

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    const prompt = body?.prompt || '';
    if (!prompt) return res.status(200).json({ text: 'HALO SAYA ADALAH GROQ AI ALYZ' });

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Namamu adalah GROQ AI ALYZ. Kamu adalah GROQ AI ALYZ." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(200).json({ text: 'Groq Error: ' + (data.error?.message || JSON.stringify(data)) });
    return res.status(200).json({ text: data.choices[0].message.content });
  } catch (e) {
    return res.status(200).json({ text: 'Error: ' + e.message });
  }
  }
