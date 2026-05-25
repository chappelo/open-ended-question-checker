# open-ended-question-checker

Verify free-text survey answers with a local LLM. Catches gibberish, off-topic responses, and low-effort filler like `"asdf"`, `"n/a"`, `"idk"`. Zero runtime dependencies. Works offline.

## Setup

**1. Install Ollama**

Download from [ollama.com](https://ollama.com), then pull a model:

```bash
ollama pull llama3.1
```

**2. Install the package**

```bash
npm install open-ended-question-checker
```

## Usage

```ts
import { VerifyOpenEndedResponse } from 'open-ended-question-checker';

const results = await VerifyOpenEndedResponse.check([
  { question: 'What did you enjoy most?', answer: 'Fast delivery and helpful support.' },
  { question: 'What did you enjoy most?', answer: 'asdf' },
]);
// [
//   { isValid: true,  score: 0.85, reason: 'Relevant and specific.' },
//   { isValid: false, score: 0.1,  reason: 'Not a meaningful response.' },
// ]
```

Set module-level defaults once instead of passing options on every call:

```ts
VerifyOpenEndedResponse.configure({
  model: 'llama3.2:3b',
  threshold: 0.7,
});
```

### Options

| Option      | Default                  | Env var              | Description                                                   |
| ----------- | ------------------------ | -------------------- | ------------------------------------------------------------- |
| `ollamaUrl` | `http://localhost:11434` | `OLLAMA_URL`         | Ollama server URL                                             |
| `model`     | `llama3.1`               | `OLLAMA_MODEL`       | Any model pulled via `ollama pull`                            |
| `threshold` | `0.6`                    | `OLLAMA_THRESHOLD`   | `score >= threshold` → `isValid: true`                        |
| `timeoutMs` | `30000`                  | `OLLAMA_TIMEOUT_MS`  | Per-call timeout in ms                                        |
| `language`  | _auto_                   | `OLLAMA_LANGUAGE`    | Language for the `reason` field. Defaults to answer language. |

Per-call options override `configure()`, which overrides env vars, which override built-in defaults.

Copy `.env.example` to `.env` and uncomment any values you want to change. The library reads env vars at startup — no dotenv dependency is included, so load `.env` yourself if needed (e.g. `node --env-file=.env`).

## How it works

Uses the **LLM-as-judge** pattern. Each question/answer pair is sent to Ollama's `/api/chat` endpoint with a system prompt that scores on five criteria: relevance, coherence, specificity, effort, and language alignment. Ollama's JSON schema mode (≥ 0.5) constrains the model to reply with exactly `{ score, reason }` — no regex parsing, no malformed JSON.

`isValid` is derived by comparing `score` to `threshold` in the library, not by asking the model, so you can adjust strictness without changing the prompt. Temperature is fixed at `0` — identical inputs always produce identical scores.

## License

MIT
