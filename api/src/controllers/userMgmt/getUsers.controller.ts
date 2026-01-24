import { userTable } from '@api/db/tables/user';
import { db } from '@api/db/connection';
import { eq } from 'drizzle-orm';

export async function getUsers()
{
	return await db.select().from(userTable);
}

