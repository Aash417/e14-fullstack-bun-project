/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/utils/api';
import type { FieldApi } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

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
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			title: '',
			amount: '0',
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			const res = await api.expense.$post({ json: value });
			navigate({ to: '/expenses' });
			if (!res.ok) throw new Error('server error');
			console.log(value);
		},
	});

	return (
		<div className='p-2'>
			<h2>Create Expense</h2>
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
