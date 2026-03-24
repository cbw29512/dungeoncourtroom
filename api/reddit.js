export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://www.reddit.com/r/DungeonCourtroom/new.json?limit=25',
      { headers: { 'User-Agent': 'DungeonCourtroom/1.0' } }
    );
    const data = await response.json();
    const posts = data.data.children.map(c => ({
      id: 'r_' + c.data.id,
      source: 'reddit',
      title: c.data.title,
      body: c.data.selftext || '',
      author: c.data.author,
      score: c.data.score,
      comments: c.data.num_comments,
      url: 'https://reddit.com' + c.data.permalink,
      created: new Date(c.data.created_utc * 1000),
    }));
    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ error: err.message, posts: [] });
  }
}
