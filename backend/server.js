import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'siteConfig.json');
const FRONTEND_BUILD_DIR = path.join(__dirname, '..', 'frontend', 'build');


app.use(cors({
  origin: [
    'http://localhost:8000',
    'http://localhost:5001',
    'https://tesla-energy-site-builder.onrender.com',
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

app.post('/api/layout', (req, res) => {
    try {
        const config = req.body;
        if (!config || typeof config !== 'object') {
            console.error('Invalid request body:', config);
            return res.status(400).json({ error: 'Invalid configuration data' });
        }
        fs.writeFile(DATA_FILE, JSON.stringify(config, null, 2), (err) => {
            if (err) {
                console.error("File write error:", err);
                return res.status(500).json({ error: 'Failed to save configuration' });
            }
            console.log('Configuration saved successfully');
            res.json({ message: 'Session saved successfully' });
        });
    } catch (err) {
        console.error('POST /api/layout error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/layout', (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            console.log('No saved configuration found, returning defaults');
            return res.json({ 
                quantities: { MEGAPACK_XL: 0, MEGAPACK_2: 0, MEGAPACK: 0, POWERPACK: 0 } 
            });
        }
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error('File read error:', err);
                return res.status(500).json({ error: 'Failed to load configuration' });
            }
            try {
                const config = JSON.parse(data);
                console.log('Configuration loaded successfully');
                res.json(config);
            } catch (parseErr) {
                console.error('JSON parse error:', parseErr);
                res.status(500).json({ error: 'Invalid configuration file' });
            }
        });
    } catch (err) {
        console.error('GET /api/layout error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Serve React build from frontend
if (fs.existsSync(FRONTEND_BUILD_DIR)) {
  app.use(express.static(FRONTEND_BUILD_DIR));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }

    res.sendFile(path.join(FRONTEND_BUILD_DIR, 'index.html'));
  });
} else {
  console.warn('Frontend build folder not found at', FRONTEND_BUILD_DIR);
}


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tesla Energy Server running at http://localhost:${PORT}`);
}); 