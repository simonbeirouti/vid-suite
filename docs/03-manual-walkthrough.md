# 03 – Doing it by hand

Everything the AI does, you can do yourself with a few commands and Remotion
Studio. Useful if you want to understand what's happening, or tweak
something quickly.

All commands run in Terminal, inside the `vid-suite` folder.

## 1. Create a project

```
pnpm new-project --prepare --open
```

It first asks what the project is called. Type **Summer Trip** and press Enter.
The project is created immediately and its **assets/** folder opens so you can
add content. No platform is assumed yet.

If you already know the name, platforms and length, you can create everything
in one step instead:

```
pnpm new-project "Summer Trip" --platforms tiktok,instagram-reels --duration 30 --open
```

This creates:

```
projects/summer-trip/
  assets/       your media
  scripts/      script.md for voiceover / on-screen text
  captions/     transcriptions
  brief.md      describe the video here
  Video.tsx     the video (starts as a simple title card)
  formats.tsx   the platforms it exports to
```

## 2. Add files

Copy files or whole folders in:

```
pnpm add-files summer-trip ~/Downloads/trip ~/Desktop/logo.png
```

Or open the folder and drag files in with Finder:

```
pnpm open summer-trip
```

You can also drag files into Remotion Studio. It saves them inside
`projects/`. Make sure they end up in `summer-trip/assets`.

After adding files to a folder-only project, choose its platforms:

```sh
pnpm add-format summer-trip tiktok,instagram-reels
```

The AI can then confirm the length and write the brief. Formats added without
a supplied length start with a 15-second placeholder; `durationInSeconds` in
`formats.tsx` sets the actual length.

## 3. Preview in Studio

```
pnpm dev
```

In the sidebar, open **summer-trip** and click a format. The **Props**
panel on the right shows this format's settings:

- `durationInSeconds`: the length of this format

The red 40px safe-area guide stays visible throughout every Studio preview.

Some things, like images, captions and scenes on the timeline, can be
adjusted directly in Studio, which writes the changes back to `Video.tsx`.

## 4. Captions

From Terminal:

```
pnpm transcribe summer-trip interview.mp4
```

This saves `captions/interview.json`. Remotion Studio also has its own
built-in transcription tool, which is free and runs on your computer. See
[05 – Transcription](05-transcription-and-api-keys.md).

## 5. Add or change platforms

```
pnpm add-format summer-trip youtube
```

To see all platforms: [04 – Platforms](04-platforms-and-safe-zones.md).

## 6. Export

```
pnpm export summer-trip tiktok
pnpm export summer-trip all
pnpm export summer-trip linkedin-square   # adds the format first if it's new
```

Files go to `exports/summer-trip/`. Open the folder with:

```
pnpm open summer-trip exports
```

You can also use the **Render** button in Studio. It saves to
`exports/summer-trip/summer-trip--<platform>.mp4`, replacing the previous
Studio render of that format.

## 7. See what you have

```
pnpm projects
```

## Editing the video yourself

`Video.tsx` is a React component. Have a look at `projects/example/Video.tsx`
for a commented example. The main building blocks (from `src/kit`):

| | |
|---|---|
| `<PlatformCanvas>` | the background, and the safe zone guide in Studio |
| `<SafeArea>` | a box inside the creative safe margin. Put text in here. |
| `usePlatform()` | tells you the platform, `scale()` for sizes, `isVertical` etc. for layout |
| `<BasicCaptions>` | shows captions |

Remotion's own docs: <https://www.remotion.dev/docs/the-fundamentals>.
