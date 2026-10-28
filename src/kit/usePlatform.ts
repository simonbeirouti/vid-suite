import { useVideoConfig } from "remotion";
import {
  isPlatformId,
  PLATFORMS,
  SAFE_AREA_INSET,
  type PlatformId,
  type SafeZone,
} from "../platforms";

/**
 * Props every project video receives. Each format in a project's
 * formats.tsx sets these in its defaultProps.
 */
export type PlatformProps = {
  platform: PlatformId;
  durationInSeconds: number;
};

/**
 * Information about the platform the video is currently being made for.
 * Use it to adapt the layout instead of hardcoding sizes.
 */
export const usePlatform = () => {
  const { width, height, props } = useVideoConfig();
  const id: PlatformId = isPlatformId(props.platform)
    ? props.platform
    : "youtube";
  const preset = PLATFORMS[id];

  // Sizes are designed against a 1080px short edge, so 1080×1920, 1080×1080
  // and 1920×1080 all use the same numbers. scale() converts them to the
  // actual frame size.
  const unit = Math.min(width, height) / 1080;
  const scale = (px: number) => px * unit;

  // One uniform margin for every composition, including resized formats.
  const inset = scale(SAFE_AREA_INSET);
  const safe: SafeZone = {
    top: inset,
    right: inset,
    bottom: inset,
    left: inset,
  };

  const aspect = width / height;

  return {
    id,
    preset,
    width,
    height,
    scale,
    safe,
    isVertical: aspect < 0.8,
    isSquare: aspect >= 0.8 && aspect <= 1.25,
    isLandscape: aspect > 1.25,
  };
};
