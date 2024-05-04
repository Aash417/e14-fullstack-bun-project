import { userQueryOptions } from '@/utils/api';
import { Outlet, createFileRoute } from '@tanstack/react-router';

const Login = () => {
	return (
		<div className=''>
			you have to login
			<a href='/api/login'>login...</a>
		</div>
	);
};

const Component = () => {
	const { user } = Route.useRouteContext();
	if (!user) {
		return <Login />;
	}
	return <Outlet />;
};

// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;

		try {
			const data = await queryClient.fetchQuery(userQueryOptions);
			return data;
		} catch (error) {
			return { user: null };
		}
	},
	component: Component,
});
