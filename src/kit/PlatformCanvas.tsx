import React from "react";
import { AbsoluteFill } from "remotion";
import { SafeZoneGuide } from "./SafeZoneGuide";

type PlatformCanvasProps = {
  children?: React.ReactNode;
  background?: string;
  style?: React.CSSProperties;
};

/**
 * The root of every project video. Fills the frame with a background and
 * draws the safe zone guide on top while previewing in Studio.
 */
export const PlatformCanvas: React.FC<PlatformCanvasProps> = ({
  children,
  background = "#000000",
  style,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: background, ...style }}>
      {children}
      <SafeZoneGuide />
    </AbsoluteFill>
  );
};
