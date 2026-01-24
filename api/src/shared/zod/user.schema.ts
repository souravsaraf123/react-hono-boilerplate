import { z } from 'zod';

export const userSchema = z.object({
	name: z.string().min(1),
	email: z.string().email().min(1),
});

export const updateUserSchema = userSchema.partial();

export const userIdParamSchema = z.object({
	id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});
