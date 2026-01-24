import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { XCircle } from 'lucide-react';

export default function NotFound()
{
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="flex items-center justify-center text-4xl font-bold text-red-500">
						<XCircle className="mr-2" size={36} />
						404
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-4 text-center text-gray-600">Oops! The page you're looking for doesn't exist.</p>
					<p className="text-center text-sm text-gray-500">It might have been moved or deleted.</p>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button asChild>
						<Link to="/">Go back home</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
