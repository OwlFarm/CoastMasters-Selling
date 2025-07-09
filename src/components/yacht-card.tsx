
import Image from 'next/image';
import Link from 'next/link';
import type { Yacht } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, GitCompareArrows, MapPin, Calendar, Ruler } from 'lucide-react';

type YachtCardProps = {
  yacht: Yacht;
};

export function YachtCard({ yacht }: YachtCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/yachts/${yacht.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${yacht.name}`}>
        <span className="sr-only">View Details</span>
      </Link>
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
             <Button size="icon" variant="secondary" className="relative z-20 h-8 w-8 rounded-full bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/30">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Favorite</span>
            </Button>
             <Button size="icon" variant="secondary" className="relative z-20 h-8 w-8 rounded-full bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/30">
              <GitCompareArrows className="h-4 w-4" />
              <span className="sr-only">Compare</span>
            </Button>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Badge variant="secondary">{yacht.boatType}</Badge>
            <Badge variant={yacht.listingType === 'Broker' ? 'default' : 'outline'}>{yacht.listingType}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">{yacht.name}</CardTitle>
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
               <Ruler className="h-4 w-4" />
              <span>{yacht.length} ft</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-2xl font-headline font-semibold text-primary">
          ${yacht.price.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
