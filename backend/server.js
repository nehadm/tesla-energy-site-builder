import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'siteConfig.json');


app.use(cors({
  origin: 'http://localhost:8000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

app.post('/api/layout', (req, res) => {
    const config = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(config, null, 2), (err) => {
        if (err) {
            console.error("Save Error:", err);
            return res.status(500).json({ error: 'Failed to save configuration' });
        }
        res.json({ message: 'Session saved successfully' });
    });
});

app.get('/api/layout', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) {
        return res.json({ 
            quantities: { MEGAPACK_XL: 0, MEGAPACK_2: 0, MEGAPACK: 0, POWERPACK: 0 } 
        });
    }
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Load failed' });
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tesla Energy Server running at http://localhost:${PORT}`);
}); 