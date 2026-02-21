import { NewConversation } from '@/components/NewConversation';
import { createFileRoute } from '@tanstack/react-router';
import { Sidebar } from '@/components/Sidebar';

export const Route = createFileRoute('/')({
	component: () =>
	{
		return (
			<div className="bg-background grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
				{/* Sidebar */}
				<Sidebar />

				{/* Main Content */}
				<NewConversation />
			</div>
		);
	},
});
