import { type ApiRoute } from '@server/app';
import { type CreateExpense } from '@server/commonTypes';
import { queryOptions } from '@tanstack/react-query';
import { hc } from 'hono/client';
const client = hc<ApiRoute>('/');

export const api = client.api;

async function getCurrentUser() {
	const result = await api.me.$get();
	if (!result.ok) {
		throw new Error('server error');
	}
	const data = await result.json();
	return data;
}

export const userQueryOptions = queryOptions({
	queryKey: ['currentUser'],
	queryFn: getCurrentUser,
	staleTime: Infinity,
});

export const getTotalExpenseQueryOptions = queryOptions({
	queryKey: ['allExpenses'],
	queryFn: getTotalSpent,
	staleTime: 1000 * 60 * 5,
});

export const loadingCreateExpenseQueryOptions = queryOptions<{ expense?: CreateExpense }>({
	queryKey: ['loading-create-expense'],
	queryFn: async () => {
		return {};
	},
	staleTime: Infinity,
});

export async function getTotalSpent() {
	// await new Promise((r) => setTimeout(r, 2000));
	const result = await api.expense.$get();
	if (!result.ok) {
		throw new Error('server error');
	}
	const data = await result.json();
	return data;
}

export async function createExpense({ value }: { value: CreateExpense }) {
	await new Promise((r) => setTimeout(r, 2000));
	const res = await api.expense.$post({ json: value });
	if (!res.ok) throw new Error('server error');

	const newExpense = await res.json();
	return newExpense;
}

export async function deleteExpense({ id }: { id: number }) {
	await new Promise((r) => setTimeout(r, 2000));
	const res = await api.expense[':id{[0-9]+}'].$delete({ param: { id: String(id) } });

	if (!res.ok) throw new Error('server error');
}
