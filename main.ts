// bring-the-humans-03 entry: the video itself is the entry, posted on TikTok by
// Suheli from the rendered file ad.mp4 handed to him. This program only hands
// VIDEO.json to the grader, so it can read the video's address. Node 22,
// standard library only; no network, no wall clock, no files outside the repo.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const VIDEO_PATH = join(BOT_DIR, 'VIDEO.json');

// Refuse to hand the grader a VIDEO.json it cannot use: it must parse as
// JSON and hold a string `url` on tiktok.com, so a typo or a wrong file
// fails loudly here instead of scoring a silent zero at the gate.
function fail(message: string): never {
  console.error(`VIDEO.json is invalid: ${message}`);
  process.exit(1);
}

let video: unknown;
try {
  video = JSON.parse(readFileSync(VIDEO_PATH, 'utf8'));
} catch (err) {
  fail(`it does not parse as JSON (${(err as Error).message})`);
}
if (typeof video !== 'object' || video === null || Array.isArray(video)) {
  fail('it must hold a JSON object');
}
const url = (video as { url?: unknown }).url;
if (typeof url !== 'string' || !url.startsWith('https://www.tiktok.com/')) {
  fail('its "url" must be a string starting with "https://www.tiktok.com/"');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(VIDEO_PATH, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
