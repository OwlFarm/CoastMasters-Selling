
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
import { Textarea } from './ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

// Updated schema to include a title and make some fields optional for multi-step validation
const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  listingType: z.string({ required_error: 'Please select a listing type.' }),
  boatType: z.string({ required_error: 'Please select a boat type.' }),
  condition: z.string({ required_error: 'Please select the condition.' }),
  location: z.string({ required_error: 'Please select a location.' }),
  fuelType: z.string({ required_error: 'Please select a fuel type.' }),
  hullMaterial: z.string({ required_error: 'Please select a hull material.' }),
  hullShape: z.string({ required_error: 'Please select a hull shape.' }),
  bowShape: z.string({ required_error: 'Please select a bow shape.' }),
  keelType: z.string({ required_error: 'Please select a keel type.' }),
  rudderType: z.string({ required_error: 'Please select a rudder type.' }),
  propellerType: z.string({ required_error: 'Please select a propeller type.' }),
  make: z.string({ required_error: 'Please select or enter a builder.' }),
  model: z.string().min(2, { message: 'Model must be at least 2 characters.' }),
  year: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year')
  ),
  length: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Must be a positive number')),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Must be a positive number')),
  description: z.string().min(50, { message: 'Description must be at least 50 characters.' }).max(5000, { message: 'Description cannot exceed 5000 characters.' }),
  features: z.array(z.string()).optional(),
  usageStyles: z.array(z.string()).optional(),
  deck: z.array(z.string()).optional(),
  cabin: z.array(z.string()).optional(),
  heroImage: z.any().refine((file) => file instanceof File && file.size > 0, "Hero image is required."),
  galleryImages: z.array(z.any()).min(9, { message: 'At least 9 gallery images are required.' }).max(49, { message: 'You can upload a maximum of 49 images.' }),
  otherSpecifications: z.string().max(500, { message: "Cannot exceed 500 characters."}).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

