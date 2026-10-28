// pnpm open <project> [assets|scripts|captions|exports]
import fs from "node:fs";
import path from "node:path";
import {
  EXPORTS_DIR,
  fail,
  ok,
  openInFileBrowser,
  parseArgs,
  projectDir,
  rel,
  resolveProject,
} from "./lib.ts";

const PLACES = ["assets", "scripts", "captions", "exports"];

const { positional } = parseArgs();
const slug = resolveProject(positional[0]);
const where = positional[1] ?? "assets";
if (!PLACES.includes(where)) fail(`Open one of: ${PLACES.join(", ")}`);

const target =
  where === "exports"
    ? path.join(EXPORTS_DIR, slug)
    : path.join(projectDir(slug), where);

fs.mkdirSync(target, { recursive: true });
openInFileBrowser(target);
ok(`Opened ${rel(target)}/. Drag your files in there.`);
