import { MessageRole, MessageType } from '@api/shared/zod/chat.schema';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Conversation, Message } from '@api/shared/dbTypes';
import { createFileRoute } from '@tanstack/react-router';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { Send, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

type ConversationData = {
	conversation: Conversation;
	messages: Message[];
};

export const Route = createFileRoute('/conversation/$conversationId')({
	component: ConversationPage,
});

function ConversationPage()
{
	const { conversationId } = Route.useParams();
	const [message, setMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const {
		data: conversationData,
		isLoading,
		error,
	} = useQuery<ConversationData>({
		queryKey: ['conversation', conversationId],
		queryFn: async () =>
		{
			// Use direct fetch since Hono client may not handle colon routes well
			const baseUrl = import.meta.env.VITE_API_URL || '';
			const response = await fetch(`${baseUrl}/api/v1/chatmgmt/getConversationById/${conversationId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!response.ok)
			{
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to fetch conversation');
			}
			const res = await response.json();
			return res.data;
		},
		// Use cached data if available (from initial message injection)
		initialData: () =>
		{
			return queryClient.getQueryData<ConversationData>(['conversation', conversationId]);
		},
		// Use placeholderData to show cached data immediately while fetching
		placeholderData: () =>
		{
			return queryClient.getQueryData<ConversationData>(['conversation', conversationId]);
		},
		// If we have cached data, don't refetch immediately (staleTime from main.tsx will handle freshness)
		refetchOnMount: query =>
		{
			// Don't refetch if we have cached data that's still fresh
			const cached = queryClient.getQueryData<ConversationData>(['conversation', conversationId]);
			return !cached;
		},
	});

	// Auto-scroll to bottom when messages change
	useEffect(() =>
	{
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [conversationData?.messages]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
	{
		e.preventDefault();
		if (!message.trim() || isSubmitting)
		{
			return;
		}

		const userMessageText = message.trim();
		const queryKey = ['conversation', conversationId];
		const currentData = conversationData;

		// Clear textarea immediately
		setMessage('');
		setIsSubmitting(true);

		// Create optimistic user message
		const tempUserMessageId = `temp-user-${Date.now()}`;
		const tempAssistantMessageId = `temp-assistant-${Date.now()}`;
		const now = Date.now();

		const optimisticUserMessage: Message = {
			id: tempUserMessageId,
			conversationId,
			role: MessageRole.user,
			type: MessageType.text,
			content: userMessageText,
			createdAt: now,
			createdBy: 'user',
			updatedAt: now,
			updatedBy: 'user',
		} as Message;

		const optimisticAssistantMessage: Message = {
			id: tempAssistantMessageId,
			conversationId,
			role: MessageRole.assistant,
			type: MessageType.text,
			content: 'Thinking...',
			createdAt: now,
			createdBy: 'system',
			updatedAt: now,
			updatedBy: 'system',
		} as Message;

		// Optimistically update the cache with user message and loading indicator
		if (currentData)
		{
			queryClient.setQueryData(queryKey, {
				...currentData,
				messages: [...currentData.messages, optimisticUserMessage, optimisticAssistantMessage],
			});
		}

		try
		{
			// Send message
			const textChatResponse = await api.chatmgmt.textChat.$post({
				json: {
					conversationId,
					userPrompt: userMessageText,
				},
			});
			const textChatData = await textChatResponse.json();
			const { userMessage, assistantMessage } = textChatData.data;

			// Replace optimistic messages with real ones
			if (currentData)
			{
				// Remove temporary messages and add real ones
				const messagesWithoutTemp = currentData.messages.filter(msg => msg.id !== tempUserMessageId && msg.id !== tempAssistantMessageId);
				queryClient.setQueryData(queryKey, {
					...currentData,
					messages: [...messagesWithoutTemp, userMessage, assistantMessage],
				});
			}
		}
		catch (error)
		{
			console.error('Error sending message:', error);
			// Remove optimistic messages on error
			if (currentData)
			{
				const messagesWithoutTemp = currentData.messages.filter(msg => msg.id !== tempUserMessageId && msg.id !== tempAssistantMessageId);
				queryClient.setQueryData(queryKey, {
					...currentData,
					messages: messagesWithoutTemp,
				});
				// Restore the message text so user can retry
				setMessage(userMessageText);
			}
		}
		finally
		{
			setIsSubmitting(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
	{
		if (e.key === 'Enter' && !e.shiftKey)
		{
			e.preventDefault();
			const form = e.currentTarget.form;
			if (form)
			{
				form.requestSubmit();
			}
		}
	};

	if (isLoading && !conversationData)
	{
		return (
			<div className="bg-background grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
				<Sidebar />
				<main className="flex h-full items-center justify-center">
					<div className="text-muted-foreground">Loading conversation...</div>
				</main>
			</div>
		);
	}

	if (error)
	{
		return (
			<div className="bg-background grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
				<Sidebar />
				<main className="flex h-full items-center justify-center">
					<div className="text-destructive">Error loading conversation</div>
				</main>
			</div>
		);
	}

	const messages = conversationData?.messages || [];

	return (
		<div className="bg-background grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
			<Sidebar />

			<main className="flex h-full flex-col">
				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-4 md:p-8">
					<div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
						{messages.length === 0 && (
							<div className="text-muted-foreground flex h-full items-center justify-center text-center">
								No messages yet. Start the conversation!
							</div>
						)}
						{messages.map((msg: Message) =>
						{
							const isLoading = msg.id.startsWith('temp-assistant-');
							return (
								<div key={msg.id} className={`flex gap-4 ${msg.role === MessageRole.user ? 'justify-end' : 'justify-start'}`}>
									<div
										className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === MessageRole.user ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
										{isLoading ? (
											<div className="flex items-center gap-2">
												<Loader2 className="h-4 w-4 animate-spin" />
												<span className="text-muted-foreground text-sm">Thinking...</span>
											</div>
										) : (
											<div className="text-sm leading-relaxed break-words whitespace-pre-wrap">{msg.content}</div>
										)}
									</div>
								</div>
							);
						})}
						<div ref={messagesEndRef} />
					</div>
				</div>

				{/* Input Area */}
				<div className="border-border border-t p-4 md:p-8">
					<div className="mx-auto w-full max-w-3xl">
						<form onSubmit={handleSubmit} className="flex items-center gap-2">
							<div className="relative flex-1">
								<Textarea
									value={message}
									onChange={e => setMessage(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
									className="max-h-[200px] min-h-[80px] resize-none pr-12 md:min-h-[100px]"
									rows={1}
									disabled={isSubmitting}
								/>
							</div>
							<Button
								type="submit"
								size="icon"
								className="h-[50px] w-[50px] shrink-0 md:h-[55px] md:w-[55px]"
								disabled={!message.trim() || isSubmitting}>
								<Send className="size-4 md:size-5" />
								<span className="sr-only">Send message</span>
							</Button>
						</form>
					</div>
				</div>
			</main>
		</div>
	);
}
