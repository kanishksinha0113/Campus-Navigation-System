import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, '..', 'data');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error: ' + err.code);
            return;
        }
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    // Enable CORS for flexibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // API endpoints
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
        return;
    }

    // Serve /data/* from project root /data directory
    if (pathname.startsWith('/data/')) {
        const fileName = path.basename(pathname);
        const dataFilePath = path.join(DATA_DIR, fileName);
        if (fs.existsSync(dataFilePath)) {
            serveFile(res, dataFilePath, 'application/json');
            return;
        }
    }

    // Default to index.html for root
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const localFilePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(localFilePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found: ' + pathname);
            return;
        }

        const ext = path.extname(localFilePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        serveFile(res, localFilePath, contentType);
    });
});

server.listen(PORT, () => {
    console.log(`
┌──────────────────────────────────────────────────────────────┐
│                  CAMPUSNAV 3D ENTERPRISE                    │
│             IIT Delhi Spatial Digital Twin                   │
├──────────────────────────────────────────────────────────────┤
│  Localhost Server:  http://localhost:${PORT}                  │
│  Data Source:       /data/campus_nodes.json                  │
│  Status:            ONLINE & READY                           │
└──────────────────────────────────────────────────────────────┘
`);
});
