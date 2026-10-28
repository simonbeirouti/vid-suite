# vid-suite

Make videos for TikTok, Instagram, YouTube, LinkedIn and X by describing
them to an AI (Claude Code or Codex). Projects, media and finished MP4s are
stored on your computer. Your AI tool may process the content you share with
it through its online service.

Built on [Remotion](https://www.remotion.dev), which turns code into video.
You won't need to write any code yourself.

## What you get

- **Projects**: each video gets its own named folder for your clips, photos,
  music, scripts and captions.
- **Platform formats**: pick TikTok, Reels, Shorts, YouTube, square or
  portrait feed posts, and more. One video adapts to every shape.
- **Safe zones**: a red preview guide marks an equal 40px creative margin
  on every side, with a modest gutter around the Studio canvas.
- **Transcription**: turns speech into captions, free on your computer or via
  OpenAI if you add a key.
- **Exports**: finished MP4s land in `exports/<project>/`, named by project,
  platform and date.

## Quick start

1. Follow [Install](docs/01-install.md) once to get the kit and its dependencies.
2. Open the **vid-suite folder** in Codex, or start `codex` or `claude` from that
   folder in Terminal. The kit includes instructions for both tools.
3. Say: **"I want to make a video."** The AI asks: **"What would you like to call
   this video?"** If you already gave a name, it uses that.
4. Give it a name, such as **Summer Trip**. It creates `projects/summer-trip/`
   and opens **assets/** in your file browser. Drag or copy your videos, images,
   audio and logos into this folder, then tell the AI you're ready. You can also
   give the AI the location of existing files to import.
5. Choose platforms, length and style with the AI. For example:
   > Make a 30-second upbeat recap for TikTok and Instagram Reels, with captions.
6. Review the video in Remotion Studio. When you're happy, say:
   > Export it for TikTok and Reels.

Start here for the full conversation: [Make a video with AI](docs/02-make-a-video-with-ai.md).

## Let your agent install and run the kit

If you already have Codex or Claude Code and a local copy of this repository,
open the main **vid-suite** folder in your AI tool and say:

> Install and set up this video kit, check that it works, then help me make a video.

The agent checks the required tools, installs the project's locked dependencies,
checks the kit and opens the example in Studio. It then follows the name-first
video workflow: create and open your content folder, collect the brief, build
the video, preview it and export when you ask.

[AGENTS.md](AGENTS.md) contains the installation and operating instructions for
agents. Codex uses it directly; [CLAUDE.md](CLAUDE.md) imports the same instructions
for Claude Code. This README and the guides explain the process for people.
Any system installation or account sign-in that needs your input is explained
when it comes up.

## What to tell the AI

Give it the topic, audience, platforms, approximate length, tone and any
must-include text, logos or closing message. Supply your media or say that you
want a video made from text and graphics. The AI saves the brief, drafts the
script, builds the video and keeps important content inside the shared safe area.

## Guides

| | |
|---|---|
| [01 – Install](docs/01-install.md) | One-time setup on your computer |
| [02 – Make a video with AI](docs/02-make-a-video-with-ai.md) | The full walkthrough, with what to say |
| [03 – Doing it by hand](docs/03-manual-walkthrough.md) | The same steps without an AI |
| [04 – Platforms & safe zones](docs/04-platforms-and-safe-zones.md) | Sizes, lengths and what the red areas mean |
| [05 – Transcription & API keys](docs/05-transcription-and-api-keys.md) | Captions, free vs OpenAI |
| [Prompt cookbook](docs/prompt-cookbook.md) | Copy-and-paste prompts for common videos |

## Commands at a glance

Your AI runs these for you, but you can use them yourself too:

```
pnpm dev                                   open the preview (Remotion Studio)
pnpm projects                              list your projects
pnpm new-project "Summer Trip"             start a project
pnpm new-project "Summer Trip" --prepare --open  create and open its content folder first
pnpm add-files summer-trip ~/Downloads/a.mp4  add files to it
pnpm open summer-trip                      open its folder to drag files in
pnpm add-format summer-trip youtube        add another platform
pnpm transcribe summer-trip clip.mp4       speech → captions
pnpm export summer-trip tiktok             make the MP4 (or "all")
pnpm setup-keys                            save an OpenAI key (optional)
```

## Where things are

```
projects/<name>/    your project: assets/, scripts/, captions/, brief.md, Video.tsx
exports/<name>/     finished videos
projects/example/   a sample project to look at
```

The kit excludes your personal projects and exports from Git. Keep your own
backups of those local files.

## License

Remotion is free for individuals and small companies (up to 3 people). Larger
companies need a license. [Read the terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
