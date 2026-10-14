import { cp, mkdir, rm, copyFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = join(root, 'dist');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await copyFile(join(root, 'index.html'), join(out, 'index.html'));

for (const name of ['src', 'public']) {
    const source = join(root, name);
    const files = await readdir(source).catch(() => []);
    if (files.length) {
        await cp(source, join(out, name === 'src' ? 'src' : ''), { recursive: true });
    }
}

await build({
    entryPoints: [join(root, 'src/story-world.js')],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: ['es2022'],
    legalComments: 'inline',
    outfile: join(out, 'src/story-world.bundle.js')
});

console.log('Static site and local 3D story bundle built in dist/');
