import { createConversation } from '@api/controllers/chatmgmt/createConversation.controller';
import { customZodValidator } from '@api/middlewares/customZodValidator.middleware';
import { textChat } from '@api/controllers/chatmgmt/textChat.controller';
import { userMessageInputSchema } from '@api/shared/zod/chat.schema';
import { Hono } from 'hono';

export const chatRouter = new Hono()
	.post('/createConversation', async c =>
	{
		const conversation = await createConversation();
		return c.json({ conversation });
	})
	.post('/textChat', customZodValidator('json', userMessageInputSchema), async c =>
	{
		const { conversationId, userPrompt } = c.req.valid('json');
		const text = await textChat(conversationId, userPrompt);
		return c.json({ text });
	});
