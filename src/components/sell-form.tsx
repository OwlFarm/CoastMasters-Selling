
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, X, Eye, Image as ImageIcon, Wand2, LoaderCircle } from 'lucide-react';
import { getMetadata, type Metadata } from '@/services/metadata-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { ListingPreview } from './listing-preview';
import { handleGenerateListingDetails, handlePolishDescription } from '@/lib/actions';
import { useActionState } from 'react';
import { Textarea } from './ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const formSchema = z.object({
  title: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().optional().nullable(),
  length: z.coerce.number().optional().nullable(),
  price: z.coerce.number().optional().nullable(),
  description: z.string().optional(),
  heroImage: z.any().optional(),
  galleryImages: z.array(z.any()).optional(),
  listingType: z.string().optional(),
  boatType: z.string().optional(),
  condition: z.string().optional(),
  location: z.string().optional(),
  fuelType: z.string().optional(),
  hullMaterial: z.string().optional(),
  transomShape: z.string().optional(),
  bowShape: z.string().optional(),
  keelType: z.string().optional(),
  rudderType: z.string().optional(),
  propellerType: z.string().optional(),
  sailRigging: z.string().optional(),
  features: z.array(z.string()).optional(),
  divisions: z.array(z.string()).optional(),
  deck: z.array(z.string()).optional(),
  otherSpecifications: z.string().optional(),
  loaM: z.coerce.number().optional().nullable(),
  lwlM: z.coerce.number().optional().nullable(),
  beamM: z.coerce.number().optional().nullable(),
  draftM: z.coerce.number().optional().nullable(),
  airDraftM: z.coerce.number().optional().nullable(),
  headroomM: z.coerce.number().optional().nullable(),
  country: z.string().optional(),
  designer: z.string().optional(),
  displacementT: z.coerce.number().optional().nullable(),
  ballastTonnes: z.coerce.number().optional().nullable(),
  hullColor: z.string().optional(),
  hullShape: z.string().optional(),
  superstructureMaterial: z.string().optional(),
  deckMaterial: z.string().optional(),
  deckFinish: z.string().optional(),
  superstructureDeckFinish: z.string().optional(),
  cockpitDeckFinish: z.string().optional(),
  dorades: z.string().optional(),
  windowFrame: z.string().optional(),
  windowMaterial: z.string().optional(),
  deckhatch: z.string().optional(),
  fuelTankLitre: z.coerce.number().optional().nullable(),
  levelIndicatorFuel: z.string().optional(),
  freshwaterTankLitre: z.coerce.number().optional().nullable(),
  levelIndicatorFreshwater: z.string().optional(),
  wheelSteering: z.string().optional(),
  outsideHelmPosition: z.string().optional(),
  accommodation: z.object({
    numberOfCabins: z.coerce.number().optional().nullable(),
    numberOfBerths: z.coerce.number().optional().nullable(),
    interiorMaterial: z.string().optional(),
    layout: z.string().optional(),
    floor: z.string().optional(),
    openCockpit: z.boolean().optional(),
    aftDeck: z.boolean().optional(),
    saloonHeadroom: z.coerce.number().optional().nullable(),
    heating: z.string().optional(),
    navigationCenter: z.boolean().optional(),
    chartTable: z.boolean().optional(),
    countertop: z.string().optional(),
    sink: z.string().optional(),
    cooker: z.string().optional(),
    oven: z.string().optional(),
    microwave: z.string().optional(),
    fridge: z.string().optional(),
    freezer: z.string().optional(),
    hotWaterSystem: z.string().optional(),
    waterPressureSystem: z.string().optional(),
    ownersCabin: z.string().optional(),
    ownersCabinBedLength: z.string().optional(),
    ownersCabinWardrobe: z.string().optional(),
    ownersCabinBathroom: z.string().optional(),
    ownersCabinToilet: z.string().optional(),
    ownersCabinToiletSystem: z.string().optional(),
    ownersCabinWashBasin: z.string().optional(),
    ownersCabinShower: z.string().optional(),
    guestCabin1: z.string().optional(),
    guestCabin1BedLength: z.string().optional(),
    guestCabin1Wardrobe: z.string().optional(),
    guestCabin2: z.string().optional(),
    guestCabin2BedLength: z.string().optional(),
    guestCabin2Wardrobe: z.string().optional(),
    sharedBathroom: z.string().optional(),
    sharedToilet: z.string().optional(),
    sharedToiletSystem: z.string().optional(),
    sharedWashBasin: z.string().optional(),
    sharedShower: z.string().optional(),
    washingMachine: z.string().optional(),
    cabins: z.array(z.string()).optional(),
    saloon: z.array(z.string()).optional(),
    galley: z.array(z.string()).optional(),
    heads: z.array(z.string()).optional(),
  }).optional(),
  machinery: z.object({
    numberOfEngines: z.coerce.number().optional().nullable(),
    make: z.string().optional(),
    type: z.string().optional(),
    hp: z.coerce.number().optional().nullable(),
    kw: z.coerce.number().optional().nullable(),
    fuel: z.string().optional(),
    yearInstalled: z.coerce.number().optional().nullable(),
    yearOfOverhaul: z.string().optional(),
    maxSpeedKnots: z.coerce.number().optional().nullable(),
    cruisingSpeedKnots: z.coerce.number().optional().nullable(),
    consumptionLhr: z.coerce.number().optional().nullable(),
    engineCoolingSystem: z.string().optional(),
    drive: z.string().optional(),
    shaftSeal: z.string().optional(),
    engineControls: z.string().optional(),
    gearbox: z.string().optional(),
    bowthruster: z.string().optional(),
    propellerType: z.string().optional(),
    manualBilgePump: z.string().optional(),
    electricBilgePump: z.string().optional(),
    electricalInstallation: z.string().optional(),
    generator: z.string().optional(),
    batteries: z.string().optional(),
    startBattery: z.string().optional(),
    serviceBattery: z.string().optional(),
    batteryMonitor: z.string().optional(),
    batteryCharger: z.string().optional(),
    solarPanel: z.string().optional(),
    shorepower: z.string().optional(),
    watermaker: z.string().optional(),
    extraInfo: z.string().optional(),
  }).optional(),
  navigation: z.object({
    compass: z.string().optional(),
    depthSounder: z.string().optional(),
    log: z.string().optional(),
    windset: z.string().optional(),
    vhf: z.string().optional(),
    autopilot: z.string().optional(),
    radar: z.string().optional(),
    gps: z.string().optional(),
    plotter: z.string().optional(),
    navtex: z.string().optional(),
    aisTransceiver: z.string().optional(),
    navigationLights: z.string().optional(),
    extraInfo: z.string().optional(),
  }).optional(),
  equipment: z.object({
    fixedWindscreen: z.string().optional(),
    cockpitTable: z.string().optional(),
    bathingPlatform: z.string().optional(),
    boardingLadder: z.string().optional(),
    deckShower: z.string().optional(),
    anchor: z.string().optional(),
    anchorChain: z.string().optional(),
    anchor2: z.string().optional(),
    windlass: z.string().optional(),
    deckWash: z.string().optional(),
    dinghy: z.string().optional(),
    outboard: z.string().optional(),
    davits: z.string().optional(),
    seaRailing: z.string().optional(),
    pushpit: z.string().optional(),
    pulpit: z.string().optional(),
    lifebuoy: z.string().optional(),
    radarReflector: z.string().optional(),
    fenders: z.string().optional(),
    mooringLines: z.string().optional(),
    radio: z.string().optional(),
    cockpitSpeakers: z.string().optional(),
    speakersInSalon: z.string().optional(),
    fireExtinguisher: z.string().optional(),
  }).optional(),
  rigging: z.object({
    rigging: z.string().optional(),
    standingRigging: z.string().optional(),
    brandMast: z.string().optional(),
    materialMast: z.string().optional(),
    spreaders: z.string().optional(),
    mainsail: z.string().optional(),
    stowayMast: z.string().optional(),
    cutterstay: z.string().optional(),
    jib: z.string().optional(),
    genoa: z.string().optional(),
    genoaFurler: z.string().optional(),
    cutterFurler: z.string().optional(),
    gennaker: z.string().optional(),
    spinnaker: z.string().optional(),
    reefingSystem: z.string().optional(),
    backstayAdjuster: z.string().optional(),
    primarySheetWinch: z.string().optional(),
    secondarySheetWinch: z.string().optional(),
    genoaSheetwinches: z.string().optional(),
    halyardWinches: z.string().optional(),
    multifunctionalWinches: z.string().optional(),
    spiPole: z.string().optional(),
  }).optional(),
  status: z.string().optional(),
  vat: z.string().optional(),
  salesOffice: z.string().optional(),
}).passthrough();


