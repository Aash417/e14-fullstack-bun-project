import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create-expense')({
	component: CreateExpense,
});

function CreateExpense() {
	return (
		<div className='p-2'>
			<h2>Create Expense</h2>
			<form action='' className='max-w-xl m-auto'>
				<Label htmlFor='email'>Title</Label>
				<Input type='text' id='title' placeholder='Title' />
				<Label htmlFor='email'>Amount</Label>
				<Input type='text' id='amount' placeholder='Amount' />
				<Button type='submit'>Submit</Button>
			</form>
		</div>
	);
}
