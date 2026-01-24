import { createRootRouteWithContext, HeadContent } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import NotFound from '@/components/notFound';
import '../index.css';

export const Route = createRootRouteWithContext()({
	component: () => (
		<>
			<HeadContent />
			<Outlet />
		</>
	),
	notFoundComponent: NotFound,
	head: () => ({
		meta: [
			{
				title: 'Boilerplate',
			},
		],
	}),
});
