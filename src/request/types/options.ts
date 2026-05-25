export interface ResolvedOptions {
	ollamaUrl: string;
	model: string;
	threshold: number;
	timeoutMs: number;
	language: string | undefined;
}

export type CheckOptions = Partial<ResolvedOptions>;
