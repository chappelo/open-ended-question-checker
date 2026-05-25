import type { CheckOptions, ResolvedOptions } from "./types/options.js";

function getDefaults(): ResolvedOptions {
	const threshold = process.env.OLLAMA_THRESHOLD;
	const timeoutMs = process.env.OLLAMA_TIMEOUT_MS;
	return {
		ollamaUrl: process.env.OLLAMA_URL ?? "http://localhost:11434",
		model: process.env.OLLAMA_MODEL ?? "llama3.1",
		threshold: threshold !== undefined ? parseFloat(threshold) : 0.6,
		timeoutMs: timeoutMs !== undefined ? parseInt(timeoutMs, 10) : 30_000,
		language: process.env.OLLAMA_LANGUAGE,
	};
}

export class Configuration {
	private readonly state: ResolvedOptions = getDefaults();

	update(opts: CheckOptions): void {
		Object.assign(this.state, this.pick(opts));
	}

	reset(): void {
		Object.assign(this.state, getDefaults());
	}

	resolve(opts?: CheckOptions): ResolvedOptions {
		return { ...this.state, ...this.pick(opts) };
	}

	private pick(opts?: CheckOptions): Partial<ResolvedOptions> {
		if (!opts) return {};
		const picked: Partial<ResolvedOptions> = {};
		if (opts.ollamaUrl !== undefined) picked.ollamaUrl = opts.ollamaUrl;
		if (opts.model !== undefined) picked.model = opts.model;
		if (opts.threshold !== undefined) picked.threshold = opts.threshold;
		if (opts.timeoutMs !== undefined) picked.timeoutMs = opts.timeoutMs;
		if (opts.language !== undefined) picked.language = opts.language;
		return picked;
	}
}
