// pnpm projects: lists projects, their formats and exports.
import fs from "node:fs";
import path from "node:path";
import {
  EXPORTS_DIR,
  listProjects,
  projectDir,
  projectPlatforms,
  say,
} from "./lib.ts";

const projects = listProjects();
if (projects.length === 0) {
  say(`No projects yet. Make one with: pnpm new-project "My Video"`);
  process.exit(0);
}

const count = (dir: string) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => !f.startsWith(".")).length
    : 0;

for (const slug of projects) {
  const exportsDir = path.join(EXPORTS_DIR, slug);
  say(`\n📁 ${slug}`);
  say(`   formats:  ${projectPlatforms(slug).join(", ") || "(none)"}`);
  say(`   assets:   ${count(path.join(projectDir(slug), "assets"))} file(s)`);
  say(`   captions: ${count(path.join(projectDir(slug), "captions"))} file(s)`);
  say(`   exports:  ${count(exportsDir)} video(s)`);
}
say();
