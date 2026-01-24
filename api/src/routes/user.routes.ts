import { customZodValidator } from '@api/middlewares/customZodValidator.middleware';
import { createUser } from '@api/controllers/userMgmt/createUser.controller';
import { userSchema } from '@api/shared/zod/user.schema';
import { Hono } from 'hono';

export const userRouter = new Hono()
	// Create user route
	.post('/create', customZodValidator('json', userSchema), async c =>
	{
		const user = c.req.valid('json');
		const newUser = await createUser(user);
		return c.json(newUser);
	});
