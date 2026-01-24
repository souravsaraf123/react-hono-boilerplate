import { userTable } from '@api/db/tables/user';
import { NewUser } from '@api/shared/dbTypes';
import { db } from '@api/db/connection';

export async function createUser(user: NewUser)
{
	return await db.insert(userTable).values(user).returning();
}
