// pnpm transcribe <project> <file> [--language xx] [--local]
//
// Turns speech in a video or audio file into captions:
// projects/<project>/captions/<file name>.json (Remotion Caption[] format).
//
// Uses OpenAI's Whisper API if an OpenAI key has been saved with
// `pnpm setup-keys`. Otherwise it runs a free Whisper model on this computer.
import { registerMediabunnyServer } from "@mediabunny/server";
import type { Caption } from "@remotion/captions";
import { openAiWhisperApiToCaptions } from "@remotion/openai-whisper";
import {
  WHISPER_WEBGPU_SAMPLE_RATE,
  canUseWhisperWebGpu,
  downloadWhisperModel,
  loadWhisperModel,
  toCaptions,
  transcribe,
  type WhisperWebGpuModel,
} from "@remotion/whisper-webgpu";
import dotenv from "dotenv";
import {
  ALL_FORMATS,
  Conversion,
  FilePathSource,
  Input,
  NullTarget,
  Output,
  WavOutputFormat,
} from "mediabunny";
import fs from "node:fs";
import path from "node:path";
import OpenAI, { toFile } from "openai";
import {
  expandHome,
  fail,
  ok,
  parseArgs,
  projectDir,
  rel,
  resolveProject,
  say,
  SECRETS_FILE,
  warn,
} from "./lib.ts";

const { positional, flags } = parseArgs();
const slug = resolveProject(positional[0]);
const fileArg = positional[1];
const language =
  typeof flags.language === "string" ? flags.language.toLowerCase() : undefined;

if (!fileArg) {
  fail(
    `Which file should be transcribed? e.g. pnpm transcribe ${slug} assets/interview.mp4`,
  );
}

// Accept "assets/clip.mp4", "clip.mp4" (looked up in assets/) or a full path.
const candidates = [
  path.resolve(expandHome(fileArg)),
  path.join(projectDir(slug), fileArg),
  path.join(projectDir(slug), "assets", fileArg),
];
const source = candidates.find(
  (p) => fs.existsSync(p) && fs.statSync(p).isFile(),
);
if (!source)
  fail(
    `Couldn't find "${fileArg}" in ${slug}. Add it first with: pnpm add-files ${slug} <path>`,
  );

const outFile = path.join(
  projectDir(slug),
  "captions",
  `${path.basename(source as string, path.extname(source as string))}.json`,
);

// ---------- Decode audio to 16 kHz mono ----------

registerMediabunnyServer();

const decodeAudio = async (file: string): Promise<Float32Array> => {
  type Chunk = { startFrame: number; waveform: Float32Array };
  const chunks: Chunk[] = [];

  using input = new Input({
    formats: ALL_FORMATS,
    source: new FilePathSource(file),
  });
  const audioTrack = await input.getPrimaryAudioTrack();
  if (audioTrack === null) fail(`${path.basename(file)} has no sound in it.`);

  const conversion = await Conversion.init({
    input,
    output: new Output({
      format: new WavOutputFormat(),
      target: new NullTarget(),
    }),
    video: { discard: true },
    audio: (track) => {
      if (track.id !== audioTrack!.id) return { discard: true };
      return {
        codec: "pcm-f32",
        forceTranscode: true,
        numberOfChannels: 1,
        sampleFormat: "f32",
        sampleRate: WHISPER_WEBGPU_SAMPLE_RATE,
        process: (sample) => {
          const waveform = new Float32Array(
            sample.allocationSize({ format: "f32", planeIndex: 0 }) /
              Float32Array.BYTES_PER_ELEMENT,
          );
          sample.copyTo(waveform, { format: "f32", planeIndex: 0 });
          chunks.push({
            startFrame: Math.round(
              sample.timestamp * WHISPER_WEBGPU_SAMPLE_RATE,
            ),
            waveform,
          });
          return sample;
        },
      };
    },
  });
  if (!conversion.isValid)
    fail(`Couldn't read the audio in ${path.basename(file)}.`);
  await conversion.execute();

  const length = chunks.reduce(
    (max, c) => Math.max(max, c.startFrame + c.waveform.length),
    0,
  );
  const out = new Float32Array(length);
  for (const chunk of chunks) {
    const dest = Math.max(0, chunk.startFrame);
    const src = Math.max(0, -chunk.startFrame);
    const n = Math.min(chunk.waveform.length - src, out.length - dest);
    if (n > 0) out.set(chunk.waveform.subarray(src, src + n), dest);
  }
  return out;
};

