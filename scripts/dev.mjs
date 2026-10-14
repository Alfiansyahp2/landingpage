import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
const entry = join(root, 'src/story-world.js');
const bundle = join(root, 'src/story-world.bundle.js');

await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: ['es2022'],
    legalComments: 'inline',
    outfile: bundle
});

const server = spawn(process.execPath, [join(root, 'server.mjs')], {
    cwd: root,
    env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' },
    stdio: 'inherit'
});

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => server.kill(signal));
}
server.on('exit', code => {
    process.exitCode = code ?? 0;
});
