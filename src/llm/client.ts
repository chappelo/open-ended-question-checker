import { OllamaHttpClient } from "./http.js";
import { ResponseParser } from "./parser.js";
import { buildSystemPrompt, buildUserMessage } from "./prompt.js";
import { resSchema } from "./schema.js";
import type {
	ChatRequest,
	CheckResponse,
	OllamaClientConfig,
} from "./types/index.js";

export class OllamaClient {
	private readonly http: OllamaHttpClient;
	private readonly parser: ResponseParser;

	constructor(private readonly config: OllamaClientConfig) {
		this.http = new OllamaHttpClient(config.ollamaUrl, config.timeoutMs);
		this.parser = new ResponseParser();
	}

	async evaluate(question: string, answer: string): Promise<CheckResponse> {
		const body: ChatRequest = {
			model: this.config.model,
			messages: [
				{ role: "system", content: buildSystemPrompt(this.config.language) },
				{ role: "user", content: buildUserMessage(question, answer) },
			],
			stream: false,
			format: resSchema,
			options: { temperature: 0 },
		};

		const res = await this.http.post(body);
		const content = await this.http.extractContent(res);
		return this.parser.validate(this.parser.parse(content));
	}
}
