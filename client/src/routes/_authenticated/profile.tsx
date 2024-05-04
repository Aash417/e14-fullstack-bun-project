import { Button } from '@/components/ui/button';
import { userQueryOptions } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/profile')({
	component: Profile,
});

function Profile() {
	const { isLoading, error, data } = useQuery(userQueryOptions);

	if (isLoading) return 'loading ...';
	if (error) return 'not logged in';

	return (
		<div className='flex flex-col max-w-xl gap-6 m-auto'>
			<h3>Hello {data?.user.given_name}</h3>
			<Button asChild className='w-20'>
				<a href='/api/logout'>logout</a>
			</Button>
		</div>
	);
}
