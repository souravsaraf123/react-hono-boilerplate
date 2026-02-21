import { chatUserTable } from '@api/db/tables/chatUser.table';
import { closeDb, db } from '@api/db/connection';

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

	await db.insert(chatUserTable).values(users);
	console.log('Chat Users seeded successfully');

	await closeDb();
}

main().catch(console.error);