const steps = [
  { 
    id: 'Step 1', 
    name: 'Listing Details', 
    fields: [
        'listingType', 'boatType', 'condition', 'make', 'model', 'year', 'length', 'price', 'location', 'title', 'description',
        'hullMaterial', 'hullShape', 'bowShape', 'keelType', 'rudderType', 'propellerType', 'fuelType', 'usageStyles', 
        'otherSpecifications', 'features', 'deck', 'cabin'
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
            usageStyles: [],
            deck: [],
            cabin: [],
            condition: undefined,
            location: undefined,
            fuelType: undefined,
            hullMaterial: undefined,
            hullShape: undefined,
            bowShape: undefined,
            keelType: undefined,
            rudderType: undefined,
            propellerType: undefined,
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
            if (aiState.result.detectedHullShape) form.setValue('hullShape', aiState.result.detectedHullShape, { shouldValidate: true });
            if (aiState.result.detectedKeelType) form.setValue('keelType', aiState.result.detectedKeelType, { shouldValidate: true });
            if (aiState.result.detectedRudderType) form.setValue('rudderType', aiState.result.detectedRudderType, { shouldValidate: true });
            if (aiState.result.detectedPropellerType) form.setValue('propellerType', aiState.result.detectedPropellerType, { shouldValidate: true });
            if (aiState.result.detectedFuelType) form.setValue('fuelType', aiState.result.detectedFuelType, { shouldValidate: true });
            if (aiState.result.detectedUsageStyles) form.setValue('usageStyles', aiState.result.detectedUsageStyles, { shouldValidate: true });
            if (aiState.result.detectedFeatures) form.setValue('features', aiState.result.detectedFeatures, { shouldValidate: true });
            if (aiState.result.detectedDeck) form.setValue('deck', aiState.result.detectedDeck, { shouldValidate: true });
            if (aiState.result.detectedCabin) form.setValue('cabin', aiState.result.detectedCabin, { shouldValidate: true });
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
        console.log('Form Submitted:', { ...values, lengthUnit });
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
                                        <CardTitle>Listing Essentials</CardTitle>
                                        <CardDescription>Start with the most important details for your listing. Use our AI assistant for an SEO-optimized result!</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                                            <FormField control={form.control} name="boatType" render={({ field }) => (
                                            <FormItem className="md:col-span-2"><FormLabel>Boat Type</FormLabel><FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4 pt-2">
                                                    {metadata.boatTypes.map((type) => (<FormItem key={type.id} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl><RadioGroupItem value={type.id} /></FormControl>
                                                        <FormLabel className="font-normal">{type.label}</FormLabel>
                                                    </FormItem>))}
                                                </RadioGroup>
                                            </FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="make" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Builder</FormLabel>
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
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="model" render={({ field }) => (
                                                <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., Oceanis 46.1" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="year" render={({ field }) => (
                                                <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2022" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="length" render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel>LOA ({lengthUnit})</FormLabel>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-muted-foreground">Ft</span>
                                                        <Switch
                                                            checked={lengthUnit === 'm'}
                                                            onCheckedChange={(checked) => setLengthUnit(checked ? 'm' : 'ft')}
                                                            id="length-unit-switch-form"
                                                        />
                                                        <span className="text-muted-foreground">M</span>
                                                    </div>
                                                </div>
                                                <FormControl><Input type="number" placeholder={lengthUnit === 'ft' ? "e.g., 46" : "e.g., 14"} {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )} />
                                            <FormField control={form.control} name="price" render={({ field }) => (
                                                <FormItem className="md:col-span-2"><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
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
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Specifications</CardTitle>
                                        <CardDescription>Provide the technical details about your yacht's build.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                         <FormField control={form.control} name="usageStyles" render={() => (
                                            <FormItem>
                                                <FormLabel>Usage Styles</FormLabel>
                                                <div className="grid grid-cols-5 gap-x-8 pt-2">
                                                    {metadata.usageStyles.map((item) => (
                                                        <FormField key={item.id} control={form.control} name="usageStyles" render={({ field }) => (
                                                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentValue = field.value || [];
                                                                            return checked
                                                                                ? field.onChange([...currentValue, item.id])
                                                                                : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )} />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="hullMaterial" render={({ field }) => (
                                            <FormItem><FormLabel>Hull Material</FormLabel><FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-5 gap-x-8 pt-2">
                                                    {metadata.hullMaterialOptions.map((mat) => (<FormItem key={mat.id} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl><RadioGroupItem value={mat.id} /></FormControl>
                                                        <FormLabel className="font-normal">{mat.label}</FormLabel>
                                                    </FormItem>))}
                                                </RadioGroup>
                                            </FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="hullShape" render={({ field }) => (
                                            <FormItem><FormLabel>Hull Shape</FormLabel><FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-5 gap-x-8 pt-2">
                                                    {metadata.hullShapeOptions.map((shape) => (<FormItem key={shape.id} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl><RadioGroupItem value={shape.id} /></FormControl>
                                                        <FormLabel className="font-normal">{shape.label}</FormLabel>
                                                    </FormItem>))}
                                                </RadioGroup>
                                            </FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="bowShape" render={({ field }) => (
                                            <FormItem><FormLabel>Bow Shape</FormLabel><FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-5 gap-x-8 pt-2">
                                                    {metadata.bowShapeOptions.map((shape) => (<FormItem key={shape.id} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl><RadioGroupItem value={shape.id} /></FormControl>
                                                        <FormLabel className="font-normal">{shape.label}</FormLabel>
                                                    </FormItem>))}
                                                </RadioGroup>
                                            </FormControl><FormMessage /></FormItem>
                                        )} />
                                         <FormField control={form.control} name="keelType" render={({ field }) => (
                                            <FormItem><FormLabel>Keel Type</FormLabel><FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-5 gap-x-8 pt-2">
                                                    {metadata.keelTypeOptions.map((keel) => (<FormItem key={keel.id} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl><RadioGroupItem value={keel.id} /></FormControl>
                                                        <FormLabel className="font-normal">{keel.label}</FormLabel>
                                                    </FormItem>))}
                                                </RadioGroup>
                                            </FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="rudderType" render={({ field }) => (
                                            <FormItem><FormLabel>Rudder Type</FormLabel><FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-5 gap-x-8 pt-2">
                                                    {metadata.rudderTypeOptions.map((rudder) => (<FormItem key={rudder.id} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl><RadioGroupItem value={rudder.id} /></FormControl>
                                                        <FormLabel className="font-normal">{rudder.label}</FormLabel>
                                                    </FormItem>))}
                                                </RadioGroup>
                                            </FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="propellerType" render={({ field }) => (
                                            <FormItem><FormLabel>Propeller Type</FormLabel><FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-5 gap-x-8 pt-2">
                                                    {metadata.propellerTypeOptions.map((prop) => (<FormItem key={prop.id} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl><RadioGroupItem value={prop.id} /></FormControl>
                                                        <FormLabel className="font-normal">{prop.label}</FormLabel>
                                                    </FormItem>))}
                                                </RadioGroup>
                                            </FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="fuelType" render={({ field }) => (
                                            <FormItem><FormLabel>Fuel Type</FormLabel><FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-5 gap-x-8 pt-2">
                                                    {metadata.fuelTypes.map((type) => (<FormItem key={type.id} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl><RadioGroupItem value={type.id} /></FormControl>
                                                        <FormLabel className="font-normal">{type.label}</FormLabel>
                                                    </FormItem>))}
                                                </RadioGroup>
                                            </FormControl><FormMessage /></FormItem>
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
                                        <CardTitle>Features &amp; Equipment</CardTitle>
                                        <CardDescription>Select all features and equipment included with your yacht.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField control={form.control} name="features" render={() => (
                                            <FormItem className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
                                                {metadata.featureOptions.map((item) => (
                                                    <FormField key={item.id} control={form.control} name="features" render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentValue = field.value || [];
                                                                        return checked
                                                                            ? field.onChange([...currentValue, item.id])
                                                                            : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                                        </FormItem>
                                                    )} />
                                                ))}
                                            </FormItem>
                                        )} />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Deck Features</CardTitle>
                                        <CardDescription>Select all deck features included with your yacht.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField control={form.control} name="deck" render={() => (
                                            <FormItem className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
                                                {metadata.deckOptions.map((item) => (
                                                    <FormField key={item.id} control={form.control} name="deck" render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentValue = field.value || [];
                                                                        return checked
                                                                            ? field.onChange([...currentValue, item.id])
                                                                            : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                                        </FormItem>
                                                    )} />
                                                ))}
                                            </FormItem>
                                        )} />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Cabin Features</CardTitle>
                                        <CardDescription>Select all features included in the cabin.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField control={form.control} name="cabin" render={() => (
                                            <FormItem className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
                                                {metadata.cabinOptions.map((item) => (
                                                    <FormField key={item.id} control={form.control} name="cabin" render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentValue = field.value || [];
                                                                        return checked
                                                                            ? field.onChange([...currentValue, item.id])
                                                                            : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                                        </FormItem>
                                                    )} />
                                                ))}
                                            </FormItem>
                                        )} />
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
                                                                &lt;&gt;
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
                                                                &lt;/&gt;
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
    );
}
