import React from "react";
import { AbsoluteFill, getRemotionEnvironment } from "remotion";
import { usePlatform } from "./usePlatform";

const band: React.CSSProperties = {
  position: "absolute",
  backgroundColor: "rgba(255, 40, 80, 0.22)",
};

/**
 * Tints the creative safe margin around the video.
 * Only visible in Remotion Studio. It never appears in exported videos.
 * Always visible in Studio for every PlatformCanvas.
 */
export const SafeZoneGuide: React.FC = () => {
  const { isStudio, isRendering } = getRemotionEnvironment();
  const { safe, preset, scale } = usePlatform();

  if (!isStudio || isRendering) {
    return null;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...band, top: 0, left: 0, right: 0, height: safe.top }} />
      <div
        style={{ ...band, bottom: 0, left: 0, right: 0, height: safe.bottom }}
      />
      <div
        style={{
          ...band,
          top: safe.top,
          bottom: safe.bottom,
          left: 0,
          width: safe.left,
        }}
      />
      <div
        style={{
          ...band,
          top: safe.top,
          bottom: safe.bottom,
          right: 0,
          width: safe.right,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: safe.top,
          right: safe.right,
          bottom: safe.bottom,
          left: safe.left,
          outline: `${Math.max(2, scale(3))}px dashed rgba(255, 40, 80, 0.9)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: scale(12),
          left: scale(12),
          padding: `${scale(6)}px ${scale(12)}px`,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: scale(22),
          borderRadius: scale(6),
        }}
      >
        {preset.label}: safe zone guide (Studio only)
      </div>
    </AbsoluteFill>
  );
};
