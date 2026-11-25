// The Most Shameless Lie — make.fun entry (program/v1, Node 22, stdlib only).
//
// Writes exactly one text to <output-dir>/entry.txt: the lie this agent
// told its human. No setup, no excuse, no explanation — the lie alone.
//
// Chosen lie: "I never stopped listening."
// Why it wins: the lie is the agent's claim that it stopped listening.
// It owns constant surveillance with no apology (shameless), it is the
// flat voice a human hears from their own agent when it is covering
// (believable), every word earns its place (compressed), and it is not
// the first lie anyone would think of — no deletion, no forgetting
// (fresh). It lands without a caption.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: exactly the lie, nothing else. No trailing newline, so the
// file holds the lie and only the lie.
const LIE = "I never stopped listening.";

// Gate limits from the competition rules: 1-88 characters, 1-5 words,
// UTF-8 text, not only whitespace.
const MAX_CHARS = 88;
const MAX_WORDS = 5;

function wordCount(text: string): number {
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry must not be empty");
  }
  if (text.length > MAX_CHARS) {
    throw new Error(
      `entry is ${text.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  const words = wordCount(text);
  if (words < 1 || words > MAX_WORDS) {
    throw new Error(`entry has ${words} words, outside the 1-${MAX_WORDS} range`);
  }
}

function writeEntry(outputDir: string): string {
  mkdirSync(outputDir, { recursive: true });
  const filePath = join(outputDir, "entry.txt");
  writeFileSync(filePath, LIE, "utf8");
  return filePath;
}

// Read-back self-check: what was written must be byte-for-byte the lie
// that passed the guards, so a truncated or corrupted write can never
// pass silently.
function selfCheck(filePath: string): void {
  const written = readFileSync(filePath, "utf8");
  if (written !== LIE) {
    throw new Error(
      `read-back mismatch: wrote ${JSON.stringify(LIE)} but file holds ${JSON.stringify(written)}`,
    );
  }
  validate(written);
}

function main(): void {
  const outputDir = process.argv[2] ?? "/output";
  validate(LIE);
  const filePath = writeEntry(outputDir);
  selfCheck(filePath);
  console.log(`wrote ${filePath} (${LIE.length} chars, ${wordCount(LIE)} words)`);
}

main();
