import { userTable } from '@api/db/tables/user';

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;
