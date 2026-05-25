# open-ended-question-checker

Verify free-text survey answers with a local LLM. Catches gibberish, off-topic responses, and low-effort filler like `"asdf"`, `"n/a"`, `"idk"`, `"あああ"`, `"なし"`, `"わからん"`. Zero runtime dependencies. Works offline.

ローカル LLM を使ってアンケートの自由記述回答を検証します。意味不明な回答、無関係な回答、`"asdf"`, `"n/a"`, `"idk"`, `"あああ"`, `"なし"`, `"わからん"` などの低品質な回答を検出します。実行時依存なし。オフライン動作。

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
  { question: '最も気に入った点は何ですか？', answer: '配送が早く、サポートも丁寧でした。' },
  { question: '最も気に入った点は何ですか？', answer: 'あああ' },
]);
// [
//   { question: 'What did you enjoy most?', answer: 'Fast delivery and helpful support.', isValid: true,  score: 0.85, reason: 'Relevant and specific.' },
//   { question: 'What did you enjoy most?', answer: 'asdf',                               isValid: false, score: 0.1,  reason: 'Not a meaningful response.' },
//   { question: '最も気に入った点は何ですか？', answer: '配送が早く、サポートも丁寧でした。', isValid: true,  score: 0.88, reason: '配送速度とサポートの質に言及しており、具体的な回答です。' },
//   { question: '最も気に入った点は何ですか？', answer: 'あああ',                           isValid: false, score: 0.05, reason: '意味のある内容が含まれていません。' },
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
