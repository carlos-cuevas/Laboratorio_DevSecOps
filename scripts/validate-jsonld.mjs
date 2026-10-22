#!/usr/bin/env node

// Validates every JSON-LD block in the pre-rendered build output.
// Usage: node scripts/validate-jsonld.mjs [dir]   (default: .next/server/app)

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT_DIR = process.argv[2] ?? '.next/server/app';
const SCRIPT_RE =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;

let totalScripts = 0;
let totalFiles = 0;
const errors = [];

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && p.endsWith('.html')) yield p;
  }
}

for await (const file of walk(OUT_DIR)) {
  totalFiles += 1;
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(SCRIPT_RE)) {
    totalScripts += 1;
    const raw = match[1].trim();
    try {
      const json = JSON.parse(raw);
      const nodes = Array.isArray(json) ? json : [json];
      for (const n of nodes) {
        if (!n['@context']) errors.push({ file, msg: 'missing @context' });
        if (!n['@type'] && !n['@graph'])
          errors.push({ file, msg: 'missing @type / @graph' });
      }
    } catch (err) {
      errors.push({ file, msg: `invalid JSON: ${err.message}` });
    }
  }
}

console.log(`Scanned ${totalFiles} HTML files, found ${totalScripts} JSON-LD blocks.`);

if (errors.length > 0) {
  console.error(`\n${errors.length} JSON-LD problem(s):`);
  for (const e of errors) console.error(`  ${e.file}: ${e.msg}`);
  process.exit(1);
}

console.log('All JSON-LD blocks parsed cleanly.');
