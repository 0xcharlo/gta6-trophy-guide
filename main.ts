// Leonida Trophy Atlas — the entry program (Node 22, standard library only).
//
// The guide itself is plain static files in app/ (index.html, modules, CSS and the
// trophy data in data/trophies.json): a desktop browser opens it and it works with
// the network off. This program hands the guide in: it copies app/ and
// screenshots/ into the output folder and writes dossier.json there, the summary
// the judge reads (the screenshots, the first load's files and bytes, and the
// source), using the vendored make.fun library. vendor/makefun-frontend.ts is the
// kit's copy and must stay untouched: the scorer rebuilds the dossier with its
// own copy and the two must match byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice into two folders and diff them: both runs must write the same bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the folder this file lives in; the output folder is
// /output inside the grader, or MAKEFUN_OUTPUT_DIR when set (local runs).
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly, before copying anything, if the guide itself is missing: a
// silent empty output would pass no gate and waste a grading run.
if (!existsSync(join(repoRoot, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing: the guide was not built');
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's own limits (see the kit's reference/gate.json):
// at most 4 screenshots, each at most 256 KiB; app/ at most 993 files and
// directories and 48 MiB in all; the dossier text at most 160 KiB. An entry past
// any of those is refused by the scorer, so refusing here first is the honest
// failure: buildDossier throws, and the program exits with an error.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
