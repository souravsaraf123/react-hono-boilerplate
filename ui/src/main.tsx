import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { router } from './router';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		},
	},
});

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

// For HMR, reuse existing root if available
let root = (rootElement as any)._reactRootContainer;
if (!root) {
	root = createRoot(rootElement);
	(rootElement as any)._reactRootContainer = root;
}

root.render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>
);
