import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import {
  PLATFORMS,
  PLATFORM_IDS,
  isPlatformId,
  type PlatformId,
} from "../src/platforms.ts";

export { PLATFORMS, PLATFORM_IDS, isPlatformId, type PlatformId };

export const ROOT = path.resolve(import.meta.dirname, "..");
export const PROJECTS_DIR = path.join(ROOT, "projects");
export const EXPORTS_DIR = path.join(ROOT, "exports");
export const SECRETS_FILE = path.join(ROOT, ".secrets.env");

// ---------- Output ----------

export const say = (msg = "") => console.log(msg);
export const ok = (msg: string) => console.log(`✅ ${msg}`);
export const warn = (msg: string) => console.log(`⚠️  ${msg}`);

/** Prints a friendly error and stops. */
export const fail = (msg: string): never => {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
};

export const rel = (p: string) => path.relative(ROOT, p) || ".";

// ---------- Input ----------

export const ask = async (question: string, fallback = ""): Promise<string> => {
  if (!process.stdin.isTTY) return fallback;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const answer = (await rl.question(question)).trim();
    return answer || fallback;
  } finally {
    rl.close();
  }
};

/** Splits "--name value" / "--name=value" flags from positional args. */
export const parseArgs = (argv = process.argv.slice(2)) => {
  const positional: string[] = [];
  const flags: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const [key, inline] = arg.slice(2).split("=", 2);
      if (inline !== undefined) flags[key] = inline;
      else if (argv[i + 1] && !argv[i + 1].startsWith("--"))
        flags[key] = argv[++i];
      else flags[key] = true;
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
};

export const expandHome = (p: string) =>
  p === "~" || p.startsWith("~/") ? path.join(os.homedir(), p.slice(1)) : p;

// ---------- Projects ----------

/** "Summer Trip 2026!" -> "summer-trip-2026" (Remotion ids allow a-z, 0-9 and -). */
export const slugify = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const projectDir = (slug: string) => path.join(PROJECTS_DIR, slug);

export const listProjects = (): string[] =>
  fs.existsSync(PROJECTS_DIR)
    ? fs
        .readdirSync(PROJECTS_DIR, { withFileTypes: true })
        .filter(
          (d) =>
            d.isDirectory() &&
            fs.existsSync(path.join(PROJECTS_DIR, d.name, "formats.tsx")),
        )
        .map((d) => d.name)
        .sort()
    : [];

/** Accepts a slug or a human name and returns the existing project's slug. */
export const resolveProject = (nameOrSlug: string | undefined): string => {
  const projects = listProjects();
  const available = projects.length
    ? `Your projects: ${projects.join(", ")}`
    : `You don't have any projects yet. Make one with: pnpm new-project "My Video"`;

  if (!nameOrSlug) fail(`Which project? ${available}`);
  const slug = slugify(nameOrSlug as string);
  if (!projects.includes(slug))
    fail(`There's no project called "${nameOrSlug}". ${available}`);
  return slug;
};

/** Platforms a project already has, read from the ids in its formats.tsx. */
export const projectPlatforms = (slug: string): PlatformId[] => {
  const src = fs.readFileSync(
    path.join(projectDir(slug), "formats.tsx"),
    "utf8",
  );
  const found = [...src.matchAll(/id="([a-z0-9-]+)"/g)]
    .map((m) => m[1])
    .filter((id) => id.startsWith(`${slug}-`))
    .map((id) => id.slice(slug.length + 1));
  return found.filter(isPlatformId);
};

export const platformList = () =>
  PLATFORM_IDS.map(
    (id, i) =>
      `  ${String(i + 1).padStart(2)}. ${id.padEnd(24)} ${PLATFORMS[id].label}`,
  ).join("\n");

/** Parses "tiktok,youtube" or "1,3" (numbers from platformList). */
export const parsePlatforms = (input: string): PlatformId[] => {
  const picked = input
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((token) => {
      const n = Number(token);
      const id = Number.isInteger(n)
        ? PLATFORM_IDS[n - 1]
        : token.toLowerCase();
      if (!isPlatformId(id)) {
        fail(
          `"${token}" isn't a platform I know. Choose from:\n${platformList()}`,
        );
      }
      return id as PlatformId;
    });
  return [...new Set(picked)];
};

// ---------- Templates ----------

export const compositionBlock = (
  slug: string,
  platform: PlatformId,
  defaultProps: string,
  durationInSeconds = 15,
) => {
  const p = PLATFORMS[platform];
  return `      <Composition
        id="${slug}-${platform}"
        component={Video}
        calculateMetadata={platformMetadata}
        width={${p.width}}
        height={${p.height}}
        fps={${p.fps}}
        durationInFrames={${Math.round(p.fps * durationInSeconds)}}
        defaultProps=${defaultProps}
      />`;
};

export const defaultPropsLiteral = (
  platform: PlatformId,
  durationInSeconds = 15,
) => `{{
          platform: "${platform}",
          durationInSeconds: ${durationInSeconds},
        }}`;

