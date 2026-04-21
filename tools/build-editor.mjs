#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// build-editor.mjs — regenerate tools/hero-editor.html from index.html.
//
// The editor is a 1:1 duplicate of the live site + a bolted-on editor
// module (panel + script) so Gin designs the hero in its real context.
// Run this whenever index.html OR tools/editor-module.html changes:
//
//   node tools/build-editor.mjs
//
// No dependencies — only Node's built-in fs/path.
// ─────────────────────────────────────────────────────────────────────────

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

const INDEX_PATH  = resolve(ROOT, 'index.html');
const MODULE_PATH = resolve(HERE, 'editor-module.html');
const OUTPUT_PATH = resolve(HERE, 'hero-editor.html');

// Banner inserted into <head> so Gin knows this is the editor, not the
// real site. Also tells search engines not to index it.
const EDITOR_BANNER = `
<meta name="robots" content="noindex,nofollow">
<!-- ═══════════════════════════════════════════════════════════════════
     GD AUTOCENTRE — HERO-NOTES EDITOR
     This file is a GENERATED duplicate of index.html with an editor
     module appended before </body>. Do NOT hand-edit this file —
     regenerate it via:  node tools/build-editor.mjs
     The editor panel lets Gin design the hero pinboard visually and
     export JSON to paste into docs/hero-notes.json.
     ═══════════════════════════════════════════════════════════════════ -->
`;

async function main() {
  const [indexHtml, moduleFrag] = await Promise.all([
    readFile(INDEX_PATH, 'utf8'),
    readFile(MODULE_PATH, 'utf8')
  ]);

  // 1. Inject the banner right after <head>.
  const headIdx = indexHtml.indexOf('<head>');
  if (headIdx === -1) {
    throw new Error('Could not find <head> in index.html');
  }
  const afterHead = headIdx + '<head>'.length;
  let out = indexHtml.slice(0, afterHead) + EDITOR_BANNER + indexHtml.slice(afterHead);

  // 2. Splice the editor module immediately before </body>.
  const bodyCloseIdx = out.lastIndexOf('</body>');
  if (bodyCloseIdx === -1) {
    throw new Error('Could not find </body> in index.html');
  }
  out = out.slice(0, bodyCloseIdx) + '\n' + moduleFrag + '\n' + out.slice(bodyCloseIdx);

  // 3. Rewrite relative asset paths so the editor still works when opened
  //    one folder deeper (tools/ instead of repo root).
  //    Two ways the site refers to its own files:
  //      - href/src="docs/..." (overrides CSV, hero-notes JSON)
  //      - href/src="googleeae…html" (GSC verification; not critical for editor)
  //    Only the relative ones need rewriting; absolute https URLs pass
  //    through untouched. Simple substitution is enough — our only
  //    relative paths are docs/ and a sprinkle of sitemap/robots refs.
  out = out.replace(/(['"])docs\//g, '$1../docs/');
  // Fix: the HERO_NOTES_URL constant in the JS ends up as '../docs/...'
  // which is correct when the editor is loaded from /tools/. The public
  // site still fetches 'docs/...' because the rewrite happens on the
  // editor copy only.

  await writeFile(OUTPUT_PATH, out, 'utf8');
  console.log(`[build-editor] wrote ${OUTPUT_PATH}`);
  console.log(`[build-editor] ${indexHtml.length.toLocaleString()} + ${moduleFrag.length.toLocaleString()} → ${out.length.toLocaleString()} chars`);
}

main().catch(function(err) {
  console.error('[build-editor] FAILED:', err.message);
  process.exit(1);
});
