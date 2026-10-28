// pnpm export <project> <platform|all> [--open]
// Renders to exports/<project>/<project>--<platform>--<date>-<time>.mp4
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  addFormat,
  ask,
  EXPORTS_DIR,
  fail,
  npx,
  ok,
  openInFileBrowser,
  parseArgs,
  parsePlatforms,
  projectPlatforms,
  rel,
  resolveProject,
  ROOT,
  say,
  type PlatformId,
} from "./lib.ts";

const { positional, flags } = parseArgs();
const slug = resolveProject(positional[0]);
const existing = projectPlatforms(slug);

let input = positional.slice(1).join(",");
if (!input) {
  say(`\n${slug} has these formats: ${existing.join(", ")}`);
  input = await ask(
    `Which one should be exported? (a name, several separated by commas, or "all") [all]: `,
    "all",
  );
}

let platforms: PlatformId[];
if (input === "all") {
  platforms = existing;
} else {
  platforms = parsePlatforms(input);
  for (const platform of platforms) {
    if (addFormat(slug, platform))
      ok(`${slug} didn't have a ${platform} format yet, so I added it.`);
  }
}
if (platforms.length === 0)
  fail(`${slug} has no formats. Add one with: pnpm add-format ${slug} tiktok`);

const now = new Date();
const pad = (n: number) => String(n).padStart(2, "0");
const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;

const outDir = path.join(EXPORTS_DIR, slug);
fs.mkdirSync(outDir, { recursive: true });

const done: string[] = [];
for (const [i, platform] of platforms.entries()) {
  const out = path.join(outDir, `${slug}--${platform}--${stamp}.mp4`);
  say(`\n🎬 Exporting ${platform} (${i + 1} of ${platforms.length})...\n`);
  const result = spawnSync(
    npx,
    ["remotion", "render", `${slug}-${platform}`, out],
    {
      cwd: ROOT,
      stdio: "inherit",
    },
  );
  if (result.status !== 0) {
    fail(
      `Exporting ${platform} failed (see the messages above).${done.length ? ` These finished: ${done.join(", ")}` : ""}`,
    );
  }
  done.push(rel(out));
}

say();
ok(`Done! Your video${done.length > 1 ? "s are" : " is"} ready:`);
for (const file of done) say(`   ${file}`);
say();

if (flags.open) openInFileBrowser(outDir);
else say(`Open the folder with: pnpm open ${slug} exports`);
