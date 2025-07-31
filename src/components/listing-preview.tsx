
'use client';

import * as React from 'react';
import type { FormValues } from './sell-form';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, GitCompareArrows, MapPin, Calendar, Ship, Ruler, Anchor, Fuel, Droplets, CheckCircle, Sailboat } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata, Option, RegionOption } from '@/services/metadata-service';
import { Card } from '@/components/ui/card';

type ListingPreviewProps = {
    data: FormValues;
    metadata: Metadata;
    heroImagePreview: string;
    galleryImagePreviews: string[];
}

const findLabel = (id: string | undefined, options: (Option | RegionOption)[]): string | null => {
  if (!id) return null;
  
  for (const option of options) {
    if ('locations' in option) { // It's a RegionOption
      const foundLocation = option.locations.find(loc => loc.id === id);
      if (foundLocation) return foundLocation.label;
    } else { // It's a simple Option
      const valueToCompare = (option as Option).value ?? option.id;
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
  const yacht = {
      ...data,
      name: data.title || `${data.year} ${findLabel(data.make, metadata.makes)} ${data.model}`,
      price: data.price || 0,
      imageUrl: heroImagePreview || 'https://placehold.co/600x400.png',
      images: galleryImagePreviews,
      makeLabel: findLabel(data.make, metadata.makes) || 'N/A',
      listingTypeLabel: findLabel(data.listingType, metadata.listingTypes) || 'N/A',
      boatTypeLabel: findLabel(data.boatType, metadata.boatTypes) || 'N/A',
      conditionLabel: findLabel(data.condition, metadata.conditions) || 'N/A',
      locationLabel: findLabel(data.location, metadata.locationsByRegion) || 'N/A',
      fuelTypeLabel: findLabel(data.fuelType, metadata.fuelTypes),
      hullMaterialLabel: findLabel(data.hullMaterial, metadata.hullMaterialOptions),
      sailRiggingLabel: findLabel(data.sailRigging, metadata.sailRiggingOptions),
      transomShapeLabel: findLabel(data.transomShape, metadata.transomShapeOptions),
      bowShapeLabel: findLabel(data.bowShape, metadata.bowShapeOptions),
      keelTypeLabel: findLabel(data.keelType, metadata.keelTypeOptions),
      rudderTypeLabel: findLabel(data.rudderType, metadata.rudderTypeOptions),
      propellerTypeLabel: findLabel(data.propellerType, metadata.propellerTypeOptions),
      cabinFeatures: [
        ...(data.accommodation?.cabins || []),
        ...(data.accommodation?.saloon || []),
        ...(data.accommodation?.galley || []),
        ...(data.accommodation?.heads || []),
      ],
  };

  const specifications = [
    { label: 'Year', value: yacht.year, icon: Calendar },
    { label: 'LOA', value: `${yacht.length} ft`, icon: Ruler },
    { label: 'Type', value: yacht.boatTypeLabel, icon: Ship },
    { label: 'Condition', value: yacht.conditionLabel, icon: Anchor },
    { label: 'Location', value: yacht.locationLabel, icon: MapPin },
    { label: 'Fuel Type', value: yacht.fuelTypeLabel, icon: Fuel },
    { label: 'Hull Material', value: yacht.hullMaterialLabel, icon: Droplets },
    { label: 'Sail Rigging', value: yacht.sailRiggingLabel, icon: Sailboat },
  ];

  const generalSpecs = [
      { label: 'LOA (m)', value: yacht.loaM },
      { label: 'LWL (m)', value: yacht.lwlM },
      { label: 'Beam (m)', value: yacht.beamM },
      { label: 'Draft (m)', value: yacht.draftM },
      { label: 'Air Draft (m)', value: yacht.airDraftM },
      { label: 'Headroom (m)', value: yacht.headroomM },
      { label: 'Country', value: yacht.country },
      { label: 'Designer', value: yacht.designer },
      { label: 'Displacement (t)', value: yacht.displacementT },
      { label: 'Ballast (tonnes)', value: yacht.ballastTonnes },
      { label: 'Hull Colour', value: yacht.hullColor },
      { label: 'Hull Shape', value: yacht.hullShape },
      { label: 'Superstructure Material', value: yacht.superstructureMaterial },
      { label: 'Deck Material', value: yacht.deckMaterial },
      { label: 'Deck Finish', value: yacht.deckFinish },
      { label: 'Superstructure Deck Finish', value: yacht.superstructureDeckFinish },
      { label: 'Cockpit Deck Finish', value: yacht.cockpitDeckFinish },
      { label: 'Dorades', value: yacht.dorades },
      { label: 'Window Frame', value: yacht.windowFrame },
      { label: 'Window Material', value: yacht.windowMaterial },
      { label: 'Deckhatch', value: yacht.deckhatch },
      { label: 'Fuel Tank (litre)', value: yacht.fuelTankLitre },
      { label: 'Level Indicator (Fuel)', value: yacht.levelIndicatorFuel },
      { label: 'Freshwater Tank (litre)', value: yacht.freshwaterTankLitre },
      { label: 'Level Indicator (Freshwater)', value: yacht.levelIndicatorFreshwater },
      { label: 'Wheel Steering', value: yacht.wheelSteering },
      { label: 'Outside Helm Position', value: yacht.outsideHelmPosition },
  ].filter(spec => spec.value);
  
  const hullAndEngineSpecs = [
    { label: 'Transom Shape', value: yacht.transomShapeLabel },
    { label: 'Bow Shape', value: yacht.bowShapeLabel },
    { label: 'Keel Type', value: yacht.keelTypeLabel },
    { label: 'Rudder Type', value: yacht.rudderTypeLabel },
    { label: 'Propeller Type', value: yacht.propellerTypeLabel },
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
                        <Badge variant="secondary" className="text-base">{yacht.listingTypeLabel}</Badge>
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
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="specifications">Hull & Engine</TabsTrigger>
                        <TabsTrigger value="usage">Division</TabsTrigger>
                        <TabsTrigger value="features">Equipment</TabsTrigger>
                        <TabsTrigger value="deck">Deck</TabsTrigger>
                        <TabsTrigger value="cabin">Cabin</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {generalSpecs.map(spec => (
                                <div key={spec.label}>
                                    <p className="text-sm font-medium text-muted-foreground">{spec.label}</p>
                                    <p className="text-md font-semibold">{spec.value}</p>
                                </div>
                                ))}
                            </div>
                        </TabsContent>

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
                        {renderFeatureList(yacht.divisions, metadata.divisions)}
                        </TabsContent>

                        <TabsContent value="features" className="mt-6">
                        {renderFeatureList(yacht.features, metadata.featureOptions)}
                        </TabsContent>

                        <TabsContent value="deck" className="mt-6">
                        {renderFeatureList(yacht.deck, metadata.deckOptions)}
                        </TabsContent>

                        <TabsContent value="cabin" className="mt-6">
                        {renderFeatureList(yacht.cabinFeatures, metadata.cabinOptions)}
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
