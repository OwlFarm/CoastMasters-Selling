

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

const SpecItem = ({ label, value }: { label: string; value?: string | number | null | boolean }) => {
    if (value === null || value === undefined || value === '') return null;
    let displayValue: React.ReactNode = value;
    if (typeof value === 'boolean') {
        displayValue = value ? "Yes" : "No";
    }
    return (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-md font-semibold">{String(displayValue)}</p>
        </div>
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
      { label: 'Transom Shape', value: yacht.transomShapeLabel },
      { label: 'Bow Shape', value: yacht.bowShapeLabel },
      { label: 'Keel Type', value: yacht.keelTypeLabel },
      { label: 'Rudder Type', value: yacht.rudderTypeLabel },
      { label: 'Propeller Type', value: yacht.propellerTypeLabel },
  ].filter(spec => spec.value);

  const accommodationGeneral = [
    { label: 'Cabins', value: yacht.accommodation?.numberOfCabins },
    { label: 'Berths', value: yacht.accommodation?.numberOfBerths },
    { label: 'Interior', value: yacht.accommodation?.interiorMaterial },
    { label: 'Layout', value: yacht.accommodation?.layout },
    { label: 'Floor', value: yacht.accommodation?.floor },
    { label: 'Saloon Headroom (m)', value: yacht.accommodation?.saloonHeadroom },
    { label: 'Heating', value: yacht.accommodation?.heating },
    { label: 'Open Cockpit', value: yacht.accommodation?.openCockpit },
    { label: 'Aft Deck', value: yacht.accommodation?.aftDeck },
    { label: 'Nav Center', value: yacht.accommodation?.navigationCenter },
    { label: 'Chart Table', value: yacht.accommodation?.chartTable },
  ];
  
  const accommodationGalley = [
    { label: 'Countertop', value: yacht.accommodation?.countertop },
    { label: 'Sink', value: yacht.accommodation?.sink },
    { label: 'Cooker', value: yacht.accommodation?.cooker },
    { label: 'Oven', value: yacht.accommodation?.oven },
    { label: 'Microwave', value: yacht.accommodation?.microwave },
    { label: 'Fridge', value: yacht.accommodation?.fridge },
    { label: 'Freezer', value: yacht.accommodation?.freezer },
    { label: 'Hot Water', value: yacht.accommodation?.hotWaterSystem },
    { label: 'Water Pressure', value: yacht.accommodation?.waterPressureSystem },
  ];

  const accommodationOwnersCabin = [
    { label: 'Type', value: yacht.accommodation?.ownersCabin },
    { label: 'Bed Length (m)', value: yacht.accommodation?.ownersCabinBedLength },
    { label: 'Wardrobe', value: yacht.accommodation?.ownersCabinWardrobe },
    { label: 'Bathroom', value: yacht.accommodation?.ownersCabinBathroom },
    { label: 'Toilet', value: yacht.accommodation?.ownersCabinToilet },
    { label: 'Toilet System', value: yacht.accommodation?.ownersCabinToiletSystem },
    { label: 'Wash Basin', value: yacht.accommodation?.ownersCabinWashBasin },
    { label: 'Shower', value: yacht.accommodation?.ownersCabinShower },
  ];

  const accommodationGuestCabin1 = [
    { label: 'Type', value: yacht.accommodation?.guestCabin1 },
    { label: 'Bed Length (m)', value: yacht.accommodation?.guestCabin1BedLength },
    { label: 'Wardrobe', value: yacht.accommodation?.guestCabin1Wardrobe },
  ];

  const accommodationGuestCabin2 = [
    { label: 'Type', value: yacht.accommodation?.guestCabin2 },
    { label: 'Bed Length (m)', value: yacht.accommodation?.guestCabin2BedLength },
    { label: 'Wardrobe', value: yacht.accommodation?.guestCabin2Wardrobe },
  ];

  const accommodationBathroom = [
    { label: 'Bathroom', value: yacht.accommodation?.sharedBathroom },
    { label: 'Toilet', value: yacht.accommodation?.sharedToilet },
    { label: 'Toilet System', value: yacht.accommodation?.sharedToiletSystem },
    { label: 'Wash Basin', value: yacht.accommodation?.sharedWashBasin },
    { label: 'Shower', value: yacht.accommodation?.sharedShower },
    { label: 'Washing Machine', value: yacht.accommodation?.washingMachine },
  ];

  const machinerySpecs = [
    { label: 'No. of Engines', value: yacht.machinery?.numberOfEngines },
    { label: 'Make', value: yacht.machinery?.make },
    { label: 'Type', value: yacht.machinery?.type },
    { label: 'HP', value: yacht.machinery?.hp },
    { label: 'kW', value: yacht.machinery?.kw },
    { label: 'Fuel', value: yacht.machinery?.fuel },
    { label: 'Year Installed', value: yacht.machinery?.yearInstalled },
    { label: 'Year of Overhaul', value: yacht.machinery?.yearOfOverhaul },
    { label: 'Max Speed (kn)', value: yacht.machinery?.maxSpeedKnots },
    { label: 'Cruising Speed (kn)', value: yacht.machinery?.cruisingSpeedKnots },
    { label: 'Consumption (L/hr)', value: yacht.machinery?.consumptionLhr },
    { label: 'Engine Cooling System', value: yacht.machinery?.engineCoolingSystem },
    { label: 'Drive', value: yacht.machinery?.drive },
    { label: 'Shaft Seal', value: yacht.machinery?.shaftSeal },
    { label: 'Engine Controls', value: yacht.machinery?.engineControls },
    { label: 'Gearbox', value: yacht.machinery?.gearbox },
    { label: 'Bowthruster', value: yacht.machinery?.bowthruster },
    { label: 'Propeller Type', value: yacht.machinery?.propellerType },
    { label: 'Manual Bilge Pump', value: yacht.machinery?.manualBilgePump },
    { label: 'Electric Bilge Pump', value: yacht.machinery?.electricBilgePump },
    { label: 'Electrical Installation', value: yacht.machinery?.electricalInstallation },
    { label: 'Generator', value: yacht.machinery?.generator },
    { label: 'Batteries', value: yacht.machinery?.batteries },
    { label: 'Start Battery', value: yacht.machinery?.startBattery },
    { label: 'Service Battery', value: yacht.machinery?.serviceBattery },
    { label: 'Battery Monitor', value: yacht.machinery?.batteryMonitor },
    { label: 'Battery Charger', value: yacht.machinery?.batteryCharger },
    { label: 'Solar Panel', value: yacht.machinery?.solarPanel },
    { label: 'Shorepower', value: yacht.machinery?.shorepower },
    { label: 'Watermaker', value: yacht.machinery?.watermaker },
    { label: 'Extra Info', value: yacht.machinery?.extraInfo },
  ];
  
  const navigationSpecs = [
    { label: 'Compass', value: yacht.navigation?.compass },
    { label: 'Depth Sounder', value: yacht.navigation?.depthSounder },
    { label: 'Log', value: yacht.navigation?.log },
    { label: 'Windset', value: yacht.navigation?.windset },
    { label: 'VHF', value: yacht.navigation?.vhf },
    { label: 'Autopilot', value: yacht.navigation?.autopilot },
    { label: 'Radar', value: yacht.navigation?.radar },
    { label: 'GPS', value: yacht.navigation?.gps },
    { label: 'Plotter', value: yacht.navigation?.plotter },
    { label: 'Navtex', value: yacht.navigation?.navtex },
    { label: 'AIS Transceiver', value: yacht.navigation?.aisTransceiver },
    { label: 'Navigation Lights', value: yacht.navigation?.navigationLights },
    { label: 'Extra Info', value: yacht.navigation?.extraInfo },
  ];

  const equipmentSpecs = [
      { label: 'Fixed Windscreen', value: yacht.equipment?.fixedWindscreen },
      { label: 'Cockpit Table', value: yacht.equipment?.cockpitTable },
      { label: 'Bathing Platform', value: yacht.equipment?.bathingPlatform },
      { label: 'Boarding Ladder', value: yacht.equipment?.boardingLadder },
      { label: 'Deck Shower', value: yacht.equipment?.deckShower },
      { label: 'Anchor', value: yacht.equipment?.anchor },
      { label: 'Anchor Chain', value: yacht.equipment?.anchorChain },
      { label: 'Anchor 2', value: yacht.equipment?.anchor2 },
      { label: 'Windlass', value: yacht.equipment?.windlass },
      { label: 'Deck Wash', value: yacht.equipment?.deckWash },
      { label: 'Dinghy', value: yacht.equipment?.dinghy },
      { label: 'Outboard', value: yacht.equipment?.outboard },
      { label: 'Davits', value: yacht.equipment?.davits },
      { label: 'Sea Railing', value: yacht.equipment?.seaRailing },
      { label: 'Pushpit', value: yacht.equipment?.pushpit },
      { label: 'Pulpit', value: yacht.equipment?.pulpit },
      { label: 'Lifebuoy', value: yacht.equipment?.lifebuoy },
      { label: 'Radar Reflector', value: yacht.equipment?.radarReflector },
      { label: 'Fenders', value: yacht.equipment?.fenders },
      { label: 'Mooring Lines', value: yacht.equipment?.mooringLines },
      { label: 'Radio', value: yacht.equipment?.radio },
      { label: 'Cockpit Speakers', value: yacht.equipment?.cockpitSpeakers },
      { label: 'Speakers in Salon', value: yacht.equipment?.speakersInSalon },
      { label: 'Fire Extinguisher', value: yacht.equipment?.fireExtinguisher },
  ];

  const riggingSpecs = [
      { label: 'Rigging', value: yacht.rigging?.rigging },
      { label: 'Standing Rigging', value: yacht.rigging?.standingRigging },
      { label: 'Brand Mast', value: yacht.rigging?.brandMast },
      { label: 'Material Mast', value: yacht.rigging?.materialMast },
      { label: 'Spreaders', value: yacht.rigging?.spreaders },
      { label: 'Mainsail', value: yacht.rigging?.mainsail },
      { label: 'Stoway Mast', value: yacht.rigging?.stowayMast },
      { label: 'Cutterstay', value: yacht.rigging?.cutterstay },
      { label: 'Jib', value: yacht.rigging?.jib },
      { label: 'Genoa', value: yacht.rigging?.genoa },
      { label: 'Genoa Furler', value: yacht.rigging?.genoaFurler },
      { label: 'Cutter Furler', value: yacht.rigging?.cutterFurler },
      { label: 'Gennaker', value: yacht.rigging?.gennaker },
      { label: 'Spinnaker', value: yacht.rigging?.spinnaker },
      { label: 'Reefing System', value: yacht.rigging?.reefingSystem },
      { label: 'Backstay Adjuster', value: yacht.rigging?.backstayAdjuster },
      { label: 'Primary Sheet Winch', value: yacht.rigging?.primarySheetWinch },
      { label: 'Secondary Sheet Winch', value: yacht.rigging?.secondarySheetWinch },
      { label: 'Genoa Sheetwinches', value: yacht.rigging?.genoaSheetwinches },
      { label: 'Halyard Winches', value: yacht.rigging?.halyardWinches },
      { label: 'Multifunctional Winches', value: yacht.rigging?.multifunctionalWinches },
      { label: 'Spi-Pole', value: yacht.rigging?.spiPole },
  ];

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
                    {yacht.images.map((img, i) => (
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
                                <p className="text-md font-semibold">{String(value)}</p>
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
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-7">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
                        <TabsTrigger value="machinery">Machinery</TabsTrigger>
                        <TabsTrigger value="navigation">Navigation</TabsTrigger>
                        <TabsTrigger value="equipment">Equipment</TabsTrigger>
                        <TabsTrigger value="rigging">Rigging</TabsTrigger>
                        <TabsTrigger value="deck">Deck</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {generalSpecs.map(spec => (
                                    spec.value ? <SpecItem key={spec.label} label={spec.label} value={spec.value} /> : null
                                ))}
                            </div>
                            {yacht.otherSpecifications && (
                                <div className="mt-6 pt-4 border-t">
                                    <p className="text-sm font-medium text-muted-foreground">Other Specifications</p>
                                    <p className="text-md font-semibold whitespace-pre-line">{yacht.otherSpecifications}</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="accommodation" className="mt-6 space-y-8">
                             <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">General</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {accommodationGeneral.map(item => <SpecItem key={item.label} {...item} />)}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Galley</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                     {accommodationGalley.map(item => <SpecItem key={item.label} {...item} />)}
                                </div>
                            </div>
                             <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Owner's Cabin</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                     {accommodationOwnersCabin.map(item => <SpecItem key={item.label} {...item} />)}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Guest Cabin 1</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                     {accommodationGuestCabin1.map(item => <SpecItem key={item.label} {...item} />)}
                                </div>
                            </div>
                             <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Guest Cabin 2</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                     {accommodationGuestCabin2.map(item => <SpecItem key={item.label} {...item} />)}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Bathroom</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                     {accommodationBathroom.map(item => <SpecItem key={item.label} {...item} />)}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="machinery" className="mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {machinerySpecs.map(item => <SpecItem key={item.label} {...item} />)}
                            </div>
                        </TabsContent>

                        <TabsContent value="navigation" className="mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {navigationSpecs.map(item => <SpecItem key={item.label} {...item} />)}
                            </div>
                        </TabsContent>

                        <TabsContent value="equipment" className="mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {equipmentSpecs.map(item => <SpecItem key={item.label} {...item} />)}
                            </div>
                        </TabsContent>

                        <TabsContent value="rigging" className="mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {riggingSpecs.map(item => <SpecItem key={item.label} {...item} />)}
                            </div>
                        </TabsContent>

                        <TabsContent value="deck" className="mt-6">
                        {renderFeatureList(yacht.deck, metadata.deckOptions)}
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
