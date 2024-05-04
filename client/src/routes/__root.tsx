import { type QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Root,
});

function NavBar() {
	return (
		<div className='flex max-w-2xl gap-2 p-2 m-auto'>
			<Link to='/' className='[&.active]:font-bold'>
				Home
			</Link>{' '}
			<Link to='/about' className='[&.active]:font-bold'>
				About
			</Link>
			<Link to='/expenses' className='[&.active]:font-bold'>
				Expenses
			</Link>
			<Link to='/create-expense' className='[&.active]:font-bold'>
				Create
			</Link>
			<Link to='/profile' className='[&.active]:font-bold'>
				Profile
			</Link>
		</div>
	);
}

function Root() {
	return (
		<>
			<NavBar />
			<hr />
			<Outlet />
			{/* <TanStackRouterDevtools /> */}
		</>
	);
}
