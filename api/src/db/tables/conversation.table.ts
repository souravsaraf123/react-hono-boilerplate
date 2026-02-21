import { chatUserTable } from '@api/db/tables/chatUser.table';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { auditFields } from '@api/db/auditFields';

export const conversationTable = pgTable('conversation', {
	id: uuid().primaryKey().defaultRandom(),
	userEmail: text()
		.notNull()
		.references(() => chatUserTable.email),
	...auditFields,
});
