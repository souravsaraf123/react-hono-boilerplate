import { bigint, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const pgNow = sql`round(EXTRACT(epoch FROM now()) * 1000::numeric)`;

export const auditFields = {
	createdAt: bigint({ mode: 'number' }).notNull().default(pgNow),
	createdBy: varchar({ length: 255 }).notNull().default('admin'),
	updatedAt: bigint({ mode: 'number' }).notNull().default(pgNow),
	updatedBy: varchar({ length: 255 }).notNull().default('admin'),
};
