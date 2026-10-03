// api/chat.js - SUPER CEPAT + STREAMING
export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, system } = req.body;
  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  // model paling cepet di Groq
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // 8b = paling ngebut, 300+ token/detik
      messages: messages,
      temperature: 0.6,
      max_tokens: 512, // jangan kegedean biar cepet
      stream: true
    })
  });

  // aktifin streaming ke frontend
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');

  if (!groqRes.body) {
    return res.status(500).end('Groq error');
  }

  const reader = groqRes.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    // chunk format: data: {"choices":[{"delta":{"content":"halo"}}]}
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.replace('data: ', '');
        if (jsonStr === '[DONE]') break;
        try {
          const json = JSON.parse(jsonStr);
          const text = json.choices?.[0]?.delta?.content || "";
          if (text) res.write(text);
        } catch {}
      }
    }
  }
  res.end();
         }
