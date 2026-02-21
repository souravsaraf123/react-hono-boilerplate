import { Link, useRouterState } from '@tanstack/react-router';
import type { Conversation } from '@api/shared/dbTypes';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { router } from '@/router';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

export function Sidebar()
{
	const {
		data: conversations,
		isLoading,
		error,
	} = useQuery<Conversation[]>({
		queryKey: ['conversations'],
		queryFn: async () =>
		{
			const response = await api.chatmgmt.listConversationsForUser.$get();
			const res = await response.json();
			return res.data;
		},
	});

	// Get the current conversation ID from the route
	const currentPathname = useRouterState({
		select: state => state.location.pathname,
	});
	const currentConversationId = currentPathname.startsWith('/conversation/') ? currentPathname.split('/conversation/')[1]?.split('/')[0] : undefined;

	return (
		<aside className="border-border bg-muted/30 hidden flex-col gap-4 border-r p-4 md:flex">
			<Button
				variant="outline-primary"
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
							{conversations.map(conversation =>
							{
								const isActive = conversation.id === currentConversationId;
								return (
									<Link
										key={conversation.id}
										to="/conversation/$conversationId"
										params={{ conversationId: conversation.id }}
										className={cn(
											'rounded-md px-2 py-2 text-sm transition-colors',
											isActive
												? 'bg-primary text-primary-foreground font-medium'
												: 'text-muted-foreground hover:bg-muted hover:text-foreground'
										)}>
										Chat-{conversation.id.slice(0, 8)}...
									</Link>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</aside>
	);
}
