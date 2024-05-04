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
		<div className=''>
			<p>Hello {data?.user.given_name}</p>
			<a href='/api/logout'>out..</a>
		</div>
	);
}
