import React from "react";

// Every projects/<name>/formats.tsx is picked up automatically, so making a
// new project folder (pnpm new-project) is all it takes to show it in Studio.
const projectFormats = import.meta.webpackContext("../projects", {
  recursive: true,
  regExp: /^\.\/[a-z0-9-]+\/formats\.tsx$/,
});

const projects = projectFormats
  .keys()
  .filter((key) => key.startsWith("./"))
  .sort()
  .map((key) => {
    const mod = projectFormats(key) as { Formats?: React.FC };
    if (!mod.Formats) {
      throw new Error(
        `${key.slice(2)} must export a component called "Formats".`,
      );
    }
    return { key, Formats: mod.Formats };
  });

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {projects.map(({ key, Formats }) => (
        <Formats key={key} />
      ))}
    </>
  );
};
