import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Conversation, Message } from '@api/shared/dbTypes';
import { createFileRoute } from '@tanstack/react-router';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { Send } from 'lucide-react';
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

		setIsSubmitting(true);
		try
		{
			// Send message
			const textChatResponse = await api.chatmgmt.textChat.$post({
				json: {
					conversationId,
					userPrompt: message.trim(),
				},
			});
			const textChatData = await textChatResponse.json();
			const { userMessage, assistantMessage } = textChatData.data;

			// Update React Query cache with new messages
			const queryKey = ['conversation', conversationId];
			const currentData = conversationData;
			if (currentData)
			{
				// Use setQueryData to update the cache
				queryClient.setQueryData(queryKey, {
					...currentData,
					messages: [...currentData.messages, userMessage, assistantMessage],
				});
			}

			setMessage('');
		}
		catch (error)
		{
			console.error('Error sending message:', error);
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
						{messages.map((msg: Message) => (
							<div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
								<div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
									<div className="text-sm leading-relaxed break-words whitespace-pre-wrap">{msg.content}</div>
								</div>
							</div>
						))}
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
