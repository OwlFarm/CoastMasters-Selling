
'use client';

import * as React from 'react';
import type { FormValues } from './sell-form';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, GitCompareArrows, MapPin, Calendar, Ship, Ruler, Anchor, Fuel, Droplets, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata, Option, RegionOption } from '@/services/metadata-service';
import { Card } from '@/components/ui/card';

type ListingPreviewProps = {
    data: FormValues;
    metadata: Metadata;
    heroImagePreview: string;
    galleryImagePreviews: string[];
}

const findLabel = (id: string | undefined, options: (Option | RegionOption)[]) => {
  if (!id) return null;
  
  for (const option of options) {
    if ('locations' in option) { // It's a RegionOption
      const foundLocation = option.locations.find(loc => loc.id === id);
      if (foundLocation) return foundLocation.label;
    } else { // It's a simple Option
      const valueToCompare = option.value ?? option.id;
      if (valueToCompare === id) return option.label;
    }
  }
  return null;
};

const renderFeatureList = (ids: string[] | undefined, options: Option[]) => {
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

export function ListingPreview({ data, metadata, heroImagePreview, galleryImagePreviews }: ListingPreviewProps) {
  const allLocations = metadata.locationsByRegion.flatMap(r => r.locations);
  const yacht = {
      name: data.title || `${data.year} ${findLabel(data.make, metadata.makes)} ${data.model}`,
      price: data.price || 0,
      year: data.year,
      length: data.length,
      location: findLabel(data.location, metadata.locationsByRegion) || 'N/A',
      imageUrl: heroImagePreview || 'https://placehold.co/600x400.png',
      images: galleryImagePreviews,
      make: findLabel(data.make, metadata.makes) || 'N/A',
      model: data.model,
      listingType: findLabel(data.listingType, metadata.listingTypes) || 'N/A',
      boatType: findLabel(data.boatType, metadata.boatTypes) || 'N/A',
      condition: findLabel(data.condition, metadata.conditions) || 'N/A',
      description: data.description,
      fuelType: data.fuelType,
      hullMaterial: data.hullMaterial,
      hullShape: data.hullShape,
      bowShape: data.bowShape,
      keelType: data.keelType,
      rudderType: data.rudderType,
      propellerType: data.propellerType,
      usageStyles: data.usageStyles,
      features: data.features,
      deck: data.deck,
      cabin: data.cabin,
      otherSpecifications: data.otherSpecifications,
  };


  const specifications = [
    { label: 'Year', value: yacht.year, icon: Calendar },
    { label: 'LOA', value: `${yacht.length} ft`, icon: Ruler },
    { label: 'Type', value: yacht.boatType, icon: Ship },
    { label: 'Condition', value: yacht.condition, icon: Anchor },
    { label: 'Location', value: yacht.location, icon: MapPin },
    { label: 'Fuel Type', value: findLabel(yacht.fuelType, metadata.fuelTypes), icon: Fuel },
    { label: 'Hull Material', value: findLabel(yacht.hullMaterial, metadata.hullMaterialOptions), icon: Droplets },
  ];
  
  const hullAndEngineSpecs = [
    { label: 'Hull Shape', value: findLabel(yacht.hullShape, metadata.hullShapeOptions) },
    { label: 'Bow Shape', value: findLabel(yacht.bowShape, metadata.bowShapeOptions) },
    { label: 'Keel Type', value: findLabel(yacht.keelType, metadata.keelTypeOptions) },
    { label: 'Rudder Type', value: findLabel(yacht.rudderType, metadata.rudderTypeOptions) },
    { label: 'Propeller Type', value: findLabel(yacht.propellerType, metadata.propellerTypeOptions) },
  ].filter(spec => spec.value);


  return (
    <div className="bg-background rounded-lg border p-4 sm:p-6 md:p-8">
        <main className="flex-1">
            <div className="container mx-auto px-0">
            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
                
                <div className="space-y-4 lg:col-span-2">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                    <Image
                    src={yacht.imageUrl}
                    alt={`Image of ${yacht.name}`}
                    fill
                    className="object-cover"
                    priority
                    />
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {yacht.images.slice(0, 5).map((img, i) => (
                        <div key={i} className="relative aspect-[3/2] w-full overflow-hidden rounded-md">
                            <Image
                            src={img}
                            alt={`Image ${i + 1} of ${yacht.name}`}
                            fill
                            className="object-cover"
                            />
                        </div>
                    ))}
                </div>
                </div>

                <div className="flex lg:col-span-1">
                <Card className="rounded-lg border bg-card p-6 shadow-sm w-full flex flex-col justify-between">
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
                    </div>
                    
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Key Specifications</h2>
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
                </Card>
                </div>
            </section>

            <section>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                    <h2 className="text-2xl font-semibold border-b pb-2">Description</h2>
                        <div className="mt-4 text-muted-foreground space-y-4 whitespace-pre-line">
                         <p>{yacht.description}</p>
                        </div>
                    </div>
                    <div>
                    <h2 className="text-2xl font-semibold border-b pb-2 mb-6">Full Details</h2>
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
                        {renderFeatureList(yacht.usageStyles, metadata.usageStyles)}
                        </TabsContent>

                        <TabsContent value="features" className="mt-6">
                        {renderFeatureList(yacht.features, metadata.featureOptions)}
                        </TabsContent>

                        <TabsContent value="deck" className="mt-6">
                        {renderFeatureList(yacht.deck, metadata.deckOptions)}
                        </TabsContent>

                        <TabsContent value="cabin" className="mt-6">
                        {renderFeatureList(yacht.cabin, metadata.cabinOptions)}
                        </TabsContent>
                    </Tabs>
                    </div>
                </div>
            </section>
            </div>
        </main>
    </div>
  );
}
