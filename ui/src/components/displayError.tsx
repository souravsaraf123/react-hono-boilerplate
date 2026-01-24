import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface DisplayErrorProps
{
	title: string;
	message: string;
}

export function DisplayError({ title, message }: DisplayErrorProps)
{
	return (
		<div className="flex h-full items-center justify-center bg-background">
			<Card className="w-full max-w-[576px] p-6">
				<CardHeader>
					<CardTitle className="flex items-center justify-center text-3xl font-bold text-destructive">
						<AlertTriangle className="mr-2" size={32} />
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="whitespace-pre-wrap text-center text-lg text-foreground">{message}</p>
				</CardContent>
			</Card>
		</div>
	);
}
