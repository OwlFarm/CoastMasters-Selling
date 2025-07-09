import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getFeaturedYachts } from '@/services/yacht-service';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, GitCompareArrows, MapPin, Calendar, Ship, Ruler, Anchor, Fuel, Droplets, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  hullMaterialOptions,
  hullShapeOptions,
  bowShapeOptions,
  keelTypeOptions,
  rudderTypeOptions,
  propellerTypeOptions,
  usageStyles,
  featureOptions,
  deckOptions,
  cabinOptions,
  fuelTypes
} from '@/lib/data';
import type { Yacht } from '@/lib/types';

const findLabel = (id: string | undefined, options: { id: string; label: string }[]) => {
  if (!id) return null;
  return options.find(opt => opt.id === id)?.label || null;
};

const renderFeatureList = (ids: string[] | undefined, options: { id: string; label: string }[]) => {
  if (!ids || ids.length === 0) {
    return <p className="text-muted-foreground italic">No specific features listed in this category.</p>;
  }

  const selectedFeatures = options.filter(opt => ids.includes(opt.id));

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 list-none p-0">
      {selectedFeatures.map(feature => (
        <li key={feature.id} className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <span>{feature.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default async function YachtDetailPage({ params }: { params: { id: string } }) {
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
    { label: 'Fuel Type', value: findLabel(yacht.fuelType, fuelTypes), icon: Fuel },
    { label: 'Hull Material', value: findLabel(yacht.hullMaterial, hullMaterialOptions), icon: Droplets },
  ];
  
  const hullAndEngineSpecs = [
    { label: 'Hull Shape', value: findLabel(yacht.hullShape, hullShapeOptions) },
    { label: 'Bow Shape', value: findLabel(yacht.bowShape, bowShapeOptions) },
    { label: 'Keel Type', value: findLabel(yacht.keelType, keelTypeOptions) },
    { label: 'Rudder Type', value: findLabel(yacht.rudderType, rudderTypeOptions) },
    { label: 'Propeller Type', value: findLabel(yacht.propellerType, propellerTypeOptions) },
  ].filter(spec => spec.value);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full">
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={yacht.imageUrl}
                alt={`Image of ${yacht.name}`}
                fill
                className="object-cover"
                data-ai-hint={yacht.imageHint}
                priority
              />
            </div>
        </section>

        <div className="container mx-auto px-4">
            <div className="py-4">
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
                  {(yacht.images || []).slice(0, 8).map((img, i) => (
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

           <section className="py-8 md:py-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="md:col-span-2">
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
                   <div className="mt-8">
                     <h2 className="text-xl font-semibold border-b pb-2">Description</h2>
                      <div className="mt-4 text-muted-foreground space-y-4">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p>
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p>
                          Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
                        </p>
                        <p>
                          Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.
                        </p>
                        <p>
                          Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Praesent sed nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia.
                        </p>
                      </div>
                  </div>
                  <div className="mt-12">
                    <h2 className="text-xl font-semibold border-b pb-2 mb-6">Full Details</h2>
                    <Tabs defaultValue="specifications" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                        <TabsTrigger value="specifications">Hull & Engine</TabsTrigger>
                        <TabsTrigger value="usage">Usage</TabsTrigger>
                        <TabsTrigger value="features">Equipment</TabsTrigger>
                        <TabsTrigger value="deck">Deck</TabsTrigger>
                        <TabsTrigger value="cabin">Cabin</TabsTrigger>
                      </TabsList>

                      <TabsContent value="specifications" className="mt-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {hullAndEngineSpecs.map(spec => (
                            <div key={spec.label}>
                              <p className="text-sm font-medium text-muted-foreground">{spec.label}</p>
                              <p className="text-md font-semibold">{spec.value}</p>
                            </div>
                          ))}
                        </div>
                        {yacht.otherSpecifications && (
                           <div className="mt-6 pt-4 border-t">
                              <p className="text-sm font-medium text-muted-foreground">Other Specifications</p>
                              <p className="text-md font-semibold whitespace-pre-line">{yacht.otherSpecifications}</p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="usage" className="mt-6">
                        {renderFeatureList(yacht.usageStyles, usageStyles)}
                      </TabsContent>

                      <TabsContent value="features" className="mt-6">
                        {renderFeatureList(yacht.features, featureOptions)}
                      </TabsContent>

                      <TabsContent value="deck" className="mt-6">
                        {renderFeatureList(yacht.deck, deckOptions)}
                      </TabsContent>

                      <TabsContent value="cabin" className="mt-6">
                        {renderFeatureList(yacht.cabin, cabinOptions)}
                      </TabsContent>
                    </Tabs>
                  </div>
              </div>

              <div className="md:col-span-1">
                 <div className="sticky top-24 rounded-lg border bg-card p-6 shadow-sm">
                    <p className="text-3xl font-bold text-primary">${yacht.price.toLocaleString()}</p>
                    <div className="mt-6">
                       <h2 className="text-xl font-semibold border-b pb-2 mb-4">Specifications</h2>
                       <div className="space-y-3">
                        {specifications.map(({ label, value, icon: Icon }) => (
                          value && <div key={label} className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-muted-foreground" />
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
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
