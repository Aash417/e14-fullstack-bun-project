import { Button } from '@/components/ui/button';
import { userQueryOptions } from '@/utils/api';
import { Outlet, createFileRoute } from '@tanstack/react-router';

const Login = () => {
	return (
		<div className='flex flex-col max-w-xl gap-6 m-auto'>
			<h3>You are not logged in</h3>
			<Button asChild className='w-20'>
				<a href='/api/login'>login</a>
			</Button>
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
