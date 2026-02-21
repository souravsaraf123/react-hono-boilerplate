import { conversationTable } from '@api/db/tables/conversation.table';
import { EMAIL } from '@api/shared/appConfig';
import { db } from '@api/db/connection';

export async function createConversation()
{
	const [conversation] = await db
		.insert(conversationTable)
		.values({
			userEmail: EMAIL,
		})
		.returning();

	return conversation!;
}
