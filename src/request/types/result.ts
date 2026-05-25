export interface CheckResult {
	isValid: boolean;
	score: number;
	reason: string;
}

export interface QuestionAnswerRequest {
	question: string;
	answer: string;
}
