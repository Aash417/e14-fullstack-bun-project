import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

async function getTotalSpent() {
	const result = await api.expense['totalSpent'].$get();
	if (!result.ok) {
		throw new Error('server error');
	}
	const data = await result.json();
	return data;
}

function Index() {
	const { isPending, error, data } = useQuery({
		queryKey: ['totalSpent'],
		queryFn: getTotalSpent,
	});

	// if (isPending) return 'Loading...';
	if (error) return 'An error occurred..';

	return (
		<Card className='w-[350px] m-auto'>
			<CardHeader>
				<CardTitle>Total spent</CardTitle>
				<CardDescription>Total amount you have spent </CardDescription>
			</CardHeader>
			<CardContent>{isPending ? '...' : data.total}</CardContent>
		</Card>
	);
}

export const Route = createFileRoute('/_authenticated/')({
	component: Index,
});
