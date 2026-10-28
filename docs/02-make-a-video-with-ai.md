# 02 – Make a video with AI

Open the main **vid-suite** folder in Codex, or start `codex` or `claude` from
Terminal inside that folder. Finish the [one-time install](01-install.md) first.
Both tools use the kit's shared instructions, so the conversation is the same.

## 1. Say you want to make a video

> I want to make a video.

The AI first asks:

> What would you like to call this video?

Reply with a name, for example:

> Summer Trip

If you already gave a name, the AI uses it without asking again. To continue an
existing video, say “Continue Summer Trip” instead.

## 2. Add content to the folder that opens

As soon as the name is known, the AI creates `projects/summer-trip/` and opens
its **assets/** folder in Finder, File Explorer or your system's file browser.
It also gives you the folder's exact path.

Drag or copy your videos, photos, audio, music and logos into **assets/**.
Place scripts and notes in the neighbouring **scripts/** folder. These files
are stored locally; this step does not upload them to a website.

Then say:

> My files are ready. Please check what I added.

Or give the AI the location of files you already have:

> Import my clips from ~/Downloads/trip and the logo from ~/Desktop/logo.png.

It copies those files into this project and keeps the originals where they are.
If you have no media, say:

> Make it from text and motion graphics. I don't have clips to add.

If a project with the same name exists, the AI asks whether to continue it or
choose another name for a separate video. It does not overwrite that project.

## 3. Choose the video details

The AI asks for any details you have not already supplied:

- **Platforms:** TikTok, Instagram Reels, YouTube, LinkedIn or another supported format.
- **Length:** roughly how many seconds or minutes.
- **Topic and audience:** what it is about and who should watch it.
- **Tone and style:** upbeat, calm, formal, playful; any colours or visual references.
- **Must-include content:** key text, logos, captions, narration or a closing message.

For example:

> Make a 30-second recap for TikTok and Instagram Reels. Use a warm, upbeat
> style, captions on speech, and end with “See you next summer”.

The AI saves your answers in **brief.md**, adds the chosen formats and writes a
script for you to review. You can provide all these details in your first
message; it only asks for what is missing.

A project can hold your files before any platform is chosen. It appears as a
previewable composition in Studio after the first format is added.

## 4. Build and review

The AI opens Remotion Studio and builds the video. Choose your project and a
format in the sidebar, then press Play. Review each format because portrait,
square and landscape layouts differ.

The red edges mark the same **40px creative safe area on all four sides**. The
guide stays visible throughout Studio; exported MP4s keep the content spacing
without the red guide. Backgrounds and full-bleed footage may fill the frame.

Give feedback in plain language:

> Make the title bigger and slower.

> Cut the second clip to three seconds.

> Put the photo above the text in the square version.

If clips contain speech, ask the AI to transcribe them and add captions. Local
transcription needs no API key; the first run downloads a model. See
[Transcription and API keys](05-transcription-and-api-keys.md).

## 5. Export the finished video

When you are happy with the preview, say:

> Export all formats and open the output folder.

Finished MP4s go to **exports/summer-trip/**, with the project, platform and a
minute timestamp in the name. Keep a separate copy if you want to retain an
older export made in the same minute.

You can ask for only one format, such as “Export it for TikTok”. To add another
shape later, say “Also make a YouTube version”, review it, then export it.

## What gets created

```text
projects/summer-trip/
  assets/        videos, photos, music, audio and logos
  scripts/       script.md, narration and notes
  captions/      transcriptions
  brief.md       your agreed video brief
  Video.tsx      the video built by the AI
  formats.tsx    the selected platforms

exports/summer-trip/
  ...mp4         finished videos after export
```

The AI handles the files and commands. For examples of what to ask, use the
[prompt cookbook](prompt-cookbook.md). For the same workflow without an AI, see
[Doing it by hand](03-manual-walkthrough.md).
