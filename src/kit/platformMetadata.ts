import type { CalculateMetadataFunction } from "remotion";
import { isPlatformId, PLATFORMS } from "../platforms";
import type { PlatformProps } from "./usePlatform";

/**
 * Makes each format's size, frame rate and length always match its
 * platform preset and durationInSeconds, even if the numbers written on
 * the <Composition> drift out of date.
 */
export const platformMetadata: CalculateMetadataFunction<PlatformProps> = ({
  props,
  compositionId,
}) => {
  if (!isPlatformId(props.platform)) {
    throw new Error(
      `Unknown platform "${String(props.platform)}". Pick one from src/platforms.ts.`,
    );
  }

  const preset = PLATFORMS[props.platform];

  // Format ids are "<project>-<platform>". Studio's Render button then
  // saves to exports/<project>/<project>--<platform>.mp4.
  const suffix = `-${props.platform}`;
  const project = compositionId.endsWith(suffix)
    ? compositionId.slice(0, -suffix.length)
    : compositionId;

  return {
    width: preset.width,
    height: preset.height,
    fps: preset.fps,
    durationInFrames: Math.max(
      1,
      Math.round(props.durationInSeconds * preset.fps),
    ),
    defaultOutName: `${project}/${project}--${props.platform}`,
  };
};
