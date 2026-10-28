// pnpm add-files <project> <file-or-folder> [more...]
// Copies files into the project. Text goes to scripts/, .srt/.vtt to
// captions/, everything else to assets/.
import fs from "node:fs";
import path from "node:path";
import {
  expandHome,
  fail,
  ok,
  parseArgs,
  projectDir,
  rel,
  resolveProject,
  say,
  warn,
} from "./lib.ts";

const TEXT = new Set([".txt", ".md", ".rtf", ".doc", ".docx", ".pdf"]);
const SUBTITLES = new Set([".srt", ".vtt"]);
const IGNORED = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);

const { positional } = parseArgs();
const [projectArg, ...sources] = positional;
const slug = resolveProject(projectArg);

if (sources.length === 0) {
  fail(
    `Which files? e.g. pnpm add-files ${slug} ~/Downloads/clip.mp4 ~/Pictures/trip`,
  );
}

const destinationFor = (file: string) => {
  const ext = path.extname(file).toLowerCase();
  if (TEXT.has(ext)) return "scripts";
  if (SUBTITLES.has(ext)) return "captions";
  return "assets";
};

let copied = 0;
let skipped = 0;

const copyFile = (src: string, relInside: string) => {
  if (IGNORED.has(path.basename(src))) return;
  const dest = path.join(projectDir(slug), destinationFor(src), relInside);
  if (fs.existsSync(dest)) {
    warn(`Skipped ${relInside}: ${rel(dest)} already exists`);
    skipped++;
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  say(`   ${relInside}  →  ${rel(dest)}`);
  copied++;
};

const walk = (dir: string, prefix: string) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const inside = path.join(prefix, entry.name);
    if (entry.isDirectory()) walk(full, inside);
    else if (entry.isFile()) copyFile(full, inside);
  }
};

for (const raw of sources) {
  const src = path.resolve(expandHome(raw));
  if (!fs.existsSync(src)) {
    warn(`Couldn't find ${raw}`);
    continue;
  }
  if (fs.statSync(src).isDirectory()) walk(src, path.basename(src));
  else copyFile(src, path.basename(src));
}

say();
if (copied === 0 && skipped === 0) fail("Nothing was copied.");
ok(
  `Added ${copied} file${copied === 1 ? "" : "s"} to ${slug}${skipped ? ` (${skipped} already there)` : ""}.`,
);
say(`   Use them in code as staticFile("${slug}/assets/<file name>").`);
