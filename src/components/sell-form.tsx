'use client';

import * as React from 'react';
import { useForm, type FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, Ship, X, ArrowLeft, Sparkles, LoaderCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { boatTypes, makes, locationsByRegion, conditions, fuelTypes, hullMaterialOptions, featureOptions, usageStyles, hullShapeOptions, keelTypeOptions, rudderTypeOptions, propellerTypeOptions, deckOptions, cabinOptions, listingTypes } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { useActionState, useEffect } from 'react';
import { handleGenerateListingDetails } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

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
  keelType: z.string({ required_error: 'Please select a keel type.' }),
  rudderType: z.string({ required_error: 'Please select a rudder type.' }),
  propellerType: z.string({ required_error: 'Please select a propeller type.' }),
  make: z.string({ required_error: 'Please select a builder.' }),
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
  images: z.array(z.any()).min(5, { message: 'At least 5 high-quality images are required.' }).max(10, { message: 'You can upload a maximum of 10 images.' }),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 'Step 1', name: 'Essentials', fields: ['listingType', 'boatType', 'condition', 'make', 'model', 'year', 'length', 'price'] },
  { id: 'Step 2', name: 'Specifications', fields: ['hullMaterial', 'hullShape', 'keelType', 'rudderType', 'propellerType', 'fuelType', 'usageStyles'] },
  { id: 'Step 3', name: 'Features', fields: ['features', 'deck', 'cabin'] },
  { id: 'Step 4', name: 'Listing Details', fields: ['title', 'description', 'location'] },
  { id: 'Step 5', name: 'Photos', fields: ['images'] },
];

