import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { check } from "../src/index.js";

describe("batch integration", () => {
	it("marks gibberish as invalid", async () => {
		const [result] = await check([
			{
				question: "What did you enjoy most about our service?",
				answer: "asdfasdf qwerty zzz",
			},
		]);
		assert.equal(result?.isValid, false);
	});

	it("marks a detailed relevant answer as valid", async () => {
		const [result] = await check([
			{
				question: "How could we improve your experience?",
				answer:
					"Add a dark mode to the mobile app and let me filter orders by date.",
			},
		]);
		assert.equal(result?.isValid, true);
	});

	it("marks off-topic answer as invalid", async () => {
		const [result] = await check([
			{
				question: "How could we improve your experience?",
				answer: "I love pizza and going to the beach on weekends.",
			},
		]);
		assert.equal(result?.isValid, false);
	});

	it("marks Japanese gibberish as invalid", async () => {
		const [result] = await check([
			{
				question: "当サービスで最も気に入った点は何ですか?",
				answer: "あああああ",
			},
		]);
		assert.equal(result?.isValid, false);
	});

	it("marks a detailed Japanese answer as valid", async () => {
		const [result] = await check([
			{
				question: "当サービスで最も気に入った点は何ですか?",
				answer: "配送が速くて、カスタマーサポートが親切でした。",
			},
		]);
		assert.equal(result?.isValid, true);
	});

	it("marks a cross-language answer as invalid", async () => {
		const [result] = await check([
			{
				question: "当サービスで最も気に入った点は何ですか?",
				answer: "I love your product, it is the best.",
			},
		]);
		assert.equal(result?.isValid, false);
	});
});
