import type { ResponseSchema } from "../schema.js";

export interface ChatRequest {
	readonly model: string;
	readonly messages: ReadonlyArray<{
		readonly role: "system" | "user";
		readonly content: string;
	}>;
	readonly stream: false;
	readonly format: ResponseSchema;
	readonly options: { readonly temperature: number };
}

export interface ChatResponse {
	readonly message?: { readonly content?: string };
}
