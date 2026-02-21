import { conversationTable } from '@api/db/tables/conversation.table';
import { chatUserTable } from '@api/db/tables/chatUser.table';

export type Conversation = typeof conversationTable.$inferSelect;
export type NewConversation = typeof conversationTable.$inferInsert;

export type ChatUser = typeof chatUserTable.$inferSelect;
export type NewChatUser = typeof chatUserTable.$inferInsert;
