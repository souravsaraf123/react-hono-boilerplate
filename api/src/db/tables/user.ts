import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { auditFields } from '@api/db/auditFields';

export const userTable = pgTable('user', {
	id: integer().generatedAlwaysAsIdentity(),
	name: text().notNull(),
	email: text().notNull().unique(),
	...auditFields,
});
