import { type Content, GoogleGenAI, Modality } from '@google/genai';
import { generateText, Output, type ModelMessage } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { apiEnv } from '@api/config/apiEnv';
import type { ZodSchema } from 'zod';

type GoogleGenAiModelMessage = {
	role: 'user' | 'assistant' | 'system';
	content: string;
};

class AiService
{
	private googleProvider = createGoogleGenerativeAI({
		apiKey: apiEnv.AI_API_KEY,
	});

	/**
	 * Generate text using the AI service
	 * @param userPrompt - The prompt to generate text for
	 * @param history - The history of messages to use for the conversation. First message is the system prompt.
	 * @returns The generated text
	 */
	async generateText(userPrompt: string, history: ModelMessage[] = []): Promise<string>
	{
		let messages: ModelMessage[] = [...history, { role: 'user', content: userPrompt }];
		let aiResponse = await generateText({
			model: this.googleProvider('gemini-3-flash-preview'),
			messages: messages,
		});
		return aiResponse.text;
	}

	/**
	 * Generate JSON using the AI service
	 * @param userPrompt - The prompt to generate JSON for
	 * @param jsonSchema - The schema to generate JSON for
	 * @param history - The history of messages to use for the conversation. First message is the system prompt.
	 * @returns The generated JSON
	 */
	async generateJson(userPrompt: string, jsonSchema: ZodSchema, history: ModelMessage[] = [])
	{
		let messages: ModelMessage[] = [...history, { role: 'user', content: userPrompt }];
		let aiResponse = await generateText({
			model: this.googleProvider('gemini-3-flash-preview'),
			messages: messages,
			output: Output.object({ schema: jsonSchema }),
		});
		return aiResponse.output;
	}

	async generateAudio(userPrompt: string, history: GoogleGenAiModelMessage[] = []): Promise<ReadableStream<Uint8Array>>
	{
		const ai = new GoogleGenAI({
			apiKey: apiEnv.AI_API_KEY,
		});

		let readableStream = new ReadableStream<Uint8Array>({
			async start(controller)
			{
				const session = await ai.live.connect({
					model: 'gemini-2.5-flash-native-audio-preview-12-2025',
					config: {
						responseModalities: [Modality.AUDIO],
						speechConfig: {
							voiceConfig: {
								prebuiltVoiceConfig: {
									voiceName: 'Aoede',
								},
							},
						},
					},
					callbacks: {
						onmessage: message =>
						{
							const parts = message.serverContent?.modelTurn?.parts;
							if (!parts) return;

							for (const part of parts)
							{
								if (part.inlineData?.data)
								{
									const audioBuffer = Buffer.from(part.inlineData.data, 'base64');

									controller.enqueue(audioBuffer);
								}
							}
						},
						onerror: error =>
						{
							console.error('Live API error:', error);
							controller.error(error);
						},
						onclose: () =>
						{
							controller.close();
						},
					},
				});

				const contents: Content[] = [
					...history.map(m => ({
						role: m.role,
						parts: [{ text: m.content }],
					})),
					{
						role: 'user',
						parts: [{ text: userPrompt }],
					},
				];

				session.sendClientContent({
					turns: contents,
				});

				session.sendClientContent({ turnComplete: true });
			},
		});

		return readableStream;
	}
}

export const aiService = new AiService();