export function SellForm() {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const [lengthUnit, setLengthUnit] = React.useState<'ft' | 'm'>('ft');
    const { toast } = useToast();

    const [aiState, aiFormAction, isAiPending] = useActionState(handleGenerateListingDetails, { result: undefined, error: undefined });

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
            images: [],
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
            keelType: undefined,
            rudderType: undefined,
            propellerType: undefined,
        },
    });

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
            toast({
                title: 'AI Magic Complete!',
                description: 'Your title and description have been generated.',
            });
        }
    }, [aiState, form, toast]);

    const next = async () => {
        const fields = steps[currentStep].fields as FieldName<FormValues>[];
        const output = await form.trigger(fields, { shouldFocus: true });

        if (!output) return;

        if (currentStep < steps.length - 1) {
            setCurrentStep(step => step + 1);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setCurrentStep(step => step - 1);
        }
    };
    
    function onSubmit(values: FormValues) {
        console.log('Form Submitted:', { ...values, images: imagePreviews, lengthUnit });
        // In a real app, you would upload images and submit form data to a server.
        // This is where you would call your server action to save to Firestore.
        toast({
            title: "Listing Submitted!",
            description: "Your yacht is now ready for review.",
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={((currentStep + 1) / steps.length) * 100} />
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>Yacht Essentials</CardTitle>
                                    <CardDescription>Start with the most important details.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <FormField control={form.control} name="listingType" render={({ field }) => (
                                        <FormItem><FormLabel>Listing Type</FormLabel><FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4 pt-2">
                                                {listingTypes.map((type) => (<FormItem key={type.id} className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value={type.id} /></FormControl>
                                                    <FormLabel className="font-normal">{type.label}</FormLabel>
                                                </FormItem>))}
                                            </RadioGroup>
                                        </FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="condition" render={({ field }) => (
                                        <FormItem><FormLabel>Condition</FormLabel><FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4 pt-2">
                                                {conditions.map((c) => (<FormItem key={c.id} className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value={c.id} /></FormControl>
                                                    <FormLabel className="font-normal">{c.label}</FormLabel>
                                                </FormItem>))}
                                            </RadioGroup>
                                        </FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="boatType" render={({ field }) => (
                                      <FormItem className="md:col-span-2"><FormLabel>Boat Type</FormLabel><FormControl>
                                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4 pt-2">
                                              {boatTypes.map((type) => (<FormItem key={type.id} className="flex items-center space-x-2 space-y-0">
                                                  <FormControl><RadioGroupItem value={type.id} /></FormControl>
                                                  <FormLabel className="font-normal">{type.label}</FormLabel>
                                              </FormItem>))}
                                          </RadioGroup>
                                      </FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="make" render={({ field }) => (
                                        <FormItem><FormLabel>Builder</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a builder" /></SelectTrigger></FormControl>
                                                <SelectContent>{makes.map(make => <SelectItem key={make.id} value={make.id}>{make.label}</SelectItem>)}</SelectContent>
                                            </Select>
                                        <FormMessage /></FormItem>
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
                                              <FormLabel>Length ({lengthUnit})</FormLabel>
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
                                </CardContent>
                            </Card>
                        )}
                        {currentStep === 1 && (
                             <Card>
                                <CardHeader>
                                    <CardTitle>Specifications</CardTitle>
                                    <CardDescription>Provide the technical details about your yacht's build.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                     <FormField control={form.control} name="usageStyles" render={() => (
                                        <FormItem>
                                            <FormLabel>Usage Styles</FormLabel>
                                            <div className="flex flex-row items-center flex-wrap gap-x-4 gap-y-2 pt-2">
                                                {usageStyles.map((item) => (
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
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                                                {hullMaterialOptions.map((mat) => (<FormItem key={mat.id} className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value={mat.id} /></FormControl>
                                                    <FormLabel className="font-normal">{mat.label}</FormLabel>
                                                </FormItem>))}
                                            </RadioGroup>
                                        </FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="hullShape" render={({ field }) => (
                                        <FormItem><FormLabel>Hull Shape</FormLabel><FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                                                {hullShapeOptions.map((shape) => (<FormItem key={shape.id} className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value={shape.id} /></FormControl>
                                                    <FormLabel className="font-normal">{shape.label}</FormLabel>
                                                </FormItem>))}
                                            </RadioGroup>
                                        </FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="keelType" render={({ field }) => (
                                        <FormItem><FormLabel>Keel Type</FormLabel><FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                                                {keelTypeOptions.map((keel) => (<FormItem key={keel.id} className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value={keel.id} /></FormControl>
                                                    <FormLabel className="font-normal">{keel.label}</FormLabel>
                                                </FormItem>))}
                                            </RadioGroup>
                                        </FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="rudderType" render={({ field }) => (
                                        <FormItem><FormLabel>Rudder Type</FormLabel><FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                                                {rudderTypeOptions.map((rudder) => (<FormItem key={rudder.id} className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value={rudder.id} /></FormControl>
                                                    <FormLabel className="font-normal">{rudder.label}</FormLabel>
                                                </FormItem>))}
                                            </RadioGroup>
                                        </FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="propellerType" render={({ field }) => (
                                        <FormItem><FormLabel>Propeller Type</FormLabel><FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                                                {propellerTypeOptions.map((prop) => (<FormItem key={prop.id} className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value={prop.id} /></FormControl>
                                                    <FormLabel className="font-normal">{prop.label}</FormLabel>
                                                </FormItem>))}
                                            </RadioGroup>
                                        </FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="fuelType" render={({ field }) => (
                                        <FormItem><FormLabel>Fuel Type</FormLabel><FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                                                {fuelTypes.map((type) => (<FormItem key={type.id} className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value={type.id} /></FormControl>
                                                    <FormLabel className="font-normal">{type.label}</FormLabel>
                                                </FormItem>))}
                                            </RadioGroup>
                                        </FormControl><FormMessage /></FormItem>
                                    )} />
                                </CardContent>
                            </Card>
                        )}
                        {currentStep === 2 && (
                            <div className="space-y-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Features & Equipment</CardTitle>
                                        <CardDescription>Select all features and equipment included with your yacht.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField control={form.control} name="features" render={() => (
                                            <FormItem className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                                {featureOptions.map((item) => (
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
                                            <FormItem className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                                {deckOptions.map((item) => (
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
                                            <FormItem className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                                {cabinOptions.map((item) => (
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
                        {currentStep === 3 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Listing Details</CardTitle>
                                    <CardDescription>Create a title and description that will attract buyers. Use our AI assistant for an SEO-optimized result!</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                     <FormField control={form.control} name="location" render={({ field }) => (
                                        <FormItem><FormLabel>Location</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {locationsByRegion.map((region) => (
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
                                          <form action={aiFormAction}>
                                            {/* Hidden inputs to pass data to server action */}
                                            <input type="hidden" name="make" value={form.getValues('make')} />
                                            <input type="hidden" name="model" value={form.getValues('model')} />
                                            <input type="hidden" name="year" value={form.getValues('year')} />
                                            <input type="hidden" name="length" value={form.getValues('length')} />
                                            <input type="hidden" name="condition" value={form.getValues('condition')} />
                                            <input type="hidden" name="boatType" value={form.getValues('boatType')} />
                                            {form.getValues('features')?.map(f => <input key={f} type="hidden" name="keyFeatures" value={f} />)}
                                            <Button type="submit" variant="outline" size="sm" disabled={isAiPending}>
                                                {isAiPending ? (
                                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                )}
                                                Generate with AI
                                            </Button>
                                          </form>
                                        </div>
                                        <FormField control={form.control} name="title" render={({ field }) => (
                                            <FormItem><FormControl><Input placeholder="e.g., For Sale: 2022 Beneteau Oceanis 46.1" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                     <FormField control={form.control} name="description" render={({ field }) => (
                                        <FormItem><FormLabel>Description</FormLabel>
                                        <FormControl><Textarea placeholder="Describe your yacht's condition, history, and unique features..." className="min-h-[200px]" {...field} /></FormControl>
                                        <FormDescription>For best results, describe what makes your yacht special. Include recent upgrades, maintenance history, and ideal uses.</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>
                        )}
                        {currentStep === 4 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Yacht Photos</CardTitle>
                                    <CardDescription>Upload a minimum of 5 and up to 10 high-quality images. The first image will be the main one.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="images"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex w-full items-center justify-center">
                                                        <label htmlFor="dropzone-file" className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card hover:bg-muted">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                                                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (Min 5, max 10 images)</p>
                                                            </div>
                                                            <Input
                                                              id="dropzone-file"
                                                              type="file"
                                                              className="hidden"
                                                              multiple
                                                              accept="image/*"
                                                              onChange={(e) => {
                                                                if (e.target.files) {
                                                                  const newFiles = Array.from(e.target.files);
                                                                  const currentFiles = field.value || [];
                                                                  const combinedFiles = [...currentFiles, ...newFiles];
                                                                  const limitedFiles = combinedFiles.slice(0, 10);
                                                                  
                                                                  field.onChange(limitedFiles);

                                                                  const previews = limitedFiles.map(file => {
                                                                    if (typeof file === 'string') return file;
                                                                    if (file instanceof File) {
                                                                      return URL.createObjectURL(file);
                                                                    }
                                                                    return '';
                                                                  }).filter(p => p);
                                                                  setImagePreviews(previews);
                                                                }
                                                              }}
                                                            />
                                                        </label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                                {imagePreviews.length > 0 && (
                                                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                                                        {imagePreviews.map((src, index) => (
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

                                                                        const updatedPreviews = imagePreviews.filter((_: any, i: number) => i !== index);
                                                                        setImagePreviews(updatedPreviews);
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
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>
                
                {/* Navigation Buttons */}
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
                        <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <Ship className="mr-2 h-5 w-5" />
                            List My Yacht
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
