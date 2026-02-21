import { conversationTable } from '@api/db/tables/conversation.table';
import { messageTable } from '@api/db/tables/message.table';
import { db } from '@api/db/connection';
import { asc, eq } from 'drizzle-orm';

export async function getConversationById(conversationId: string)
{
	const [conversation] = await db.select().from(conversationTable).where(eq(conversationTable.id, conversationId));
	if (!conversation)
	{
		throw new Error('Conversation not found');
	}

	// Get the messages from the database
	const messages = await db.select().from(messageTable).where(eq(messageTable.conversationId, conversation.id)).orderBy(asc(messageTable.createdAt));
	return {
		conversation: conversation!,
		messages: messages,
	};
}
