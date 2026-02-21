import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { router } from '@/router';

export function Sidebar()
{
	const {
		data: conversations,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['conversations'],
		queryFn: async () =>
		{
			const response = await api.chatmgmt.listConversationsForUser.$get();
			const res = await response.json();
			return res.data;
		},
	});

	return (
		<aside className="border-border bg-muted/30 hidden flex-col gap-4 border-r p-4 md:flex">
			<Button
				variant="default"
				className="w-full justify-start gap-2"
				onClick={() =>
				{
					router.navigate({
						to: '/',
					});
				}}>
				<Plus className="size-4" />
				New Chat
			</Button>

			<div className="flex flex-col gap-2">
				<h2 className="text-muted-foreground px-2 text-sm font-semibold">Your Chats</h2>
				<div className="flex flex-col gap-1">
					{isLoading && <div className="text-muted-foreground px-2 py-2 text-sm">Loading...</div>}
					{error && <div className="text-destructive px-2 py-2 text-sm">Error loading chats</div>}
					{!isLoading && !error && conversations && conversations.length === 0 && (
						<div className="text-muted-foreground px-2 py-2 text-sm">No chats yet</div>
					)}
					{!isLoading && !error && conversations && conversations.length > 0 && (
						<div className="flex flex-col gap-1">
							{conversations.map(conversation => (
								<div key={conversation.id} className="text-muted-foreground px-2 py-2 text-sm">
									Chat-{conversation.id}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</aside>
	);
}
