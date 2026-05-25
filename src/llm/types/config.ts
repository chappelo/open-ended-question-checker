export interface OllamaClientConfig {
	readonly ollamaUrl: string;
	readonly model: string;
	readonly timeoutMs: number;
	readonly language?: string;
}
