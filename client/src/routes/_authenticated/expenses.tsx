import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { deleteExpense, getTotalExpenseQueryOptions } from '@/utils/api';
import { TrashIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/expenses')({
	component: Expenses,
});

function Expenses() {
	const { isPending, error, data } = useQuery(getTotalExpenseQueryOptions);
	const { data: loadingCreateExpense } = useQuery({
		queryKey: ['loading-create-expense'],
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
					<TableHead>Date</TableHead>
					<TableHead>Delete</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{loadingCreateExpense?.expense && (
					<TableRow>
						<TableCell className='font-medium'>
							<Skeleton className='h-4' />
						</TableCell>
						<TableCell>
							<Skeleton className='h-4' />
						</TableCell>
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
				)}
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
									<TableCell>
										<Skeleton className='h-4' />
									</TableCell>
									<TableCell>
										<Skeleton className='h-4' />
									</TableCell>
								</TableRow>
							))
					: data?.map((expense) => (
							<TableRow key={expense.id}>
								<TableCell className='font-medium'>{expense.id}</TableCell>
								<TableCell>{expense.title}</TableCell>
								<TableCell>{expense.amount}</TableCell>
								<TableCell>{expense.date.split('T')[0]}</TableCell>
								<TableCell>
									<ExpenseDeleteButton id={expense.id} />
								</TableCell>
							</TableRow>
						))}
			</TableBody>
		</Table>
	);
}

function ExpenseDeleteButton({ id }: { id: number }) {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: deleteExpense,
		onError: () =>
			toast('Error', {
				description: 'Failed to delete expense',
			}),
		onSuccess: () => {
			toast('Deleted', {
				description: 'Expense deleted successfully',
			});

			queryClient.setQueryData(getTotalExpenseQueryOptions.queryKey, (oldData) => {
				const newData = oldData!.filter((e) => e.id != id);
				return [...newData];
			});
		},
	});
	return (
		<Button
			disabled={isPending}
			onClick={() => {
				mutate({ id });
			}}
			variant='outline'
			size='icon'
		>
			{isPending ? '...' : <TrashIcon className='w-4 h-4' />}
		</Button>
	);
}
