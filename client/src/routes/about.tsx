import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
	component: () => <div className='max-w-xl m-auto'>coming soon</div>,
});
