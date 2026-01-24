import { userTable } from '@api/db/tables/user';
import { db } from '@api/db/connection';
import { eq } from 'drizzle-orm';

export async function getUserById(id: number)
{
	const users = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1);
	return users[0] || null;
}

