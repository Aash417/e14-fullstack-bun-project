import { type ApiRoute } from '@server/app';
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
