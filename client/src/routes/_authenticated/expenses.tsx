import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/expenses')({
	component: Expenses,
});

async function getTotalSpent() {
	// await new Promise((r) => setTimeout(r, 2000));
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

	return (
		<Table className='max-w-3xl p-2 m-auto'>
			<TableHeader>
				<TableRow>
					<TableHead className='w-[100px]'>Id</TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{isPending
					? Array(3)
							.fill(0)
							.map((_, i) => (
								<TableRow key={i}>
									<TableCell>
										<Skeleton className='h-4' />
									</TableCell>
									<TableCell>
										<Skeleton className='h-4' />
									</TableCell>
									<TableCell>
										<Skeleton className='h-4' />
									</TableCell>
								</TableRow>
							))
					: data?.expenses.map((expense) => (
							<TableRow key={expense.id}>
								<TableCell className='font-medium'>{expense.id}</TableCell>
								<TableCell>{expense.title}</TableCell>
								<TableCell>{expense.amount}</TableCell>
							</TableRow>
						))}
			</TableBody>
		</Table>
	);
}