// ---------- OpenAI ----------

// OpenAI accepts files up to 25 MB. 16-bit 16 kHz mono WAV is 32 KB/s, so ~13 min.
const OPENAI_MAX_BYTES = 25 * 1024 * 1024;

const toWav = (samples: Float32Array): Buffer => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(WHISPER_WEBGPU_SAMPLE_RATE, 24);
  buf.writeUInt32LE(WHISPER_WEBGPU_SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s < 0 ? s * 0x8000 : s * 0x7fff), 44 + i * 2);
  }
  return buf;
};

const transcribeWithOpenAi = async (
  apiKey: string,
  wav: Buffer,
): Promise<Caption[]> => {
  const client = new OpenAI({ apiKey });
  const transcription = await client.audio.transcriptions.create({
    file: await toFile(wav, "audio.wav", { type: "audio/wav" }),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
    ...(language ? { language } : {}),
  });
  return openAiWhisperApiToCaptions({ transcription }).captions;
};

// ---------- Local ----------

const transcribeLocally = async (
  waveform: Float32Array,
): Promise<Caption[]> => {
  const support = await canUseWhisperWebGpu();
  if (!support.supported) {
    fail(
      `This computer can't run the free local transcription (${support.detailedReason}).\n` +
        `   Save an OpenAI key with "pnpm setup-keys" to transcribe online instead.`,
    );
  }

  // small.en is best for English. Other languages need the multilingual model.
  const model: WhisperWebGpuModel =
    !language || language === "en" ? "small.en" : "small";

  say(
    `   Getting the "${model}" speech model ready (the first time downloads a few hundred MB)...`,
  );
  let lastShown = -1;
  await downloadWhisperModel({
    model,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= lastShown + 10) {
        lastShown = pct;
        say(`   ...${pct}%`);
      }
    },
  });
  await using _model = await loadWhisperModel({ model });
  say("   Listening...");
  const result = await transcribe({
    channelWaveform: waveform,
    model,
    ...(model === "small" && language ? { language } : {}),
  });
  return toCaptions({ whisperWebGpuOutput: result }).captions;
};

// ---------- Run ----------

dotenv.config({ path: SECRETS_FILE, quiet: true });
const apiKey = process.env.OPENAI_API_KEY;

say(`\n🎙️  Transcribing ${rel(source as string)}...`);
const waveform = await decodeAudio(source as string);
const minutes = waveform.length / WHISPER_WEBGPU_SAMPLE_RATE / 60;
say(`   ${minutes.toFixed(1)} minutes of audio.`);

let captions: Caption[];
let method: string;
const wav = apiKey && !flags.local ? toWav(waveform) : null;

if (apiKey && wav && wav.length <= OPENAI_MAX_BYTES) {
  say("   Using OpenAI (your saved key).");
  try {
    captions = await transcribeWithOpenAi(apiKey, wav);
    method = "OpenAI";
  } catch (err) {
    const status = (err as { status?: number }).status;
    const reason =
      status === 401
        ? "the saved key was rejected (run pnpm setup-keys to replace it)"
        : status === 429
          ? "the account is out of credit or rate-limited"
          : (err as Error).message;
    warn(`OpenAI didn't work: ${reason}. Trying the free local model instead.`);
    captions = await transcribeLocally(waveform);
    method = "local model";
  }
} else {
  if (apiKey && wav)
    warn(
      "This audio is too long for OpenAI's 25 MB limit, so I'm using the free local model.",
    );
  else if (!flags.local)
    say("   No OpenAI key saved, so I'm using the free local model.");
  captions = await transcribeLocally(waveform);
  method = "local model";
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(captions, null, 2));

say();
ok(
  `Transcribed with the ${method}: ${captions.length} words saved to ${rel(outFile)}`,
);
const preview = captions
  .map((c) => c.text)
  .join("")
  .trim();
if (preview)
  say(`   "${preview.slice(0, 160)}${preview.length > 160 ? "..." : ""}"`);
say();
