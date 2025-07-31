

'use client';

import * as React from 'react';
import { useForm, type FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, Ship, X, ArrowLeft, Sparkles, LoaderCircle, Eye, Image as ImageIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMetadata, type Metadata } from '@/services/metadata-service';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { useActionState, useEffect } from 'react';
import { handleGenerateListingDetails, handlePolishDescription } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { ListingPreview } from './listing-preview';
import { Combobox } from './ui/combobox';
import { TextEditor } from './ui/text-editor';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoTooltip } from './homepage-yacht-filters';

// Updated schema to include a title and make some fields optional for multi-step validation
const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  listingType: z.string({ required_error: 'Please select a listing type.' }),
  boatType: z.string({ required_error: 'Please select a boat type.' }),
  condition: z.string({ required_error: 'Please select the condition.' }),
  location: z.string({ required_error: 'Please select a location.' }),
  fuelType: z.string({ required_error: 'Please select a fuel type.' }),
  hullMaterial: z.string({ required_error: 'Please select a hull material.' }),
  transomShape: z.string({ required_error: 'Please select a transom shape.' }),
  bowShape: z.string({ required_error: 'Please select a bow shape.' }),
  keelType: z.string({ required_error: 'Keel type is required for sailing boats.' }),
  rudderType: z.string({ required_error: 'Rudder type is required for sailing boats.' }),
  propellerType: z.string({ required_error: 'Propeller type is required for sailing boats.' }),
  sailRigging: z.string({ required_error: 'Sail rigging is required for sailing boats.' }),
  make: z.string({ required_error: 'Please select or enter a builder.' }),
  model: z.string().min(1, { message: 'Model is required.' }),
  year: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year')
  ),
  length: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Must be a positive number')),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Must be a positive number')),
  description: z.string().min(50, { message: 'Description must be at least 50 characters.' }).max(5000, { message: 'Description cannot exceed 5000 characters.' }),
  features: z.array(z.string()).optional(),
  divisions: z.array(z.string()).optional(),
  deck: z.array(z.string()).optional(),
  cabin: z.array(z.string()).optional(), // Legacy, will be mapped from accommodation
  accommodation: z.object({
    cabins: z.array(z.string()).optional(),
    saloon: z.array(z.string()).optional(),
    galley: z.array(z.string()).optional(),
    heads: z.array(z.string()).optional(),
    numberOfCabins: z.preprocess((a) => a === '' ? undefined : parseInt(z.string().parse(a), 10), z.number().optional()),
    numberOfBerths: z.preprocess((a) => a === '' ? undefined : parseInt(z.string().parse(a), 10), z.number().optional()),
    interiorMaterial: z.string().optional(),
    layout: z.string().optional(),
    floor: z.string().optional(),
    openCockpit: z.boolean().optional(),
    aftDeck: z.boolean().optional(),
    saloonHeadroom: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
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
  }).optional(),
  machinery: z.object({
    numberOfEngines: z.preprocess((a) => a === '' ? undefined : parseInt(z.string().parse(a), 10), z.number().optional()),
    make: z.string().optional(),
    type: z.string().optional(),
    hp: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
    kw: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
    fuel: z.string().optional(),
    yearInstalled: z.preprocess((a) => a === '' ? undefined : parseInt(z.string().parse(a), 10), z.number().optional()),
    yearOfOverhaul: z.string().optional(),
    maxSpeedKnots: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
    cruisingSpeedKnots: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
    consumptionLhr: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
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
  heroImage: z.any().refine((file) => file instanceof File && file.size > 0, "Hero image is required."),
  galleryImages: z.array(z.any()).min(9, { message: 'At least 9 gallery images are required.' }).max(49, { message: 'You can upload a maximum of 49 images.' }),
  otherSpecifications: z.string().max(500, { message: "Cannot exceed 500 characters."}).optional(),
  saDisp: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  balDisp: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  dispLen: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  comfortRatio: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  capsizeScreeningFormula: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  sNum: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  hullSpeed: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  poundsPerInchImmersion: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),

  // New General Fields
  loaM: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  lwlM: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  beamM: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  draftM: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  airDraftM: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  headroomM: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  country: z.string().optional(),
  designer: z.string().optional(),
  displacementT: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  ballastTonnes: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
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
  fuelTankLitre: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  levelIndicatorFuel: z.string().optional(),
  freshwaterTankLitre: z.preprocess((a) => a === '' ? undefined : parseFloat(z.string().parse(a)), z.number().optional()),
  levelIndicatorFreshwater: z.string().optional(),
  wheelSteering: z.string().optional(),
  outsideHelmPosition: z.string().optional(),

});


export type FormValues = z.infer<typeof formSchema>;

const steps = [
  { 
    id: 'Step 1', 
    name: 'General', 
    fields: [
        'listingType', 'boatType', 'condition', 'make', 'model', 'year', 'length', 'price', 'location', 'title', 'description',
        'hullMaterial', 'transomShape', 'bowShape', 'keelType', 'rudderType', 'propellerType', 'sailRigging', 'fuelType', 'divisions', 
        'otherSpecifications', 'features', 'deck', 'accommodation', 'machinery', 'navigation', 'equipment', 'cabin', 'rigging',
        'saDisp', 'balDisp', 'dispLen', 'comfortRatio', 'capsizeScreeningFormula', 'sNum', 'hullSpeed', 'poundsPerInchImmersion',
        'loaM', 'lwlM', 'beamM', 'draftM', 'airDraftM', 'headroomM', 'country', 'designer', 'displacementT', 'ballastTonnes',
        'hullColor', 'hullShape', 'superstructureMaterial', 'deckMaterial', 'deckFinish', 'superstructureDeckFinish', 'cockpitDeckFinish',
        'dorades', 'windowFrame', 'windowMaterial', 'deckhatch', 'fuelTankLitre', 'levelIndicatorFuel', 'freshwaterTankLitre',
        'levelIndicatorFreshwater', 'wheelSteering', 'outsideHelmPosition'
    ] 
  },
  { id: 'Step 2', name: 'Photos', fields: ['heroImage', 'galleryImages'] },
];

