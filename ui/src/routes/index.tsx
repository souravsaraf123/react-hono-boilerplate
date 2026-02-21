import { createFileRoute } from '@tanstack/react-router';
import { Plus, MessageSquare, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const Route = createFileRoute('/')({
	component: () =>
	{
		const [message, setMessage] = useState('');

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
		{
			e.preventDefault();
			// TODO: Add API call later
			console.log('Message:', message);
			setMessage('');
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
				<aside className="border-border bg-muted/30 hidden flex-col gap-4 border-r p-4 md:flex">
					<Button
						variant="default"
						className="w-full justify-start gap-2"
						onClick={() =>
						{
							// TODO: Add functionality later
							console.log('New Chat clicked');
						}}>
						<Plus className="size-4" />
						New Chat
					</Button>

					<div className="flex flex-col gap-2">
						<h2 className="text-muted-foreground px-2 text-sm font-semibold">Your Chats</h2>
						<div className="flex flex-col gap-1">
							{/* Placeholder for chat list - will be populated later */}
							<div className="text-muted-foreground px-2 py-2 text-sm">No chats yet</div>
						</div>
					</div>
				</aside>

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
								<Button type="submit" size="icon" className="h-[50px] w-[50px] shrink-0 md:h-[55px] md:w-[55px]" disabled={!message.trim()}>
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
