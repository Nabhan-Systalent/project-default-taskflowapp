// Resilient transpile-only build for the generated app (SYS-265).
// swc mirrors src/ -> dist/ without type-checking (with decorator metadata for
// NestJS DI). A file that fails to parse is skipped so one malformed generated
// module cannot fail the build; run `npm run typecheck` for type errors.
import { transformFileSync } from '@swc/core';
import { readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const SRC = 'src';
const OUT = 'dist';

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(p) && !/\.(test|spec)\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}

const files = walk(SRC);
let compiled = 0;
let skipped = 0;

for (const file of files) {
  const isTsx = file.endsWith('.tsx');
  try {
    const { code } = transformFileSync(file, {
      jsc: {
        parser: { syntax: 'typescript', tsx: isTsx, decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
        target: 'es2021',
        keepClassNames: true,
      },
      module: { type: 'commonjs' },
      sourceMaps: false,
    });
    const outPath = join(OUT, relative(SRC, file)).replace(/\.tsx?$/, '.js');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, code);
    compiled++;
  } catch (err) {
    console.warn(`[build] skipped ${file}: ${String(err.message ?? err).split('\n')[0]}`);
    skipped++;
  }
}

console.log(`[build] compiled ${compiled} file(s), skipped ${skipped}`);
