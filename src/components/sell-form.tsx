
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
import { Upload, X, Eye, Image as ImageIcon, Wand2, LoaderCircle, Sparkles, Binary } from 'lucide-react';
import type { Metadata } from '@/services/metadata-service';
import { useToast } from '@/hooks/use-toast';
import { ListingPreview } from './listing-preview';
import { handleGenerateListingDetails, handlePolishDescription } from '@/lib/actions';
import { useActionState } from 'react';
import { Textarea } from './ui/textarea';
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';

const SectionSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-7 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

const GeneralInformation = dynamic(() => import('@/components/sell/general-information').then(mod => mod.GeneralInformation), { loading: () => <SectionSkeleton /> });
const Accommodation = dynamic(() => import('@/components/sell/accommodation').then(mod => mod.Accommodation), { loading: () => <SectionSkeleton /> });
const Machinery = dynamic(() => import('@/selling/machinery').then(mod => mod.Machinery), { loading: () => <SectionSkeleton /> });
const Navigation = dynamic(() => import('@/selling/navigation').then(mod => mod.Navigation), { loading: () => <SectionSkeleton /> });
const Equipment = dynamic(() => import('@/selling/equipment').then(mod => mod.Equipment), { loading: () => <SectionSkeleton /> });
const Rigging = dynamic(() => import('@/selling/rigging').then(mod => mod.Rigging), { loading: () => <SectionSkeleton /> });
const IndicationRatios = dynamic(() => import('@/selling/indication-ratios').then(mod => mod.IndicationRatios), { loading: () => <SectionSkeleton /> });


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

  // General Information
  loaM: z.coerce.number().optional().nullable(),
  lwlM: z.coerce.number().optional().nullable(),
  beamM: z.coerce.number().optional().nullable(),
  draftM: z.coerce.number().optional().nullable(),
  airDraftM: z.coerce.number().optional().nullable(),
  headroomM: z.coerce.number().optional().nullable(),
  country: z.string().optional().nullable(),
  designer: z.string().optional().nullable(),
  displacementT: z.coerce.number().optional().nullable(),
  ballastTonnes: z.coerce.number().optional().nullable(),
  hullColor: z.string().optional().nullable(),
  hullShape: z.string().optional().nullable(),
  superstructureMaterial: z.string().optional().nullable(),
  deckMaterial: z.string().optional().nullable(),
  deckFinish: z.string().optional().nullable(),
  superstructureDeckFinish: z.string().optional().nullable(),
  cockpitDeckFinish: z.string().optional().nullable(),
  dorades: z.string().optional().nullable(),
  windowFrame: z.string().optional().nullable(),
  windowMaterial: z.string().optional().nullable(),
  deckhatch: z.string().optional().nullable(),
  fuelTankLitre: z.coerce.number().optional().nullable(),
  levelIndicatorFuel: z.string().optional().nullable(),
  freshwaterTankLitre: z.coerce.number().optional().nullable(),
  levelIndicatorFreshwater: z.string().optional().nullable(),
  wheelSteering: z.string().optional().nullable(),
  outsideHelmPosition: z.string().optional().nullable(),

  // Accommodation
  accommodation: z.object({
    numberOfCabins: z.coerce.number().optional().nullable(),
    numberOfBerths: z.coerce.number().optional().nullable(),
    interiorMaterial: z.string().optional().nullable(),
    layout: z.string().optional().nullable(),
    floor: z.string().optional().nullable(),
    openCockpit: z.boolean().optional().nullable(),
    aftDeck: z.boolean().optional().nullable(),
    saloonHeadroom: z.coerce.number().optional().nullable(),
    heating: z.string().optional().nullable(),
    navigationCenter: z.boolean().optional().nullable(),
    chartTable: z.boolean().optional().nullable(),
    countertop: z.string().optional().nullable(),
    sink: z.string().optional().nullable(),
    cooker: z.string().optional().nullable(),
    oven: z.string().optional().nullable(),
    microwave: z.string().optional().nullable(),
    fridge: z.string().optional().nullable(),
    freezer: z.string().optional().nullable(),
    hotWaterSystem: z.string().optional().nullable(),
    waterPressureSystem: z.string().optional().nullable(),
    ownersCabin: z.string().optional().nullable(),
    ownersCabinBedLength: z.string().optional().nullable(),
    ownersCabinWardrobe: z.string().optional().nullable(),
    ownersCabinBathroom: z.string().optional().nullable(),
    ownersCabinToilet: z.string().optional().nullable(),
    ownersCabinToiletSystem: z.string().optional().nullable(),
    ownersCabinWashBasin: z.string().optional().nullable(),
    ownersCabinShower: z.string().optional().nullable(),
    guestCabin1: z.string().optional().nullable(),
    guestCabin1BedLength: z.string().optional().nullable(),
    guestCabin1Wardrobe: z.string().optional().nullable(),
    guestCabin2: z.string().optional().nullable(),
    guestCabin2BedLength: z.string().optional().nullable(),
    guestCabin2Wardrobe: z.string().optional().nullable(),
    sharedBathroom: z.string().optional().nullable(),
    sharedToilet: z.string().optional().nullable(),
    sharedToiletSystem: z.string().optional().nullable(),
    sharedWashBasin: z.string().optional().nullable(),
    sharedShower: z.string().optional().nullable(),
    washingMachine: z.string().optional().nullable(),
    cabins: z.array(z.string()).optional().nullable(),
    saloon: z.array(z.string()).optional().nullable(),
    galley: z.array(z.string()).optional().nullable(),
    heads: z.array(z.string()).optional().nullable(),
  }).optional().nullable(),

  // Rigging
  rigging: z.object({
    rigging: z.string().optional().nullable(),
    standingRigging: z.string().optional().nullable(),
    brandMast: z.string().optional().nullable(),
    materialMast: z.string().optional().nullable(),
    spreaders: z.string().optional().nullable(),
    mainsail: z.string().optional().nullable(),
    stowayMast: z.string().optional().nullable(),
    cutterstay: z.string().optional().nullable(),
    jib: z.string().optional().nullable(),
    genoa: z.string().optional().nullable(),
    genoaFurler: z.string().optional().nullable(),
    cutterFurler: z.string().optional().nullable(),
    gennaker: z.string().optional().nullable(),
    spinnaker: z.string().optional().nullable(),
    reefingSystem: z.string().optional().nullable(),
    backstayAdjuster: z.string().optional().nullable(),
    primarySheetWinch: z.string().optional().nullable(),
    secondarySheetWinch: z.string().optional().nullable(),
    genoaSheetwinches: z.string().optional().nullable(),
    halyardWinches: z.string().optional().nullable(),
    multifunctionalWinches: z.string().optional().nullable(),
    spiPole: z.string().optional().nullable(),
  }).optional().nullable(),

  // Machinery
  machinery: z.object({
    numberOfEngines: z.coerce.number().optional().nullable(),
    make: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    hp: z.coerce.number().optional().nullable(),
    kw: z.coerce.number().optional().nullable(),
    fuel: z.string().optional().nullable(),
    yearInstalled: z.coerce.number().optional().nullable(),
    yearOfOverhaul: z.string().optional().nullable(),
    maxSpeedKnots: z.coerce.number().optional().nullable(),
    cruisingSpeedKnots: z.coerce.number().optional().nullable(),
    consumptionLhr: z.coerce.number().optional().nullable(),
    engineCoolingSystem: z.string().optional().nullable(),
    drive: z.string().optional().nullable(),
    shaftSeal: z.string().optional().nullable(),
    engineControls: z.string().optional().nullable(),
    gearbox: z.string().optional().nullable(),
    bowthruster: z.string().optional().nullable(),
    propellerType: z.string().optional().nullable(),
    manualBilgePump: z.string().optional().nullable(),
    electricBilgePump: z.string().optional().nullable(),
    electricalInstallation: z.string().optional().nullable(),
    generator: z.string().optional().nullable(),
    batteries: z.string().optional().nullable(),
    startBattery: z.string().optional().nullable(),
    serviceBattery: z.string().optional().nullable(),
    batteryMonitor: z.string().optional().nullable(),
    batteryCharger: z.string().optional().nullable(),
    solarPanel: z.string().optional().nullable(),
    shorepower: z.string().optional().nullable(),
    watermaker: z.string().optional().nullable(),
    extraInfo: z.string().optional().nullable(),
  }).optional().nullable(),

  // Navigation
  navigation: z.object({
    compass: z.string().optional().nullable(),
    depthSounder: z.string().optional().nullable(),
    log: z.string().optional().nullable(),
    windset: z.string().optional().nullable(),
    vhf: z.string().optional().nullable(),
    autopilot: z.string().optional().nullable(),
    radar: z.string().optional().nullable(),
    gps: z.string().optional().nullable(),
    plotter: z.string().optional().nullable(),
    navtex: z.string().optional().nullable(),
    aisTransceiver: z.string().optional().nullable(),
    navigationLights: z.string().optional().nullable(),
    extraInfo: z.string().optional().nullable(),
  }).optional().nullable(),
  
  equipment: z.object({
    fixedWindscreen: z.string().optional().nullable(),
    cockpitTable: z.string().optional().nullable(),
    bathingPlatform: z.string().optional().nullable(),
    boardingLadder: z.string().optional().nullable(),
    deckShower: z.string().optional().nullable(),
    anchor: z.string().optional().nullable(),
    anchorChain: z.string().optional().nullable(),
    anchor2: z.string().optional().nullable(),
    windlass: z.string().optional().nullable(),
    deckWash: z.string().optional().nullable(),
    dinghy: z.string().optional().nullable(),
    outboard: z.string().optional().nullable(),
    davits: z.string().optional().nullable(),
    seaRailing: z.string().optional().nullable(),
    pushpit: z.string().optional().nullable(),
    pulpit: z.string().optional().nullable(),
    lifebuoy: z.string().optional().nullable(),
    radarReflector: z.string().optional().nullable(),
    fenders: z.string().optional().nullable(),
    mooringLines: z.string().optional().nullable(),
    radio: z.string().optional().nullable(),
    cockpitSpeakers: z.string().optional().nullable(),
    speakersInSalon: z.string().optional().nullable(),
    fireExtinguisher: z.string().optional().nullable(),
  }).optional().nullable(),

  // Indication Ratios
  saDisp: z.coerce.number().optional().nullable(),
  balDisp: z.coerce.number().optional().nullable(),
  dispLen: z.coerce.number().optional().nullable(),
  comfortRatio: z.coerce.number().optional().nullable(),
  capsizeScreeningFormula: z.coerce.number().optional().nullable(),
  sNum: z.coerce.number().optional().nullable(),
  hullSpeed: z.coerce.number().optional().nullable(),
  poundsPerInchImmersion: z.coerce.number().optional().nullable(),

  status: z.string().optional(),
  vat: z.string().optional(),
  salesOffice: z.string().optional(),
}).passthrough();


