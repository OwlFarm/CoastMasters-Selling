'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';
import { sellFormSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handleCreateListing, handleGenerateListingDetails, handlePolishDescription } from '@/lib/actions';
import { useActionState } from 'react';
import { Upload, X, Eye, Image as ImageIcon, Wand2, LoaderCircle, Sparkles, Binary } from 'lucide-react';
import Image from 'next/image';
import { Separator } from './ui/separator';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

// AI data processing function - MOVED OUTSIDE for proper access
function processScrapedData(rawData: any) {
  const processed = { ...rawData };
  
  // PRIORITY 1: Map backend HP/KW data directly if available
  if (rawData.hp) {
    processed.hp = rawData.hp;
  }
  
  if (rawData.kw) {
    processed.kw = rawData.kw;
  }
  
  // PRIORITY 2: Map machinery HP/KW if available
  if (rawData.machinery?.hp) {
    if (!processed.machinery) processed.machinery = {};
    processed.machinery.hp = rawData.machinery.hp;
  }
  
  if (rawData.machinery?.kw) {
    if (!processed.machinery) processed.machinery = {};
    processed.machinery.kw = rawData.machinery.kw;
  }
  
  // PRIORITY 3: Map accommodation data from backend
  if (rawData.accommodation) {
    console.log("🏠 Processing accommodation data:", rawData.accommodation);
    
    // Ensure processedData.accommodation exists
    if (!processed.accommodation) {
      processed.accommodation = {};
    }
    
    // Map accommodation fields to frontend form (using exact field names from accommodation component)
    if (rawData.accommodation.numberOfCabins) {
      processed.accommodation.numberOfCabins = rawData.accommodation.numberOfCabins;
      console.log("✅ Mapped accommodation.numberOfCabins:", processed.accommodation.numberOfCabins);
    }
    
    if (rawData.accommodation.numberOfBerths) {
      processed.accommodation.numberOfBerths = rawData.accommodation.numberOfBerths;
      console.log("✅ Mapped accommodation.numberOfBerths:", processed.accommodation.numberOfBerths);
    }
    
    if (rawData.accommodation.numberOfHeads) {
      processed.accommodation.numberOfHeads = rawData.accommodation.numberOfHeads;
      console.log("✅ Mapped accommodation.numberOfHeads:", processed.accommodation.numberOfHeads);
    }
    
    if (rawData.accommodation.numberOfShowers) {
      processed.accommodation.numberOfShowers = rawData.accommodation.numberOfShowers;
      console.log("✅ Mapped accommodation.numberOfShowers:", processed.accommodation.numberOfShowers);
    }
    
    // Map accommodation features to exact field names
    if (rawData.accommodation.masterCabin) {
      processed.accommodation.ownersCabin = "Master cabin";
      console.log("✅ Mapped accommodation.ownersCabin:", processed.accommodation.ownersCabin);
    }
    
    if (rawData.accommodation.vipCabin) {
      processed.accommodation.guestCabin1 = "VIP cabin";
      console.log("✅ Mapped accommodation.guestCabin1:", processed.accommodation.guestCabin1);
    }
    
    if (rawData.accommodation.crewCabin) {
      processed.accommodation.guestCabin2 = "Crew cabin";
      console.log("✅ Mapped accommodation.guestCabin2:", processed.accommodation.guestCabin2);
    }
    
    if (rawData.accommodation.galley) {
      processed.accommodation.cooker = "Yes";
      processed.accommodation.sink = "Yes";
      processed.accommodation.fridge = "Yes";
      console.log("✅ Mapped galley equipment");
    }
    
    if (rawData.accommodation.salon) {
      processed.accommodation.layout = "Salon layout";
      console.log("✅ Mapped accommodation.layout:", processed.accommodation.layout);
    }
    
    if (rawData.accommodation.cockpit) {
      processed.accommodation.openCockpit = true;
      console.log("✅ Mapped accommodation.openCockpit:", processed.accommodation.openCockpit);
    }
    
    if (rawData.accommodation.swimmingPlatform) {
      processed.accommodation.aftDeck = true;
      console.log("✅ Mapped accommodation.aftDeck:", processed.accommodation.aftDeck);
    }
    
    if (rawData.accommodation.bathingPlatform) {
      processed.accommodation.aftDeck = true;
      console.log("✅ Mapped accommodation.aftDeck:", processed.accommodation.aftDeck);
    }
    
    if (rawData.accommodation.tenderGarage) {
      processed.accommodation.layout = (processed.accommodation.layout || "") + " with tender garage";
      console.log("✅ Mapped tender garage to layout");
    }
    
    if (rawData.accommodation.flybridge) {
      processed.accommodation.navigationCenter = true;
      processed.accommodation.chartTable = true;
      console.log("✅ Mapped flybridge features");
    }
    
    // Map additional accommodation fields
    if (rawData.hullMaterial) {
      processed.accommodation.interiorMaterial = rawData.hullMaterial;
      console.log("✅ Mapped accommodation.interiorMaterial:", processed.accommodation.interiorMaterial);
    }
    
    if (rawData.material) {
      processed.accommodation.interiorMaterial = rawData.material;
      console.log("✅ Mapped accommodation.interiorMaterial from material:", processed.accommodation.interiorMaterial);
    }
    
    // Map accommodation features from equipment data
    if (rawData.equipment?.accommodation) {
      Object.keys(rawData.equipment.accommodation).forEach(item => {
        if (rawData.equipment.accommodation[item]) {
          if (item === 'toilet') {
            processed.accommodation.ownersCabinToilet = "Yes";
            processed.accommodation.ownersCabinToiletSystem = "Standard";
          } else if (item === 'shower') {
            processed.accommodation.ownersCabinShower = "Yes";
            // Also set numberOfShowers if we have shower data
            if (!processed.accommodation.numberOfShowers) {
              processed.accommodation.numberOfShowers = 1;
            }
          } else if (item === 'hotwater') {
            processed.accommodation.hotWaterSystem = "Yes";
          }
          console.log(`✅ Mapped accommodation feature: ${item}`);
        }
      });
    }
    
    // CRITICAL FIX: Extract numberOfShowers from various sources
    if (!processed.accommodation.numberOfShowers) {
      // Try to extract from equipment data
      if (rawData.equipment?.accommodation?.shower) {
        processed.accommodation.numberOfShowers = 1;
        console.log("✅ Extracted numberOfShowers from equipment data: 1");
      }
      // Try to extract from raw accommodation data
      else if (rawData.accommodation?.numberOfShowers) {
        processed.accommodation.numberOfShowers = rawData.accommodation.numberOfShowers;
        console.log("✅ Extracted numberOfShowers from raw data:", rawData.accommodation.numberOfShowers);
      }
      // Try to extract from description
      else if (rawData.description) {
        const showerMatch = rawData.description.match(/(\d+)\s*(?:shower|showers)/i);
        if (showerMatch) {
          processed.accommodation.numberOfShowers = parseInt(showerMatch[1]);
          console.log("✅ Extracted numberOfShowers from description:", processed.accommodation.numberOfShowers);
        }
      }
    }
    
    // CRITICAL FIX: Extract hotWaterSystem from various sources
    if (!processed.accommodation.hotWaterSystem) {
      // Try to extract from equipment data
      if (rawData.equipment?.accommodation?.hotwater) {
        processed.accommodation.hotWaterSystem = "Yes";
        console.log("✅ Extracted hotWaterSystem from equipment data: Yes");
      }
      // Try to extract from description
      else if (rawData.description) {
        const hotWaterMatch = rawData.description.match(/(?:hot\s*water|heating|central\s*heating)/i);
        if (hotWaterMatch) {
          processed.accommodation.hotWaterSystem = "Yes";
          console.log("✅ Extracted hotWaterSystem from description: Yes");
        }
      }
    }
    
    // CRITICAL FIX: Ensure accommodation data is preserved in processed data
    console.log("🏠 Final processedData.accommodation:", processed.accommodation);
  }
  
  // CRITICAL FALLBACK: If no accommodation data was processed, create it from available data
  if (!processed.accommodation || Object.keys(processed.accommodation).length === 0) {
    console.log("⚠️ No accommodation data processed, creating fallback accommodation object");
    processed.accommodation = {};
    
    // Try to extract basic accommodation info from other sources
    if (rawData.numberOfCabins) {
      processed.accommodation.numberOfCabins = rawData.numberOfCabins;
    }
    if (rawData.numberOfBerths) {
      processed.accommodation.numberOfBerths = rawData.numberOfBerths;
    }
    if (rawData.hullMaterial) {
      processed.accommodation.interiorMaterial = rawData.hullMaterial;
    }
    if (rawData.material) {
      processed.accommodation.interiorMaterial = rawData.material;
    }
    
    console.log("🏠 Fallback accommodation created:", processed.accommodation);
  }
  
  // FINAL VERIFICATION: Ensure accommodation object exists
  if (!processed.accommodation) {
    processed.accommodation = {};
    console.log("🏠 Empty accommodation object created as final fallback");
  }
  
  console.log("🏠 FINAL processedData.accommodation check:", processed.accommodation);
  console.log("🏠 processedData.accommodation type:", typeof processed.accommodation);
  console.log("🏠 processedData.accommodation keys:", Object.keys(processed.accommodation));
  
  // PRIORITY 4: Map equipment data from backend
  if (rawData.equipment) {
    console.log("🛠️ Processing equipment data:", rawData.equipment);
    
    // Map equipment categories to frontend form
    Object.keys(rawData.equipment).forEach(category => {
      if (rawData.equipment[category] && typeof rawData.equipment[category] === 'object') {
        processed[`equipment_${category}`] = rawData.equipment[category];
        console.log(`✅ Mapped equipment category: ${category}`);
      }
    });
  }
  
  // PRIORITY 5: Map navigation data from backend
  if (rawData.navigation) {
    console.log("🧭 Processing navigation data:", rawData.navigation);
    
    // Map navigation items to frontend form
    Object.keys(rawData.navigation).forEach(item => {
      if (rawData.navigation[item]) {
        processed[`navigation_${item}`] = rawData.navigation[item];
        console.log(`✅ Mapped navigation item: ${item}`);
      }
    });
  }
  
  // PRIORITY 6: Map rigging data from backend
  if (rawData.rigging) {
    console.log("⛵ Processing rigging data:", rawData.rigging);
    
    // Map rigging items to frontend form
    Object.keys(rawData.rigging).forEach(item => {
      if (rawData.rigging[item]) {
        processed[`rigging_${item}`] = rawData.rigging[item];
        console.log(`✅ Mapped rigging item: ${item}`);
      }
    });
  }
  
      // Clean and standardize title
    if (rawData.title) {
      // LESS AGGRESSIVE: Extract boat model from messy titles
      let titleMatch = rawData.title.match(/(\d{4}\s+)?([A-Za-z\s-]+?\s+\d+)/);
      if (titleMatch) {
        processed.title = titleMatch[2].trim(); // This will get "Oyster 485", "Hallberg-Rassy 49", etc.
      }
      
      // ENHANCED: Extract year, make, and model from title for multiple sources
      const yearMakeModelMatch = rawData.title.match(/(\d{4})\s+([A-Za-z\s-]+?)\s+(\d+)/);
      if (yearMakeModelMatch) {
        processed.year = yearMakeModelMatch[1];
        processed.make = yearMakeModelMatch[2].trim();
        processed.model = yearMakeModelMatch[3];
      }
    }
  
  // Extract make and model from title if not provided
  if (!rawData.brand && !rawData.model && processed.title) {
    const makeModelMatch = processed.title.match(/^([A-Za-z\s-]+?)\s*(\d+)$/);
    if (makeModelMatch) {
      processed.make = makeModelMatch[1].trim();
      processed.model = makeModelMatch[2].trim();
    }
  }
  
  // ENHANCED: Extract data from description when main fields are missing (for YachtWorld)
  if (rawData.description && (!rawData.brand || !rawData.model || !rawData.year || !rawData.length)) {
    const desc = rawData.description;
    
    // Extract year from description if not found in title
    if (!processed.year) {
      const yearMatch = desc.match(/(\d{4})/);
      if (yearMatch) processed.year = yearMatch[1];
    }
    
    // Extract length from description if not found in main fields
    if (!processed.length) {
      const lengthMatch = desc.match(/(\d+\.?\d*)\s*ft/);
      if (lengthMatch) processed.length = (parseFloat(lengthMatch[1]) * 0.3048).toFixed(2); // Convert ft to m
    }
    
    // Extract engine from description if not found in main fields
    if (!processed.engineMake) {
      const engineMatch = desc.match(/Engine\s*([A-Za-z\s]+?)(?:\s|$)/);
      if (engineMatch) processed.engineMake = engineMatch[1].trim();
    }
    
    // Extract HP from description if not found in main fields (only if backend data not available)
    if (!processed.hp && !processed.machinery?.hp) {
      const hpMatch = desc.match(/(\d+)\s*hp/i);
      if (hpMatch) {
        if (!processed.machinery) processed.machinery = {};
        processed.machinery.hp = parseInt(hpMatch[1]);
      }
    }
  }
  
  return processed;
}

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

