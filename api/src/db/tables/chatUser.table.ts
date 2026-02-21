import { pgTable, text } from 'drizzle-orm/pg-core';
import { auditFields } from '@api/db/auditFields';

export const chatUserTable = pgTable('chatUser', {
	email: text().notNull().primaryKey(),
	name: text().notNull(),
	...auditFields,
});
