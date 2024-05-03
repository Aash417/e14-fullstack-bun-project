import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/expenses')({
	component: Expenses,
});

async function getTotalSpent() {
	const result = await api.expense.$get();
	if (!result.ok) {
		throw new Error('server error');
	}
	const data = await result.json();
	return data;
}

function Expenses() {
	const { isPending, error, data } = useQuery({
		queryKey: ['allExpenses'],
		queryFn: getTotalSpent,
	});

	// if (isPending) return 'Loading...';
	if (error) return 'An error occurred..' + error.message;

	return <div className=''></div>;
}
