import Image from 'next/image';
import type { Yacht } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, GitCompareArrows, MapPin, Calendar, Sailboat } from 'lucide-react';

type YachtCardProps = {
  yacht: Yacht;
};

export function YachtCard({ yacht }: YachtCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={yacht.imageUrl}
            alt={`Image of ${yacht.name}`}
            width={600}
            height={400}
            className="h-56 w-full object-cover"
            data-ai-hint={yacht.imageHint}
          />
          <div className="absolute top-3 right-3 flex gap-2">
             <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/30">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Favorite</span>
            </Button>
             <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/30">
              <GitCompareArrows className="h-4 w-4" />
              <span className="sr-only">Compare</span>
            </Button>
          </div>
          <Badge variant="secondary" className="absolute bottom-3 left-3">{yacht.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl font-bold">{yacht.name}</CardTitle>
        <div className="text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 shrink-0" /> <span>{yacht.location}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{yacht.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ruler"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L3 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0L15.3 9l-3.4 3.4 6.4 6.3zm-6.4-6.4 6.3-6.3"/><path d="m3 21 9-9"/></svg>
              <span>{yacht.length} ft</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-2xl font-headline font-semibold text-primary">
          ${yacht.price.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline">View Details</Button>
      </CardFooter>
    </Card>
  );
}