export type FormValues = z.infer<typeof formSchema>;

type SellFormProps = {
  metadata: Metadata;
};

export function SellForm({ metadata }: SellFormProps) {
  const [isPreview, setIsPreview] = React.useState(false);
  const [heroImagePreview, setHeroImagePreview] = React.useState<string | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = React.useState<string[]>([]);
  const { toast } = useToast();

  const [generateState, generateAction, isGenerating] = useActionState(handleGenerateListingDetails, { result: undefined, error: undefined });
  const [polishState, polishAction, isPolishing] = useActionState(handlePolishDescription, { result: undefined, error: undefined });

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
  };

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
                    <CardTitle>Pre-fill From a Source</CardTitle>
                    <CardDescription>
                        Quickly populate the form by migrating an existing listing or using a known boat model.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="migrate-url">Migrate Listing from URL</Label>
                        <div className="flex gap-2 mt-2">
                            <Input id="migrate-url" placeholder="Enter listing URL..." />
                            <Button variant="secondary">
                                <Binary className="mr-2" />
                                Migrate
                            </Button>
                        </div>
                    </div>
                    <Separator />
                     <div>
                        <Label htmlFor="populate-model">Populate from Boat Model</Label>
                        <div className="flex gap-2 mt-2">
                            <Input id="populate-model" placeholder="e.g., Moody 54" />
                            <Button variant="secondary">
                                <Sparkles className="mr-2" />
                                Populate
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
                <CardDescription>Provide a brief overview of the yacht. This information will be prominently displayed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={form.control} name="length" render={({ field }) => (<FormItem><FormLabel>Dimensions (LOA, Beam, Draft) (m)</FormLabel><FormControl><Input placeholder="e.g., 14.96 x 4.42 x 2.20" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
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

            <GeneralInformation form={form} />
            <Accommodation form={form} />
            <Rigging />
            <Machinery />
            <Navigation />
            <Equipment />
            <IndicationRatios />

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

    