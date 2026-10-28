/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Each project's files live in projects/<name>/, so that folder is what
// staticFile() reads from: staticFile("summer-trip/assets/clip.mp4").
Config.setPublicDir("projects");

// Renders started from Studio's Render button go here too.
// `pnpm export` uses the same folder with nicer file names.
Config.setOutputLocation("exports");
