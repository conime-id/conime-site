const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/save', (req, res) => {
  const { filename, content, category } = req.body;
  
  if (!filename || !content || !category) {
    return res.status(400).json({ error: 'Missing logic fields: filename, content, or category' });
  }

  // Map category to directory
  const categoryMap = {
    'news': 'src/content/news',
    'opinion': 'src/content/opinion',
    'reviews': 'src/content/reviews'
  };

  const targetDir = categoryMap[category.toLowerCase()];
  if (!targetDir) {
    return res.status(400).json({ error: 'Invalid category. Use news, opinion, or reviews.' });
  }

  const absoluteDir = path.join(process.cwd(), targetDir);
  const absolutePath = path.join(absoluteDir, filename.endsWith('.md') ? filename : `${filename}.md`);

  try {
    if (!fs.existsSync(absoluteDir)) {
      fs.mkdirSync(absoluteDir, { recursive: true });
    }
    
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`✅ File saved successfully: ${absolutePath}`);
    res.json({ success: true, path: absolutePath });
  } catch (err) {
    console.error(`❌ Failed to save file: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Admin Content Server running at http://localhost:${PORT}`);
});
