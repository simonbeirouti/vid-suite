// pnpm setup-keys          asks for an OpenAI API key and saves it to .secrets.env
// pnpm setup-keys --check  checks the saved key works (without showing it)
// pnpm setup-keys --remove deletes the saved key
//
// When there's no terminal to type into (e.g. run by an AI agent), it opens
// .secrets.env in a text editor instead so the user can paste the key there.
// Either way, the key never passes through the AI chat.
//
// The key lives in .secrets.env rather than .env on purpose: Remotion loads
// .env into the video preview, which would expose the key to the browser.
// Only the helper commands in tools/ read .secrets.env. It's git-ignored.
import { spawnSync } from "node:child_process";
import dotenv from "dotenv";
import fs from "node:fs";
import OpenAI from "openai";
import { fail, ok, parseArgs, rel, say, SECRETS_FILE, warn } from "./lib.ts";

const { flags } = parseArgs();

const readHidden = (prompt: string): Promise<string> =>
  new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (chunk: string) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          process.stdout.write("\n");
          resolve(value.trim());
          return;
        }
        if (ch === "\u0003") process.exit(130); // Ctrl+C
        if (ch === "\u007f" || ch === "\b") {
          if (value.length) {
            value = value.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else {
          value += ch;
          process.stdout.write("•");
        }
      }
    };
    stdin.on("data", onData);
  });

const writeKey = (key: string | null) => {
  const lines = fs.existsSync(SECRETS_FILE)
    ? fs
        .readFileSync(SECRETS_FILE, "utf8")
        .split("\n")
        .filter((l) => l && !l.startsWith("OPENAI_API_KEY="))
    : [];
  if (key) lines.push(`OPENAI_API_KEY=${key}`);
  fs.writeFileSync(SECRETS_FILE, lines.length ? `${lines.join("\n")}\n` : "", {
    mode: 0o600,
  });
};

/** "ok" | "rejected" | an error message when OpenAI couldn't be reached. */
const verify = async (key: string) => {
  try {
    await new OpenAI({ apiKey: key }).models.list();
    return "ok";
  } catch (err) {
    return (err as { status?: number }).status === 401
      ? "rejected"
      : (err as Error).message;
  }
};

const savedKey = () =>
  fs.existsSync(SECRETS_FILE)
    ? dotenv.parse(fs.readFileSync(SECRETS_FILE)).OPENAI_API_KEY?.trim() || null
    : null;

if (flags.check) {
  const key = savedKey();
  if (!key) fail(`No OpenAI key is saved yet. Run pnpm setup-keys.`);
  const result = await verify(key as string);
  if (result === "ok")
    ok("The saved OpenAI key works. Transcription will use OpenAI.");
  else if (result === "rejected")
    fail("OpenAI rejected the saved key. Run pnpm setup-keys to replace it.");
  else warn(`Couldn't reach OpenAI to check the key (${result}).`);
  process.exit(0);
}

if (flags.remove) {
  writeKey(null);
  ok(
    "Removed the saved OpenAI key. Transcription will use the free local model.",
  );
  process.exit(0);
}

say(`
An OpenAI key makes transcription faster and works on any computer.
Without one, transcription still works for free using a model that runs
on this computer.

Get a key at https://platform.openai.com/api-keys (it starts with "sk-").
OpenAI charges per minute of audio. Check their pricing page for current rates.
`);

if (!process.stdin.isTTY) {
  // No terminal to type into: let the user paste the key in a text editor.
  if (savedKey() === null) {
    const existing = fs.existsSync(SECRETS_FILE)
      ? fs.readFileSync(SECRETS_FILE, "utf8")
      : "";
    const rest = existing
      .split("\n")
      .filter((l) => l && !l.startsWith("OPENAI_API_KEY="));
    fs.writeFileSync(
      SECRETS_FILE,
      [...rest, "OPENAI_API_KEY="].join("\n") + "\n",
      { mode: 0o600 },
    );
  }
  const [cmd, args] =
    process.platform === "darwin"
      ? ["open", ["-t", SECRETS_FILE]]
      : process.platform === "win32"
        ? ["notepad", [SECRETS_FILE]]
        : ["xdg-open", [SECRETS_FILE]];
  spawnSync(cmd as string, args as string[], { stdio: "ignore" });
  say(`I opened ${rel(SECRETS_FILE)} in a text editor.`);
  say(
    `Paste your key straight after "OPENAI_API_KEY=" (no spaces), save, and close it.`,
  );
  say(`Then check it with: pnpm setup-keys --check`);
  process.exit(0);
}

const key = await readHidden(
  "Paste your OpenAI key (or just press Enter to skip): ",
);
if (!key) {
  say("No key saved. That's fine, the free local model will be used.");
  process.exit(0);
}
if (!key.startsWith("sk-"))
  warn(
    `That doesn't look like an OpenAI key (they start with "sk-"). Saving it anyway.`,
  );

say("Checking the key with OpenAI...");
const result = await verify(key);
if (result === "rejected")
  fail(
    "OpenAI rejected that key. Double-check it and run pnpm setup-keys again.",
  );
writeKey(key);
if (result === "ok")
  ok("Key works and is saved. Transcription will now use OpenAI.");
else warn(`Couldn't verify the key right now (${result}). It's saved anyway.`);
