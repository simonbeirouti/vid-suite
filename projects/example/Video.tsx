import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BasicCaptions,
  PlatformCanvas,
  SafeArea,
  usePlatform,
  type PlatformProps,
} from "../../src/kit";

// Reference video for the kit. It shows how to:
// - start from <PlatformCanvas> so the safe zone guide appears in Studio
// - keep text inside <SafeArea>
// - size everything with scale() and switch layout with isVertical / isLandscape
// - load files from this project with staticFile("example/assets/...")

const font = "Arial, Helvetica, sans-serif";

const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200 } });
};

const Title: React.FC = () => {
  const { scale } = usePlatform();
  const enter = useEnter();
  return (
    <SafeArea style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          color: "white",
          fontFamily: font,
          fontWeight: 800,
          fontSize: scale(120),
          textAlign: "center",
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
        }}
      >
        Make it once.
      </div>
    </SafeArea>
  );
};

const Photo: React.FC = () => {
  const { scale, isLandscape } = usePlatform();
  const photoIn = useEnter();
  const textIn = useEnter(8);

  return (
    <SafeArea
      padding={20}
      style={{
        // Side by side on landscape, stacked on vertical and square.
        flexDirection: isLandscape ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(48),
      }}
    >
      <Img
        src={staticFile("example/assets/sample-photo.svg")}
        style={{
          flex: 1,
          minHeight: 0,
          width: isLandscape ? undefined : "100%",
          height: isLandscape ? "100%" : undefined,
          objectFit: "cover",
          borderRadius: scale(32),
          opacity: photoIn,
          transform: `translateY(${interpolate(photoIn, [0, 1], [scale(30), 0])}px)`,
        }}
      />
      <div
        style={{
          flex: isLandscape ? 1 : undefined,
          color: "white",
          fontFamily: font,
          textAlign: isLandscape ? "left" : "center",
          opacity: textIn,
        }}
      >
        <div style={{ fontSize: scale(96), fontWeight: 800, lineHeight: 1.05 }}>
          Sunset Trip
        </div>
        <div
          style={{ fontSize: scale(48), marginTop: scale(16), opacity: 0.85 }}
        >
          Your photos, any platform.
        </div>
      </div>
    </SafeArea>
  );
};

const Captioned: React.FC = () => {
  const { scale, safe, width } = usePlatform();
  const captionWidth = width - safe.left - safe.right - scale(40);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("example/assets/sample-photo.svg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.5,
        }}
      />
      {/* Captions sit inside the shared safe area. The array is
          inlined (copied from captions/sample.json) so Studio's caption
          editor can change it. */}
      <SafeArea padding={20}>
        <BasicCaptions
          name="Captions"
          width={captionWidth}
          style={{
            position: "absolute",
            bottom: scale(20),
            left: 0,
          }}
          captions={[
            {
              text: "Every",
              startMs: 0,
              endMs: 300,
              timestampMs: 150,
              confidence: null,
            },
            {
              text: " format",
              startMs: 300,
              endMs: 700,
              timestampMs: 500,
              confidence: null,
            },
            {
              text: " from",
              startMs: 700,
              endMs: 950,
              timestampMs: 825,
              confidence: null,
            },
            {
              text: " one",
              startMs: 950,
              endMs: 1250,
              timestampMs: 1100,
              confidence: null,
            },
            {
              text: " video.",
              startMs: 1250,
              endMs: 1800,
              timestampMs: 1525,
              confidence: null,
            },
          ]}
        />
      </SafeArea>
    </AbsoluteFill>
  );
};

const Closing: React.FC = () => {
  const { scale, isVertical } = usePlatform();
  const enter = useEnter();
  return (
    <SafeArea style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          color: "white",
          fontFamily: font,
          fontWeight: 700,
          fontSize: scale(isVertical ? 80 : 72),
          lineHeight: 1.15,
          textAlign: "center",
          opacity: enter,
        }}
      >
        Export for TikTok,
        <br />
        Instagram and YouTube.
      </div>
    </SafeArea>
  );
};

export const Video: React.FC<PlatformProps> = () => {
  const { fps } = useVideoConfig();

  return (
    <PlatformCanvas background="#1a0f2e">
      <Sequence name="Title" durationInFrames={1.5 * fps}>
        <Title />
      </Sequence>
      <Sequence name="Photo" from={1.5 * fps} durationInFrames={2.5 * fps}>
        <Photo />
      </Sequence>
      <Sequence name="Captions" from={4 * fps} durationInFrames={2 * fps}>
        <Captioned />
      </Sequence>
      <Sequence name="Closing" from={6 * fps}>
        <Closing />
      </Sequence>
    </PlatformCanvas>
  );
};
