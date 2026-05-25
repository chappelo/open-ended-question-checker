import { OllamaResponseError } from "./error.js";
import type { CheckResponse } from "./types/response.js";

export class ResponseParser {
	parse(content: string): unknown {
		try {
			return JSON.parse(content);
		} catch {
			throw new OllamaResponseError(
				`Ollama did not return valid JSON. Response content: ${content}`,
			);
		}
	}

	validate(raw: unknown): CheckResponse {
		if (typeof raw !== "object" || raw === null) {
			throw new OllamaResponseError("Response is not an object");
		}
		const { score, reason } = raw as Record<string, unknown>;

		if (typeof score !== "number" || Number.isNaN(score)) {
			throw new OllamaResponseError(
				`Response "score" is not a number: ${String(score)}`,
			);
		}
		if (typeof reason !== "string") {
			throw new OllamaResponseError(
				`Response "reason" is not a string: ${String(reason)}`,
			);
		}

		return { score: Math.min(1, Math.max(0, score)), reason };
	}
}
