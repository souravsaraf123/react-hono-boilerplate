import { conversationTable } from '@api/db/tables/conversation.table';
import { db } from '@api/db/connection';
import { desc, eq } from 'drizzle-orm';

export async function listConversationsForUser(userEmail: string)
{
	const conversations = await db
		.select()
		.from(conversationTable)
		.where(eq(conversationTable.userEmail, userEmail))
		.orderBy(desc(conversationTable.createdAt));
	return conversations;
}
