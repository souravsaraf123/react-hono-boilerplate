import { userTable } from '@api/db/tables/user';
import { db } from '@api/db/connection';
import { eq } from 'drizzle-orm';
import { User } from '@api/shared/dbTypes';

export async function updateUser(id: number, user: Partial<Pick<User, 'name' | 'email'>>)
{
	const updatedUsers = await db
		.update(userTable)
		.set(user)
		.where(eq(userTable.id, id))
		.returning();
	return updatedUsers[0] || null;
}

