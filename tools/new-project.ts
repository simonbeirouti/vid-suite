// pnpm new-project "Summer Trip" [--prepare] [--platforms tiktok,youtube] [--duration 30] [--open]
import fs from "node:fs";
import path from "node:path";
import {
  ask,
  briefTemplate,
  fail,
  formatsTemplate,
  ok,
  openInFileBrowser,
  parseArgs,
  parsePlatforms,
  platformList,
  projectDir,
  rel,
  say,
  scriptTemplate,
  slugify,
  videoTemplate,
  PLATFORMS,
  warn,
} from "./lib.ts";

const { positional, flags } = parseArgs();

let title = positional.join(" ").trim();
if (!title) title = await ask("What would you like to call this video? ");
if (!title)
  fail(`Give the project a name, e.g. pnpm new-project "Summer Trip"`);

const slug = slugify(title);
if (!slug) fail(`"${title}" needs at least one letter or number in it.`);

const dir = projectDir(slug);
if (fs.existsSync(dir)) {
  fail(
    `A project called "${slug}" already exists at ${rel(dir)}. Pick another name, or keep working in that one.`,
  );
}

const preparing = flags.prepare === true;
if (flags.prepare !== undefined && !preparing)
  fail("Use --prepare on its own to create the content folder first.");

const durationInput = flags.duration;
const duration =
  durationInput === undefined ? undefined : Number(durationInput);
if (
  durationInput !== undefined &&
  (typeof durationInput !== "string" ||
    !Number.isFinite(duration) ||
    duration! <= 0)
)
  fail("Give --duration a positive number of seconds, e.g. --duration 30.");

let platformInput = typeof flags.platforms === "string" ? flags.platforms : "";
if (flags.platforms !== undefined && !platformInput)
  fail(
    "List the platforms after --platforms, e.g. --platforms tiktok,youtube.",
  );
if (!platformInput && !preparing) {
  say("\nWhich platforms is this for? You can add more later.\n");
  say(platformList());
  platformInput = await ask(
    "\nType numbers or names, separated by commas [1]: ",
    "1",
  );
}
const platforms = parsePlatforms(platformInput);
if (platforms.length === 0 && !preparing) fail("Pick at least one platform.");
for (const platform of platforms) {
  const max = PLATFORMS[platform].maxDurationSec;
  if (duration !== undefined && max !== null && duration > max)
    fail(
      `${PLATFORMS[platform].label} supports up to ${max} seconds in this kit.`,
    );
}

for (const sub of ["assets", "scripts", "captions"]) {
  fs.mkdirSync(path.join(dir, sub), { recursive: true });
}
fs.writeFileSync(
  path.join(dir, "brief.md"),
  briefTemplate(title, platforms, duration),
);
fs.writeFileSync(path.join(dir, "scripts", "script.md"), scriptTemplate);
fs.writeFileSync(
  path.join(dir, "formats.tsx"),
  formatsTemplate(slug, platforms, duration ?? 15),
);
fs.writeFileSync(path.join(dir, "Video.tsx"), videoTemplate(title));

say();
ok(`Created project "${title}" in ${rel(dir)}/`);
say(`
   assets/     ← put your videos, photos, music and logos here
   scripts/    ← voiceover / on-screen text
   captions/   ← transcriptions end up here
   brief.md    ← describe what the video should be
   Video.tsx   ← the video itself
   formats.tsx ← ${platforms.length ? platforms.join(", ") : "platforms to choose after adding content"}

Add your videos, photos, audio and logos here:
   ${path.join(dir, "assets")}

Scripts and notes go in:
   ${path.join(dir, "scripts")}
`);

if (flags.open) {
  if (openInFileBrowser(path.join(dir, "assets")))
    say(
      "The content folder is open in your file browser. Add your files, then tell your AI you're ready.",
    );
  else
    warn(
      "The folder was created, but your file browser could not open it. Open the assets path shown above to add your files.",
    );
} else {
  say(`Open the content folder with: pnpm open ${slug} assets`);
}

if (!platforms.length)
  say(
    `Next, choose platforms with your AI. Add them with: pnpm add-format ${slug} <platform>`,
  );
else
  say(
    "Next, confirm the length and brief with your AI, then preview in Studio.",
  );
