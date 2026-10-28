import React from "react";
import { AbsoluteFill } from "remotion";
import { usePlatform } from "./usePlatform";

type SafeAreaProps = {
  children?: React.ReactNode;
  /** Extra breathing room inside the safe zone, in 1080-based px. */
  padding?: number;
  style?: React.CSSProperties;
};

/**
 * Fills the frame inside the creative safe margin.
 * Put all important text, faces and logos inside this.
 * Backgrounds and full-bleed footage go outside it.
 */
export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  padding = 0,
  style,
}) => {
  const { safe, scale } = usePlatform();
  const extra = scale(Math.max(0, padding));

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        ...style,
        // Layout styles may add space, but cannot remove the shared safe inset.
        position: "absolute",
        top: safe.top + extra,
        right: safe.right + extra,
        bottom: safe.bottom + extra,
        left: safe.left + extra,
        width: "auto",
        height: "auto",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
