import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

function App() {
	const [totalSpent, setTotalSpent] = useState(0);

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
