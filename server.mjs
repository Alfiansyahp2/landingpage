import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const useBuiltFiles = process.env.NODE_ENV === 'production' && existsSync(join(root, 'dist', 'index.html'));
const publicRoot = join(root, useBuiltFiles ? 'dist' : '.');
const types = {
    '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon'
};

createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400).end('Bad request'); return; }

    const requestPath = pathname === '/' ? '/index.html' : pathname;
    const safePath = normalize(requestPath).replace(/^([.][.][/\\])+/, '');
    const isPublicAsset = requestPath === '/manus-routes.json' || requestPath === '/favicon.svg' || requestPath.startsWith('/data/') || requestPath.startsWith('/images/') || requestPath.startsWith('/preview/');
    const relativePath = isPublicAsset && !useBuiltFiles
        ? join('public', safePath.replace(/^[/\\]/, ''))
        : safePath.replace(/^[/\\]/, '');
    const file = join(publicRoot, relativePath);

    if (!file.startsWith(publicRoot + sep) && file !== join(publicRoot, 'index.html')) {
        res.writeHead(403).end('Forbidden'); return;
    }

    const directFile = existsSync(file) && statSync(file).isFile() ? file : null;
    const directoryIndex = join(file, 'index.html');
    const target = directFile || (existsSync(directoryIndex) && statSync(directoryIndex).isFile() ? directoryIndex : null);
    if (!target || !target.startsWith(publicRoot + sep)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found'); return;
    }

    res.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    if (req.method === 'HEAD') { res.end(); return; }
    createReadStream(target).pipe(res);
}).listen(port, '0.0.0.0', () => console.log(`Portfolio ready on http://0.0.0.0:${port}`));
