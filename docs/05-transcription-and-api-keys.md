# 05 – Transcription & API keys

Transcription turns speech in your clips into captions with exact word
timings, ready to show on screen.

## Two ways to transcribe

| | Free (on your computer) | OpenAI (with a key) |
|---|---|---|
| Cost | Free | Pay per minute of audio (see OpenAI's pricing) |
| Privacy | Audio never leaves your computer | Audio is sent to OpenAI |
| Speed | A few seconds to a few minutes. First run downloads the model (a few hundred MB). | Usually fast |
| Needs | A reasonably modern computer | An OpenAI account with credit |
| Length limit | None | About 13 minutes per file (longer files automatically use the free option) |

If you've saved an OpenAI key, it's used automatically. If it isn't set up,
or something goes wrong (no credit, wrong key), the free option is used instead.

## Using it

Ask your AI:

> Transcribe interview.mp4 and add the captions to the video.

Or run it yourself:

```
pnpm transcribe summer-trip interview.mp4
```

The captions are saved to `projects/summer-trip/captions/interview.json`.

**Other languages:** say which language. The free option needs it, and
OpenAI is more accurate with it:

> Transcribe interview.mp4. It's in Spanish.

```
pnpm transcribe summer-trip interview.mp4 --language es
```

**Force the free option** even with a key saved:

```
pnpm transcribe summer-trip interview.mp4 --local
```

**Fixing mistakes:** ask your AI ("the word 'Remotion' is spelled wrong in
the captions"), or edit the captions in Remotion Studio's caption editor.

## Adding an OpenAI key (optional)

1. Create a key at <https://platform.openai.com/api-keys> and add some credit
   to your OpenAI account.
2. In Terminal, in the `vid-suite` folder, run:
   ```
   pnpm setup-keys
   ```
   Paste the key when asked. The typing is hidden. It checks the key works and saves it.

Or ask your AI to "set up my OpenAI key". It opens a text file where you
paste the key yourself.

**Never paste your key into the AI chat.** The kit is set up so you never have to.

Other key commands:

```
pnpm setup-keys --check     check the saved key still works
pnpm setup-keys --remove    delete it
```

### Where the key is stored

In a file called `.secrets.env` in the `vid-suite` folder. It's:

- only on your computer, and never uploaded or shared through git
- only read by the transcription command, never by the video preview

If you share your computer, anyone with access to your files could read it.
Delete it with `pnpm setup-keys --remove` when you no longer need it.
