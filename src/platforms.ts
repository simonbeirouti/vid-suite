// Platform presets: one entry per place a video can be published.
//
// Every format uses the same 40px creative safe margin at its native size.
// Platform-specific interface controls may extend beyond this design guide;
// the publishing notes below describe those controls separately.
//
// This file is plain data (no Remotion imports) so the helper commands in
// tools/ can read it too.

export type SafeZone = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type Platform = {
  id: string;
  label: string;
  width: number;
  height: number;
  fps: number;
  /** Longest video the platform accepts, roughly. null = no practical limit. */
  maxDurationSec: number | null;
  safeZone: SafeZone;
  notes: string;
};

export const SAFE_AREA_INSET = 40;
const DESIGN_SAFE_ZONE = {
  top: SAFE_AREA_INSET,
  right: SAFE_AREA_INSET,
  bottom: SAFE_AREA_INSET,
  left: SAFE_AREA_INSET,
} as const;

export const PLATFORMS = {
  youtube: {
    id: "youtube",
    label: "YouTube (landscape 16:9)",
    width: 1920,
    height: 1080,
    fps: 30,
    maxDurationSec: null,
    safeZone: DESIGN_SAFE_ZONE,
    notes: "Progress bar and controls appear along the bottom on hover.",
  },
  "youtube-shorts": {
    id: "youtube-shorts",
    label: "YouTube Shorts (vertical 9:16)",
    width: 1080,
    height: 1920,
    fps: 30,
    maxDurationSec: 180,
    safeZone: DESIGN_SAFE_ZONE,
    notes:
      "Like/comment buttons on the right, title and channel at the bottom.",
  },
  tiktok: {
    id: "tiktok",
    label: "TikTok (vertical 9:16)",
    width: 1080,
    height: 1920,
    fps: 30,
    maxDurationSec: 600,
    safeZone: DESIGN_SAFE_ZONE,
    notes:
      "Buttons on the right, username, caption and music at the bottom. Shorter (15–60s) usually performs best.",
  },
  "instagram-reels": {
    id: "instagram-reels",
    label: "Instagram Reels (vertical 9:16)",
    width: 1080,
    height: 1920,
    fps: 30,
    maxDurationSec: 180,
    safeZone: DESIGN_SAFE_ZONE,
    notes:
      "Buttons on the right, caption and audio at the bottom. The grid preview crops to the middle 3:4.",
  },
  "instagram-story": {
    id: "instagram-story",
    label: "Instagram Story (vertical 9:16)",
    width: 1080,
    height: 1920,
    fps: 30,
    maxDurationSec: 60,
    safeZone: DESIGN_SAFE_ZONE,
    notes: "Profile bar at the top, reply box at the bottom.",
  },
  "instagram-feed-portrait": {
    id: "instagram-feed-portrait",
    label: "Instagram Feed (portrait 4:5)",
    width: 1080,
    height: 1350,
    fps: 30,
    maxDurationSec: 3600,
    safeZone: DESIGN_SAFE_ZONE,
    notes: "The profile grid crops a little off the left and right edges.",
  },
  "instagram-feed-square": {
    id: "instagram-feed-square",
    label: "Instagram Feed (square 1:1)",
    width: 1080,
    height: 1080,
    fps: 30,
    maxDurationSec: 3600,
    safeZone: DESIGN_SAFE_ZONE,
    notes: "Classic square post.",
  },
  "linkedin-landscape": {
    id: "linkedin-landscape",
    label: "LinkedIn (landscape 16:9)",
    width: 1920,
    height: 1080,
    fps: 30,
    maxDurationSec: 900,
    safeZone: DESIGN_SAFE_ZONE,
    notes: "Plays muted by default, so burned-in captions matter.",
  },
  "linkedin-square": {
    id: "linkedin-square",
    label: "LinkedIn (square 1:1)",
    width: 1080,
    height: 1080,
    fps: 30,
    maxDurationSec: 900,
    safeZone: DESIGN_SAFE_ZONE,
    notes: "Takes up more of the feed than landscape. Plays muted by default.",
  },
  "x-landscape": {
    id: "x-landscape",
    label: "X / Twitter (landscape 16:9)",
    width: 1920,
    height: 1080,
    fps: 30,
    maxDurationSec: 140,
    safeZone: DESIGN_SAFE_ZONE,
    notes: "Free accounts are limited to about 2:20.",
  },
} as const satisfies Record<string, Platform>;

export type PlatformId = keyof typeof PLATFORMS;

export const PLATFORM_IDS = Object.keys(PLATFORMS) as PlatformId[];

export const isPlatformId = (value: unknown): value is PlatformId =>
  typeof value === "string" && value in PLATFORMS;
