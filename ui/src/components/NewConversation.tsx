import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/main';
import { router } from '@/router';
import { api } from '@/lib/api';

export function NewConversation()
{
	const [message, setMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
	const isNavigatingRef = useRef(false);
	const isMountedRef = useRef(true);

	useEffect(() =>
	{
		return () =>
		{
			isMountedRef.current = false;
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
	{
		e.preventDefault();
		if (!message.trim() || isSubmitting || isNavigatingRef.current)
		{
			return;
		}

		const userMessageText = message.trim();

		// Clear textarea immediately and show user message
		setMessage('');
		setSubmittedMessage(userMessageText);
		setIsSubmitting(true);

		try
		{
			// Step 1: Create conversation
			const createConvResponse = await api.chatmgmt.createConversation.$post();
			const createConvData = await createConvResponse.json();
			const conversationId = createConvData.data.id;

			// Step 2: Send the first message
			const textChatResponse = await api.chatmgmt.textChat.$post({
				json: {
					conversationId,
					userPrompt: userMessageText,
				},
			});
			const textChatData = await textChatResponse.json();
			const { userMessage, assistantMessage } = textChatData.data;

			// Step 3: Inject messages into React Query cache
			const queryKey = ['conversation', conversationId];
			queryClient.setQueryData(queryKey, {
				conversation: createConvData.data,
				messages: [userMessage, assistantMessage],
			});

			// Step 3.5: Add new conversation to the conversations list cache
			const conversationsQueryKey = ['conversations'];
			const currentConversations = queryClient.getQueryData<(typeof createConvData.data)[]>(conversationsQueryKey);
			if (currentConversations)
			{
				// Add the new conversation at the beginning (most recent first)
				// Check if it doesn't already exist to avoid duplicates
				if (!currentConversations.some(conv => conv.id === conversationId))
				{
					queryClient.setQueryData(conversationsQueryKey, [createConvData.data, ...currentConversations]);
				}
			}

			// Step 4: Navigate to conversation page
			// Mark that we're navigating to prevent state updates
			isNavigatingRef.current = true;

			// Navigate without replace to avoid route matching issues
			router.navigate({
				to: '/conversation/$conversationId',
				params: { conversationId },
			});
		}
		catch (error)
		{
			console.error('Error creating conversation:', error);
			// Restore the message text so user can retry
			if (!isNavigatingRef.current && isMountedRef.current)
			{
				setMessage(userMessageText);
				setSubmittedMessage(null);
				setIsSubmitting(false);
			}
			// TODO: Show error message to user
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

	return (
		<main className="flex h-full items-center justify-center">
			<div className="-mt-16 flex w-full max-w-3xl flex-col items-center gap-6 p-4 md:-mt-20 md:gap-8 md:p-8">
				{/* Welcome Message */}
				{!submittedMessage && (
					<div className="space-y-2 text-center">
						<MessageSquare className="text-muted-foreground mx-auto size-10 md:size-12" />
						<h1 className="text-xl font-semibold md:text-2xl">How can I help you today?</h1>
						<p className="text-muted-foreground text-sm md:text-base">Start a conversation by typing a message below</p>
					</div>
				)}

				{/* User Message and Thinking Loader */}
				{submittedMessage && (
					<div className="flex w-full flex-col gap-6">
						{/* User Message */}
						<div className="flex justify-end gap-4">
							<div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl px-4 py-3">
								<div className="text-sm leading-relaxed break-words whitespace-pre-wrap">{submittedMessage}</div>
							</div>
						</div>
						{/* Thinking Loader */}
						{isSubmitting && (
							<div className="flex justify-start gap-4">
								<div className="bg-muted max-w-[85%] rounded-2xl px-4 py-3">
									<div className="flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										<span className="text-muted-foreground text-sm">Thinking...</span>
									</div>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Input Area */}
				<div className="w-full">
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
	);
}
