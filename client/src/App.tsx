import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

function App() {
	const [totalSpent, setTotalSpent] = useState(0);

	useEffect(() => {
		async function total() {
			const res = await fetch('/api/expense/totalSpent');
			const data = await res.json();
			setTotalSpent(data.total);
		}
		total();
	}, []);

	return (
		<Card className='w-[350px] m-auto'>
			<CardHeader>
				<CardTitle>Total spent</CardTitle>
				<CardDescription>Total amount you have spent </CardDescription>
			</CardHeader>
			<CardContent>{totalSpent}</CardContent>
		</Card>
	);
}

export default App;