export function SellForm() {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [heroImagePreview, setHeroImagePreview] = React.useState<string | null>(null);
    const [galleryImagePreviews, setGalleryImagePreviews] = React.useState<string[]>([]);
    const [lengthUnit, setLengthUnit] = React.useState<'ft' | 'm'>('ft');
    const [isPreview, setIsPreview] = React.useState(false);
    const { toast } = useToast();
    const [metadata, setMetadata] = React.useState<Metadata | null>(null);

    const [aiState, aiFormAction, isAiPending] = useActionState(handleGenerateListingDetails, { result: undefined, error: undefined });
    const [polishState, polishFormAction, isPolishPending] = useActionState(handlePolishDescription, { result: undefined, error: undefined });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            make: undefined,
            model: '',
            year: new Date().getFullYear(),
            length: undefined,
            price: undefined,
            description: '',
            features: [],
            heroImage: undefined,
            galleryImages: [],
            listingType: undefined,
            boatType: undefined,
            divisions: [],
            deck: [],
            cabin: [],
            accommodation: {
                cabins: [],
                saloon: [],
                galley: [],
                heads: [],
            },
            machinery: {},
            navigation: {},
            equipment: {},
            rigging: {},
            condition: undefined,
            location: undefined,
            fuelType: undefined,
            hullMaterial: undefined,
            transomShape: undefined,
            bowShape: undefined,
            keelType: undefined,
            rudderType: undefined,
            propellerType: undefined,
            sailRigging: undefined,
            otherSpecifications: '',
        },
    });

    React.useEffect(() => {
        async function fetchMetadata() {
            const data = await getMetadata();
            setMetadata(data);
        }
        fetchMetadata();
    }, []);

    useEffect(() => {
        if (aiState.error) {
            toast({
                variant: 'destructive',
                title: 'AI Generation Failed',
                description: aiState.error,
            });
        }
        if (aiState.result) {
            form.setValue('title', aiState.result.title, { shouldValidate: true });
            form.setValue('description', aiState.result.description, { shouldValidate: true });
            if (aiState.result.detectedHullMaterial) form.setValue('hullMaterial', aiState.result.detectedHullMaterial, { shouldValidate: true });
            if (aiState.result.detectedTransomShape) form.setValue('transomShape', aiState.result.detectedTransomShape, { shouldValidate: true });
            if (aiState.result.detectedKeelType) form.setValue('keelType', aiState.result.detectedKeelType, { shouldValidate: true });
            if (aiState.result.detectedRudderType) form.setValue('rudderType', aiState.result.detectedRudderType, { shouldValidate: true });
            if (aiState.result.detectedPropellerType) form.setValue('propellerType', aiState.result.detectedPropellerType, { shouldValidate: true });
            if (aiState.result.detectedFuelType) form.setValue('fuelType', aiState.result.detectedFuelType, { shouldValidate: true });
            if (aiState.result.detectedDivisions) form.setValue('divisions', aiState.result.detectedDivisions, { shouldValidate: true });
            if (aiState.result.detectedFeatures) form.setValue('features', aiState.result.detectedFeatures, { shouldValidate: true });
            if (aiState.result.detectedDeck) form.setValue('deck', aiState.result.detectedDeck, { shouldValidate: true });
            if (aiState.result.detectedCabins) form.setValue('accommodation.cabins', aiState.result.detectedCabins, { shouldValidate: true });
            if (aiState.result.detectedSaloon) form.setValue('accommodation.saloon', aiState.result.detectedSaloon, { shouldValidate: true });
            if (aiState.result.detectedGalley) form.setValue('accommodation.galley', aiState.result.detectedGalley, { shouldValidate: true });
            if (aiState.result.detectedHeads) form.setValue('accommodation.heads', aiState.result.detectedHeads, { shouldValidate: true });
            toast({
                title: 'AI Magic Complete!',
                description: 'Your title and description have been generated, and we\'ve pre-selected some features for you.',
            });
        }
    }, [aiState, form, toast]);

    useEffect(() => {
        if (polishState.error) {
            toast({
                variant: 'destructive',
                title: 'AI Polish Failed',
                description: polishState.error,
            });
        }
        if (polishState.result) {
            form.setValue('description', polishState.result, { shouldValidate: true });
            toast({
                title: 'Description Polished!',
                description: 'The AI has refined your description.',
            });
        }
    }, [polishState, form, toast]);

    const next = async () => {
        const fields = steps[currentStep].fields as FieldName<FormValues>[];
        const output = await form.trigger(fields, { shouldFocus: true });

        if (!output) return;

        if (currentStep < steps.length - 1) {
            setCurrentStep(step => step + 1);
        } else {
            setIsPreview(true);
        }
    };

    const prev = () => {
        if (isPreview) {
            setIsPreview(false);
            return;
        }
        if (currentStep > 0) {
            setCurrentStep(step => step - 1);
        }
    };
    
    function onSubmit(values: FormValues) {
        // Map the flat 'cabin' array from accommodation object for submission
        const submissionValues = {
            ...values,
            cabin: [
                ...(values.accommodation?.cabins || []),
                ...(values.accommodation?.saloon || []),
                ...(values.accommodation?.galley || []),
                ...(values.accommodation?.heads || []),
            ]
        };
        console.log('Form Submitted:', { ...submissionValues, lengthUnit });
        toast({
            title: "Listing Submitted!",
            description: "Your yacht is now ready for review.",
        });
    }

    if (!metadata) {
        return (
             <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
             </div>
        );
    }


    if (isPreview) {
        const formData = form.getValues();
        return (
            <div>
                <div className="mb-8 flex justify-between items-center">
                   <div>
                     <h2 className="text-2xl font-bold">Review Your Listing</h2>
                     <p className="text-muted-foreground">This is how your listing will appear to potential buyers.</p>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="outline" onClick={prev}><ArrowLeft className="mr-2 h-4 w-4" /> Edit Listing</Button>
                      <Button type="button" onClick={form.handleSubmit(onSubmit)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                          <Ship className="mr-2 h-5 w-5" />
                          List My Yacht
                      </Button>
                   </div>
                </div>
                <ListingPreview
                    data={formData}
                    metadata={metadata}
                    heroImagePreview={heroImagePreview!}
                    galleryImagePreviews={galleryImagePreviews}
                />
                <div className="mt-8 flex justify-end gap-2">
                    <Button variant="outline">Save as Draft</Button>
                    <Button type="button" onClick={form.handleSubmit(onSubmit)} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Ship className="mr-2 h-5 w-5" />
                        List My Yacht
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                    <Progress value={((currentStep + 1) / (steps.length + 1)) * 100} />
                    <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}</p>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 0 && (
                                <div className="space-y-8">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>General</CardTitle>
                                            <CardDescription>Start with the most important details for your listing. Use our AI assistant for an SEO-optimized result!</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField control={form.control} name="listingType" render={({ field }) => (
                                                    <FormItem><FormLabel>Listing Type</FormLabel><FormControl>
                                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4 pt-2">
                                                            {metadata.listingTypes.map((type) => (<FormItem key={type.id} className="flex items-center space-x-2 space-y-0">
                                                                <FormControl><RadioGroupItem value={type.id} /></FormControl>
                                                                <FormLabel className="font-normal">{type.label}</FormLabel>
                                                            </FormItem>))}
                                                        </RadioGroup>
                                                    </FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="condition" render={({ field }) => (
                                                    <FormItem><FormLabel>Condition</FormLabel><FormControl>
                                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4 pt-2">
                                                            {metadata.conditions.map((c) => (<FormItem key={c.id} className="flex items-center space-x-2 space-y-0">
                                                                <FormControl><RadioGroupItem value={c.id} /></FormControl>
                                                                <FormLabel className="font-normal">{c.label}</FormLabel>
                                                            </FormItem>))}
                                                        </RadioGroup>
                                                    </FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                            <FormField control={form.control} name="price" render={({ field }) => (
                                                <FormItem><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="location" render={({ field }) => (
                                                <FormItem><FormLabel>Location</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            {metadata.locationsByRegion.map((region) => (
                                                                <SelectGroup key={region.region}>
                                                                    <SelectLabel>{region.region}</SelectLabel>
                                                                    {region.locations.map(loc => <SelectItem key={loc.id} value={loc.id}>{loc.label}</SelectItem>)}
                                                                </SelectGroup>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                <FormMessage /></FormItem>
                                            )} />
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                <FormLabel>Listing Title</FormLabel>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={isAiPending}
                                                        onClick={() => {
                                                            const formData = new FormData();
                                                            formData.append('make', form.getValues('make'));
                                                            formData.append('model', form.getValues('model'));
                                                            formData.append('year', form.getValues('year').toString());
                                                            formData.append('length', form.getValues('length').toString());
                                                            formData.append('condition', form.getValues('condition'));
                                                            formData.append('boatType', form.getValues('boatType'));
                                                            form.getValues('features')?.forEach(f => formData.append('features', f));
                                                            aiFormAction(formData);
                                                        }}
                                                    >
                                                        {isAiPending ? (
                                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Sparkles className="mr-2 h-4 w-4" />
                                                        )}
                                                        Generate with AI
                                                    </Button>
                                                </div>
                                                <FormField control={form.control} name="title" render={({ field }) => (
                                                    <FormItem><FormControl><Input placeholder="e.g., For Sale: 2022 Beneteau Oceanis 46.1" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t">
                                                <FormField control={form.control} name="make" render={({ field }) => (
                                                    <FormItem><FormLabel>Builder</FormLabel>
                                                        <FormControl>
                                                            <Combobox
                                                                options={metadata.makes.map(m => ({ label: m.label, value: m.value || m.id }))}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder="Select a builder..."
                                                                searchPlaceholder="Search builders..."
                                                                notFoundText="No builder found. You can add a new one."
                                                            />
                                                        </FormControl>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="model" render={({ field }) => (
                                                    <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., Oceanis 46.1" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="boatType" render={({ field }) => (
                                                    <FormItem><FormLabel>Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.boatTypes.map((type) => (
                                                                    <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="year" render={({ field }) => (
                                                    <FormItem><FormLabel>Year Built</FormLabel><FormControl><Input type="number" placeholder="e.g., 2022" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="designer" render={({ field }) => (
                                                    <FormItem><FormLabel>Designer</FormLabel><FormControl><Input placeholder="e.g., Olle Enderlein" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="country" render={({ field }) => (
                                                    <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="e.g., Sweden" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="length" render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel>LOA (ft)</FormLabel>
                                                    </div>
                                                    <FormControl><Input type="number" placeholder="e.g., 49" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )} />
                                                <FormField control={form.control} name="loaM" render={({ field }) => (
                                                    <FormItem><FormLabel>LOA (m)</FormLabel><FormControl><Input type="number" placeholder="e.g., 14.96" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="lwlM" render={({ field }) => (
                                                    <FormItem><FormLabel>LWL (m)</FormLabel><FormControl><Input type="number" placeholder="e.g., 12.50" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="beamM" render={({ field }) => (
                                                    <FormItem><FormLabel>Beam (m)</FormLabel><FormControl><Input type="number" placeholder="e.g., 4.42" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="draftM" render={({ field }) => (
                                                    <FormItem><FormLabel>Draft (m)</FormLabel><FormControl><Input type="number" placeholder="e.g., 2.20" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="airDraftM" render={({ field }) => (
                                                    <FormItem><FormLabel>Air Draft (m)</FormLabel><FormControl><Input type="number" placeholder="e.g., 21.45" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="headroomM" render={({ field }) => (
                                                    <FormItem><FormLabel>Headroom (m)</FormLabel><FormControl><Input type="number" placeholder="e.g., 2.00" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="displacementT" render={({ field }) => (
                                                    <FormItem><FormLabel>Displacement (t)</FormLabel><FormControl><Input type="number" placeholder="e.g., 18" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="ballastTonnes" render={({ field }) => (
                                                    <FormItem><FormLabel>Ballast (tonnes)</FormLabel><FormControl><Input type="number" placeholder="e.g., 8.1" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="hullColor" render={({ field }) => (
                                                    <FormItem><FormLabel>Hull Colour</FormLabel><FormControl><Input placeholder="e.g., white" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="hullShape" render={({ field }) => (
                                                    <FormItem><FormLabel>Hull Shape</FormLabel><FormControl><Input placeholder="e.g., S-bilged" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="superstructureMaterial" render={({ field }) => (
                                                    <FormItem><FormLabel>Superstructure Material</FormLabel><FormControl><Input placeholder="e.g., GRP" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="deckMaterial" render={({ field }) => (
                                                    <FormItem><FormLabel>Deck Material</FormLabel><FormControl><Input placeholder="e.g., GRP" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="deckFinish" render={({ field }) => (
                                                    <FormItem><FormLabel>Deck Finish</FormLabel><FormControl><Input placeholder="e.g., teak 2019" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="superstructureDeckFinish" render={({ field }) => (
                                                    <FormItem><FormLabel>Superstructure Deck Finish</FormLabel><FormControl><Input placeholder="e.g., teak 2019" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="cockpitDeckFinish" render={({ field }) => (
                                                    <FormItem><FormLabel>Cockpit Deck Finish</FormLabel><FormControl><Input placeholder="e.g., teak" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="dorades" render={({ field }) => (
                                                    <FormItem><FormLabel>Dorades</FormLabel><FormControl><Input placeholder="e.g., 5x Vetus" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="windowFrame" render={({ field }) => (
                                                    <FormItem><FormLabel>Window Frame</FormLabel><FormControl><Input placeholder="e.g., aluminium" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="windowMaterial" render={({ field }) => (
                                                    <FormItem><FormLabel>Window Material</FormLabel><FormControl><Input placeholder="e.g., tempered glass" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="deckhatch" render={({ field }) => (
                                                    <FormItem><FormLabel>Deckhatch</FormLabel><FormControl><Input placeholder="e.g., 6x Gebo" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="fuelTankLitre" render={({ field }) => (
                                                    <FormItem><FormLabel>Fuel Tank (litre)</FormLabel><FormControl><Input type="number" placeholder="e.g., 765" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="levelIndicatorFuel" render={({ field }) => (
                                                    <FormItem><FormLabel>Level Indicator (Fuel)</FormLabel><FormControl><Input placeholder="e.g., Wema aanalogue indicator" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="freshwaterTankLitre" render={({ field }) => (
                                                    <FormItem><FormLabel>Freshwater Tank (litre)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1400" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="levelIndicatorFreshwater" render={({ field }) => (
                                                    <FormItem><FormLabel>Level Indicator (Freshwater)</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="wheelSteering" render={({ field }) => (
                                                    <FormItem><FormLabel>Wheel Steering</FormLabel><FormControl><Input placeholder="e.g., mechanical" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="outsideHelmPosition" render={({ field }) => (
                                                    <FormItem><FormLabel>Outside Helm Position</FormLabel><FormControl><Input placeholder="e.g., mechanical" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />

                                                <FormField control={form.control} name="divisions" render={({ field }) => (
                                                    <FormItem><FormLabel>Division</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value?.[0]}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a division" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.divisions.map((item) => (<SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="sailRigging" render={({ field }) => (
                                                    <FormItem><FormLabel>Sail Rigging</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select sail rigging" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.sailRiggingOptions.map((item) => (<SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="hullMaterial" render={({ field }) => (
                                                    <FormItem><FormLabel>Hull Material</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select hull material" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.hullMaterialOptions.map((item) => (<SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="transomShape" render={({ field }) => (
                                                    <FormItem><FormLabel>Transom Shape</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select transom shape" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.transomShapeOptions.map((item) => (<SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="bowShape" render={({ field }) => (
                                                    <FormItem><FormLabel>Bow Shape</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select bow shape" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.bowShapeOptions.map((item) => (<SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="keelType" render={({ field }) => (
                                                    <FormItem><FormLabel>Keel Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select keel type" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.keelTypeOptions.map((item) => (<SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="rudderType" render={({ field }) => (
                                                    <FormItem><FormLabel>Rudder Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select rudder type" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.rudderTypeOptions.map((item) => (<SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="propellerType" render={({ field }) => (
                                                    <FormItem><FormLabel>Propeller Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select propeller type" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.propellerTypeOptions.map((item) => (<SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="fuelType" render={({ field }) => (
                                                    <FormItem><FormLabel>Fuel Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select fuel type" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {metadata.fuelTypes.map((item) => (<SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage /></FormItem>
                                                )} />

                                            </div>
                                            <FormField control={form.control} name="description" render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel>Description</FormLabel>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={isPolishPending || !field.value}
                                                                onClick={() => {
                                                                    const formData = new FormData();
                                                                    formData.append('description', form.getValues('description'));
                                                                    polishFormAction(formData);
                                                                }}
                                                            >
                                                                {isPolishPending ? (
                                                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                                )}
                                                                Polish with AI
                                                            </Button>
                                                    </div>
                                                    <FormControl>
                                                        <TextEditor
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Describe your yacht's condition, history, and unique features..."
                                                        />
                                                    </FormControl>
                                                    <FormDescription>For best results, describe what makes your yacht special. Include recent upgrades, maintenance history, and ideal uses.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="otherSpecifications" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Other Specifications (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="e.g., Custom rigging, specific navigation equipment not listed, etc."
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Use this field to list any other important specifications not covered above.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </CardContent>
                                    </Card>
                                    
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Calculated Ratios (Optional)</CardTitle>
                                            <CardDescription>Provide these performance ratios if you know them. They are highly sought after by experienced sailors.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <FormField control={form.control} name="saDisp" render={({ field }) => (
                                                    <FormItem><div className="flex items-center">
                                                        <FormLabel htmlFor="sa-disp">SA/Disp.</FormLabel>
                                                        <InfoTooltip>
                                                            <div className="space-y-2 text-left">
                                                                <p>A sail area/displacement ratio below 16 is underpowered; 16 to 20 is good performance; above 20 is high performance.</p>
                                                                <code className="text-xs">SA/D = SA (ft²) ÷ [Disp (lbs) / 64]^0.666</code>
                                                            </div>
                                                        </InfoTooltip>
                                                    </div><FormControl><Input id="sa-disp" type="number" placeholder="e.g., 18.5" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="balDisp" render={({ field }) => (
                                                    <FormItem><div className="flex items-center">
                                                        <FormLabel htmlFor="bal-disp">Bal./Disp.</FormLabel>
                                                        <InfoTooltip>
                                                            <div className="space-y-2 text-left">
                                                                <p>A Ballast/Displacement ratio of 40 or more means a stiffer, more powerful boat.</p>
                                                                <code className="text-xs">Bal./Disp = ballast (lbs) / displacement (lbs) * 100</code>
                                                            </div>
                                                        </InfoTooltip>
                                                    </div><FormControl><Input id="bal-disp" type="number" placeholder="e.g., 42" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="dispLen" render={({ field }) => (
                                                    <FormItem><div className="flex items-center">
                                                        <FormLabel htmlFor="disp-len">Disp./Len.</FormLabel>
                                                        <InfoTooltip>
                                                            <div className="space-y-2 text-left">
                                                                <p>The lower the ratio, the less power is needed to reach hull speed. &lt;100: Ultralight, 100-200: Light, 200-275: Moderate, 275-350: Heavy, 350+: Ultraheavy.</p>
                                                                <code className="text-xs">D/L = (Disp / 2240) / (0.01*LWL)^3</code>
                                                            </div>
                                                        </InfoTooltip>
                                                    </div><FormControl><Input id="disp-len" type="number" placeholder="e.g., 280" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="comfortRatio" render={({ field }) => (
                                                    <FormItem><div className="flex items-center">
                                                        <FormLabel htmlFor="comfort-ratio">Comfort Ratio</FormLabel>
                                                        <InfoTooltip>
                                                            <div className="space-y-2 text-left">
                                                                <p>A measure of motion comfort by Ted Brewer. &lt;20: Racing, 20-30: Coastal Cruiser, 30-40: Moderate Bluewater, 40-50: Heavy Bluewater, 50+: Extremely Heavy Bluewater.</p>
                                                                <code className="text-xs">CR = D ÷ (.65 x (.7 LWL + .3 LOA) x Beam^1.33)</code>
                                                            </div>
                                                        </InfoTooltip>
                                                    </div><FormControl><Input id="comfort-ratio" type="number" placeholder="e.g., 35" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="capsizeScreeningFormula" render={({ field }) => (
                                                    <FormItem><div className="flex items-center">
                                                        <FormLabel htmlFor="csf">Capsize Screen</FormLabel>
                                                        <InfoTooltip>
                                                            <div className="space-y-2 text-left">
                                                                <p>Determines blue water capability. A result of 2.0 or less is better suited for ocean passages. The lower the better.</p>
                                                                <code className="text-xs">CSF = Beam / (Disp / 64)^0.333</code>
                                                            </div>
                                                        </InfoTooltip>
                                                    </div><FormControl><Input id="csf" type="number" placeholder="e.g., 1.8" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="sNum" render={({ field }) => (
                                                    <FormItem><div className="flex items-center">
                                                        <FormLabel htmlFor="s-num">S#</FormLabel>
                                                        <InfoTooltip>
                                                            <div className="space-y-2 text-left">
                                                                <p>A guide to probable boat performance. For boats of the same length, a higher S# generally means a lower PHRF. &lt;2: Slow, 2-3: Cruiser, 3-5: Racer Cruiser, 5+: Fast/Racing.</p>
                                                                <code className="text-xs">S# = 3.972*(10^(-[Dsp/LWL]/526+(0.691*(LOG([@[SA/Dp]])-1)^0.8)))</code>
                                                            </div>
                                                        </InfoTooltip>
                                                    </div><FormControl><Input id="s-num" type="number" placeholder="e.g., 3.1" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="hullSpeed" render={({ field }) => (
                                                    <FormItem><div className="flex items-center">
                                                        <FormLabel htmlFor="hull-speed">Hull Speed</FormLabel>
                                                        <InfoTooltip>
                                                            <div className="space-y-2 text-left">
                                                                <p>The maximum speed of a displacement hull.</p>
                                                                <code className="text-xs">HS = 1.34 x &#8730;LWL (in feet)</code>
                                                            </div>
                                                        </InfoTooltip>
                                                    </div><FormControl><Input id="hull-speed" type="number" placeholder="e.g., 8.3" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="poundsPerInchImmersion" render={({ field }) => (
                                                    <FormItem><div className="flex items-center">
                                                        <FormLabel htmlFor="ppi">PPI</FormLabel>
                                                        <InfoTooltip>
                                                            <p className="text-left">Pounds per Inch Immersion.</p>
                                                        </InfoTooltip>
                                                    </div><FormControl><Input id="ppi" type="number" placeholder="e.g., 1500" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Rigging</CardTitle>
                                            <CardDescription>Provide details about the rigging and sails.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <FormField control={form.control} name="rigging.rigging" render={({ field }) => (<FormItem><FormLabel>Rigging</FormLabel><FormControl><Input placeholder="e.g., sloop" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.standingRigging" render={({ field }) => (<FormItem><FormLabel>Standing Rigging</FormLabel><FormControl><Input placeholder="e.g., wire" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.brandMast" render={({ field }) => (<FormItem><FormLabel>Brand Mast</FormLabel><FormControl><Input placeholder="e.g., Seldén" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.materialMast" render={({ field }) => (<FormItem><FormLabel>Material Mast</FormLabel><FormControl><Input placeholder="e.g., aluminium" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.spreaders" render={({ field }) => (<FormItem><FormLabel>Spreaders</FormLabel><FormControl><Input placeholder="e.g., 3 sets" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.mainsail" render={({ field }) => (<FormItem><FormLabel>Mainsail</FormLabel><FormControl><Input placeholder="e.g., New 2023 De vries maritiem lemmer 55m2" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.stowayMast" render={({ field }) => (<FormItem><FormLabel>Stoway Mast</FormLabel><FormControl><Input placeholder="e.g., Seldén electric" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.cutterstay" render={({ field }) => (<FormItem><FormLabel>Cutterstay</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.jib" render={({ field }) => (<FormItem><FormLabel>Jib</FormLabel><FormControl><Input placeholder="e.g., Ullman sails" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.genoa" render={({ field }) => (<FormItem><FormLabel>Genoa</FormLabel><FormControl><Input placeholder="e.g., New 2023 De vries maritiem lemmer 77 m2" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.genoaFurler" render={({ field }) => (<FormItem><FormLabel>Genoa Furler</FormLabel><FormControl><Input placeholder="e.g., Furlex 400e Electric" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.cutterFurler" render={({ field }) => (<FormItem><FormLabel>Cutter Furler</FormLabel><FormControl><Input placeholder="e.g., Furlex" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.gennaker" render={({ field }) => (<FormItem><FormLabel>Gennaker</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.spinnaker" render={({ field }) => (<FormItem><FormLabel>Spinnaker</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.reefingSystem" render={({ field }) => (<FormItem><FormLabel>Reefing System</FormLabel><FormControl><Input placeholder="e.g., main in-mast furling" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.backstayAdjuster" render={({ field }) => (<FormItem><FormLabel>Backstay Adjuster</FormLabel><FormControl><Input placeholder="e.g., hydraulic | Navtec" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.primarySheetWinch" render={({ field }) => (<FormItem><FormLabel>Primary Sheet Winch</FormLabel><FormControl><Input placeholder="e.g., 2x Lewmar 43 self tailing" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.secondarySheetWinch" render={({ field }) => (<FormItem><FormLabel>Secondary Sheet Winch</FormLabel><FormControl><Input placeholder="e.g., Lewmar 46 self tailing" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.genoaSheetwinches" render={({ field }) => (<FormItem><FormLabel>Genoa Sheetwinches</FormLabel><FormControl><Input placeholder="e.g., 2x Lewmar 64 self tailing electric" {...field} /></FormControl><FormMessage /></FormMessage>)} />
                                                <FormField control={form.control} name="rigging.halyardWinches" render={({ field }) => (<FormItem><FormLabel>Halyard Winches</FormLabel><FormControl><Input placeholder="e.g., 2x Lewmar 43 self tailing" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.multifunctionalWinches" render={({ field }) => (<FormItem><FormLabel>Multifunctional Winches</FormLabel><FormControl><Input placeholder="e.g., Lewmar 8 Pole hoist winch | Lewmar ocean electric 40" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="rigging.spiPole" render={({ field }) => (<FormItem><FormLabel>Spi-Pole</FormLabel><FormControl><Input placeholder="e.g., aluminium" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Accommodation</CardTitle>
                                            <CardDescription>Provide details about the interior layout and features.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4 border-b pb-4">
                                                <h4 className="text-base font-semibold">General</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <FormField control={form.control} name="accommodation.numberOfCabins" render={({ field }) => (
                                                        <FormItem><FormLabel>Cabins</FormLabel><FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.numberOfBerths" render={({ field }) => (
                                                        <FormItem><FormLabel>Berths</FormLabel><FormControl><Input type="number" placeholder="e.g., 9" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.interiorMaterial" render={({ field }) => (
                                                        <FormItem><FormLabel>Interior</FormLabel><FormControl><Input placeholder="e.g., teak" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.layout" render={({ field }) => (
                                                        <FormItem><FormLabel>Layout</FormLabel><FormControl><Input placeholder="e.g., Classic | Warm" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.floor" render={({ field }) => (
                                                        <FormItem><FormLabel>Floor</FormLabel><FormControl><Input placeholder="e.g., teak and holly" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.saloonHeadroom" render={({ field }) => (
                                                        <FormItem><FormLabel>Saloon Headroom (m)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1.95" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.heating" render={({ field }) => (
                                                        <FormItem><FormLabel>Heating</FormLabel><FormControl><Input placeholder="e.g., 2x Webasto HL32" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                                    <FormField control={form.control} name="accommodation.openCockpit" render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3 shadow-sm"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Open Cockpit</FormLabel></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.aftDeck" render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3 shadow-sm"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Aft Deck</FormLabel></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.navigationCenter" render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3 shadow-sm"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Navigation Center</FormLabel></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.chartTable" render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3 shadow-sm"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Chart Table</FormLabel></FormItem>
                                                    )} />
                                                </div>
                                            </div>
                                            <div className="space-y-4 border-b pb-4">
                                                <h4 className="text-base font-semibold">Galley</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <FormField control={form.control} name="accommodation.countertop" render={({ field }) => (
                                                        <FormItem><FormLabel>Countertop</FormLabel><FormControl><Input placeholder="e.g., wood" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.sink" render={({ field }) => (
                                                        <FormItem><FormLabel>Sink</FormLabel><FormControl><Input placeholder="e.g., stainless steel | Double" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.cooker" render={({ field }) => (
                                                        <FormItem><FormLabel>Cooker</FormLabel><FormControl><Input placeholder="e.g., Eno | 2-burner" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.oven" render={({ field }) => (
                                                        <FormItem><FormLabel>Oven</FormLabel><FormControl><Input placeholder="e.g., In cooker" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.microwave" render={({ field }) => (
                                                        <FormItem><FormLabel>Microwave</FormLabel><FormControl><Input placeholder="e.g., Electrolux NF4014" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.fridge" render={({ field }) => (
                                                        <FormItem><FormLabel>Fridge</FormLabel><FormControl><Input placeholder="e.g., Dometic CU55" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.freezer" render={({ field }) => (
                                                        <FormItem><FormLabel>Freezer</FormLabel><FormControl><Input placeholder="e.g., Frigoboat" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.hotWaterSystem" render={({ field }) => (
                                                        <FormItem><FormLabel>Hot Water</FormLabel><FormControl><Input placeholder="e.g., 220V + engine" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.waterPressureSystem" render={({ field }) => (
                                                        <FormItem><FormLabel>Water Pressure</FormLabel><FormControl><Input placeholder="e.g., electrical" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                            </div>
                                            <div className="space-y-4 border-b pb-4">
                                                <h4 className="text-base font-semibold">Owner's Cabin</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <FormField control={form.control} name="accommodation.ownersCabin" render={({ field }) => (
                                                        <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., twin single" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.ownersCabinBedLength" render={({ field }) => (
                                                        <FormItem><FormLabel>Bed Length (m)</FormLabel><FormControl><Input placeholder="e.g., 2,05" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.ownersCabinWardrobe" render={({ field }) => (
                                                        <FormItem><FormLabel>Wardrobe</FormLabel><FormControl><Input placeholder="e.g., hanging and shelves" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.ownersCabinBathroom" render={({ field }) => (
                                                        <FormItem><FormLabel>Bathroom</FormLabel><FormControl><Input placeholder="e.g., en suite" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.ownersCabinToilet" render={({ field }) => (
                                                        <FormItem><FormLabel>Toilet</FormLabel><FormControl><Input placeholder="e.g., en suite" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.ownersCabinToiletSystem" render={({ field }) => (
                                                        <FormItem><FormLabel>Toilet System</FormLabel><FormControl><Input placeholder="e.g., manual | Jabsco" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.ownersCabinWashBasin" render={({ field }) => (
                                                        <FormItem><FormLabel>Wash Basin</FormLabel><FormControl><Input placeholder="e.g., in cabin" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.ownersCabinShower" render={({ field }) => (
                                                        <FormItem><FormLabel>Shower</FormLabel><FormControl><Input placeholder="e.g., en suite" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                            </div>
                                            <div className="space-y-4 border-b pb-4">
                                                <h4 className="text-base font-semibold">Guest Cabin 1</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <FormField control={form.control} name="accommodation.guestCabin1" render={({ field }) => (
                                                        <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., v-bed" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.guestCabin1BedLength" render={({ field }) => (
                                                        <FormItem><FormLabel>Bed Length (m)</FormLabel><FormControl><Input placeholder="e.g., 2,04" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.guestCabin1Wardrobe" render={({ field }) => (
                                                        <FormItem><FormLabel>Wardrobe</FormLabel><FormControl><Input placeholder="e.g., hanging and shelves" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                            </div>
                                            <div className="space-y-4 border-b pb-4">
                                                <h4 className="text-base font-semibold">Guest Cabin 2</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <FormField control={form.control} name="accommodation.guestCabin2" render={({ field }) => (
                                                        <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., bunk bed" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.guestCabin2BedLength" render={({ field }) => (
                                                        <FormItem><FormLabel>Bed Length (m)</FormLabel><FormControl><Input placeholder="e.g., 2,00" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.guestCabin2Wardrobe" render={({ field }) => (
                                                        <FormItem><FormLabel>Wardrobe</FormLabel><FormControl><Input placeholder="e.g., hanging and shelves" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="text-base font-semibold">Bathroom</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <FormField control={form.control} name="accommodation.sharedBathroom" render={({ field }) => (
                                                        <FormItem><FormLabel>Bathroom</FormLabel><FormControl><Input placeholder="e.g., shared" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.sharedToilet" render={({ field }) => (
                                                        <FormItem><FormLabel>Toilet</FormLabel><FormControl><Input placeholder="e.g., shared" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.sharedToiletSystem" render={({ field }) => (
                                                        <FormItem><FormLabel>Toilet System</FormLabel><FormControl><Input placeholder="e.g., manual" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.sharedWashBasin" render={({ field }) => (
                                                        <FormItem><FormLabel>Wash Basin</FormLabel><FormControl><Input placeholder="e.g., in bathroom" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.sharedShower" render={({ field }) => (
                                                        <FormItem><FormLabel>Shower</FormLabel><FormControl><Input placeholder="e.g., shared" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                    <FormField control={form.control} name="accommodation.washingMachine" render={({ field }) => (
                                                        <FormItem><FormLabel>Washing Machine</FormLabel><FormControl><Input placeholder="e.g., Kenny Compact" {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Machinery</CardTitle>
                                            <CardDescription>Provide details about the engine and other machinery.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <FormField control={form.control} name="machinery.numberOfEngines" render={({ field }) => (<FormItem><FormLabel>No. of Engines</FormLabel><FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.make" render={({ field }) => (<FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="e.g., Volvo Penta" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., TMD41A" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.hp" render={({ field }) => (<FormItem><FormLabel>HP</FormLabel><FormControl><Input type="number" placeholder="e.g., 143" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.kw" render={({ field }) => (<FormItem><FormLabel>kW</FormLabel><FormControl><Input type="number" placeholder="e.g., 105.25" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.fuel" render={({ field }) => (<FormItem><FormLabel>Fuel</FormLabel><FormControl><Input placeholder="e.g., diesel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.yearInstalled" render={({ field }) => (<FormItem><FormLabel>Year Installed</FormLabel><FormControl><Input type="number" placeholder="e.g., 1991" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.yearOfOverhaul" render={({ field }) => (<FormItem><FormLabel>Year of Overhaul</FormLabel><FormControl><Input placeholder="e.g., 2018" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.maxSpeedKnots" render={({ field }) => (<FormItem><FormLabel>Max Speed (kn)</FormLabel><FormControl><Input type="number" placeholder="e.g., 9" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.cruisingSpeedKnots" render={({ field }) => (<FormItem><FormLabel>Cruising Speed (kn)</FormLabel><FormControl><Input type="number" placeholder="e.g., 7.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.consumptionLhr" render={({ field }) => (<FormItem><FormLabel>Consumption (L/hr)</FormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.engineCoolingSystem" render={({ field }) => (<FormItem><FormLabel>Engine Cooling System</FormLabel><FormControl><Input placeholder="e.g., seawater" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.drive" render={({ field }) => (<FormItem><FormLabel>Drive</FormLabel><FormControl><Input placeholder="e.g., shaft" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.shaftSeal" render={({ field }) => (<FormItem><FormLabel>Shaft Seal</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.engineControls" render={({ field }) => (<FormItem><FormLabel>Engine Controls</FormLabel><FormControl><Input placeholder="e.g., bowden cable" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.gearbox" render={({ field }) => (<FormItem><FormLabel>Gearbox</FormLabel><FormControl><Input placeholder="e.g., mechanical" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.bowthruster" render={({ field }) => (<FormItem><FormLabel>Bowthruster</FormLabel><FormControl><Input placeholder="e.g., electric" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.propellerType" render={({ field }) => (<FormItem><FormLabel>Propeller Type</FormLabel><FormControl><Input placeholder="e.g., fixed" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.manualBilgePump" render={({ field }) => (<FormItem><FormLabel>Manual Bilge Pump</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.electricBilgePump" render={({ field }) => (<FormItem><FormLabel>Electric Bilge Pump</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.electricalInstallation" render={({ field }) => (<FormItem><FormLabel>Electrical Installation</FormLabel><FormControl><Input placeholder="e.g., 12-24-230 V" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.generator" render={({ field }) => (<FormItem><FormLabel>Generator</FormLabel><FormControl><Input placeholder="e.g., Westerbeke 8 kW" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.batteries" render={({ field }) => (<FormItem><FormLabel>Batteries</FormLabel><FormControl><Input placeholder="e.g., 5 x Greenline 12V - 105Ah" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.startBattery" render={({ field }) => (<FormItem><FormLabel>Start Battery</FormLabel><FormControl><Input placeholder="e.g., 1 x 105Ah" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.serviceBattery" render={({ field }) => (<FormItem><FormLabel>Service Battery</FormLabel><FormControl><Input placeholder="e.g., 4 x 105Ah" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.batteryMonitor" render={({ field }) => (<FormItem><FormLabel>Battery Monitor</FormLabel><FormControl><Input placeholder="e.g., Odelco DCC 2000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.batteryCharger" render={({ field }) => (<FormItem><FormLabel>Battery Charger</FormLabel><FormControl><Input placeholder="e.g., Victron Centaur 24v 60Ah" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.solarPanel" render={({ field }) => (<FormItem><FormLabel>Solar Panel</FormLabel><FormControl><Input placeholder="e.g., Solbian 2 x SR166" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.shorepower" render={({ field }) => (<FormItem><FormLabel>Shorepower</FormLabel><FormControl><Input placeholder="e.g., with cable" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.watermaker" render={({ field }) => (<FormItem><FormLabel>Watermaker</FormLabel><FormControl><Input placeholder="e.g., Not connected" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="machinery.extraInfo" render={({ field }) => (<FormItem className="md:col-span-full"><FormLabel>Extra Info</FormLabel><FormControl><Textarea placeholder="Any other machinery details..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Navigation</CardTitle>
                                            <CardDescription>Provide details about the navigation equipment.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <FormField control={form.control} name="navigation.compass" render={({ field }) => (<FormItem><FormLabel>Compass</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.depthSounder" render={({ field }) => (<FormItem><FormLabel>Depth Sounder</FormLabel><FormControl><Input placeholder="e.g., B&G" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.log" render={({ field }) => (<FormItem><FormLabel>Log</FormLabel><FormControl><Input placeholder="e.g., B&G" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.windset" render={({ field }) => (<FormItem><FormLabel>Windset</FormLabel><FormControl><Input placeholder="e.g., B&G" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.vhf" render={({ field }) => (<FormItem><FormLabel>VHF</FormLabel><FormControl><Input placeholder="e.g., Icom IC-M423G" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.autopilot" render={({ field }) => (<FormItem><FormLabel>Autopilot</FormLabel><FormControl><Input placeholder="e.g., B&G Hydro Pilot" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.radar" render={({ field }) => (<FormItem><FormLabel>Radar</FormLabel><FormControl><Input placeholder="e.g., B&G 4G" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.gps" render={({ field }) => (<FormItem><FormLabel>GPS</FormLabel><FormControl><Input placeholder="e.g., Furuno GP32" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.plotter" render={({ field }) => (<FormItem><FormLabel>Plotter</FormLabel><FormControl><Input placeholder="e.g., B&G 12'' Zeus Touch" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.navtex" render={({ field }) => (<FormItem><FormLabel>Navtex</FormLabel><FormControl><Input placeholder="e.g., ISC NAV6" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.aisTransceiver" render={({ field }) => (<FormItem><FormLabel>AIS Transceiver</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.navigationLights" render={({ field }) => (<FormItem><FormLabel>Navigation Lights</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="navigation.extraInfo" render={({ field }) => (<FormItem className="md:col-span-full"><FormLabel>Extra Info</FormLabel><FormControl><Textarea placeholder="Any other navigation details..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Equipment</CardTitle>
                                            <CardDescription>Provide details about the equipment included with your yacht.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <FormField control={form.control} name="equipment.fixedWindscreen" render={({ field }) => (<FormItem><FormLabel>Fixed Windscreen</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.cockpitTable" render={({ field }) => (<FormItem><FormLabel>Cockpit Table</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.bathingPlatform" render={({ field }) => (<FormItem><FormLabel>Bathing Platform</FormLabel><FormControl><Input placeholder="e.g., Custom made stainless steel and teak" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.boardingLadder" render={({ field }) => (<FormItem><FormLabel>Boarding Ladder</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.deckShower" render={({ field }) => (<FormItem><FormLabel>Deck Shower</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.anchor" render={({ field }) => (<FormItem><FormLabel>Anchor</FormLabel><FormControl><Input placeholder="e.g., 40 kg Rocna" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.anchorChain" render={({ field }) => (<FormItem><FormLabel>Anchor Chain</FormLabel><FormControl><Input placeholder="e.g., 80 mtr calibrated chain" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.anchor2" render={({ field }) => (<FormItem><FormLabel>Anchor 2</FormLabel><FormControl><Input placeholder="e.g., Spare Aluminium 34 kg CQR" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.windlass" render={({ field }) => (<FormItem><FormLabel>Windlass</FormLabel><FormControl><Input placeholder="e.g., electrical Lofrans Albatross 1500 W" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.deckWash" render={({ field }) => (<FormItem><FormLabel>Deck Wash</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.dinghy" render={({ field }) => (<FormItem><FormLabel>Dinghy</FormLabel><FormControl><Input placeholder="e.g., Avon 2.8 mtr." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.outboard" render={({ field }) => (<FormItem><FormLabel>Outboard</FormLabel><FormControl><Input placeholder="e.g., New 2022 | Mariner F4 4hp 4 stroke" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.davits" render={({ field }) => (<FormItem><FormLabel>Davits</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.seaRailing" render={({ field }) => (<FormItem><FormLabel>Sea Railing</FormLabel><FormControl><Input placeholder="e.g., wire" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.pushpit" render={({ field }) => (<FormItem><FormLabel>Pushpit</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.pulpit" render={({ field }) => (<FormItem><FormLabel>Pulpit</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.lifebuoy" render={({ field }) => (<FormItem><FormLabel>Lifebuoy</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.radarReflector" render={({ field }) => (<FormItem><FormLabel>Radar Reflector</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.fenders" render={({ field }) => (<FormItem><FormLabel>Fenders</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.mooringLines" render={({ field }) => (<FormItem><FormLabel>Mooring Lines</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.radio" render={({ field }) => (<FormItem><FormLabel>Radio</FormLabel><FormControl><Input placeholder="e.g., Sony" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.cockpitSpeakers" render={({ field }) => (<FormItem><FormLabel>Cockpit Speakers</FormLabel><FormControl><Input placeholder="e.g., 2x Sony xplod" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.speakersInSalon" render={({ field }) => (<FormItem><FormLabel>Speakers in Salon</FormLabel><FormControl><Input placeholder="e.g., 2x Sony xplod" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="equipment.fireExtinguisher" render={({ field }) => (<FormItem><FormLabel>Fire Extinguisher</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                            {currentStep === 1 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Yacht Photos</CardTitle>
                                        <CardDescription>Upload one hero image and at least 9 gallery images. The hero image is the first photo buyers see.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col md:flex-row gap-8 items-stretch">
                                            <FormField
                                                control={form.control}
                                                name="heroImage"
                                                render={({ field }) => (
                                                    <FormItem className="flex-none w-full md:w-1/3 flex flex-col">
                                                        <FormLabel>Hero Image (Required)</FormLabel>
                                                        <FormControl className="flex-grow">
                                                            <label htmlFor="hero-dropzone-file" className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card hover:bg-muted relative">
                                                                {heroImagePreview ? (
                                                                    <>
                                                                        <Image src={heroImagePreview} alt="Hero Preview" fill className="rounded-md object-cover" />
                                                                        <Button
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="icon"
                                                                            className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                form.setValue('heroImage', undefined, { shouldValidate: true });
                                                                                setHeroImagePreview(null);
                                                                            }}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center text-center p-4">
                                                                        <ImageIcon className="mb-4 h-8 w-8 text-muted-foreground" />
                                                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                                                        <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                                                                    </div>
                                                                )}
                                                                <Input
                                                                    id="hero-dropzone-file"
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            field.onChange(file);
                                                                            setHeroImagePreview(URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="galleryImages"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1 flex flex-col">
                                                        <FormLabel>Gallery Images (Min 9, Max 49)</FormLabel>
                                                        <FormControl className="flex-grow">
                                                            <div className="h-full">
                                                            <label htmlFor="gallery-dropzone-file" className="flex h-full min-h-[16rem] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card hover:bg-muted">
                                                                <div className="flex flex-col items-center justify-center text-center p-4">
                                                                    <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                                                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                    <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                                                                </div>
                                                                <Input
                                                                id="gallery-dropzone-file"
                                                                type="file"
                                                                className="hidden"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    if (e.target.files) {
                                                                        const newFiles = Array.from(e.target.files);
                                                                        const currentFiles = field.value || [];
                                                                        const combinedFiles = [...currentFiles, ...newFiles];
                                                                        const limitedFiles = combinedFiles.slice(0, 49);
                                                                        
                                                                        field.onChange(limitedFiles);

                                                                        const previews = limitedFiles.map(file => {
                                                                            if (file instanceof File) {
                                                                                return URL.createObjectURL(file);
                                                                            }
                                                                            return file; 
                                                                        }).filter(p => typeof p === 'string');
                                                                        
                                                                        galleryImagePreviews.forEach(url => {
                                                                            if (url.startsWith('blob:')) {
                                                                            URL.revokeObjectURL(url);
                                                                            }
                                                                        });

                                                                        setGalleryImagePreviews(previews as string[]);
                                                                    }
                                                                }}
                                                                />
                                                            </label>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                        {galleryImagePreviews.length > 0 && (
                                                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                                {galleryImagePreviews.map((src, index) => (
                                                                    <div key={index} className="relative aspect-video">
                                                                        <Image src={src} alt={`Preview ${index + 1}`} fill className="rounded-md object-cover" />
                                                                        <Button
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="icon"
                                                                            className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full"
                                                                            onClick={() => {
                                                                                const updatedFiles = field.value.filter((_: any, i: number) => i !== index);
                                                                                field.onChange(updatedFiles);

                                                                                const updatedPreviews = galleryImagePreviews.filter((_: any, i: number) => i !== index);
                                                                                
                                                                                const urlToRevoke = galleryImagePreviews[index];
                                                                                if (urlToRevoke && urlToRevoke.startsWith('blob:')) {
                                                                                    URL.revokeObjectURL(urlToRevoke);
                                                                                }

                                                                                setGalleryImagePreviews(updatedPreviews);
                                                                            }}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    
                    <div className="mt-8 flex justify-between">
                        <Button
                            type="button"
                            onClick={prev}
                            disabled={currentStep === 0}
                            variant="outline"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        {currentStep < steps.length - 1 ? (
                            <Button type="button" onClick={next} size="lg">
                                Next Step
                            </Button>
                        ) : (
                            <Button type="button" onClick={next} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <Eye className="mr-2 h-5 w-5" />
                                Review Listing
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
