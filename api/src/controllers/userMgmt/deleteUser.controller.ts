import { userTable } from '@api/db/tables/user';
import { db } from '@api/db/connection';
import { eq } from 'drizzle-orm';

export async function deleteUser(id: number)
{
	await db.delete(userTable).where(eq(userTable.id, id));
}
