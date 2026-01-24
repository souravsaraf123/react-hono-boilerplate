import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { router } from '@/router';

export const Route = createFileRoute('/')({
	component: () =>
	{
		return (
			<div className="grid h-screen place-items-center">
				<div className="flex flex-col gap-4">
					Welcome to the Boilerplate
					<Button onClick={() => router.navigate({ to: '/user' })}>Go to Users</Button>
				</div>
			</div>
		);
	},
});
