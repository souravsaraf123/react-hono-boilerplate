import { createFileRoute } from '@tanstack/react-router';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { queryClient } from '@/main';
import { router } from '@/router';
import { useState } from 'react';
import { api } from '@/lib/api';

export const Route = createFileRoute('/')({
	component: () =>
	{
		const [message, setMessage] = useState('');
		const [isSubmitting, setIsSubmitting] = useState(false);

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
				// Step 1: Create conversation
				const createConvResponse = await api.chatmgmt.createConversation.$post();
				const createConvData = await createConvResponse.json();
				const conversationId = createConvData.data.id;

				// Step 2: Send the first message
				const textChatResponse = await api.chatmgmt.textChat.$post({
					json: {
						conversationId,
						userPrompt: message.trim(),
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

				// Step 4: Navigate to conversation page
				// Use router.navigate for more reliable navigation
				await router.navigate({
					to: '/conversation/$conversationId',
					params: { conversationId },
					replace: true,
				});
			}
			catch (error)
			{
				console.error('Error creating conversation:', error);
				// TODO: Show error message to user
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

		return (
			<div className="bg-background grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
				{/* Sidebar */}
				<Sidebar />

				{/* Main Content */}
				<main className="flex h-full items-center justify-center">
					<div className="-mt-16 flex w-full max-w-3xl flex-col items-center gap-6 p-4 md:-mt-20 md:gap-8 md:p-8">
						{/* Welcome Message */}
						<div className="space-y-2 text-center">
							<MessageSquare className="text-muted-foreground mx-auto size-10 md:size-12" />
							<h1 className="text-xl font-semibold md:text-2xl">How can I help you today?</h1>
							<p className="text-muted-foreground text-sm md:text-base">Start a conversation by typing a message below</p>
						</div>

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
	},
});
