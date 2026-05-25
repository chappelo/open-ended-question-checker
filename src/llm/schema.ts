export const resSchema = {
	type: "object",
	properties: {
		score: { type: "number", minimum: 0, maximum: 1 },
		reason: { type: "string", maxLength: 200 },
	},
	required: ["score", "reason"],
	additionalProperties: false,
} as const;

export type ResponseSchema = typeof resSchema;
