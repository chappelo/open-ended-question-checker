export class OllamaConnectionError extends Error {
	override readonly name = "OllamaConnectionError";

	constructor(url: string) {
		super(`Cannot reach Ollama at ${url}.`);
	}
}

export class OllamaResponseError extends Error {
	override readonly name = "OllamaResponseError";
}
