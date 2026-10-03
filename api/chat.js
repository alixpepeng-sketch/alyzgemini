// api/chat.js - FINAL GROQ + ANTI ERROR
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({ text: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ text: 'GROQ_API_KEY belum di set di Vercel anj' });
  }

  try {
    const { prompt, system } = req.body || {};

    if (!prompt) {
      return res.status(200).json({ text: 'Prompt kosong' });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: system || "Kamu adalah asisten yang cepat dan membantu." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ text: `Groq Error: ${data.error?.message || JSON.stringify(data)}` });
    }

    const text = data.choices?.[0]?.message?.content || 'Gak ada respon';

    return res.status(200).json({ text: text });

  } catch (err) {
    return res.status(200).json({ text: 'Server Error: ' + err.message });
  }
      }
