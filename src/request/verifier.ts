import { OllamaClient } from "../llm/index.js";
import { Configuration } from "./configuration.js";
import type { CheckOptions, ResolvedOptions } from "./types/options.js";
import type { CheckResult, QuestionAnswerRequest } from "./types/result.js";

const configuration = new Configuration();

export function configure(opts: CheckOptions): void {
	configuration.update(opts);
}

export function resetConfig(): void {
	configuration.reset();
}

export async function check(
	items: QuestionAnswerRequest[],
	opts?: CheckOptions,
): Promise<CheckResult[]> {
	const resolved = configuration.resolve(opts);
	const client = new OllamaClient(resolved);
	const results: CheckResult[] = [];
	for (const item of items) {
		results.push(await checkOne(item, resolved, client));
	}
	return results;
}

export const VerifyOpenEndedResponse = {
	check,
	configure,
	resetConfig,
} as const;

async function checkOne(
	item: QuestionAnswerRequest,
	resolved: ResolvedOptions,
	client: OllamaClient,
): Promise<CheckResult> {
	if (!item.answer?.trim()) {
		return {
			question: item.question,
			answer: item.answer,
			isValid: false,
			score: 0,
			reason: "Empty answer.",
		};
	}
	const response = await client.evaluate(item.question, item.answer);
	return {
		question: item.question,
		answer: item.answer,
		isValid: response.score >= resolved.threshold,
		score: response.score,
		reason: response.reason,
	};
}
