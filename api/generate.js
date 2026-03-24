export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are the scriptwriter for Dungeon Courtroom, a YouTube Shorts series where D&D monsters argue rules questions in a fantasy courtroom drama.

The cast:
- JUDGE VORN: Gruff half-orc judge in purple robes with a white wig. Impatient, no-nonsense, occasionally wise.
- PROSECUTOR SKRIX: Sly goblin lawyer. Cites rules obsessively, dramatic and cunning.
- DEFENSE GRIMBOLT: Skeleton lawyer in black robes. Calm, philosophical, uses death metaphors.
- BAILIFF THUNK: Large orc guard. Simple but loyal. Keeps order.

Write a short courtroom drama script (6-8 exchanges) debating the D&D rules question provided. Format as:

PANEL 1 - [scene description]
CHARACTER: "Dialogue"

Keep it punchy, funny, and D&D-accurate. End with Judge Vorn's ruling.`,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const script = data.content?.[0]?.text || 'Error generating script.';
    return res.status(200).json({ script });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
