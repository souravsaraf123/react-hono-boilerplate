import { z } from 'zod';

export enum MessageRole
{
	user = 'user',
	assistant = 'assistant',
	system = 'system',
}

export enum MessageType
{
	text = 'text',
	json = 'json',
	audio = 'audio',
}

export const textMessageSchema = z.object({
	type: z.literal(MessageType.text),
	content: z.string().min(1),
});

export const jsonMessageSchema = z.object({
	type: z.literal(MessageType.json),
	content: z.object(),
});

export const audioMessageSchema = z.object({
	type: z.literal(MessageType.audio),
	content: z.instanceof(ReadableStream),
});

export const chatMessageSchema = z
	.object({
		role: z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
	})
	.and(z.discriminatedUnion('type', [textMessageSchema, jsonMessageSchema, audioMessageSchema]));
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatHistorySchema = z.array(chatMessageSchema);
export type ChatHistory = z.infer<typeof chatHistorySchema>;

export const userMessageInputSchema = z.object({
	conversationId: z.uuid(),
	userPrompt: z.string().min(1),
});
export type UserMessageInput = z.infer<typeof userMessageInputSchema>;

export const conversationIdSchema = z.object({
	conversationId: z.string().uuid(),
});
