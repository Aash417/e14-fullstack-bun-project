import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
	component: Root,
});

function NavBar() {
	return (
		<div className='flex gap-2 p-2'>
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
