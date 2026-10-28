# 04 – Platforms & safe zones

## Platforms

| Id (what you type) | Platform | Size | Shape | Max length* |
|---|---|---|---|---|
| `youtube` | YouTube | 1920×1080 | landscape 16:9 | none |
| `youtube-shorts` | YouTube Shorts | 1080×1920 | vertical 9:16 | 3 min |
| `tiktok` | TikTok | 1080×1920 | vertical 9:16 | 10 min |
| `instagram-reels` | Instagram Reels | 1080×1920 | vertical 9:16 | 3 min |
| `instagram-story` | Instagram Story | 1080×1920 | vertical 9:16 | 60 s |
| `instagram-feed-portrait` | Instagram feed | 1080×1350 | portrait 4:5 | 60 min |
| `instagram-feed-square` | Instagram feed | 1080×1080 | square 1:1 | 60 min |
| `linkedin-landscape` | LinkedIn | 1920×1080 | landscape 16:9 | 15 min |
| `linkedin-square` | LinkedIn | 1080×1080 | square 1:1 | 15 min |
| `x-landscape` | X / Twitter | 1920×1080 | landscape 16:9 | 2 min 20 s |

\* Roughly what each platform allows at the time of writing. Platforms change
these often. Shorter almost always performs better: 15–60 seconds is the
sweet spot for vertical video.

All formats export as MP4 (H.264) at 30 frames per second, which every
platform accepts.

You can export one project to as many platforms as you like. The same
video rearranges itself for each shape: for example, side-by-side on
landscape and stacked on vertical.

## Safe zones

Remotion Studio shows an equal **40px creative safe margin on all four
sides** of every format. The margin has a red tint and a dashed inner line.
The exported video keeps its full platform dimensions.

Studio also leaves a **24px minimum gutter outside the video** in Fit mode.
The preview stays centered and preserves its aspect ratio, so the wider axis
can have additional space.

- **Keep text, faces, logos and captions inside the dashed line.**
- Backgrounds, footage and decoration can go edge to edge.
- The red tint is **only shown in Studio**. It never appears in your exported video.
- The guide stays visible throughout every Studio preview. All existing and
  future projects use the same shared rule, including newly added formats.

The red margin is a design guide. Platform buttons, usernames and captions
can occupy additional space; the platform notes describe those interfaces.

## For the curious

The presets live in `src/platforms.ts`. Each one has a size, frame rate,
maximum length and safe zone. Adding a new platform there makes it
available to every project.
