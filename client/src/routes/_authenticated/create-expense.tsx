/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createExpense, getTotalExpenseQueryOptions } from '@/utils/api';
import type { FieldApi } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { toast } from 'sonner';
import { createExpenseSchema } from '../../../../server/commonTypes';

export const Route = createFileRoute('/_authenticated/create-expense')({
	component: CreateExpense,
});

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
	return (
		<>
			{field.state.meta.touchedErrors ? <em>{field.state.meta.touchedErrors}</em> : null}
			{field.state.meta.isValidating ? 'Validating...' : null}
		</>
	);
}

function CreateExpense() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			title: '',
			amount: '0',
			date: new Date().toISOString(),
		},
		onSubmit: async ({ value }) => {
			const existingExpenses = await queryClient.ensureQueryData(getTotalExpenseQueryOptions);

			navigate({ to: '/expenses' });

			//loading state
			queryClient.setQueryData(['loading-create-expense'], { expense: value });

			try {
				// success state
				const newExpense = await createExpense({ value });
				// manually setting your data in query client
				queryClient.setQueryData(getTotalExpenseQueryOptions.queryKey, [
					newExpense,
					...existingExpenses,
				]);
				toast('Expense created', {
					description: `Successfully created new Expense : ${newExpense.id}`,
				});
			} catch (error) {
				toast('Error', {
					description: 'Failed to create new expense',
				});
				// error state
			} finally {
				queryClient.setQueryData(['loading-create-expense'], {});
			}
		},
	});

	return (
		<div className='p-2'>
			<div className='max-w-xl m-auto'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.Field
						name='title'
						validatorAdapter={zodValidator}
						validators={{
							onChange: createExpenseSchema.shape.title,
						}}
						children={(field) => (
							<>
								<Label htmlFor={field.name}>Title</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<FieldInfo field={field} />
							</>
						)}
					/>
					<form.Field
						name='amount'
						children={(field) => (
							<>
								<Label htmlFor={field.name}>Amount</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type='number'
								/>
								<FieldInfo field={field} />
							</>
						)}
					/>
					<form.Field
						name='date'
						children={(field) => (
							<div className='self-center'>
								<Calendar
									mode='single'
									selected={new Date(field.state.value)}
									onSelect={(date) =>
										field.handleChange((date ?? new Date()).toISOString())
									}
									className='border rounded-md shadow'
								/>
								<FieldInfo field={field} />
							</div>
						)}
					/>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button type='submit' disabled={!canSubmit}>
								{isSubmitting ? '...' : 'Submit'}
							</Button>
						)}
					/>
				</form>
			</div>
		</div>
	);
}
