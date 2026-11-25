#!/usr/bin/env node
// Motion lab server. No dependencies.
//
// It serves THIS project at / and mounts the skill's asset directory at /assets/.
// The mount is why the lab lives outside the skill but still audits the real files:
// no relative-path gymnastics, no duplicated fixtures.
//
// Resolution order for the assets directory:
//   1. --assets <path>
//   2. EWM_ASSETS environment variable
//   3. lab.config.json  { "assets": "<path>" }
//   4. ../skills/extravagant-web-motion/assets inside this repo
//   5. ~/.agents/skills/extravagant-web-motion/assets (standalone install)
import { createServer } from 'node:http';
import { readFile, stat, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
// Inside this repo the assets sit next door; a standalone install falls back to the profile path.
const SIBLING_ASSETS = resolve(HERE, '..', 'skills', 'extravagant-web-motion', 'assets');
const PROFILE_ASSETS = join(homedir(), '.agents/skills/extravagant-web-motion/assets');
const DEFAULT_ASSETS = existsSync(SIBLING_ASSETS) ? SIBLING_ASSETS : PROFILE_ASSETS;

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function configuredAssets() {
  const configPath = join(HERE, 'lab.config.json');
  if (existsSync(configPath)) {
    try {
      const cfg = JSON.parse(readFileSync(configPath, 'utf8'));
      if (cfg.assets) return resolve(HERE, cfg.assets);
    } catch (e) {
      console.warn('lab.config.json is not valid JSON, ignoring it:', e.message);
    }
  }
  return null;
}

const PORT = Number(arg('port', process.env.EWM_PORT || 4815));
const ASSETS = resolve(arg('assets', process.env.EWM_ASSETS) || configuredAssets() || DEFAULT_ASSETS);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function send(res, code, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' }).end(body);
}

async function serveFile(res, filePath, root) {
  const target = resolve(join(root, normalize(filePath)));
  if (!target.startsWith(root)) return send(res, 403, 'forbidden');
  try {
    const info = await stat(target);
    if (!info.isFile()) throw new Error('not a file');
    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': MIME[extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': body.length,
    }).end(body);
  } catch {
    send(res, 404, 'not found: ' + filePath);
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  if (pathname.startsWith('/assets/')) {
    return serveFile(res, pathname.slice('/assets/'.length), ASSETS);
  }
  if (pathname === '/' || pathname === '') {
    res.writeHead(302, { Location: '/index.html' }).end();
    return;
  }
  return serveFile(res, pathname.slice(1), HERE);
});

const assetsOk = existsSync(ASSETS);
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`motion lab  →  http://127.0.0.1:${PORT}/index.html`);
  console.log(`project     →  ${HERE}`);
  if (!assetsOk) {
    console.error(`ASSETS MISSING → ${ASSETS}`);
    console.error('Pass --assets <dir>, set EWM_ASSETS, or create lab.config.json.');
    return;
  }
  const files = (await readdir(ASSETS)).filter((f) => f.endsWith('.html'));
  console.log(`assets      →  ${ASSETS}`);
  console.log(`found       →  ${files.length} demo files: ${files.join(', ')}`);
  const missing = [1, 2, 3, 4, 5, 6, 7].filter(
    (n) => !files.some((f) => f.startsWith('0' + n + '-'))
  );
  if (missing.length) console.warn(`warning     →  no asset found for pattern ${missing.join(', ')}`);
});
