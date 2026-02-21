import { DisplayLoader } from '@/components/displayLoader';
import { DisplayError } from '@/components/displayError';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const router = createRouter({
	routeTree,
	defaultPendingMs: 300, // Only show loader if navigation takes longer than 300ms
	defaultPendingComponent: DisplayLoader,
	defaultErrorComponent: props => <DisplayError title={props.error.name} message={props.error.message} />,
});

// Register the router instance for type safety
declare module '@tanstack/react-router'
{
	interface Register
	{
		router: typeof router;
	}
}
