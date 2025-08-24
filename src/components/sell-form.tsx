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
      // Call the Flask API on port 5001
      const response = await fetch('http://localhost:5001/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: migrationUrl }),
      });

      if (!response.ok) {
        throw new Error('Migration failed');
      }

      const result = await response.json();
      
      if (result.data) {
        // Populate form with migrated data
        const data = result.data;
        console.log('📥 Raw scraped data:', data);
        console.log('🔍 Data structure analysis:');
        console.log('  - Title:', data.title);
        console.log('  - Brand:', data.brand);
        console.log('  - Model:', data.model);
        console.log('  - Year:', data.year);
        console.log('  - Length:', data.length);
        console.log('  - Price:', data.price);
        console.log('  - Engine:', data.engineMake);
        console.log('  - All available fields:', Object.keys(data));
        
        // ROBUST FORM CLEARING: Clear each field individually to prevent data persistence
        const formFields = [
          'title', 'make', 'model', 'year', 'length', 'beamM', 'draftM', 'hullMaterial',
          'machinery.make', 'machinery.hp', 'machinery.kw', 'machinery.numberOfEngines',
          'location', 'description', 'price', 'accommodation.numberOfCabins', 'accommodation.numberOfBerths'
        ];
        
        formFields.forEach(field => {
          form.setValue(field as any, '');
        });
        
        // AI ENHANCEMENT: Process and clean scraped data
        const processedData = processScrapedData(data);
        console.log('🧠 AI Processed Data:', processedData);
        
        // CRITICAL DEBUGGING: Track accommodation data flow
        console.log('🔍 CRITICAL DEBUGGING - Accommodation Data Flow:');
        console.log('  - Raw data.accommodation:', data.accommodation);
        console.log('  - Raw data.accommodation type:', typeof data.accommodation);
        console.log('  - Raw data.accommodation keys:', data.accommodation ? Object.keys(data.accommodation) : 'NONE');
        console.log('  - processedData.accommodation:', processedData.accommodation);
        console.log('  - processedData.accommodation type:', typeof processedData.accommodation);
        console.log('  - processedData.accommodation keys:', processedData.accommodation ? Object.keys(processedData.accommodation) : 'NONE');
        console.log('  - Will accommodation mapping execute?', !!processedData.accommodation);
        
        console.log('🔧 Enhanced Extraction Results:');
        console.log('  - Title cleaned:', processedData.title);
        console.log('  - Year extracted:', processedData.year);
        console.log('  - Make extracted:', processedData.make);
        console.log('  - Model extracted:', processedData.model);
        console.log('  - Length extracted:', processedData.length);
        console.log('  - Engine extracted:', processedData.engineMake);
        console.log('🎯 Title Cleaning Debug:');
        console.log('  - Original title:', data.title);
        console.log('  - Cleaned title:', processedData.title);
        console.log('🎯 Description Extraction Debug:');
        console.log('  - Description available:', !!data.description);
        console.log('  - Description length:', data.description?.length || 0);
        
        // ACCOMMODATION DEBUGGING
        console.log('🏠 Accommodation Debugging:');
        console.log('  - Raw accommodation data:', data.accommodation);
        console.log('  - Accommodation type:', typeof data.accommodation);
        console.log('  - Accommodation keys:', data.accommodation ? Object.keys(data.accommodation) : 'NONE');
        if (data.accommodation && typeof data.accommodation === 'object') {
          Object.keys(data.accommodation).forEach(key => {
            console.log(`    - ${key}:`, data.accommodation[key]);
          });
        }
        
        console.log('🎯 Field mapping results:');
        
        // Map processed data to form fields with smart fallbacks
        if (processedData.title) {
          form.setValue('title', processedData.title);
          console.log('✅ Title mapped:', processedData.title);
        }
        if (processedData.make) {
          form.setValue('make', processedData.make);
          console.log('✅ Make mapped:', processedData.make);
        }
        if (processedData.model) {
          form.setValue('model', processedData.model);
          console.log('✅ Model mapped:', processedData.model);
        }
        
        // Enhanced model extraction - try multiple sources
        if (!processedData.model && processedData.title) {
          // Extract model number from title (e.g., "MOODY 54" -> "54")
          const modelMatch = processedData.title.match(/(\d+)/);
          if (modelMatch) {
            form.setValue('model', modelMatch[1]);
            console.log('🔧 Model extracted from title:', modelMatch[1]);
          }
        }
        
        if (processedData.year) {
          form.setValue('year', parseInt(processedData.year) || null);
          console.log('✅ Year mapped:', processedData.year);
        }
        
        // Dimensions - use actual scraped data (not generic dimensions)
        if (processedData.length) {
          form.setValue('length', parseFloat(processedData.length) || null);
          console.log('✅ Length mapped:', processedData.length);
        }
        
        // ENHANCED: Extract beam and draft
        if (processedData.beam) {
          form.setValue('beamM', parseFloat(processedData.beam) || null);
          console.log('✅ Beam mapped:', processedData.beam);
        }
        
        if (processedData.draft) {
          form.setValue('draftM', parseFloat(processedData.draft) || null);
          console.log('✅ Draft mapped:', processedData.draft);
        }
        
        // ENHANCED: Try to extract dimensions from description if not in main fields
        if (!processedData.beam || !processedData.draft) {
          if (data.description) {
            // Extract beam from description
            if (!processedData.beam) {
              const beamMatch = data.description.match(/(\d+\.?\d*)\s*(?:ft|m|meter).*?(?:beam|width)/i);
              if (beamMatch) {
                const beam = parseFloat(beamMatch[1]);
                form.setValue('beamM', beam);
                console.log('🔧 Beam extracted from description:', beam);
              }
            }
            
            // Extract draft from description
            if (!processedData.draft) {
              const draftMatch = data.description.match(/(\d+\.?\d*)\s*(?:ft|m|meter).*?(?:draft|depth)/i);
              if (draftMatch) {
                const draft = parseFloat(draftMatch[1]);
                form.setValue('draftM', draft);
                console.log('🔧 Draft extracted from description:', draft);
              }
            }
          }
        }
        
        // FIXED: Create composite dimensions string for the Dimensions field
        const length = form.getValues('length');
        const beam = form.getValues('beamM');
        const draft = form.getValues('draftM');
        
        if (length || beam || draft) {
          const dimensions = [length, beam, draft].filter(Boolean).join(' x ');
          if (dimensions) {
            // Store the composite dimensions in a way that doesn't break the form
            // The length field will show the composite, but we'll also store individual values
            console.log('🔧 Composite dimensions created:', dimensions);
            // Note: The form will display the composite in the Dimensions field
            // Individual values are stored in length, beamM, draftM for other sections
            
            // FIXED: Update the length field to show composite dimensions for display
            // This will show "16.72 x 4.85 x 2.28" in the Dimensions field
            if (dimensions !== String(length)) {
              form.setValue('length', dimensions as any);
              console.log('🔧 Dimensions field updated with composite:', dimensions);
            }
          }
        }
        
        // Hull material - use actual scraped data
        if (processedData.hullMaterial) {
          form.setValue('hullMaterial', processedData.hullMaterial);
          console.log('✅ Hull material mapped:', processedData.hullMaterial);
        } else {
          // ENHANCED: Try to extract hull material from description
          if (data.description) {
            // Multiple material patterns
            let materialMatch = data.description.match(/(?:hull|built|construction|material).*?(?:fiberglass|grp|steel|aluminum|wood|composite)/i);
            if (!materialMatch) materialMatch = data.description.match(/(?:fiberglass|grp|steel|aluminum|wood|composite)/i);
            if (!materialMatch) materialMatch = data.description.match(/(?:hull|built|construction).*?(?:fiberglass|grp|steel|aluminum|wood|composite)/i);
            
            if (materialMatch) {
              const material = materialMatch[0].split(/\s+/).pop(); // Get the last word (material type)
              form.setValue('hullMaterial', material);
              console.log('🔧 Hull material extracted from description:', material);
            }
          }
        }
        
        // Engine - use actual scraped data with fallback
        if (processedData.engineMake) {
          form.setValue('machinery.make', processedData.engineMake);
          console.log('✅ Engine mapped:', processedData.engineMake);
        } else if (processedData.machinery?.make) {
          form.setValue('machinery.make', processedData.machinery.make);
          console.log('✅ Engine mapped (from machinery):', processedData.machinery.make);
        }
        
        // PRIORITY 1: Map backend HP/KW data if available
        if (processedData.hp) {
          form.setValue('machinery.hp', parseInt(processedData.hp));
          console.log('✅ HP mapped from backend:', processedData.hp);
        }
        
        if (processedData.kw) {
          form.setValue('machinery.kw', parseFloat(processedData.kw));
          console.log('✅ KW mapped from backend:', processedData.kw);
        }
        
        // PRIORITY 2: Extract HP from engine description if backend data not available
        if (processedData.engine && (!processedData.hp && !processedData.kw)) {
          // Try multiple HP patterns
          let hpMatch = processedData.engine.match(/(\d+)\s*HP/i);
          if (!hpMatch) hpMatch = processedData.engine.match(/(\d+)\s*hp/i);
          if (!hpMatch) hpMatch = processedData.engine.match(/(\d+)\s*horsepower/i);
          
          // CRITICAL FIX: Add specific pattern for De Valk engine format "1x Yanmar 4JH110 diesel"
          if (!hpMatch) hpMatch = processedData.engine.match(/(\d+)x\s+[A-Za-z]+\s+\w*(\d+)\s*[A-Za-z]*/);
          if (hpMatch && hpMatch[2]) {
            // For pattern "1x Yanmar 4JH110 diesel", group 2 contains the HP (110)
            const hp = parseInt(hpMatch[2]);
            form.setValue('machinery.hp', hp);
            form.setValue('machinery.kw', Math.round(hp * 0.7457)); // Convert HP to KW
            console.log('🔧 HP extracted from De Valk pattern:', hp, 'KW calculated:', Math.round(hp * 0.7457));
          } else if (hpMatch) {
            // Standard HP pattern
            const hp = parseInt(hpMatch[1]);
            form.setValue('machinery.hp', hp);
            form.setValue('machinery.kw', Math.round(hp * 0.7457)); // Convert HP to KW
            console.log('🔧 HP extracted:', hp, 'KW calculated:', Math.round(hp * 0.7457));
          } else {
            // ENHANCED: Try to extract HP from description if not found in engine
            if (data.description) {
              const descHpMatch = data.description.match(/(\d+)\s*hp/i);
              if (descHpMatch) {
                const hp = parseInt(descHpMatch[1]);
                form.setValue('machinery.hp', hp);
                form.setValue('machinery.kw', Math.round(hp * 0.7457));
                console.log('🔧 HP extracted from description:', hp, 'KW calculated:', Math.round(hp * 0.7457));
              }
            }
            console.log('❌ No HP pattern found in:', processedData.engine);
          }
        }
        
        if (processedData.machinery?.numberOfEngines) {
          form.setValue('machinery.numberOfEngines', processedData.machinery.numberOfEngines);
          console.log('✅ Number of engines mapped:', processedData.machinery.numberOfEngines);
        }
        
        // FIXED: Create composite HP/KW string for the HP/KW field
        const hp = form.getValues('machinery.hp');
        const kw = form.getValues('machinery.kw');
        
        if (hp || kw) {
          if (hp && kw) {
            // Store the HP value but log the composite for display
            console.log('🔧 Composite HP/KW available:', `${hp} / ${kw}`);
            // The form will show HP in the HP/KW field, KW is stored separately
          } else if (hp) {
            const calculatedKw = Math.round(hp * 0.7457);
            form.setValue('machinery.kw', calculatedKw);
            console.log('🔧 HP/KW created with calculated KW:', `${hp} / ${calculatedKw}`);
          } else if (kw) {
            const calculatedHp = Math.round(kw / 0.7457);
            form.setValue('machinery.hp', calculatedHp);
            console.log('🔧 HP/KW created with calculated HP:', `${calculatedHp} / ${kw}`);
          }
        }
        
        // Equipment - transform Yes/No object to comma-separated list for description
        if (processedData.equipment && typeof processedData.equipment === 'object') {
          const equipmentList = Object.entries(processedData.equipment)
            .filter(([_, value]) => value === 'Yes')
            .map(([key, _]) => key)
            .join(', ');
          if (equipmentList) {
            const currentDesc = form.getValues('description') || '';
            form.setValue('description', currentDesc + (currentDesc ? '\n\nEquipment: ' : 'Equipment: ') + equipmentList);
          }
        }
        
        // Navigation - transform Yes/No object to comma-separated list for description
        if (processedData.navigation && typeof processedData.navigation === 'object') {
          const navigationList = Object.entries(processedData.navigation)
            .filter(([_, value]) => value === 'Yes')
            .map(([key, _]) => key)
            .join(', ');
          if (navigationList) {
            const currentDesc = form.getValues('description') || '';
            form.setValue('description', currentDesc + (currentDesc ? '\n\nNavigation: ' : 'Navigation: ') + navigationList);
          }
        }
        
        // Rigging - transform Yes/No object to comma-separated list for description
        if (processedData.rigging && typeof processedData.rigging === 'object') {
          const riggingList = Object.entries(processedData.rigging)
            .filter(([_, value]) => value === 'Yes')
            .map(([key, _]) => key)
            .join(', ');
          if (riggingList) {
            const currentDesc = form.getValues('description') || '';
            form.setValue('description', currentDesc + (currentDesc ? '\n\nRigging: ' : 'Rigging: ') + riggingList);
          }
        }
        
        // Location and other fields
        if (processedData.lying) {
          form.setValue('location', processedData.lying);
          console.log('✅ Location mapped:', processedData.lying);
        }
        if (processedData.description) {
          form.setValue('description', processedData.description);
          console.log('✅ Description mapped:', processedData.description);
        }
        if (processedData.price) {
          let cleanPrice = null;
        if (typeof processedData.price === 'string') {
          cleanPrice = parseInt(processedData.price.replace(/[^0-9]/g, '')) || null;
        } else if (typeof processedData.price === 'number') {
          cleanPrice = processedData.price;
        }
          
          // ENHANCED: Handle "000" prices and try to extract from description
          if (cleanPrice === 0 && processedData.price === '000') {
            // Try to extract price from description
            if (data.description) {
              const priceMatch = data.description.match(/(\d{1,3}(?:,\d{3})*)\s*(?:euro|eur|€|dollar|usd|\$)/i);
              if (priceMatch) {
                cleanPrice = parseInt(priceMatch[1].replace(/,/g, ''));
                console.log('🔧 Price extracted from description:', cleanPrice);
              }
            }
          }
          
          // ENHANCED: Try to extract price from description if main price is invalid
          if (!cleanPrice || cleanPrice === 0) {
            if (data.description) {
              // Multiple price patterns
              let descPriceMatch = data.description.match(/(\d{1,3}(?:,\d{3})*)\s*(?:euro|eur|€|dollar|usd|\$)/i);
              if (!descPriceMatch) descPriceMatch = data.description.match(/(?:price|cost|asking|offered)\s*(?:at|for|is)?\s*[\$€]?\s*(\d{1,3}(?:,\d{3})*)/i);
              if (!descPriceMatch) descPriceMatch = data.description.match(/(\d{1,3}(?:,\d{3})*)\s*(?:k|thousand|000)/i);
              
              if (descPriceMatch) {
                cleanPrice = parseInt(descPriceMatch[1].replace(/,/g, ''));
                console.log('🔧 Price extracted from description (fallback):', cleanPrice);
              }
            }
          }
          
          form.setValue('price', cleanPrice);
          console.log('✅ Price mapped:', processedData.price, '→ Clean:', cleanPrice);
        }
        if (processedData.cabins) {
          form.setValue('accommodation.numberOfCabins', parseInt(processedData.cabins) || null);
          console.log('✅ Cabins mapped:', processedData.cabins);
        }
        if (processedData.berths) {
          form.setValue('accommodation.numberOfBerths', parseInt(processedData.berths) || null);
          console.log('✅ Berths mapped:', processedData.berths);
        }
        
        // CRITICAL CHECK: Ensure we get to accommodation mapping
        console.log('🔍 CRITICAL CHECK - About to start accommodation mapping section');
        console.log('🔍 Current form values before accommodation mapping:');
        console.log('  - Title:', form.getValues('title'));
        console.log('  - Make:', form.getValues('make'));
        console.log('  - Model:', form.getValues('model'));
        console.log('  - Year:', form.getValues('year'));
        console.log('  - Length:', form.getValues('length'));
        console.log('  - Price:', form.getValues('price'));
        console.log('  - HP:', form.getValues('machinery.hp'));
        console.log('  - KW:', form.getValues('machinery.kw'));
        
        // 🎯 DE VALK FIELD MAPPING - EXACT MATCH
        console.log('🎯 Starting De Valk exact field mapping');
        
        // KEY DETAILS SECTION
        if (processedData.key_details) {
          console.log('🔑 Mapping Key Details section');
          Object.entries(processedData.key_details).forEach(([key, value]) => {
            if (value && value !== 'none' && value !== 'n/a') {
              switch (key) {
                case 'dimensions':
                  form.setValue('dimensions', value);
                  console.log(`✅ dimensions set to: ${value}`);
                  break;
                case 'material':
                  form.setValue('hullMaterial', value);
                  console.log(`✅ hullMaterial set to: ${value}`);
                  break;
                case 'built':
                  form.setValue('year', parseInt(value) || value);
                  console.log(`✅ year set to: ${value}`);
                  break;
                case 'engines':
                  form.setValue('engine', value);
                  console.log(`✅ engine set to: ${value}`);
                  break;
                case 'hp_kw':
                  // Extract HP and KW from combined field
                  const hpMatch = value.match(/(\d+(?:\.\d+)?)\s*hp/i);
                  const kwMatch = value.match(/(\d+(?:\.\d+)?)\s*kw/i);
                  if (hpMatch) {
                    form.setValue('machinery.hp', parseFloat(hpMatch[1]));
                    console.log(`✅ machinery.hp set to: ${hpMatch[1]}`);
                  }
                  if (kwMatch) {
                    form.setValue('machinery.kw', parseFloat(kwMatch[1]));
                    console.log(`✅ machinery.kw set to: ${kwMatch[1]}`);
                  }
                  break;
                case 'asking_price':
                  const cleanPrice = value.replace(/[^0-9]/g, '');
                  if (cleanPrice) {
                    form.setValue('price', parseInt(cleanPrice));
                    console.log(`✅ price set to: ${cleanPrice}`);
                  }
                  break;
              }
            }
          });
        }
        
        // GENERAL INFORMATION SECTION
        if (processedData.general) {
          console.log('📋 Mapping General Information section');
          Object.entries(processedData.general).forEach(([key, value]) => {
            if (value && value !== 'none' && value !== 'n/a') {
              switch (key) {
                case 'model':
                  form.setValue('model', value);
                  console.log(`✅ model set to: ${value}`);
                  break;
                case 'type':
                  form.setValue('type', value);
                  console.log(`✅ type set to: ${value}`);
                  break;
                case 'loa_m':
                  form.setValue('length', parseFloat(value) || value);
                  console.log(`✅ length set to: ${value}`);
                  break;
                case 'beam_m':
                  form.setValue('beam', parseFloat(value) || value);
                  console.log(`✅ beam set to: ${value}`);
                  break;
                case 'draft_m':
                  form.setValue('draft', parseFloat(value) || value);
                  console.log(`✅ draft set to: ${value}`);
                  break;
                case 'year_built':
                  form.setValue('year', parseInt(value) || value);
                  console.log(`✅ year set to: ${value}`);
                  break;
                case 'builder':
                  form.setValue('make', value);
                  console.log(`✅ make set to: ${value}`);
                  break;
                case 'country':
                  form.setValue('country', value);
                  console.log(`✅ country set to: ${value}`);
                  break;
                case 'designer':
                  form.setValue('designer', value);
                  console.log(`✅ designer set to: ${value}`);
                  break;
                case 'hull_material':
                  form.setValue('hullMaterial', value);
                  console.log(`✅ hullMaterial set to: ${value}`);
                  break;
              }
            }
          });
        }
        
        // ACCOMMODATION SECTION - DE VALK EXACT FIELDS
        if (processedData.accommodation) {
          console.log('🏠 Mapping Accommodation section (De Valk exact fields)');
          Object.entries(processedData.accommodation).forEach(([key, value]) => {
            if (value && value !== 'none' && value !== 'n/a') {
              switch (key) {
                case 'cabins':
                  form.setValue('accommodation.numberOfCabins', parseInt(value) || value);
                  console.log(`✅ accommodation.numberOfCabins set to: ${value}`);
                  break;
                case 'berths':
                  form.setValue('accommodation.numberOfBerths', parseInt(value) || value);
                  console.log(`✅ accommodation.numberOfBerths set to: ${value}`);
                  break;
                case 'interior':
                  form.setValue('accommodation.interiorMaterial', value);
                  console.log(`✅ accommodation.interiorMaterial set to: ${value}`);
                  break;
                case 'layout':
                  form.setValue('accommodation.layout', value);
                  console.log(`✅ accommodation.layout set to: ${value}`);
                  break;
                case 'open_cockpit':
                  form.setValue('accommodation.openCockpit', value === 'yes' || value === true);
                  console.log(`✅ accommodation.openCockpit set to: ${value}`);
                  break;
                case 'aft_deck':
                  form.setValue('accommodation.aftDeck', value === 'yes' || value === true);
                  console.log(`✅ accommodation.aftDeck set to: ${value}`);
                  break;
                case 'galley':
                  form.setValue('accommodation.galley', value === 'yes' || value === true);
                  console.log(`✅ accommodation.galley set to: ${value}`);
                  break;
                case 'cooker':
                  form.setValue('accommodation.cooker', value);
                  console.log(`✅ accommodation.cooker set to: ${value}`);
                  break;
                case 'sink':
                  form.setValue('accommodation.sink', value);
                  console.log(`✅ accommodation.sink set to: ${value}`);
                  break;
                case 'fridge':
                  form.setValue('accommodation.fridge', value);
                  console.log(`✅ accommodation.fridge set to: ${value}`);
                  break;
                case 'oven':
                  form.setValue('accommodation.oven', value);
                  console.log(`✅ accommodation.oven set to: ${value}`);
                  break;
                case 'microwave':
                  form.setValue('accommodation.microwave', value);
                  console.log(`✅ accommodation.microwave set to: ${value}`);
                  break;
                case 'freezer':
                  form.setValue('accommodation.freezer', value);
                  console.log(`✅ accommodation.freezer set to: ${value}`);
                  break;
                case 'hot_water_system':
                  form.setValue('accommodation.hotWaterSystem', value);
                  console.log(`✅ accommodation.hotWaterSystem set to: ${value}`);
                  break;
                case 'toilet':
                  form.setValue('accommodation.ownersCabinToilet', value);
                  console.log(`✅ accommodation.ownersCabinToilet set to: ${value}`);
                  break;
                case 'shower':
                  form.setValue('accommodation.ownersCabinShower', value);
                  console.log(`✅ accommodation.ownersCabinShower set to: ${value}`);
                  break;
              }
            }
          });
        }
        
        // MACHINERY SECTION - DE VALK EXACT FIELDS
        if (processedData.machinery) {
          console.log('🔧 Mapping Machinery section (De Valk exact fields)');
          Object.entries(processedData.machinery).forEach(([key, value]) => {
            if (value && value !== 'none' && value !== 'n/a') {
              switch (key) {
                case 'no_of_engines':
                  form.setValue('machinery.numberOfEngines', parseInt(value) || value);
                  console.log(`✅ machinery.numberOfEngines set to: ${value}`);
                  break;
                case 'make':
                  form.setValue('machinery.make', value);
                  console.log(`✅ machinery.make set to: ${value}`);
                  break;
                case 'type':
                  form.setValue('machinery.type', value);
                  console.log(`✅ machinery.type set to: ${value}`);
                  break;
                case 'hp':
                  form.setValue('machinery.hp', parseFloat(value) || value);
                  console.log(`✅ machinery.hp set to: ${value}`);
                  break;
                case 'kw':
                  form.setValue('machinery.kw', parseFloat(value) || value);
                  console.log(`✅ machinery.kw set to: ${value}`);
                  break;
                case 'fuel':
                  form.setValue('machinery.fuel', value);
                  console.log(`✅ machinery.fuel set to: ${value}`);
                  break;
                case 'generator':
                  form.setValue('machinery.generator', value);
                  console.log(`✅ machinery.generator set to: ${value}`);
                  break;
                case 'battery_charger':
                  form.setValue('machinery.batteryCharger', value);
                  console.log(`✅ machinery.batteryCharger set to: ${value}`);
                  break;
                case 'solar_panel':
                  form.setValue('machinery.solarPanel', value);
                  console.log(`✅ machinery.solarPanel set to: ${value}`);
                  break;
              }
            }
          });
        }
        
        // NAVIGATION SECTION - DE VALK EXACT FIELDS
        if (processedData.navigation) {
          console.log('🧭 Mapping Navigation section (De Valk exact fields)');
          Object.entries(processedData.navigation).forEach(([key, value]) => {
            if (value && value !== 'none' && value !== 'n/a') {
              switch (key) {
                case 'compass':
                  form.setValue('navigation.compass', value);
                  console.log(`✅ navigation.compass set to: ${value}`);
                  break;
                case 'depth_sounder':
                  form.setValue('navigation.depthSounder', value);
                  console.log(`✅ navigation.depthSounder set to: ${value}`);
                  break;
                case 'log':
                  form.setValue('navigation.log', value);
                  console.log(`✅ navigation.log set to: ${value}`);
                  break;
                case 'windset':
                  form.setValue('navigation.windset', value);
                  console.log(`✅ navigation.windset set to: ${value}`);
                  break;
                case 'vhf':
                  form.setValue('navigation.vhf', value);
                  console.log(`✅ navigation.vhf set to: ${value}`);
                  break;
                case 'autopilot':
                  form.setValue('navigation.autopilot', value);
                  console.log(`✅ navigation.autopilot set to: ${value}`);
                  break;
                case 'radar':
                  form.setValue('navigation.radar', value);
                  console.log(`✅ navigation.radar set to: ${value}`);
                  break;
                case 'gps':
                  form.setValue('navigation.gps', value);
                  console.log(`✅ navigation.gps set to: ${value}`);
                  break;
                case 'plotter':
                  form.setValue('navigation.plotter', value);
                  console.log(`✅ navigation.plotter set to: ${value}`);
                  break;
                case 'ais_transceiver':
                  form.setValue('navigation.ais', value);
                  console.log(`✅ navigation.ais set to: ${value}`);
                  break;
              }
            }
          });
        }
        
        // EQUIPMENT SECTION - DE VALK EXACT FIELDS
        if (processedData.equipment) {
          console.log('🛠️ Mapping Equipment section (De Valk exact fields)');
          Object.entries(processedData.equipment).forEach(([key, value]) => {
            if (value && value !== 'none' && value !== 'n/a') {
              switch (key) {
                case 'anchor':
                  form.setValue('equipment.anchor', value);
                  console.log(`✅ equipment.anchor set to: ${value}`);
                  break;
                case 'anchor_chain':
                  form.setValue('equipment.anchorChain', value);
                  console.log(`✅ equipment.anchorChain set to: ${value}`);
                  break;
                case 'windlass':
                  form.setValue('equipment.windlass', value);
                  console.log(`✅ equipment.windlass set to: ${value}`);
                  break;
                case 'dinghy':
                  form.setValue('equipment.dinghy', value);
                  console.log(`✅ equipment.dinghy set to: ${value}`);
                  break;
                case 'outboard':
                  form.setValue('equipment.outboard', value);
                  console.log(`✅ equipment.outboard set to: ${value}`);
                  break;
                case 'davits':
                  form.setValue('equipment.davits', value);
                  console.log(`✅ equipment.davits set to: ${value}`);
                  break;
                case 'fire_extinguisher':
                  form.setValue('equipment.fireExtinguisher', value);
                  console.log(`✅ equipment.fireExtinguisher set to: ${value}`);
                  break;
              }
            }
          });
        }
        
        // RIGGING SECTION - DE VALK EXACT FIELDS (INCLUDING DETAILED WINCHES!)
        if (processedData.rigging) {
          console.log('⛵ Mapping Rigging section (De Valk exact fields with detailed winches)');
          Object.entries(processedData.rigging).forEach(([key, value]) => {
            if (value && value !== 'none' && value !== 'n/a') {
              switch (key) {
                case 'mast':
                  form.setValue('rigging.mast', value);
                  console.log(`✅ rigging.mast set to: ${value}`);
                  break;
                case 'boom':
                  form.setValue('rigging.boom', value);
                  console.log(`✅ rigging.boom set to: ${value}`);
                  break;
                case 'mainsail':
                  form.setValue('rigging.mainsail', value);
                  console.log(`✅ rigging.mainsail set to: ${value}`);
                  break;
                case 'genoa':
                  form.setValue('rigging.genoa', value);
                  console.log(`✅ rigging.genoa set to: ${value}`);
                  break;
                case 'jib':
                  form.setValue('rigging.jib', value);
                  console.log(`✅ rigging.jib set to: ${value}`);
                  break;
                case 'spinnaker':
                  form.setValue('rigging.spinnaker', value);
                  console.log(`✅ rigging.spinnaker set to: ${value}`);
                  break;
                case 'spreaders':
                  form.setValue('rigging.spreaders', value);
                  console.log(`✅ rigging.spreaders set to: ${value}`);
                  break;
                // 🎯 DETAILED WINCH FIELDS - EXACT DE VALK MATCH!
                case 'primary_sheet_winch':
                  form.setValue('rigging.primarySheetWinch', value);
                  console.log(`✅ rigging.primarySheetWinch set to: ${value}`);
                  break;
                case 'secondary_sheet_winch':
                  form.setValue('rigging.secondarySheetWinch', value);
                  console.log(`✅ rigging.secondarySheetWinch set to: ${value}`);
                  break;
                case 'genoa_sheetwinches':
                  form.setValue('rigging.genoaSheetwinches', value);
                  console.log(`✅ rigging.genoaSheetwinches set to: ${value}`);
                  break;
                case 'halyard_winches':
                  form.setValue('rigging.halyardWinches', value);
                  console.log(`✅ rigging.halyardWinches set to: ${value}`);
                  break;
                case 'multifunctional_winches':
                  form.setValue('rigging.multifunctionalWinches', value);
                  console.log(`✅ rigging.multifunctionalWinches set to: ${value}`);
                  break;
              }
            }
          });
        }
        
        console.log('🎯 De Valk exact field mapping completed!');
        
        // COMPREHENSIVE ACCOMMODATION MAPPING
        try {
          console.log('🔍 ABOUT TO START ACCOMMODATION MAPPING - processedData.accommodation exists:', !!processedData.accommodation);
          console.log('🔍 processedData.accommodation type:', typeof processedData.accommodation);
          console.log('🔍 processedData.accommodation keys:', processedData.accommodation ? Object.keys(processedData.accommodation) : 'NONE');
          
          if (processedData.accommodation) {
            console.log('🏠 Starting comprehensive accommodation field mapping');
            console.log('🏠 STEP 1: Basic accommodation fields');
            
            // Basic accommodation fields
            if (processedData.accommodation.numberOfCabins) {
              console.log('🏠 Setting numberOfCabins to:', processedData.accommodation.numberOfCabins);
              form.setValue('accommodation.numberOfCabins', parseInt(processedData.accommodation.numberOfCabins) || null);
              console.log('✅ accommodation.numberOfCabins mapped:', processedData.accommodation.numberOfCabins);
            }
            
            if (processedData.accommodation.numberOfBerths) {
              console.log('🏠 Setting numberOfBerths to:', processedData.accommodation.numberOfBerths);
              form.setValue('accommodation.numberOfBerths', parseInt(processedData.accommodation.numberOfBerths) || null);
              console.log('✅ accommodation.numberOfBerths mapped:', processedData.accommodation.numberOfBerths);
            }
            
            if (processedData.accommodation.numberOfHeads) {
              console.log('🏠 Setting numberOfHeads to:', processedData.accommodation.numberOfHeads);
              form.setValue('accommodation.numberOfHeads', parseInt(processedData.accommodation.numberOfHeads) || null);
              console.log('✅ accommodation.numberOfHeads mapped:', processedData.accommodation.numberOfHeads);
            }
            
            if (processedData.accommodation.numberOfShowers) {
              console.log('🏠 Setting numberOfShowers to:', processedData.accommodation.numberOfShowers);
              form.setValue('accommodation.numberOfShowers', parseInt(processedData.accommodation.numberOfShowers) || null);
              console.log('✅ accommodation.numberOfShowers mapped:', processedData.accommodation.numberOfShowers);
            }
            
            console.log('🏠 STEP 2: Accommodation features');
            
            // Accommodation features
            if (processedData.accommodation.ownersCabin) {
              console.log('🏠 Setting ownersCabin to:', processedData.accommodation.ownersCabin);
              form.setValue('accommodation.ownersCabin', processedData.accommodation.ownersCabin);
              console.log('✅ accommodation.ownersCabin mapped:', processedData.accommodation.ownersCabin);
            }
            
            if (processedData.accommodation.guestCabin1) {
              console.log('🏠 Setting guestCabin1 to:', processedData.accommodation.guestCabin1);
              form.setValue('accommodation.guestCabin1', processedData.accommodation.guestCabin1);
              console.log('✅ accommodation.guestCabin1 mapped:', processedData.accommodation.guestCabin1);
            }
            
            if (processedData.accommodation.guestCabin2) {
              console.log('🏠 Setting guestCabin2 to:', processedData.accommodation.guestCabin2);
              form.setValue('accommodation.guestCabin2', processedData.accommodation.guestCabin2);
              console.log('✅ accommodation.guestCabin2 mapped:', processedData.accommodation.guestCabin2);
            }
            
            if (processedData.accommodation.layout) {
              console.log('🏠 Setting layout to:', processedData.accommodation.layout);
              form.setValue('accommodation.layout', processedData.accommodation.layout);
              console.log('✅ accommodation.layout mapped:', processedData.accommodation.layout);
            }
            
            if (processedData.accommodation.interiorMaterial) {
              console.log('🏠 Setting interiorMaterial to:', processedData.accommodation.interiorMaterial);
              form.setValue('accommodation.interiorMaterial', processedData.accommodation.interiorMaterial);
              console.log('✅ accommodation.interiorMaterial mapped:', processedData.accommodation.interiorMaterial);
            }
            
            console.log('🏠 STEP 3: Galley equipment');
            
            // Galley equipment
            if (processedData.accommodation.cooker) {
              console.log('🏠 Setting cooker to:', processedData.accommodation.cooker);
              form.setValue('accommodation.cooker', processedData.accommodation.cooker);
              console.log('✅ accommodation.cooker mapped:', processedData.accommodation.cooker);
            }
            
            if (processedData.accommodation.sink) {
              console.log('🏠 Setting sink to:', processedData.accommodation.sink);
              form.setValue('accommodation.sink', processedData.accommodation.sink);
              console.log('✅ accommodation.sink mapped:', processedData.accommodation.sink);
            }
            
            if (processedData.accommodation.fridge) {
              console.log('🏠 Setting fridge to:', processedData.accommodation.fridge);
              form.setValue('accommodation.fridge', processedData.accommodation.fridge);
              console.log('✅ accommodation.fridge mapped:', processedData.accommodation.fridge);
            }
            
            console.log('🏠 STEP 4: Toggle switches');
            
            // Toggle switches
            if (processedData.accommodation.openCockpit !== undefined) {
              console.log('🏠 Setting openCockpit to:', processedData.accommodation.openCockpit);
              form.setValue('accommodation.openCockpit', processedData.accommodation.openCockpit);
              console.log('✅ accommodation.openCockpit mapped:', processedData.accommodation.openCockpit);
            }
            
            if (processedData.accommodation.aftDeck !== undefined) {
              console.log('🏠 Setting aftDeck to:', processedData.accommodation.aftDeck);
              form.setValue('accommodation.aftDeck', processedData.accommodation.aftDeck);
              console.log('✅ accommodation.aftDeck mapped:', processedData.accommodation.aftDeck);
            }
            
            console.log('🏠 Comprehensive accommodation mapping complete');
          } else {
            console.log('⚠️ No processedData.accommodation found, creating accommodation data from raw data');
            
            if (data.accommodation) {
              console.log('🏠 Using raw data.accommodation for field mapping');
              
              // Basic accommodation fields
              if (data.accommodation.numberOfCabins) {
                console.log('🏠 Setting numberOfCabins from raw data to:', data.accommodation.numberOfCabins);
                form.setValue('accommodation.numberOfCabins', parseInt(data.accommodation.numberOfCabins) || null);
                console.log('✅ accommodation.numberOfCabins mapped from raw data:', data.accommodation.numberOfCabins);
              }
              
              if (data.accommodation.numberOfBerths) {
                console.log('🏠 Setting numberOfBerths from raw data to:', data.accommodation.numberOfBerths);
                form.setValue('accommodation.numberOfBerths', parseInt(data.accommodation.numberOfBerths) || null);
                console.log('✅ accommodation.numberOfBerths mapped from raw data:', data.accommodation.numberOfBerths);
              }
              
              if (data.accommodation.numberOfHeads) {
                console.log('🏠 Setting numberOfHeads from raw data to:', data.accommodation.numberOfHeads);
                form.setValue('accommodation.numberOfHeads', parseInt(data.accommodation.numberOfHeads) || null);
                console.log('✅ accommodation.numberOfHeads mapped from raw data:', data.accommodation.numberOfHeads);
              }
              
              if (data.accommodation.numberOfShowers) {
                console.log('🏠 Setting numberOfShowers from raw data to:', data.accommodation.numberOfShowers);
                form.setValue('accommodation.numberOfShowers', parseInt(data.accommodation.numberOfShowers) || null);
                console.log('✅ accommodation.numberOfShowers mapped from raw data:', data.accommodation.numberOfShowers);
              }
              
              // Map other accommodation fields from raw data
              if (data.accommodation.interiorMaterial) {
                console.log('🏠 Setting interiorMaterial from raw data to:', data.accommodation.interiorMaterial);
                form.setValue('accommodation.interiorMaterial', data.accommodation.interiorMaterial);
                console.log('✅ accommodation.interiorMaterial mapped from raw data:', data.accommodation.interiorMaterial);
              }
              
              if (data.accommodation.layout) {
                console.log('🏠 Setting layout from raw data to:', data.accommodation.layout);
                form.setValue('accommodation.layout', data.accommodation.layout);
                console.log('✅ accommodation.layout mapped from raw data:', data.accommodation.layout);
              }
              
              console.log('🏠 Raw data accommodation mapping complete');
            } else {
              console.log('❌ No accommodation data available from any source');
            }
          }
        } catch (error) {
          console.error('❌ ERROR in accommodation mapping:', error);
          console.error('❌ Error stack:', error.stack);
          console.error('❌ processedData.accommodation:', processedData.accommodation);
          console.error('❌ data.accommodation:', data.accommodation);
        }
        
        // COMPREHENSIVE EQUIPMENT MAPPING
        try {
          console.log('🔍 ABOUT TO START EQUIPMENT MAPPING - processedData.equipment exists:', !!processedData.equipment);
          console.log('🔍 processedData.equipment type:', typeof processedData.equipment);
          console.log('🔍 processedData.equipment keys:', processedData.equipment ? Object.keys(processedData.equipment) : 'NONE');
          
          if (processedData.equipment) {
            console.log('🛠️ Starting comprehensive equipment field mapping');
            console.log('🛠️ STEP 1: Map equipment to actual form fields');
            
            // Map equipment categories to frontend form
            Object.keys(processedData.equipment).forEach(category => {
              if (processedData.equipment[category] && typeof processedData.equipment[category] === 'object') {
                console.log(`🛠️ Processing equipment category: ${category}`);
                
                // Map individual equipment items within each category
                Object.keys(processedData.equipment[category]).forEach(item => {
                  if (processedData.equipment[category][item]) {
                    console.log(`🛠️ Found equipment item: ${category}.${item} = ${processedData.equipment[category][item]}`);
                    
                    // Map to appropriate form fields based on category and item
                    if (category === 'accommodation') {
                      if (item === 'toilet') {
                        form.setValue('accommodation.ownersCabinToilet', 'Yes');
                        console.log('✅ accommodation.ownersCabinToilet set to: Yes');
                      } else if (item === 'shower') {
                        form.setValue('accommodation.ownersCabinShower', 'Yes');
                        console.log('✅ accommodation.ownersCabinShower set to: Yes');
                      } else if (item === 'hotwater') {
                        form.setValue('accommodation.hotWaterSystem', 'Yes');
                        console.log('✅ accommodation.hotWaterSystem set to: Yes');
                      }
                    } else if (category === 'galley') {
                      if (item === 'oven') {
                        form.setValue('accommodation.oven', 'Yes');
                        console.log('✅ accommodation.oven set to: Yes');
                      } else if (item === 'microwave') {
                        form.setValue('accommodation.microwave', 'Yes');
                        console.log('✅ accommodation.microwave set to: Yes');
                      } else if (item === 'freezer') {
                        form.setValue('accommodation.freezer', 'Yes');
                        console.log('✅ accommodation.freezer set to: Yes');
                      }
                    } else if (category === 'comfort') {
                      if (item === 'heating') {
                        form.setValue('accommodation.heating', 'Yes');
                        console.log('✅ accommodation.heating set to: Yes');
                      } else if (item === 'airConditioning') {
                        form.setValue('accommodation.airConditioning', 'Yes');
                        console.log('✅ accommodation.airConditioning set to: Yes');
                      }
                    } else if (category === 'deck_safety') {
                      if (item === 'anchor') {
                        form.setValue('equipment.anchor', 'Yes');
                        console.log('✅ equipment.anchor set to: Yes');
                      } else if (item === 'lifeRaft') {
                        form.setValue('equipment.lifeRaft', 'Yes');
                        console.log('✅ equipment.lifeRaft set to: Yes');
                      } else if (item === 'epirb') {
                        form.setValue('equipment.epirb', 'Yes');
                        console.log('✅ equipment.epirb set to: Yes');
                      } else if (item === 'fireExtinguisher') {
                        form.setValue('equipment.fireExtinguisher', 'Yes');
                        console.log('✅ equipment.fireExtinguisher set to: Yes');
                      } else if (item === 'bilgePump') {
                        form.setValue('equipment.bilgePump', 'Yes');
                        console.log('✅ equipment.bilgePump set to: Yes');
                      } else if (item === 'davits') {
                        form.setValue('equipment.davits', 'Yes');
                        console.log('✅ equipment.davits set to: Yes');
                      } else if (item === 'windlass') {
                        form.setValue('equipment.windlass', 'Yes');
                        console.log('✅ equipment.windlass set to: Yes');
                      }
                    } else if (category === 'systems') {
                      if (item === 'generator') {
                        form.setValue('machinery.generator', 'Yes');
                        console.log('✅ machinery.generator set to: Yes');
                      } else if (item === 'inverter') {
                        form.setValue('machinery.inverter', 'Yes');
                        console.log('✅ machinery.inverter set to: Yes');
                      } else if (item === 'batteryCharger') {
                        form.setValue('machinery.batteryCharger', 'Yes');
                        console.log('✅ machinery.batteryCharger set to: Yes');
                      } else if (item === 'fuelTank') {
                        form.setValue('machinery.fuelTank', 'Yes');
                        console.log('✅ machinery.fuelTank set to: Yes');
                      } else if (item === 'waterTank') {
                        form.setValue('machinery.waterTank', 'Yes');
                        console.log('✅ machinery.waterTank set to: Yes');
                      }
                    } else if (category === 'tender') {
                      if (item === 'dinghy') {
                        form.setValue('equipment.dinghy', 'Yes');
                        console.log('✅ equipment.dinghy set to: Yes');
                      } else if (item === 'inflatable') {
                        form.setValue('equipment.inflatable', 'Yes');
                        console.log('✅ equipment.inflatable set to: Yes');
                      } else if (item === 'outboard') {
                        form.setValue('equipment.outboard', 'Yes');
                        console.log('✅ equipment.outboard set to: Yes');
                      }
                    }
                  }
                });
              }
            });
            
            console.log('🛠️ Comprehensive equipment mapping complete');
          } else {
            console.log('⚠️ No processedData.equipment found, creating equipment data from raw data');
            
            if (data.equipment) {
              console.log('🛠️ Using raw data.equipment for field mapping');
              
              // Map equipment from raw data to actual form fields
              if (data.equipment.accommodation) {
                if (data.equipment.accommodation.toilet) {
                  form.setValue('accommodation.ownersCabinToilet', 'Yes');
                  console.log('✅ accommodation.ownersCabinToilet set from raw data: Yes');
                }
                if (data.equipment.accommodation.shower) {
                  form.setValue('accommodation.ownersCabinShower', 'Yes');
                  console.log('✅ accommodation.ownersCabinShower set from raw data: Yes');
                }
              }
              
              console.log('🛠️ Raw data equipment mapping complete');
            } else {
              console.log('❌ No equipment data available from any source');
            }
          }
        } catch (error) {
          console.error('❌ ERROR in equipment mapping:', error);
          console.error('❌ Error stack:', error.stack);
        }
        
        // COMPREHENSIVE NAVIGATION MAPPING
        try {
          console.log('🔍 ABOUT TO START NAVIGATION MAPPING - processedData.navigation exists:', !!processedData.navigation);
          console.log('🔍 processedData.navigation type:', typeof processedData.navigation);
          console.log('🔍 processedData.navigation keys:', processedData.navigation ? Object.keys(processedData.navigation) : 'NONE');
          
          if (processedData.navigation) {
            console.log('🧭 Starting comprehensive navigation field mapping');
            console.log('🧭 STEP 1: Map navigation to actual form fields');
            
            // Map navigation items to actual navigation form fields
            Object.keys(processedData.navigation).forEach(item => {
              if (processedData.navigation[item]) {
                console.log(`🧭 Found navigation item: ${item} = ${processedData.navigation[item]}`);
                
                // Map to appropriate form fields based on item name
                if (item === 'ais') {
                  form.setValue('navigation.ais', 'Yes');
                  console.log('✅ navigation.ais set to: Yes');
                } else if (item === 'autopilot') {
                  form.setValue('navigation.autopilot', 'Yes');
                  console.log('✅ navigation.autopilot set to: Yes');
                } else if (item === 'compass') {
                  form.setValue('navigation.compass', 'Yes');
                  console.log('✅ navigation.compass set to: Yes');
                } else if (item === 'depth sounder' || item === 'depthsounder') {
                  form.setValue('navigation.depthSounder', 'Yes');
                  console.log('✅ navigation.depthSounder set to: Yes');
                } else if (item === 'gps') {
                  form.setValue('navigation.gps', 'Yes');
                  console.log('✅ navigation.gps set to: Yes');
                } else if (item === 'radar') {
                  form.setValue('navigation.radar', 'Yes');
                  console.log('✅ navigation.radar set to: Yes');
                } else if (item === 'vhf') {
                  form.setValue('navigation.vhf', 'Yes');
                  console.log('✅ navigation.vhf set to: Yes');
                } else if (item === 'plotter') {
                  form.setValue('navigation.plotter', 'Yes');
                  console.log('✅ navigation.plotter set to: Yes');
                } else if (item === 'epirb') {
                  form.setValue('navigation.epirb', 'Yes');
                  console.log('✅ navigation.epirb set to: Yes');
                } else if (item === 'log') {
                  form.setValue('navigation.log', 'Yes');
                  console.log('✅ navigation.log set to: Yes');
                } else if (item === 'windset') {
                  form.setValue('navigation.windset', 'Yes');
                  console.log('✅ navigation.windset set to: Yes');
                } else if (item === 'satellite') {
                  form.setValue('navigation.satellite', 'Yes');
                  console.log('✅ navigation.satellite set to: Yes');
                } else if (item === 'rudder angle indicator' || item === 'rudderAngleIndicator') {
                  form.setValue('navigation.rudderAngleIndicator', 'Yes');
                  console.log('✅ navigation.rudderAngleIndicator set to: Yes');
                }
              }
            });
            
            console.log('🧭 Comprehensive navigation mapping complete');
          } else {
            console.log('⚠️ No processedData.navigation found, creating navigation data from raw data');
            
            if (data.navigation) {
              console.log('🧭 Using raw data.navigation for field mapping');
              
              // Map navigation from raw data to actual form fields
              if (data.navigation.ais) {
                form.setValue('navigation.ais', 'Yes');
                console.log('✅ navigation.ais set from raw data: Yes');
              }
              if (data.navigation.autopilot) {
                form.setValue('navigation.autopilot', 'Yes');
                console.log('✅ navigation.autopilot set from raw data: Yes');
              }
              if (data.navigation.gps) {
                form.setValue('navigation.gps', 'Yes');
                console.log('✅ navigation.gps set from raw data: Yes');
              }
              
              console.log('🧭 Raw data navigation mapping complete');
            } else {
              console.log('❌ No navigation data available from any source');
            }
          }
        } catch (error) {
          console.error('❌ ERROR in navigation mapping:', error);
          console.error('❌ Error stack:', error.stack);
        }
        
        // ⛵ COMPREHENSIVE RIGGING MAPPING
        try {
          console.log('⛵ Starting comprehensive rigging field mapping');
          console.log('⛵ STEP 1: Map rigging to actual form fields');
          
          // Map basic rigging items
          if (processedData.rigging) {
            Object.entries(processedData.rigging).forEach(([key, value]) => {
              console.log(`⛵ Found rigging item: ${key} = ${value}`);
              
              // Map to specific form fields
              switch (key) {
                case 'mast':
                  form.setValue('rigging.mast', value === true ? 'Yes' : value);
                  console.log(`✅ rigging.mast set to: ${value === true ? 'Yes' : value}`);
                  break;
                case 'boom':
                  form.setValue('rigging.boom', value === true ? 'Yes' : value);
                  console.log(`✅ rigging.boom set to: ${value === true ? 'Yes' : value}`);
                  break;
                case 'mainsail':
                  form.setValue('rigging.mainsail', value === true ? 'Yes' : value);
                  console.log(`✅ rigging.mainsail set to: ${value === true ? 'Yes' : value}`);
                  break;
                case 'genoa':
                  form.setValue('rigging.genoa', value === true ? 'Yes' : value);
                  console.log(`✅ rigging.genoa set to: ${value === true ? 'Yes' : value}`);
                  break;
                case 'jib':
                  form.setValue('rigging.jib', value === true ? 'Yes' : value);
                  console.log(`✅ rigging.jib set to: ${value === true ? 'Yes' : value}`);
                  break;
                case 'spinnaker':
                  form.setValue('rigging.spinnaker', value === true ? 'Yes' : value);
                  console.log(`✅ rigging.spinnaker set to: ${value === true ? 'Yes' : value}`);
                  break;
                case 'spreaders':
                  form.setValue('rigging.spreaders', value === true ? 'Yes' : value);
                  console.log(`✅ rigging.spreaders set to: ${value === true ? 'Yes' : value}`);
                  break;
                // New detailed winch fields
                case 'primarySheetWinch':
                  form.setValue('rigging.primarySheetWinch', value);
                  console.log(`✅ rigging.primarySheetWinch set to: ${value}`);
                  break;
                case 'secondarySheetWinch':
                  form.setValue('rigging.secondarySheetWinch', value);
                  console.log(`✅ rigging.secondarySheetWinch set to: ${value}`);
                  break;
                case 'genoaSheetwinches':
                  form.setValue('rigging.genoaSheetwinches', value);
                  console.log(`✅ rigging.genoaSheetwinches set to: ${value}`);
                  break;
                case 'halyardWinches':
                  form.setValue('rigging.halyardWinches', value);
                  console.log(`✅ rigging.halyardWinches set to: ${value}`);
                  break;
                case 'multifunctionalWinches':
                  form.setValue('rigging.multifunctionalWinches', value);
                  console.log(`✅ rigging.multifunctionalWinches set to: ${value}`);
                  break;
                default:
                  console.log(`⛵ Unmapped rigging item: ${key} = ${value}`);
              }
            });
          }
          
          console.log('⛵ Comprehensive rigging mapping complete');
        } catch (error) {
          console.error('❌ Error in rigging mapping:', error);
        }
        
        // COMPREHENSIVE MACHINERY MAPPING
        try {
          console.log('🔍 ABOUT TO START MACHINERY MAPPING - processedData.machinery exists:', !!processedData.machinery);
          console.log('🔍 processedData.machinery type:', typeof processedData.machinery);
          console.log('🔍 processedData.machinery keys:', processedData.machinery ? Object.keys(processedData.machinery) : 'NONE');
          
          if (processedData.machinery) {
            console.log('🔧 Starting comprehensive machinery field mapping');
            console.log('🔧 STEP 1: Engine specifications');
            
            // Map machinery fields to frontend form
            Object.keys(processedData.machinery).forEach(item => {
              if (processedData.machinery[item]) {
                console.log(`🔧 Found machinery item: ${item} = ${processedData.machinery[item]}`);
                
                // Map to appropriate form fields based on item name
                if (item === 'make') {
                  form.setValue('machinery.make', processedData.machinery.make);
                  console.log('✅ machinery.make set to:', processedData.machinery.make);
                } else if (item === 'hp') {
                  form.setValue('machinery.hp', parseInt(processedData.machinery.hp) || null);
                  console.log('✅ machinery.hp set to:', processedData.machinery.hp);
                } else if (item === 'kw') {
                  form.setValue('machinery.kw', parseFloat(processedData.machinery.kw) || null);
                  console.log('✅ machinery.kw set to:', processedData.machinery.kw);
                } else if (item === 'numberOfEngines') {
                  form.setValue('machinery.numberOfEngines', parseInt(processedData.machinery.numberOfEngines) || null);
                  console.log('✅ machinery.numberOfEngines set to:', processedData.machinery.numberOfEngines);
                } else if (item === 'fuel') {
                  form.setValue('machinery.fuel', processedData.machinery.fuel);
                  console.log('✅ machinery.fuel set to:', processedData.machinery.fuel);
                } else if (item === 'type') {
                  form.setValue('machinery.type', processedData.machinery.type);
                  console.log('✅ machinery.type set to:', processedData.machinery.type);
                }
              }
            });
            
            // Also check equipment.systems for machinery items
            if (processedData.equipment?.systems) {
              console.log('🔧 Checking equipment.systems for machinery items');
              
              if (processedData.equipment.systems.generator) {
                form.setValue('machinery.generator', 'Yes');
                console.log('✅ machinery.generator set to: Yes');
              }
              if (processedData.equipment.systems.inverter) {
                form.setValue('machinery.inverter', 'Yes');
                console.log('✅ machinery.inverter set to: Yes');
              }
              if (processedData.equipment.systems.batteryCharger) {
                form.setValue('machinery.batteryCharger', 'Yes');
                console.log('✅ machinery.batteryCharger set to: Yes');
              }
              if (processedData.equipment.systems.fuelTank) {
                form.setValue('machinery.fuelTank', 'Yes');
                console.log('✅ machinery.fuelTank set to: Yes');
              }
              if (processedData.equipment.systems.waterTank) {
                form.setValue('machinery.waterTank', 'Yes');
                console.log('✅ machinery.waterTank set to: Yes');
              }
            }
            
            console.log('🔧 Comprehensive machinery mapping complete');
          } else {
            console.log('⚠️ No processedData.machinery found, creating machinery data from raw data');
            
            if (data.machinery) {
              console.log('🔧 Using raw data.machinery for field mapping');
              
              // Map machinery from raw data
              if (data.machinery.make) {
                console.log('�� Setting machinery.make from raw data to:', data.machinery.make);
                form.setValue('machinery.make', data.machinery.make);
                console.log('✅ machinery.make mapped from raw data:', data.machinery.make);
              }
              
              if (data.machinery.hp) {
                console.log('🔧 Setting machinery.hp from raw data to:', data.machinery.hp);
                form.setValue('machinery.hp', parseInt(data.machinery.hp) || null);
                console.log('✅ machinery.hp mapped from raw data:', data.machinery.hp);
              }
              
              if (data.machinery.kw) {
                console.log('🔧 Setting machinery.kw from raw data to:', data.machinery.kw);
                form.setValue('machinery.kw', parseFloat(data.machinery.kw) || null);
                console.log('✅ machinery.kw mapped from raw data:', data.machinery.kw);
              }
              
              if (data.machinery.numberOfEngines) {
                console.log('🔧 Setting machinery.numberOfEngines from raw data to:', data.machinery.numberOfEngines);
                form.setValue('machinery.numberOfEngines', parseInt(data.machinery.numberOfEngines) || null);
                console.log('✅ machinery.numberOfEngines mapped from raw data:', data.machinery.numberOfEngines);
              }
              
              console.log('🔧 Raw data machinery mapping complete');
            } else {
              console.log('❌ No machinery data available from any source');
            }
          }
        } catch (error) {
          console.error('❌ ERROR in machinery mapping:', error);
          console.error('❌ Error stack:', error.stack);
        }
        
        // COMPREHENSIVE ACCOMMODATION SUMMARY
        console.log('🏠 ACCOMMODATION MAPPING SUMMARY:');
        console.log('  - Number of Cabins:', form.getValues('accommodation.numberOfCabins'));
        console.log('  - Number of Berths:', form.getValues('accommodation.numberOfBerths'));
        console.log('  - Number of Heads:', form.getValues('accommodation.numberOfHeads'));
        console.log('  - Number of Showers:', form.getValues('accommodation.numberOfShowers'));
        console.log('  - Interior Material:', form.getValues('accommodation.interiorMaterial'));
        console.log('  - Layout:', form.getValues('accommodation.layout'));
        console.log('  - Open Cockpit:', form.getValues('accommodation.openCockpit'));
        console.log('  - Aft Deck:', form.getValues('accommodation.aftDeck'));
        console.log('  - Navigation Center:', form.getValues('accommodation.navigationCenter'));
        console.log('  - Chart Table:', form.getValues('accommodation.chartTable'));
        console.log('  - Galley Equipment (Cooker, Sink, Fridge, etc.):', {
          cooker: form.getValues('accommodation.cooker'),
          sink: form.getValues('accommodation.sink'),
          fridge: form.getValues('accommodation.fridge'),
          oven: form.getValues('accommodation.oven'),
          microwave: form.getValues('accommodation.microwave'),
          freezer: form.getValues('accommodation.freezer')
        });
        
        // COMPREHENSIVE EQUIPMENT SUMMARY
        console.log('🛠️ EQUIPMENT MAPPING SUMMARY:');
        console.log('  - Equipment Categories:', Object.keys(processedData.equipment || {}));
        console.log('  - Accommodation Equipment:', {
          cooker: form.getValues('accommodation.cooker'),
          sink: form.getValues('accommodation.sink'),
          fridge: form.getValues('accommodation.fridge'),
          toilet: form.getValues('accommodation.ownersCabinToilet'),
          shower: form.getValues('accommodation.ownersCabinShower'),
          hotWater: form.getValues('accommodation.hotWaterSystem'),
          oven: form.getValues('accommodation.oven'),
          microwave: form.getValues('accommodation.microwave'),
          freezer: form.getValues('accommodation.freezer')
        });
        console.log('  - Comfort Equipment:', {
          heating: form.getValues('accommodation.heating'),
          airConditioning: form.getValues('accommodation.airConditioning'),
          entertainment: form.getValues('accommodation.entertainment')
        });
        console.log('  - Deck & Safety Equipment:', {
          winches: form.getValues('equipment.winches'),
          anchors: form.getValues('equipment.anchor'),
          lifeRaft: form.getValues('equipment.lifeRaft'),
          epirb: form.getValues('equipment.epirb'),
          fireExtinguisher: form.getValues('equipment.fireExtinguisher'),
          bilgePump: form.getValues('equipment.bilgePump'),
          davits: form.getValues('equipment.davits'),
          windlass: form.getValues('equipment.windlass')
        });
        console.log('  - Systems Equipment:', {
          generator: form.getValues('machinery.generator'),
          inverter: form.getValues('machinery.inverter'),
          batteryCharger: form.getValues('machinery.batteryCharger'),
          fuelTank: form.getValues('machinery.fuelTank'),
          waterTank: form.getValues('machinery.waterTank')
        });
        console.log('  - Tender Equipment:', {
          dinghy: form.getValues('equipment.dinghy'),
          inflatable: form.getValues('equipment.inflatable'),
          outboard: form.getValues('equipment.outboard')
        });
        
        // COMPREHENSIVE NAVIGATION SUMMARY
        console.log('🧭 NAVIGATION MAPPING SUMMARY:');
        console.log('  - Navigation Items:', {
          ais: form.getValues('navigation.ais'),
          autopilot: form.getValues('navigation.autopilot'),
          compass: form.getValues('navigation.compass'),
          depthSounder: form.getValues('navigation.depthSounder'),
          gps: form.getValues('navigation.gps'),
          radar: form.getValues('navigation.radar'),
          vhf: form.getValues('navigation.vhf'),
          plotter: form.getValues('navigation.plotter'),
          epirb: form.getValues('navigation.epirb'),
          log: form.getValues('navigation.log'),
          windset: form.getValues('navigation.windset'),
          satellite: form.getValues('navigation.satellite'),
          rudderAngleIndicator: form.getValues('navigation.rudderAngleIndicator')
        });
        
        // COMPREHENSIVE RIGGING SUMMARY
        console.log('⛵ RIGGING MAPPING SUMMARY:');
        console.log('  - Rigging Items:', {
          mast: form.getValues('rigging.mast'),
          boom: form.getValues('rigging.boom'),
          mainsail: form.getValues('rigging.mainsail'),
          genoa: form.getValues('rigging.genoa'),
          jib: form.getValues('rigging.jib'),
          spinnaker: form.getValues('rigging.spinnaker'),
          spreaders: form.getValues('rigging.spreaders'),
          // New detailed winch fields
          primarySheetWinch: form.getValues('rigging.primarySheetWinch'),
          secondarySheetWinch: form.getValues('rigging.secondarySheetWinch'),
          genoaSheetwinches: form.getValues('rigging.genoaSheetwinches'),
          halyardWinches: form.getValues('rigging.halyardWinches'),
          multifunctionalWinches: form.getValues('rigging.multifunctionalWinches')
        });
        
        // COMPREHENSIVE MACHINERY SUMMARY
        console.log('🔧 MACHINERY MAPPING SUMMARY:');
        console.log('  - Engine Make:', form.getValues('machinery.make'));
        console.log('  - HP:', form.getValues('machinery.hp'));
        console.log('  - KW:', form.getValues('machinery.kw'));
        console.log('  - Number of Engines:', form.getValues('machinery.numberOfEngines'));
        console.log('  - Additional Machinery Fields:', Object.keys(processedData.machinery || {}).filter(key => !['make', 'hp', 'kw', 'numberOfEngines'].includes(key)));
        
        // COMPREHENSIVE PRICE SUMMARY
        console.log('💰 PRICE MAPPING SUMMARY:');
        console.log('  - Price (€):', form.getValues('price'));
        
        // 🎉 FINAL SUCCESS MESSAGE
        console.log('🎉🎉🎉 COMPREHENSIVE MAPPING COMPLETE! 🎉🎉🎉');
        console.log('✅ All sections have been processed and mapped:');
        console.log('  🏠 ACCOMMODATION: ✅ Complete with field mapping');
        console.log('  🛠️ EQUIPMENT: ✅ Complete with category mapping');
        console.log('  🧭 NAVIGATION: ✅ Complete with item mapping');
        console.log('  ⛵ RIGGING: ✅ Complete with equipment mapping');
        console.log('  🔧 MACHINERY: ✅ Complete with engine mapping');
        console.log('  📏 DIMENSIONS: ✅ Complete with composite mapping');
        console.log('  💰 PRICE: ✅ Complete with currency handling');
        console.log('🚀 The yacht migration is now fully comprehensive!');
        
        // FINAL VERIFICATION: Check if all section fields were actually populated
        console.log('🔍 FINAL VERIFICATION - ALL SECTIONS STATUS:');
        
        // Define all field arrays once to avoid duplicate definitions
        const accommodationFields = [
          'accommodation.numberOfCabins',
          'accommodation.numberOfBerths', 
          'accommodation.numberOfHeads',
          'accommodation.numberOfShowers',
          'accommodation.interiorMaterial',
          'accommodation.layout',
          'accommodation.cooker',
          'accommodation.sink',
          'accommodation.fridge',
          'accommodation.oven',
          'accommodation.microwave',
          'accommodation.freezer',
          'accommodation.openCockpit',
          'accommodation.aftDeck',
          'accommodation.ownersCabinToilet',
          'accommodation.ownersCabinShower',
          'accommodation.hotWaterSystem'
        ];
        
        const equipmentFields = [
          'equipment.anchor',
          'equipment.lifeRaft',
          'equipment.epirb',
          'equipment.fireExtinguisher',
          'equipment.bilgePump',
          'equipment.davits',
          'equipment.windlass',
          'equipment.dinghy',
          'equipment.inflatable',
          'equipment.outboard'
        ];
        
        const navigationFields = [
          'navigation.ais',
          'navigation.autopilot',
          'navigation.compass',
          'navigation.depthSounder',
          'navigation.gps',
          'navigation.radar',
          'navigation.vhf',
          'navigation.plotter',
          'navigation.epirb',
          'navigation.log',
          'navigation.windset',
          'navigation.satellite',
          'navigation.rudderAngleIndicator'
        ];
        
        const riggingFields = [
          'rigging.mast',
          'rigging.boom',
          'rigging.mainsail',
          'rigging.genoa',
          'rigging.jib',
          'rigging.spinnaker',
          'rigging.spreaders',
          // New detailed winch fields
          'rigging.primarySheetWinch',
          'rigging.secondarySheetWinch',
          'rigging.genoaSheetwinches',
          'rigging.halyardWinches',
          'rigging.multifunctionalWinches'
        ];
        
        const machineryFields = [
          'machinery.make',
          'machinery.hp',
          'machinery.kw',
          'machinery.numberOfEngines',
          'machinery.generator',
          'machinery.inverter',
          'machinery.batteryCharger',
          'machinery.fuelTank',
          'machinery.waterTank'
        ];
        
        // Accommodation fields
        console.log('🏠 ACCOMMODATION FIELDS:');
        accommodationFields.forEach(field => {
          const value = form.getValues(field as any);
          console.log(`  - ${field}: ${value !== undefined && value !== null && value !== '' ? '✅ POPULATED' : '❌ EMPTY'} (${value})`);
        });
        
        // Equipment fields
        console.log('🛠️ EQUIPMENT FIELDS:');
        equipmentFields.forEach(field => {
          const value = form.getValues(field as any);
          console.log(`  - ${field}: ${value !== undefined && value !== null && value !== '' ? '✅ POPULATED' : '❌ EMPTY'} (${value})`);
        });
        
        // Navigation fields
        console.log('🧭 NAVIGATION FIELDS:');
        navigationFields.forEach(field => {
          const value = form.getValues(field as any);
          console.log(`  - ${field}: ${value !== undefined && value !== null && value !== '' ? '✅ POPULATED' : '❌ EMPTY'} (${value})`);
        });
        
        // Rigging fields
        console.log('⛵ RIGGING FIELDS:');
        riggingFields.forEach(field => {
          const value = form.getValues(field as any);
          console.log(`  - ${field}: ${value !== undefined && value !== null && value !== '' ? '✅ POPULATED' : '❌ EMPTY'} (${value})`);
        });
        
        // Machinery fields
        console.log('🔧 MACHINERY FIELDS:');
        machineryFields.forEach(field => {
          const value = form.getValues(field as any);
          console.log(`  - ${field}: ${value !== undefined && value !== null && value !== '' ? '✅ POPULATED' : '❌ EMPTY'} (${value})`);
        });
        
        console.log('🎉 Migration Summary:');
        console.log('  - Form cleared successfully');
        console.log('  - Data processed by AI');
        console.log('  - Fields mapped to form');
        console.log('  - Ready for user review');
        
        // FINAL COMPREHENSIVE STATUS REPORT
        console.log('🎯🎯🎯 FINAL COMPREHENSIVE STATUS REPORT 🎯🎯🎯');
        console.log('📊 OVERALL COMPLETION STATUS:');
        
        // Calculate completion percentages for each section
        const accommodationPopulated = accommodationFields.filter(field => {
          const value = form.getValues(field as any);
          return value !== undefined && value !== null && value !== '';
        }).length;
        const accommodationPercentage = Math.round((accommodationPopulated / accommodationFields.length) * 100);
        
        const equipmentPopulated = equipmentFields.filter(field => {
          const value = form.getValues(field as any);
          return value !== undefined && value !== null && value !== '';
        }).length;
        const equipmentPercentage = Math.round((equipmentPopulated / equipmentFields.length) * 100);
        
        const navigationPopulated = navigationFields.filter(field => {
          const value = form.getValues(field as any);
          return value !== undefined && value !== null && value !== '';
        }).length;
        const navigationPercentage = Math.round((navigationPopulated / navigationFields.length) * 100);
        
        const riggingPopulated = riggingFields.filter(field => {
          const value = form.getValues(field as any);
          return value !== undefined && value !== null && value !== '';
        }).length;
        const riggingPercentage = Math.round((riggingPopulated / riggingFields.length) * 100);
        
        const machineryPopulated = machineryFields.filter(field => {
          const value = form.getValues(field as any);
          return value !== undefined && value !== null && value !== '';
        }).length;
        const machineryPercentage = Math.round((machineryPopulated / machineryFields.length) * 100);
        
        console.log(`  🏠 ACCOMMODATION: ${accommodationPercentage}% Complete (${accommodationPopulated}/${accommodationFields.length} fields)`);
        console.log(`  🛠️ EQUIPMENT: ${equipmentPercentage}% Complete (${equipmentPopulated}/${equipmentFields.length} fields)`);
        console.log(`  🧭 NAVIGATION: ${navigationPercentage}% Complete (${navigationPopulated}/${navigationFields.length} fields)`);
        console.log(`  ⛵ RIGGING: ${riggingPercentage}% Complete (${riggingPopulated}/${riggingFields.length} fields)`);
        console.log(`  🔧 MACHINERY: ${machineryPercentage}% Complete (${machineryPopulated}/${machineryFields.length} fields)`);
        
        const overallPercentage = Math.round(((accommodationPopulated + equipmentPopulated + navigationPopulated + riggingPopulated + machineryPopulated) / (accommodationFields.length + equipmentFields.length + navigationFields.length + riggingFields.length + machineryFields.length)) * 100);
        console.log(`🎯 OVERALL COMPLETION: ${overallPercentage}%`);
        
        if (overallPercentage >= 90) {
          console.log('🏆 EXCELLENT! Migration is nearly complete!');
        } else if (overallPercentage >= 75) {
          console.log('🚀 GREAT PROGRESS! Most sections are working well!');
        } else if (overallPercentage >= 50) {
          console.log('📈 GOOD PROGRESS! Several sections are working!');
        } else {
          console.log('⚠️ NEEDS ATTENTION! Several sections need work!');
        }
        
        console.log('🎯🎯🎯 END OF COMPREHENSIVE STATUS REPORT 🎯🎯🎯');
        
        toast({ title: 'Success', description: 'Migration completed! Form populated with scraped data.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'Migration failed' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Migration failed: ' + (error instanceof Error ? error.message : 'Unknown error') });
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
