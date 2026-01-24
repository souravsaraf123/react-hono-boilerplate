import { userRouter } from '@api/routes/user.routes';
import { db, closeDb } from '@api/db/connection';
import { userTable } from '@api/db/tables/user';
import { testClient } from 'hono/testing';
import { after, test } from 'node:test';
import assert from 'node:assert';
import { eq } from 'drizzle-orm';

const client = testClient(userRouter, { env: {} });

// Helper function to clean up test data
async function cleanupTestUsers()
{
	await db.delete(userTable).where(eq(userTable.email, 'test@example.com'));
	await db.delete(userTable).where(eq(userTable.email, 'test2@example.com'));
	await db.delete(userTable).where(eq(userTable.email, 'updated@example.com'));
}

test('User CRUD API Tests', async t =>
{
	// Clean up before starting
	await cleanupTestUsers();

	let createdUserId: number;

	await t.test('GET / - Get all users (initially empty or with existing data)', async () =>
	{
		const res = await client.index.$get();
		assert.strictEqual(res.status, 200);
		const data = await res.json();
		assert(Array.isArray(data));
	});

	await t.test('POST /create - Create a new user', async () =>
	{
		const newUser = {
			name: 'Test User',
			email: 'test@example.com',
		};

		const res = await client.create.$post({
			json: newUser,
		});

		assert.strictEqual(res.status, 200);
		const data = await res.json();
		let user = data[0]!;
		assert.strictEqual(user.name, newUser.name);
		assert.strictEqual(user.email, newUser.email);
		assert(typeof user.id === 'number');
		createdUserId = user.id;
	});

	await t.test('POST /create - Create user with invalid email should fail', async () =>
	{
		const invalidUser = {
			name: 'Test User',
			email: 'invalid-email',
		};

		const res = await client.create.$post({
			json: invalidUser,
		});

		assert.strictEqual(res.status, 500); // Zod validation error
	});

	await t.test('POST /create - Create user with empty name should fail', async () =>
	{
		const invalidUser = {
			name: '',
			email: 'test2@example.com',
		};

		const res = await client.create.$post({
			json: invalidUser,
		});

		assert.strictEqual(res.status, 500); // Zod validation error
	});

	await t.test('GET /:id - Get user by ID', async () =>
	{
		const res = await client[':id'].$get({
			param: { id: createdUserId.toString() },
		});

		assert.strictEqual(res.status, 200);
		const data = await res.json();
		assert.strictEqual(data.id, createdUserId);
		assert.strictEqual(data.name, 'Test User');
		assert.strictEqual(data.email, 'test@example.com');
	});

	await t.test('GET /:id - Get user with invalid ID format should fail', async () =>
	{
		const res = await client[':id'].$get({
			param: { id: 'invalid-id' },
		});

		assert.strictEqual(res.status, 500); // Zod validation error
	});

	await t.test('GET /:id - Get non-existent user should return 404', async () =>
	{
		const res = await client[':id'].$get({
			param: { id: '99999' },
		});

		assert.strictEqual(res.status, 404);
		const data = await res.json();
		if (typeof data === 'object' && 'message' in data)
		{
			assert.strictEqual(data.message, 'User not found');
		}
		else
		{
			assert.fail('Expected object with message property');
		}
	});

	await t.test('PUT /:id - Update user (full update)', async () =>
	{
		const updateData = {
			name: 'Updated User',
			email: 'updated@example.com',
		};

		const res = await client[':id'].$put({
			param: { id: createdUserId.toString() },
			json: updateData,
		});

		assert.strictEqual(res.status, 200);
		const data = await res.json();
		assert.strictEqual(data.id, createdUserId);
		assert.strictEqual(data.name, updateData.name);
		assert.strictEqual(data.email, updateData.email);
	});

	await t.test('PUT /:id - Update user (partial update - name only)', async () =>
	{
		const updateData = {
			name: 'Partially Updated User',
		};

		const res = await client[':id'].$put({
			param: { id: createdUserId.toString() },
			json: updateData,
		});

		assert.strictEqual(res.status, 200);
		const data = await res.json();
		assert.strictEqual(data.id, createdUserId);
		assert.strictEqual(data.name, updateData.name);
		// Email should remain unchanged
		assert.strictEqual(data.email, 'updated@example.com');
	});

	await t.test('PUT /:id - Update user (partial update - email only)', async () =>
	{
		const updateData = {
			email: 'test2@example.com',
		};

		const res = await client[':id'].$put({
			param: { id: createdUserId.toString() },
			json: updateData,
		});

		assert.strictEqual(res.status, 200);
		const data = await res.json();
		assert.strictEqual(data.id, createdUserId);
		assert.strictEqual(data.email, updateData.email);
	});

	await t.test('PUT /:id - Update non-existent user should return 404', async () =>
	{
		const updateData = {
			name: 'Non-existent User',
		};

		const res = await client[':id'].$put({
			param: { id: '99999' },
			json: updateData,
		});

		assert.strictEqual(res.status, 404);
		const data = await res.json();
		if (typeof data === 'object' && 'message' in data)
		{
			assert.strictEqual(data.message, 'User not found');
		}
		else
		{
			assert.fail('Expected object with message property');
		}
	});

	await t.test('PUT /:id - Update user with invalid email should fail', async () =>
	{
		const invalidUpdate = {
			email: 'invalid-email',
		};

		const res = await client[':id'].$put({
			param: { id: createdUserId.toString() },
			json: invalidUpdate,
		});

		assert.strictEqual(res.status, 500); // Zod validation error
	});

	await t.test('DELETE /:id - Delete user', async () =>
	{
		const res = await client[':id'].$delete({
			param: { id: createdUserId.toString() },
		});

		assert.strictEqual(res.status, 200);
		const data = await res.json();
		assert.strictEqual(data.message, 'User deleted successfully');

		// Verify user is actually deleted
		const getRes = await client[':id'].$get({
			param: { id: createdUserId.toString() },
		});
		assert.strictEqual(getRes.status, 404);
	});

	await t.test('DELETE /:id - Delete non-existent user should succeed (idempotent)', async () =>
	{
		const res = await client[':id'].$delete({
			param: { id: '99999' },
		});

		assert.strictEqual(res.status, 200);
		const data = await res.json();
		assert.strictEqual(data.message, 'User deleted successfully');
	});

	await t.test('DELETE /:id - Delete with invalid ID format should fail', async () =>
	{
		const res = await client[':id'].$delete({
			param: { id: 'invalid-id' },
		});

		assert.strictEqual(res.status, 500); // Zod validation error
	});

	await t.test('GET / - Get all users after operations', async () =>
	{
		const res = await client.index.$get();
		assert.strictEqual(res.status, 200);
		const data = await res.json();
		assert(Array.isArray(data));
		// The test user should not be in the list
		const testUser = data.find((u: { id: number }) => u.id === createdUserId);
		assert.strictEqual(testUser, undefined);
	});

	// Clean up after all tests
	await cleanupTestUsers();
});

after(async () =>
{
	await closeDb();
});
