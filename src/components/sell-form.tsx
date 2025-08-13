
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader } from './ui/card';

const SellFormClient = dynamic(() => import('./sell-form-client').then(mod => mod.SellForm), { 
    ssr: false,
    loading: () => (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
    )
});

export function SellForm() {
  return <SellFormClient />;
}
