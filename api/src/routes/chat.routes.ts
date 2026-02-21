import { listConversationsForUser } from '@api/controllers/chatmgmt/listConversationsForUser.controller';
import { getConversationById } from '@api/controllers/chatmgmt/getConversationById.controller';
import { createConversation } from '@api/controllers/chatmgmt/createConversation.controller';
import { conversationIdSchema, userMessageInputSchema } from '@api/shared/zod/chat.schema';
import { customZodValidator } from '@api/middlewares/customZodValidator.middleware';
import { textChat } from '@api/controllers/chatmgmt/textChat.controller';
import { EMAIL } from '@api/shared/appConfig';
import { Hono } from 'hono';

export const chatRouter = new Hono()
	.post('/createConversation', async c =>
	{
		const response = await createConversation();
		return c.json({ data: response });
	})
	.post('/textChat', customZodValidator('json', userMessageInputSchema), async c =>
	{
		const { conversationId, userPrompt } = c.req.valid('json');
		const response = await textChat(conversationId, userPrompt);
		return c.json({ data: response });
	})
	.get('/listConversationsForUser', async c =>
	{
		const response = await listConversationsForUser(EMAIL!);
		return c.json({ data: response });
	})
	.get('/getConversationById/:conversationId', customZodValidator('param', conversationIdSchema), async c =>
	{
		const { conversationId } = c.req.valid('param');
		const response = await getConversationById(conversationId);
		return c.json({ data: response });
	});
