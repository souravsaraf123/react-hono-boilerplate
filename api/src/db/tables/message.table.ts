import { MessageRole, MessageType } from '@api/shared/zod/chat.schema';
import { conversationTable } from '@api/db/tables/conversation.table';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { auditFields } from '@api/db/auditFields';

export const messageTable = pgTable('message', {
	id: uuid().primaryKey().defaultRandom(),
	conversationId: uuid()
		.notNull()
		.references(() => conversationTable.id),
	type: text().notNull().$type<MessageType>(),
	content: text().notNull(),
	role: text().notNull().$type<MessageRole>(),
	...auditFields,
});