export type FormValues = z.infer<typeof formSchema>;

const FormSkeleton = () => (
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
);

export function SellForm() {
  const [metadata, setMetadata] = React.useState<Metadata | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPreview, setIsPreview] = React.useState(false);
  const [heroImagePreview, setHeroImagePreview] = React.useState<string | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = React.useState<string[]>([]);
  const { toast } = useToast();

  const [generateState, generateAction, isGenerating] = useActionState(handleGenerateListingDetails, { result: undefined, error: undefined });
  const [polishState, polishAction, isPolishing] = useActionState(handlePolishDescription, { result: undefined, error: undefined });

  React.useEffect(() => {
    getMetadata().then(data => {
      setMetadata(data);
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to load metadata", err);
      setIsLoading(false);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load form data.' });
    })
  }, [toast]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      make: '',
      model: '',
      galleryImages: [],
      features: [],
      deck: [],
    },
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (generateState.result) {
        form.setValue('title', generateState.result.title);
        form.setValue('description', generateState.result.description);
        // We can set all other detected fields here as well
        toast({ title: 'Success', description: 'AI has populated the listing details.' });
    }
    if (generateState.error) {
        toast({ variant: 'destructive', title: 'Error', description: generateState.error });
    }
  }, [generateState, form, toast]);

  React.useEffect(() => {
    if (polishState.result) {
        form.setValue('description', polishState.result);
        toast({ title: 'Success', description: 'AI has polished the description.' });
    }
    if (polishState.error) {
        toast({ variant: 'destructive', title: 'Error', description: polishState.error });
    }
  }, [polishState, form, toast]);

  const onGenerateDetails = () => {
    const formData = new FormData();
    const values = form.getValues();
    formData.append('make', values.make || '');
    formData.append('model', values.model || '');
    formData.append('year', String(values.year || ''));
    formData.append('length', String(values.length || ''));
    formData.append('condition', values.condition || '');
    formData.append('boatType', values.boatType || '');
    (values.features || []).forEach(f => formData.append('features', f));
    generateAction(formData);
  };
  
  const onPolishDescription = () => {
      const formData = new FormData();
      formData.append('description', form.getValues('description') || '');
      polishAction(formData);
  };

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    toast({ title: 'Success!', description: 'Your listing has been submitted for review.' });
    setIsPreview(false); // Go back to form after submission
  };
  
  const processForm = () => {
    // Manually trigger validation
    form.trigger().then(isValid => {
      if (isValid) {
        setIsPreview(true);
      } else {
        toast({
            variant: 'destructive',
            title: 'Incomplete Form',
            description: 'Please fill out all required fields before previewing.',
        });
      }
    });
  }


  if (isLoading || !metadata) {
    return <FormSkeleton />;
  }

  return (
    <div className="space-y-8">
      {isPreview ? (
        <div>
          <div className="mb-8 flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsPreview(false)}>
              Back to Edit
            </Button>
            <h2 className="text-2xl font-bold">Listing Preview</h2>
            <Button onClick={form.handleSubmit(onSubmit)}>Submit Listing</Button>
          </div>
          <ListingPreview
            data={form.getValues()}
            metadata={metadata}
            heroImagePreview={heroImagePreview || ''}
            galleryImagePreviews={galleryImagePreviews}
          />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
             <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
                <CardDescription>Provide a brief overview of the yacht. This information will be prominently displayed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={form.control} name="loaM" render={({ field }) => (<FormItem><FormLabel>Dimensions (LOA, Beam, Draft) (m)</FormLabel><FormControl><Input placeholder="e.g., 14.96 x 4.42 x 2.20" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="hullMaterial" render={({ field }) => (<FormItem><FormLabel>Material</FormLabel><FormControl><Input placeholder="e.g., GRP" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="year" render={({ field }) => (<FormItem><FormLabel>Built</FormLabel><FormControl><Input type="number" placeholder="e.g., 1990" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="machinery.make" render={({ field }) => (<FormItem><FormLabel>Engine(s)</FormLabel><FormControl><Input placeholder="e.g., Volvo Penta TMD41A" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="machinery.hp" render={({ field }) => (<FormItem><FormLabel>HP / KW</FormLabel><FormControl><Input placeholder="e.g., 143 / 105.25" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Lying</FormLabel><FormControl><Input placeholder="e.g., at sales office" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="salesOffice" render={({ field }) => (<FormItem><FormLabel>Sales Office</FormLabel><FormControl><Input placeholder="e.g., De Valk Hindeloopen" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><FormControl><Input placeholder="e.g., For Sale" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="vat" render={({ field }) => (<FormItem><FormLabel>VAT</FormLabel><FormControl><Input placeholder="e.g., Paid" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />

                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="price" render={({ field }) => ( <FormItem> <FormLabel>Asking Price (€)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 275000" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
                 </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Provide the main dimensions and details of the yacht.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" defaultValue={['dimensions', 'hull-details']} className="w-full">
                  <AccordionItem value="dimensions">
                    <AccordionTrigger>Dimensions & Core Details</AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="boatType" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="loaM" render={({ field }) => (<FormItem><FormLabel>LOA (m)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="lwlM" render={({ field }) => (<FormItem><FormLabel>LWL (m)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="beamM" render={({ field }) => (<FormItem><FormLabel>Beam (m)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="draftM" render={({ field }) => (<FormItem><FormLabel>Draft (m)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="airDraftM" render={({ field }) => (<FormItem><FormLabel>Air Draft (m)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="headroomM" render={({ field }) => (<FormItem><FormLabel>Headroom (m)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="year" render={({ field }) => (<FormItem><FormLabel>Year Built</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="make" render={({ field }) => (<FormItem><FormLabel>Builder</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="designer" render={({ field }) => (<FormItem><FormLabel>Designer</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="displacementT" render={({ field }) => (<FormItem><FormLabel>Displacement (t)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="ballastTonnes" render={({ field }) => (<FormItem><FormLabel>Ballast (tonnes)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="hull-details">
                     <AccordionTrigger>Hull, Deck & Keel</AccordionTrigger>
                     <AccordionContent className="pt-4">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="hullMaterial" render={({ field }) => (<FormItem><FormLabel>Hull Material</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="hullColor" render={({ field }) => (<FormItem><FormLabel>Hull Colour</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="hullShape" render={({ field }) => (<FormItem><FormLabel>Hull Shape</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="keelType" render={({ field }) => (<FormItem><FormLabel>Keel Type</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="superstructureMaterial" render={({ field }) => (<FormItem><FormLabel>Superstructure Material</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="deckMaterial" render={({ field }) => (<FormItem><FormLabel>Deck Material</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="deckFinish" render={({ field }) => (<FormItem><FormLabel>Deck Finish</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="superstructureDeckFinish" render={({ field }) => (<FormItem><FormLabel>Superstructure Deck Finish</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="cockpitDeckFinish" render={({ field }) => (<FormItem><FormLabel>Cockpit Deck Finish</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                       </div>
                     </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="other-general">
                     <AccordionTrigger>Other General Details</AccordionTrigger>
                     <AccordionContent className="pt-4">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField control={form.control} name="dorades" render={({ field }) => (<FormItem><FormLabel>Dorades</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="windowFrame" render={({ field }) => (<FormItem><FormLabel>Window Frame</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="windowMaterial" render={({ field }) => (<FormItem><FormLabel>Window Material</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="deckhatch" render={({ field }) => (<FormItem><FormLabel>Deckhatch</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="fuelTankLitre" render={({ field }) => (<FormItem><FormLabel>Fuel Tank (litre)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="levelIndicatorFuel" render={({ field }) => (<FormItem><FormLabel>Level Indicator (Fuel)</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="freshwaterTankLitre" render={({ field }) => (<FormItem><FormLabel>Freshwater Tank (litre)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="levelIndicatorFreshwater" render={({ field }) => (<FormItem><FormLabel>Level Indicator (Freshwater)</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="wheelSteering" render={({ field }) => (<FormItem><FormLabel>Wheel Steering</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="outsideHelmPosition" render={({ field }) => (<FormItem><FormLabel>Outside Helm Position</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                       </div>
                     </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                    <CardDescription>
                        Write a detailed description of the yacht. You can also use the AI assistant to help you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g., A classic blue-water cruiser, well-maintained and ready for adventure..."
                                        className="min-h-[200px]"
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={onPolishDescription} disabled={isPolishing}>
                            {isPolishing ? <LoaderCircle className="animate-spin" /> : <Wand2 />}
                            Polish with AI
                        </Button>
                        <Button type="button" variant="outline" onClick={onGenerateDetails} disabled={isGenerating}>
                            {isGenerating ? <LoaderCircle className="animate-spin" /> : <Wand2 />}
                            Generate with AI
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Photos</CardTitle>
                    <CardDescription>High-quality photos are crucial for attracting buyers. The first image will be your main "hero" image.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <FormField
                        control={form.control}
                        name="heroImage"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hero Image</FormLabel>
                            <FormControl>
                            <div className="relative flex items-center justify-center w-full h-64 border-2 border-dashed rounded-lg">
                                <Input
                                type="file"
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange(file);
                                        setHeroImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                />
                                {heroImagePreview ? (
                                    <Image src={heroImagePreview} alt="Hero preview" fill className="object-cover rounded-lg" />
                                ) : (
                                    <div className="text-center">
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p>Click to upload</p>
                                    </div>
                                )}
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="galleryImages"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gallery Images</FormLabel>
                            <FormControl>
                                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {galleryImagePreviews.map((src, index) => (
                                    <div key={index} className="relative group">
                                        <Image src={src} alt={`Gallery preview ${index + 1}`} width={200} height={150} className="object-cover rounded-lg aspect-[4/3]" />
                                        <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                        onClick={() => {
                                            const newPreviews = galleryImagePreviews.filter((_, i) => i !== index);
                                            const newFiles = (form.getValues('galleryImages') || []).filter((_: any, i: number) => i !== index);
                                            setGalleryImagePreviews(newPreviews);
                                            form.setValue('galleryImages', newFiles);
                                        }}
                                        >
                                        <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    ))}
                                    <div className="relative flex items-center justify-center w-full aspect-[4/3] border-2 border-dashed rounded-lg">
                                        <Input
                                            type="file"
                                            multiple
                                            className="absolute w-full h-full opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                const currentFiles = form.getValues('galleryImages') || [];
                                                const newFiles = [...currentFiles, ...files];
                                                field.onChange(newFiles);
                                                const newPreviews = files.map(f => URL.createObjectURL(f));
                                                setGalleryImagePreviews([...galleryImagePreviews, ...newPreviews]);
                                            }}
                                        />
                                         <div className="text-center p-2">
                                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                                            <p className="mt-1 text-xs text-muted-foreground">Add more</p>
                                        </div>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="button" size="lg" onClick={processForm}>
                    <Eye className="mr-2" /> Preview & Submit
                </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

    