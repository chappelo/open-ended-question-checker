import { OllamaConnectionError, OllamaResponseError } from "./error.js";
import type { ChatRequest, ChatResponse } from "./types/index.js";

export class OllamaHttpClient {
	constructor(
		private readonly ollamaUrl: string,
		private readonly timeoutMs: number,
	) {}

	async post(body: ChatRequest): Promise<Response> {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), this.timeoutMs);

		const res = await this.req(body, controller.signal).finally(() =>
			clearTimeout(timer),
		);

		if (!res.ok) {
			const text = await res.text().catch(() => "");
			throw new OllamaResponseError(
				`Ollama returned HTTP ${res.status}: ${text || res.statusText}`,
			);
		}
		return res;
	}

	async extractContent(res: Response): Promise<string> {
		const data = (await res.json()) as ChatResponse;
		const content = data.message?.content;
		if (!content)
			throw new OllamaResponseError("Ollama response missing message.content");
		return content;
	}

	private async req(body: ChatRequest, signal: AbortSignal): Promise<Response> {
		try {
			return await fetch(`${this.ollamaUrl.replace(/\/$/, "")}/api/chat`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body),
				signal,
			});
		} catch {
			throw new OllamaConnectionError(this.ollamaUrl);
		}
	}
}
