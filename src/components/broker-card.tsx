import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail } from 'lucide-react';

export type Broker = {
  id: string;
  name: string;
  agency: string;
  imageUrl: string;
  imageHint: string;
  location: string;
  specialties: string[];
  phone: string;
  email: string;
};

type BrokerCardProps = {
  broker: Broker;
};

export function BrokerCard({ broker }: BrokerCardProps) {
  return (
    <Card className="overflow-hidden rounded-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full">
          <Image
            src={broker.imageUrl}
            alt={`Portrait of ${broker.name}`}
            fill
            className="object-cover"
            data-ai-hint={broker.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold">{broker.name}</h3>
        <p className="text-md font-semibold text-primary">{broker.agency}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{broker.location}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {broker.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary">{specialty}</Badge>
          ))}
        </div>
        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
           <div className="flex items-center gap-2 text-muted-foreground">
             <Phone className="h-4 w-4" /> <span>{broker.phone}</span>
           </div>
           <div className="flex items-center gap-2 text-muted-foreground">
             <Mail className="h-4 w-4" /> <span>{broker.email}</span>
           </div>
        </div>
         <Button asChild className="mt-4 w-full relative z-10">
            <Link href={`/brokers/${broker.id}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
