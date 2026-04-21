#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// dev-server.mjs — zero-dep lokalny serwer statyczny.
// Odpala sie z tools/, serwuje cale repo (../).
// ─────────────────────────────────────────────────────────────────────────

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, extname, normalize } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const PORT = Number(process.env.PORT) || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.csv':  'text/csv; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2'
};

function safeJoin(base, urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const joined  = normalize(join(base, decoded));
  if (!joined.startsWith(base)) return null; // traversal guard
  return joined;
}

const server = createServer(async (req, res) => {
  try {
    let urlPath = req.url || '/';
    if (urlPath === '/') urlPath = '/index.html';

    let filePath = safeJoin(ROOT, urlPath);
    if (!filePath) { res.writeHead(400).end('bad path'); return; }

    let st;
    try { st = await stat(filePath); }
    catch { res.writeHead(404).end('not found: ' + urlPath); return; }

    if (st.isDirectory()) {
      filePath = join(filePath, 'index.html');
      try { st = await stat(filePath); }
      catch { res.writeHead(404).end('no index.html in directory'); return; }
    }

    const body = await readFile(filePath);
    const mime = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type':  mime,
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(body);
    console.log(res.statusCode, req.method, urlPath);
  } catch (err) {
    console.error('ERROR', req.url, err.message);
    res.writeHead(500).end('server error: ' + err.message);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  [BLAD] Port ${PORT} jest juz zajety.`);
    console.error(`  Ubij proces na tym porcie albo zmien PORT w tym pliku.`);
  } else {
    console.error('\n  [BLAD]', err.message);
  }
  process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  GD Autocentre — dev server (Node)');
  console.log('  ─────────────────────────────────');
  console.log('  Root   : ' + ROOT);
  console.log('  Editor : http://localhost:' + PORT + '/tools/hero-editor.html');
  console.log('  Site   : http://localhost:' + PORT + '/');
  console.log('');
  console.log('  Ctrl+C = stop. Zamknij okno gdy skonczysz.');
  console.log('');
});
