
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
import { TextEditor } from './ui/text-editor';

// Robust schema to handle various optional and numeric inputs.
const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  make: z.string().min(1, 'Make is required.'),
  model: z.string().min(1, 'Model is required.'),
  year: z.coerce.number().min(1900, 'Invalid year.').max(new Date().getFullYear() + 1, 'Invalid year.'),
  length: z.coerce.number().positive('Length must be a positive number.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  description: z.string().min(10, 'Description is required.'),
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

  // General Specs
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

  // Accommodation
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

  // Machinery
  machinery: z.any().optional(),
  navigation: z.any().optional(),
  equipment: z.any().optional(),
  rigging: z.any().optional(),
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
      year: new Date().getFullYear(),
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
    formData.append('make', values.make);
    formData.append('model', values.model);
    formData.append('year', String(values.year));
    formData.append('length', String(values.length));
    formData.append('condition', values.condition || '');
    formData.append('boatType', values.boatType || '');
    (values.features || []).forEach(f => formData.append('features', f));
    generateAction(formData);
  };
  
  const onPolishDescription = () => {
      const formData = new FormData();
      formData.append('description', form.getValues('description'));
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
            {/* Section 1: Basic Details */}
            <Card>
              <CardHeader>
                <CardTitle>Yacht Details</CardTitle>
                <CardDescription>Start with the basics. You can also use our AI to help generate content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="make" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl><Input placeholder="e.g., Beneteau" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl><Input placeholder="e.g., Oceanis 46.1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl><Input type="number" placeholder="YYYY" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="length" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (ft)</FormLabel>
                      <FormControl><Input type="number" placeholder="Overall length in feet" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl><Input type="number" placeholder="Asking price" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Immaculate 2022 Beneteau Oceanis 46.1 For Sale" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <TextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Describe the yacht's history, features, condition, and recent upgrades..." 
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onGenerateDetails} disabled={isGenerating}>
                        {isGenerating ? <LoaderCircle className="animate-spin" /> : <Wand2 />}
                        Generate Details with AI
                    </Button>
                    <Button type="button" variant="outline" onClick={onPolishDescription} disabled={isPolishing}>
                        {isPolishing ? <LoaderCircle className="animate-spin" /> : <Wand2 />}
                        Polish Description
                    </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Photos */}
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

            {/* TODO: Add more sections for Specifications, Accommodation etc. */}

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
