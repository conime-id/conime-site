import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

app.post('/api/save', (req, res) => {
  try {
    const { filename, content, category } = req.body;
    
    if (!filename || !content || !category) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Determine target directory
    // Categories: news, opinion, reviews
    const targetDir = path.join(__dirname, 'src', 'content', category);
    ensureDir(targetDir);

    const filePath = path.join(targetDir, filename);

    // Write file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`[Server] Saved ${filename} to ${category}`);
    res.json({ success: true, path: filePath });

  } catch (error) {
    console.error('[Server] Error saving file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] Content Helper running on http://localhost:${PORT}`);
});
