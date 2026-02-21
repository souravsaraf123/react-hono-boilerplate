import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: () =>
	{
		return (
			<div className="grid h-screen grid-cols-[auto_1fr]">
				<div className="flex flex-col gap-4">Sidebar</div>
				<div className="flex flex-col gap-4">Main Content</div>
			</div>
		);
	},
});
