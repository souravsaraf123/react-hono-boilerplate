import { conversationTable } from '@api/db/tables/conversation.table';
import type { messageTable } from '@api/db/tables/message.table';
import { chatUserTable } from '@api/db/tables/chatUser.table';

export type Conversation = typeof conversationTable.$inferSelect;
export type NewConversation = typeof conversationTable.$inferInsert;

export type ChatUser = typeof chatUserTable.$inferSelect;
export type NewChatUser = typeof chatUserTable.$inferInsert;

export type Message = typeof messageTable.$inferSelect;
export type NewMessage = typeof messageTable.$inferInsert;
