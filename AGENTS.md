# Instructions for AI agents (Claude Code, Codex, etc.)

This repo is a kit for making social videos with [Remotion](https://www.remotion.dev).
The person you're working with is probably **not a developer**. They describe
the video and you build it.

## Install and start the kit

When the user asks you to install or set up this kit, or the project commands
cannot run because dependencies are missing, do the setup yourself. Run commands
from the main `vid-suite` folder containing `package.json` and `remotion.config.ts`.
Use this existing project; do not scaffold another Remotion app.

1. **Check the tools.** Run `git --version`, `node --version` and `pnpm --version`.
   The recommended setup is Node.js 24 and pnpm 12; supported Node.js ranges
   are in `package.json`. Reuse working installations. If a prerequisite is
   missing, follow [the install guide](docs/01-install.md) and perform the steps
   your environment permits. Explain any system installer, sign-in or access
   step that needs the user. Never ask them to paste credentials into chat.
2. **Install dependencies.** On a fresh checkout, run
   `pnpm install --frozen-lockfile`. Repeat when the lockfile changes or installed
   dependencies are missing. Keep the locked versions, the `patches/` directory
   and the build settings in `pnpm-workspace.yaml`; the Studio spacing patch is
   part of the kit. Do not upgrade packages or rewrite the lockfile as a setup
   shortcut. If installation fails, identify and fix the cause before continuing.
3. **Check the installation.** Run `pnpm projects` and `pnpm lint`. Report any
   failure plainly and resolve it. Do not create a sample user project just to
   check installation; `projects/example/` is already provided.
4. **Open the preview when checking setup or building a video.** Run `pnpm dev`
   and keep it running. Reuse an existing Studio for this checkout. Open the
   exact URL it prints and verify an example composition loads. A project created
   with `--prepare` gets its own preview after its first format is added.
5. **Continue with the workflow below.** For a new video, ask for its name if
   missing, create and open its content folder, gather the media and brief, then
   build, review and export when requested. If the kit is already working, skip
   installation and continue the user's project without repeating setup checks.

## How to talk to the user

- Use plain language. Don't show code, file diffs or terminal output unless they ask.
  Say what you did and what they should look at ("Open Studio and click
  *summer-trip › summer-trip-tiktok*").
- When the user asks to make a new video without giving a project name, first
  ask **"What would you like to call this video?"** Do not invent a name or ask
  again if one was already supplied. Create and open its content folder as soon
  as the name is known; platforms and length can be chosen afterward.
- Before building the video itself, confirm **which project**, **which platform(s)**,
  and **roughly how long**. If the brief is thin, ask a few short questions
  (what's it about, who's it for, tone, must-include items) and write the
  answers into `brief.md`.
- When something fails, explain it simply and say what you'll try next.
- Run the helper commands yourself. Don't ask the user to type commands,
  except where noted under API keys below.

## How a project is laid out

```
projects/<project>/        one folder per video project (folder name = project id)
  brief.md                 what the video is about. Read this first.
  scripts/                 voiceover / narration / on-screen text
  assets/                  the user's images, video, audio, logos
  captions/                transcriptions (Caption[] JSON)
  Video.tsx                the video. This is what you build.
  formats.tsx              which platforms the project exports to
exports/<project>/         finished videos. Written by `pnpm export` only.
src/platforms.ts           platform presets and safe zones (shared, don't edit casually)
src/kit/                   shared helpers: PlatformCanvas, SafeArea, usePlatform, BasicCaptions
projects/example/          a working reference video. Copy its patterns.
```

`projects/` is Remotion's public folder, so files are referenced as
`staticFile("<project>/assets/<file>")`.

## Helper commands

| Command | Use it to |
|---|---|
| `pnpm projects` | see what projects exist |
| `pnpm new-project "Name" --platforms tiktok,youtube` | create a project. Always use this instead of making folders by hand. |
| `pnpm new-project "Name" --prepare --open` | create the named project and open its assets folder before platforms are chosen. |
| `pnpm add-files <project> <path> [more paths]` | copy the user's files or folders into the project (e.g. from ~/Downloads) |
| `pnpm open <project> [assets\|scripts\|captions\|exports]` | open a folder in Finder so the user can drag files in |
| `pnpm add-format <project> <platform>` | add another platform to a project |
| `pnpm transcribe <project> <file> [--language xx]` | speech to captions, saved to `captions/<file>.json` |
| `pnpm export <project> <platform\|all>` | render finished MP4s to `exports/<project>/` |
| `pnpm dev` | open Remotion Studio (the preview) |

Platform ids: `youtube`, `youtube-shorts`, `tiktok`, `instagram-reels`,
`instagram-story`, `instagram-feed-portrait`, `instagram-feed-square`,
`linkedin-landscape`, `linkedin-square`, `x-landscape`.
Sizes, length limits and safe zones are in `src/platforms.ts`.

## Workflow

1. **Ask for the name, then create the content folder.** Run `pnpm projects`.
   - For a new video with no name, ask "What would you like to call this video?"
     and wait for the name. For an existing project, continue in its folder.
   - Once named, run `pnpm new-project "Name" --prepare --open` immediately.
     This creates the project and opens `projects/<project>/assets/` in the
     user's file browser. No platform is assumed, and no format is registered yet.
   - If platforms are already supplied, use
     `pnpm new-project "Name" --platforms tiktok,youtube --open` instead.
     Include `--duration 30` when the user has already supplied the length.
   - Tell the user the absolute assets-folder path and say they can drag or copy
     videos, photos, audio and logos into it. Scripts and notes go in `scripts/`.
     Ask them to say when their files are ready. These are local files, not a
     cloud upload. If opening the folder fails, still give its exact path.
   - Never overwrite a matching project. Ask whether to continue it or choose a
     different name when the user has requested a separate video.
2. **Gather material.** Read `brief.md`, everything in `scripts/`, and list `assets/`.
   - If the user mentions a file that isn't in `assets/`, ask where it is and
     import it with `pnpm add-files`. Or run `pnpm open <project>` so they can drag it in.
   - Never reference files outside the project folder in the video.
3. **Complete the brief and formats.** Ask for platforms, approximate length,
   topic, audience, tone and must-include items that have not already been supplied.
   Save the answers in `brief.md`. Use `pnpm add-format <project> <platform>` for
   the chosen platforms; set each format's `durationInSeconds` to the agreed
   length. Write or refine the script in `scripts/` and check it with the user.
4. **Open Studio** (`pnpm dev`) early and keep it running so the user sees changes live.
5. **Build `Video.tsx`** (rules below). Split it into scenes with named `<Sequence>`s.
6. **Review.** Ask the user to check each format in Studio. The red tinted
   areas mark the shared 40px creative safe margin on all four sides.
7. **Export when requested** with `pnpm export <project> <platform>` or `all`, and tell the user
   where the file is (`pnpm open <project> exports` opens the folder).

## Rules for building videos

- **Only edit files inside the current project folder.** Don't change `src/`,
  other projects or `projects/example/` unless the user explicitly asks.
- The root of `Video` must be `<PlatformCanvas>`. That's what shows the safe zone guide in Studio.
- **Every video, scene and platform must preserve the shared 40px safe area on
  all four sides** (scaled with the video's short edge). The red Studio guide
  stays visible at all times. Use the shared helpers and keep this rule in new
  projects and added formats. The guide itself stays out of exported MP4s.
- Put all text, faces, logos and captions inside `<SafeArea>`. Backgrounds
  and full-bleed footage can fill the whole frame.
- **Never hardcode the frame size.** Use `usePlatform()`:
  - `scale(px)` for every size (designed for a 1080px short edge)
  - `isVertical` / `isSquare` / `isLandscape` to change layout
  - `safe` for the safe zone insets in px
  - `preset` for the platform's label, `maxDurationSec` and notes

  One `Video.tsx` must look right in every format the project has.
- Set the length with `durationInSeconds` in `formats.tsx` (each format can
  differ). Keep it within the platform's `maxDurationSec`.
- Don't edit `width`, `height` or `fps` in `formats.tsx`. They come from the preset automatically.
- Text sizes (1080-based): headlines at least 84, supporting text at least 44.
  Keep text short. People watch on phones, often with the sound off.
- Media: use `<Img>` from `remotion` for images, and `<Video>` / `<Audio>` from
  `@remotion/media` for video and audio, with `staticFile("<project>/assets/...")`.
- Captions: transcribe with `pnpm transcribe`, then use `<BasicCaptions>` from
  `src/kit` with the JSON **copied inline** into its `captions` prop (so
  Studio's caption editor can change it). Place it inside the safe area, as
  `projects/example/Video.tsx` does. Keep each clip's video and captions in the same `<Sequence>`.
- Don't read API keys or `process.env` in video code.
- Use `pnpm lint` to check for errors after big changes.

For animation, transitions, audio, fonts, captions and anything else
Remotion-specific, use the Remotion skills installed in `.claude/skills/` and
`.agents/skills/` (start with `remotion-best-practices`). Where they conflict
with this file about project layout, this file wins. For example, use
`projects/<project>/assets` rather than `public/`.

## Transcription and API keys

- `pnpm transcribe` works without any key, using a free Whisper model that runs
  on the computer (the first run downloads it, a few hundred MB).
- If the user wants faster or online transcription, they can save an OpenAI key.
  **Never ask the user to paste a key into the chat, and never open or print
  `.secrets.env`.** Instead, either:
  - run `pnpm setup-keys` yourself. Without a terminal it opens `.secrets.env`
    in a text editor and the user pastes the key there. Then run
    `pnpm setup-keys --check` to confirm it works, or
  - ask them to run `pnpm setup-keys` in their own Terminal window, where it
    asks for the key with the typing hidden.

  The key is saved to `.secrets.env`, which is git-ignored and read only by
  the helper commands (not by Remotion or the video code).
- For non-English speech, pass `--language` (e.g. `--language es`).
