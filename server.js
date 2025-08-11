const http = require('http');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');
const msgFile = path.join(dataDir, 'messages.json');
const photoFile = path.join(dataDir, 'photos.json');

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(path.join(publicDir, 'uploads'), { recursive: true });

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let messages = readJSON(msgFile);
let photos = readJSON(photoFile);

function serveStatic(req, res) {
  const relPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(publicDir, relPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = ext === '.js' ? 'application/javascript'
      : ext === '.css' ? 'text/css'
      : 'text/html';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/messages') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(messages));
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let msg = '';
      try { msg = JSON.parse(body).message || ''; } catch {}
      messages.push({ role: 'user', text: msg });
      const reply = msg;
      messages.push({ role: 'layler', text: reply });
      writeJSON(msgFile, messages);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply }));
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/api/photos') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(photos));
  }

  if (req.method === 'POST' && req.url === '/api/photo') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, data } = JSON.parse(body);
        const buffer = Buffer.from(data, 'base64');
        const filename = Date.now() + '-' + name;
        const filePath = path.join(publicDir, 'uploads', filename);
        fs.writeFile(filePath, buffer, err => {
          if (err) {
            res.writeHead(500);
            return res.end('error');
          }
          photos.push(filename);
          writeJSON(photoFile, photos);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ url: '/uploads/' + filename }));
        });
      } catch {
        res.writeHead(400);
        res.end('invalid');
      }
    });
    return;
  }

  serveStatic(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
