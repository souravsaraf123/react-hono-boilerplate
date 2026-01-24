import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisplayLoaderProps
{
	className?: string;
	message?: string;
}

export function DisplayLoader({ message, className }: DisplayLoaderProps)
{
	return (
		<div className={cn('grid h-full place-content-center place-items-center text-muted-foreground', className)}>
			<div className="flex items-center gap-2">
				<Loader className="h-5 w-5 animate-spin" />
				<p>{message || 'Loading...'}</p>
			</div>
		</div>
	);
}