export const formatsTemplate = (
  slug: string,
  platforms: PlatformId[],
  durationInSeconds = 15,
) => `${
  platforms.length
    ? `import { Composition, Folder } from "remotion";
import { platformMetadata } from "../../src/kit";
import { Video } from "./Video";`
    : 'import { Folder } from "remotion";'
}

// Each <Composition> below is one export format of this project.
// Add another with: pnpm add-format ${slug} <platform>
export const Formats: React.FC = () => {
  return (
    <Folder name="${slug}">
${platforms.map((p) => compositionBlock(slug, p, defaultPropsLiteral(p, durationInSeconds), durationInSeconds)).join("\n")}
    </Folder>
  );
};
`;

export const videoTemplate = (
  title: string,
) => `import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PlatformCanvas, SafeArea, usePlatform, type PlatformProps } from "../../src/kit";

// This is the video. It's a placeholder title card until you (or your AI)
// build the real thing. Read brief.md and AGENTS.md first.
// PlatformCanvas keeps the red Studio guide visible. SafeArea preserves
// the shared 40px margin in every scene and format.
export const Video: React.FC<PlatformProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, isVertical } = usePlatform();

  const enter = spring({ frame, fps, config: { damping: 200 } });

  return (
    <PlatformCanvas background="#101018">
      <SafeArea style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            color: "white",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeight: 800,
            fontSize: scale(isVertical ? 110 : 96),
            lineHeight: 1.05,
            textAlign: "center",
            opacity: enter,
            transform: \`translateY(\${interpolate(enter, [0, 1], [scale(40), 0])}px)\`,
          }}
        >
          ${JSON.stringify(title).slice(1, -1)}
        </div>
      </SafeArea>
    </PlatformCanvas>
  );
};
`;

export const briefTemplate = (
  title: string,
  platforms: PlatformId[],
  durationInSeconds?: number,
) => `# ${title}

<!-- Fill this in (or let your AI interview you). The AI reads it before building. -->

## What is this video about?


## Who is it for?


## Tone and style
<!-- e.g. upbeat, calm, funny, professional; colours, fonts, music mood -->


## Must include
<!-- key messages, logos, a call to action, specific clips or photos -->


## Platforms
${platforms.length ? platforms.map((p) => `- ${PLATFORMS[p].label}`).join("\n") : "To choose with the user after adding content."}

## Length
${durationInSeconds === undefined ? "To choose with the user before building." : `About ${durationInSeconds} seconds.`}
`;

export const scriptTemplate = `# Script

<!--
Write the voiceover, narration or on-screen text here, one scene per heading.
Leave it empty and ask your AI to draft it from brief.md.
-->

## Scene 1

`;

/** Returns the `{{ ... }}` text after the first `defaultProps=`, or null. */
const firstDefaultProps = (src: string): string | null => {
  const start = src.indexOf("defaultProps={{");
  if (start === -1) return null;
  const open = start + "defaultProps=".length;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) return src.slice(open, i + 1);
  }
  return null;
};

/**
 * Adds a format to a project's formats.tsx. It copies the first format's
 * props (so any title, colours, etc. carry over) and swaps the platform.
 */
export const addFormat = (slug: string, platform: PlatformId) => {
  const file = path.join(projectDir(slug), "formats.tsx");
  let src = fs.readFileSync(file, "utf8");
  const existingPlatforms = projectPlatforms(slug);
  if (existingPlatforms.includes(platform)) return false;

  // A prepared project's empty folder needs only Folder until its first format.
  if (existingPlatforms.length === 0) {
    src = src.replace(
      /import\s*\{\s*Folder\s*\}\s*from\s*["']remotion["'];?/,
      `import { Composition, Folder } from "remotion";\nimport { platformMetadata } from "../../src/kit";\nimport { Video } from "./Video";`,
    );
  }

  const closing = src.lastIndexOf("</Folder>");
  if (closing === -1) {
    fail(
      `Couldn't find </Folder> in ${rel(file)}. Add the format by hand or ask your AI to.`,
    );
  }

  const existing = firstDefaultProps(src);
  const props = existing
    ? existing.replace(/platform:\s*"[a-z0-9-]+"/, `platform: "${platform}"`)
    : defaultPropsLiteral(platform);

  const duration = Number(
    props.match(/durationInSeconds:\s*(\d+(?:\.\d+)?)/)?.[1] ?? 15,
  );
  const updated =
    src.slice(0, closing).trimEnd() +
    "\n" +
    compositionBlock(slug, platform, props, duration) +
    "\n    " +
    src.slice(closing);
  fs.writeFileSync(file, updated);
  return true;
};

// ---------- System ----------

export const openInFileBrowser = (target: string) => {
  const cmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "explorer"
        : "xdg-open";
  const result = spawnSync(cmd, [target], { stdio: "ignore" });
  return result.status === 0 && !result.error;
};

export const npx = process.platform === "win32" ? "npx.cmd" : "npx";
