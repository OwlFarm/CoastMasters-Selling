import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getFeaturedYachts } from '@/services/yacht-service';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, GitCompareArrows, MapPin, Calendar, Ship, Ruler, Anchor, Fuel, Droplets } from 'lucide-react';

export default async function YachtDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch this specific yacht from the DB
  // For now, we'll find it in our static data.
  const yachts = await getFeaturedYachts();
  const yacht = yachts.find(y => y.id === params.id);

  if (!yacht) {
    notFound();
  }

  const specifications = [
    { label: 'Year', value: yacht.year, icon: Calendar },
    { label: 'Length', value: `${yacht.length} ft`, icon: Ruler },
    { label: 'Type', value: yacht.boatType, icon: Ship },
    { label: 'Condition', value: yacht.condition, icon: Anchor },
    { label: 'Location', value: yacht.location, icon: MapPin },
    { label: 'Fuel Type', value: yacht.fuelType, icon: Fuel },
    { label: 'Hull Material', value: yacht.hullMaterial, icon: Droplets },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={yacht.imageUrl}
                  alt={`Image of ${yacht.name}`}
                  fill
                  className="object-cover"
                  data-ai-hint={yacht.imageHint}
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(yacht.images || []).slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-video w-full overflow-hidden rounded-md">
                     <Image
                        src={img}
                        alt={`Image ${i + 1} of ${yacht.name}`}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-110"
                      />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-base">{yacht.listingType}</Badge>
                 <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Favorite</span>
                    </Button>
                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                      <GitCompareArrows className="h-4 w-4" />
                      <span className="sr-only">Compare</span>
                    </Button>
                  </div>
              </div>
              <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight md:text-4xl">
                {yacht.name}
              </h1>
              <p className="mt-4 text-3xl font-bold text-primary">${yacht.price.toLocaleString()}</p>
              
              <div className="mt-8">
                 <h2 className="text-xl font-semibold border-b pb-2">Description</h2>
                 <p className="mt-4 text-muted-foreground">{yacht.description || "No description available."}</p>
              </div>

               <div className="mt-8">
                 <h2 className="text-xl font-semibold border-b pb-2">Specifications</h2>
                 <div className="grid grid-cols-2 gap-4 mt-4">
                  {specifications.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <p className="text-md font-semibold">{value}</p>
                      </div>
                    </div>
                  ))}
                 </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
