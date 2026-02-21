import { MessageRole, MessageType } from '@api/shared/zod/chat.schema';
import { conversationTable } from '@api/db/tables/conversation.table';
import { messageTable } from '@api/db/tables/message.table';
import { aiService } from '@api/services/ai.service';
import { db } from '@api/db/connection';
import { ModelMessage } from 'ai';
import { eq } from 'drizzle-orm';

export async function textChat(conversationId: string, userPrompt: string) {
	// Get the conversation from the database
	const [conversation] = await db.select().from(conversationTable).where(eq(conversationTable.id, conversationId));
	if (!conversation) {
		throw new Error('Conversation not found');
	}

	// Insert the user message into the database
	let [userMessage] = await db
		.insert(messageTable)
		.values({
			conversationId: conversation.id,
			role: MessageRole.user,
			content: userPrompt,
			type: MessageType.text,
		})
		.returning();

	// Get the history of messages from the database
	const messages = await db.select().from(messageTable).where(eq(messageTable.conversationId, conversation.id));
	let history: ModelMessage[] = messages.map(message => ({
		role: message.role,
		content: message.content,
	}));

	// Remove the last message from the history (since it's the user message)
	history.pop();

	const aiResponse = await aiService.generateText(userPrompt, history);

	// Save the message to the database
	let [assistantMessage] = await db
		.insert(messageTable)
		.values({
			conversationId: conversation.id,
			role: MessageRole.assistant,
			content: aiResponse,
			type: MessageType.text,
		})
		.returning();

	return {
		userMessage: userMessage!,
		assistantMessage: assistantMessage!,
	};
}