export type FormValues = z.infer<typeof sellFormSchema>;

type SellFormProps = {
  metadata: any;
};

export function SellForm({ metadata }: SellFormProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = React.useState(false);
  const [migrationUrl, setMigrationUrl] = React.useState('');
  const [isMigrating, setIsMigrating] = React.useState(false);
  const [heroImagePreview, setHeroImagePreview] = React.useState<string | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = React.useState<string[]>([]);
  const { toast } = useToast();

  const [generateState, generateAction, isGenerating] = useActionState(handleGenerateListingDetails, { result: undefined, error: undefined });
  const [polishState, polishAction, isPolishing] = useActionState(handlePolishDescription, { result: undefined, error: undefined });
  const [createState, createAction, isCreating] = useActionState(handleCreateListing, { message: undefined, errors: undefined, newListingId: undefined });



  const form = useForm<FormValues>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      title: '',
      make: '',
      model: '',
      description: '',
      year: null,
      length: null,
      price: null,
      hullMaterial: '',
      machinery: { make: '', hp: null },
      location: '',
      salesOffice: '',
      status: '',
      vat: '',
      condition: '',
      boatType: '',
      features: [],
      deck: [],
      heroImage: null,
      galleryImages: [],
    },
    mode: 'onBlur',
  });

  React.useEffect(() => {
    if (generateState.result) {
        form.setValue('title', generateState.result.title);
        form.setValue('description', generateState.result.description);
        toast({ title: 'Success', description: 'AI has populated the listing details.' });
    }
    if (generateState.error) {
      toast({ variant: 'destructive', title: 'Error', description: String(generateState.error) });
    }
  }, [generateState, form, toast]);



  React.useEffect(() => {
    if (polishState.result) {
        form.setValue('description', polishState.result);
        toast({ title: 'Success', description: 'AI has polished the description.' });
    }
    if (polishState.error) {
      toast({ variant: 'destructive', title: 'Error', description: String(polishState.error) });
    }
  }, [polishState, form, toast]);

   React.useEffect(() => {
    if (createState.message === 'success' && createState.newListingId) {
      toast({
        title: 'Listing Created!',
        description: 'Your yacht has been successfully listed.',
      });
      router.push(`/yachts/${createState.newListingId}`);
    } else if (createState.message) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: createState.message,
      });
    }
    if (createState.errors) {
       Object.values(createState.errors).forEach(error => {
          toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: error,
          });
      });
    }
  }, [createState, toast, router]);

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

  const onSubmit = () => {
    const data = form.getValues();
    console.log('Submitting form data:', data);

    const formData = new FormData();
    
    // Append JSON data for all fields except files
    const dataToSubmit = { ...data };
    delete dataToSubmit.heroImage;
    delete dataToSubmit.galleryImages;
    formData.append('json_data', JSON.stringify(dataToSubmit));

    // Append hero image file
    if (data.heroImage instanceof File) {
        formData.append('heroImage', data.heroImage);
    }
    
    // Append gallery image files
    if (data.galleryImages && Array.isArray(data.galleryImages)) {
      data.galleryImages.forEach((file) => {
            if (file instanceof File) {
          formData.append('galleryImages', file);
            }
        });
    }

    createAction(formData);
  };
  
  const processForm = () => {
    form.trigger().then(isValid => {
      if (isValid) {
        setIsPreview(true);
      } else {
        toast({
            variant: 'destructive',
            title: 'Incomplete Form',
            description: 'Please fill out all required fields before previewing.',
        });
        console.log("Validation Errors:", form.formState.errors);
      }
    });
  };

  const handleMigration = async () => {
    if (!migrationUrl.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a URL to migrate' });
      return;
    }

    setIsMigrating(true);
    try {
      // TEMPORARILY DISABLED FOR BUILD FIX
      // TODO: Use new simple-devalk-form.tsx for De Valk data processing
      console.log('🎯 Migration temporarily disabled for build fix');
      console.log('🎯 Use the new simple-devalk-form.tsx for De Valk data processing');
      
      toast({
        title: 'Migration Disabled',
        description: 'Use the new De Valk form for data processing',
        variant: 'default'
      });
      
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: 'Migration Error',
        description: 'Migration temporarily disabled',
        variant: 'destructive'
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-8">
      {isPreview ? (
        <div>
          <div className="mb-8 flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsPreview(false)} disabled={isCreating}>
              Back to Edit
            </Button>
            <h2 className="text-2xl font-bold">Listing Preview</h2>
            <Button onClick={onSubmit} disabled={isCreating}>
              {isCreating && <LoaderCircle className="animate-spin mr-2" />}
              Submit Listing
            </Button>
          </div>
          {/* TODO: Add ListingPreview component */}
          <div className="p-8 border rounded-lg bg-muted">
            <h3 className="text-lg font-semibold mb-4">Preview Placeholder</h3>
            <p>Form data preview will be displayed here</p>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Migration and AI Tools Card */}
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
                        <Input 
                          id="migrate-url" 
                          placeholder="Enter listing URL..." 
                          value={migrationUrl}
                          onChange={(e) => setMigrationUrl(e.target.value)}
                          />
                          <Button 
                           variant="secondary" 
                      onClick={handleMigration}
  disabled={isMigrating}
>
  {isMigrating ? <LoaderCircle className="animate-spin mr-2" /> : <Binary className="mr-2" />}
  {isMigrating ? 'Migrating...' : 'Migrate'}
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

            {/* Key Details Card */}
             <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
                <CardDescription>Provide a brief overview of the yacht. This information will be prominently displayed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField 
                    control={form.control} 
                    name="title" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Moody 54 - Blue Water Cruiser" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  <FormField 
                    control={form.control} 
                    name="make" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Moody" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  <FormField 
                    control={form.control} 
                    name="model" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 54" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField 
                    control={form.control} 
                    name="length" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions (LOA, Beam, Draft) (m)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 14.96 x 4.42 x 2.20" {...field} onChange={e => field.onChange(e.target.value === '' ? null : e.target.value)} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  <FormField 
                    control={form.control} 
                    name="hullMaterial" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., GRP" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  <FormField 
                    control={form.control} 
                    name="year" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Built</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1990" {...field} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField 
                    control={form.control} 
                    name="machinery.make" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine(s)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Volvo Penta TMD41A" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  <FormField 
                    control={form.control} 
                    name="machinery.hp" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HP / KW</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 143 / 105.25" {...field} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  <FormField 
                    control={form.control} 
                    name="price" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asking Price (€)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 275000" {...field} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                 </div>
              </CardContent>
            </Card>

            {/* Dynamic Form Sections */}
            <GeneralInformation form={form as any} />
            <Accommodation form={form as any} />
            <Rigging />
            <Machinery />
            <Navigation />
            <Equipment />
            <IndicationRatios />

            {/* Description Card with AI Tools */}
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

            {/* Image Upload Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Upload Photos</CardTitle>
                    <CardDescription>High-quality photos are crucial for attracting buyers. The first image will be your main "hero" image.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                {/* Hero Image */}
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

                {/* Gallery Images */}
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
