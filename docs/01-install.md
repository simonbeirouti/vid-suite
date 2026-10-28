# 01 – Install

Set up the kit once, then make videos by talking to Codex or Claude Code.
You do not need to write video code yourself.

Already have Codex or Claude Code and a local checkout? Open the **vid-suite**
folder and ask: **"Install and set up this video kit, check that it works, then
help me make a video."** The agent follows the setup section in
[AGENTS.md](../AGENTS.md). The steps below are the manual alternative and cover
installing your AI tool for the first time.

## What you need

- A computer with space for the kit, your media and finished videos.
- Git, Node.js and pnpm for running this project.
- Access to Codex or Claude Code. Sign-in options and account access are managed
  by the tool you choose; see its official setup guide below.

The steps below use a Mac. Windows notes are at the end.

## 1. Install Git and Node.js

Open **Terminal**: press `⌘ Space`, type **Terminal**, then press Enter.
Install Apple's command-line tools, which include Git:

```sh
xcode-select --install
```

Complete the installer. If the tools are already installed, continue.

Install **Node.js 24 LTS** from [nodejs.org](https://nodejs.org/). This is the
Node.js version used to check this kit. Open a new Terminal window and check:

```sh
git --version
node --version
npm --version
```

Each command should print a version number. The project's supported Node.js
ranges are recorded in `package.json`.

## 2. Install pnpm

This kit uses pnpm 12:

```sh
npm install -g pnpm@12
pnpm --version
```

See the [official pnpm installation guide](https://pnpm.io/installation) if you
get a permissions or installation error.

## 3. Get and install this project

Ask whoever shared the kit for its repository link. In Terminal:

```sh
cd ~/Documents
git clone <repository-link> vid-suite
cd vid-suite
pnpm install
```

Replace `<repository-link>` with the actual link. You may need to sign in to the
repository host if the kit is private. The `vid-suite` folder is the kit's main
folder; open this folder in your AI tool, rather than an individual video folder.

## 4. Choose Codex or Claude Code

You only need one of these tools. The project provides `AGENTS.md` for Codex and
`CLAUDE.md`, which imports the same instructions, for Claude Code.

### Codex

**Desktop:** follow the [official Codex quickstart](https://developers.openai.com/codex/quickstart),
sign in, choose Codex, and open the local `vid-suite` folder.

**Terminal:** follow the [official Codex CLI setup](https://developers.openai.com/codex/cli).
On macOS or Linux, its standalone installer is:

```sh
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

Open a new Terminal window, then start Codex inside the kit:

```sh
cd ~/Documents/vid-suite
codex
```

Follow the first-run sign-in prompts. Codex reads the project's
[AGENTS.md instructions](https://developers.openai.com/codex/guides/agents-md).

### Claude Code

Follow the [official Claude Code quickstart](https://code.claude.com/docs/en/quickstart).
On macOS or Linux, install it with:

```sh
curl -fsSL https://claude.ai/install.sh | bash
```

Open a new Terminal window, then start Claude Code inside the kit:

```sh
cd ~/Documents/vid-suite
claude
```

Follow its first-run sign-in prompts. Use Claude Code with access to the local
kit folder so it can create projects and run the video tools.

## 5. Check the kit

Ask your AI:

> Check this kit is installed and open the example video in Studio.

It runs the helper commands and opens the preview. In Studio, choose **example**
and a format, then press Play. The red guide marks the shared 40px safe area.

To run the preview yourself, use `pnpm dev` inside `vid-suite`. Keep that process
running while working; `Ctrl C` stops it when you are finished.

## 6. Make your first video

Say:

> I want to make a video.

The AI asks for a name, creates that project's folders and opens **assets/** for
you to add content. It then helps choose the platforms, length and brief.
Continue with [Make a video with AI](02-make-a-video-with-ai.md).

## Coming back later

Open the same local `vid-suite` folder in Codex, or start `codex` or `claude`
from Terminal inside it. Say “Continue Summer Trip” to work on an existing video,
or “I want to make a new video” to start another.

For kit updates, run `git pull` and `pnpm install` inside `vid-suite`. Personal
projects and exports are ignored by Git. Keep your own backup of those files.

## Troubleshooting

| Problem | What to do |
|---|---|
| `node`, `pnpm`, `codex` or `claude` is not found | Open a new Terminal window, then follow the relevant installation guide if it still fails. |
| The AI cannot find the kit | Open the main `vid-suite` folder in the app, or change to it in Terminal before starting the AI. |
| No preview for a new project | Add at least one platform with the AI; a folder-only project has no video format yet. |
| The content folder does not open | Use the exact folder path printed by the helper to open it manually. |
| Studio uses a different port | Use the address printed by Studio; it selects a free port when needed. |
| Something else fails | Give the AI the error message and ask it to fix the setup. |

## Windows

Install [Git for Windows](https://git-scm.com/downloads/win) and Node.js, then use
PowerShell for `npm`, `pnpm` and the project commands. Follow the official
[Codex setup](https://developers.openai.com/codex/cli) or
[Claude Code setup](https://code.claude.com/docs/en/quickstart) for the Windows
installer. Use your actual checkout path, such as `C:\Users\you\Documents\vid-suite`.
The content folder opens in File Explorer.
