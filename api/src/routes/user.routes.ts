import { userSchema, updateUserSchema, userIdParamSchema } from '@api/shared/zod/user.schema';
import { customZodValidator } from '@api/middlewares/customZodValidator.middleware';
import { getUserById } from '@api/controllers/userMgmt/getUserById.controller';
import { updateUser } from '@api/controllers/userMgmt/updateUser.controller';
import { deleteUser } from '@api/controllers/userMgmt/deleteUser.controller';
import { createUser } from '@api/controllers/userMgmt/createUser.controller';
import { getUsers } from '@api/controllers/userMgmt/getUsers.controller';
import { Hono } from 'hono';

export const userRouter = new Hono()
	// Get all users route
	.get('/', async c =>
	{
		const users = await getUsers();
		return c.json(users);
	})
	// Get user by ID route
	.get('/:id', customZodValidator('param', userIdParamSchema), async c =>
	{
		const { id } = c.req.valid('param');
		const user = await getUserById(id);
		if (!user)
		{
			return c.json({ message: 'User not found' }, 404);
		}
		return c.json(user);
	})
	// Create user route
	.post('/create', customZodValidator('json', userSchema), async c =>
	{
		const user = c.req.valid('json');
		const newUser = await createUser(user);
		return c.json(newUser);
	})
	// Update user route
	.put('/:id', customZodValidator('param', userIdParamSchema), customZodValidator('json', updateUserSchema), async c =>
	{
		const { id } = c.req.valid('param');
		const userData = c.req.valid('json');
		const updatedUser = await updateUser(id, userData);
		if (!updatedUser)
		{
			return c.json({ message: 'User not found' }, 404);
		}
		return c.json(updatedUser);
	})
	// Delete user route
	.delete('/:id', customZodValidator('param', userIdParamSchema), async c =>
	{
		const { id } = c.req.valid('param');
		await deleteUser(id);
		return c.json({ message: 'User deleted successfully' });
	});
