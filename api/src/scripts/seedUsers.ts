import { closeDb, db } from '@api/db/connection';
import { userTable } from '@api/db/tables/user';

async function main()
{
	let users = [
		{
			name: 'John Doe',
			email: 'john.doe@example.com',
		},
		{
			name: 'Sarah Wilson',
			email: 'sarah.wilson@example.com',
		},
	];

	await db.insert(userTable).values(users);
	console.log('Users seeded successfully');

	await closeDb();
}

main().catch(console.error);
