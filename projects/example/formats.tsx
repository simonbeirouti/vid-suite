import { Composition, Folder } from "remotion";
import { platformMetadata } from "../../src/kit";
import { Video } from "./Video";

// Each <Composition> below is one export format of this project.
// Add another with: pnpm add-format example <platform>
export const Formats: React.FC = () => {
  return (
    <Folder name="example">
      <Composition
        id="example-tiktok"
        component={Video}
        calculateMetadata={platformMetadata}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={450}
        defaultProps={{
          platform: "tiktok",
          durationInSeconds: 8,
        }}
      />
      <Composition
        id="example-instagram-feed-square"
        component={Video}
        calculateMetadata={platformMetadata}
        width={1080}
        height={1080}
        fps={30}
        durationInFrames={450}
        defaultProps={{
          platform: "instagram-feed-square",
          durationInSeconds: 8,
        }}
      />
      <Composition
        id="example-youtube"
        component={Video}
        calculateMetadata={platformMetadata}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={450}
        defaultProps={{
          platform: "youtube",
          durationInSeconds: 8,
        }}
      />
    </Folder>
  );
};
