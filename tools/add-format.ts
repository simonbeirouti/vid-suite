// pnpm add-format <project> <platform>[,<platform>...]
import {
  addFormat,
  ask,
  ok,
  parseArgs,
  parsePlatforms,
  platformList,
  projectPlatforms,
  resolveProject,
  say,
} from "./lib.ts";

const { positional } = parseArgs();
const slug = resolveProject(positional[0]);

let input = positional.slice(1).join(",");
if (!input) {
  say(`\n${slug} currently exports: ${projectPlatforms(slug).join(", ")}\n`);
  say(platformList());
  input = await ask("\nWhich platforms should be added? ");
}

for (const platform of parsePlatforms(input)) {
  if (addFormat(slug, platform))
    ok(
      `Added ${platform} to ${slug}. It's now in Studio as ${slug} › ${slug}-${platform}.`,
    );
  else say(`   ${slug} already has ${platform}.`);
}
