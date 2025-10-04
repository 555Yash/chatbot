export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: message,
        stream: false,
      }),
    });

    const data = await ollamaResponse.json();

    res.status(200).json({ response: data.response });
  } catch (error) {
    console.error("Error communicating with Ollama:", error);
    res.status(404).json({ error: 'Failed to fetch from Ollama' });
  }
}
