

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
import { Upload, Ship, X, ArrowLeft, Sparkles, LoaderCircle, Eye, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMetadata, type Metadata } from '@/services/metadata-service';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { useActionState, useEffect, useCallback, useMemo } from 'react';
import { handleGenerateListingDetails, handlePolishDescription } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { ListingPreview } from './listing-preview';
import { Combobox } from './ui/combobox';
import { TextEditor } from './ui/text-editor';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoTooltip } from './homepage-yacht-filters';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Constants
const FORM_CONSTANTS = {
  MIN_GALLERY_IMAGES: 9,
  MAX_GALLERY_IMAGES: 49,
  MIN_DESCRIPTION_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 5000,
  MIN_TITLE_LENGTH: 5,
  MAX_SPECIFICATIONS_LENGTH: 500,
  MIN_YEAR: 1900,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
} as const;

// Utility functions
const createNumberPreprocessor = (optional = false, positive = false) => 
  z.preprocess(
    (a) => {
      if (a === '' || a === null || a === undefined) return optional ? undefined : 0;
      const num = typeof a === 'string' ? parseFloat(a) : Number(a);
      return isNaN(num) ? (optional ? undefined : 0) : num;
    },
    optional 
      ? (positive ? z.number().positive({ message: 'Must be a positive number' }).optional() : z.number().optional())
      : (positive ? z.number().positive({ message: 'Must be a positive number' }) : z.number())
  );

const createIntegerPreprocessor = (optional = false) =>
  z.preprocess(
    (a) => {
      if (a === '' || a === null || a === undefined) return optional ? undefined : 0;
      const num = typeof a === 'string' ? parseInt(a, 10) : Number(a);
      return isNaN(num) ? (optional ? undefined : 0) : num;
    },
    optional ? z.number().int().optional() : z.number().int()
  );

const validateFile = (file: File): string | null => {
  if (!file) return 'File is required';
  if (file.size > FORM_CONSTANTS.MAX_FILE_SIZE) return 'File size must be less than 10MB';
  if (!FORM_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'File must be JPEG, PNG, or WebP format';
  }
  return null;
};

// Optimized schema with better validation
const formSchema = z.object({
  title: z.string().min(FORM_CONSTANTS.MIN_TITLE_LENGTH, { 
    message: `Title must be at least ${FORM_CONSTANTS.MIN_TITLE_LENGTH} characters.` 
  }),
  listingType: z.string({ required_error: 'Please select a listing type.' }),
  boatType: z.string({ required_error: 'Please select a boat type.' }),
  condition: z.string({ required_error: 'Please select the condition.' }),
  location: z.string({ required_error: 'Please select a location.' }),
  fuelType: z.string({ required_error: 'Please select a fuel type.' }),
  hullMaterial: z.string({ required_error: 'Please select a hull material.' }),
  transomShape: z.string({ required_error: 'Please select a transom shape.' }),
  bowShape: z.string({ required_error: 'Please select a bow shape.' }),
  keelType: z.string().optional(),
  rudderType: z.string().optional(),
  propellerType: z.string().optional(),
  sailRigging: z.string().optional(),
  make: z.string({ required_error: 'Please select or enter a builder.' }),
  model: z.string().min(1, { message: 'Model is required.' }),
  year: createIntegerPreprocessor().refine(
    val => val >= FORM_CONSTANTS.MIN_YEAR && val <= new Date().getFullYear() + 1,
    'Invalid year'
  ),
  length: createNumberPreprocessor(false, true),
  price: createNumberPreprocessor(false, true),
  description: z.string()
    .min(FORM_CONSTANTS.MIN_DESCRIPTION_LENGTH, { 
      message: `Description must be at least ${FORM_CONSTANTS.MIN_DESCRIPTION_LENGTH} characters.` 
    })
    .max(FORM_CONSTANTS.MAX_DESCRIPTION_LENGTH, { 
      message: `Description cannot exceed ${FORM_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters.` 
    }),
  features: z.array(z.string()).optional(),
  divisions: z.array(z.string()).optional(),
  deck: z.array(z.string()).optional(),
  cabin: z.array(z.string()).optional(),
  accommodation: z.object({
    cabins: z.array(z.string()).optional(),
    saloon: z.array(z.string()).optional(),
    galley: z.array(z.string()).optional(),
    heads: z.array(z.string()).optional(),
    numberOfCabins: createIntegerPreprocessor(true),
    numberOfBerths: createIntegerPreprocessor(true),
    interiorMaterial: z.string().optional(),
    layout: z.string().optional(),
    floor: z.string().optional(),
    openCockpit: z.boolean().optional(),
    aftDeck: z.boolean().optional(),
    saloonHeadroom: createNumberPreprocessor(true),
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
    numberOfEngines: createIntegerPreprocessor(true),
    make: z.string().optional(),
    type: z.string().optional(),
    hp: createNumberPreprocessor(true),
    kw: createNumberPreprocessor(true),
    fuel: z.string().optional(),
    yearInstalled: createIntegerPreprocessor(true),
    yearOfOverhaul: z.string().optional(),
    maxSpeedKnots: createNumberPreprocessor(true),
    cruisingSpeedKnots: createNumberPreprocessor(true),
    consumptionLhr: createNumberPreprocessor(true),
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
  heroImage: z.any().refine((file) => {
    if (!file || !(file instanceof File)) return false;
    const error = validateFile(file);
    return error === null;
  }, "Please select a valid hero image (JPEG, PNG, or WebP, max 10MB)."),
  galleryImages: z.array(z.any())
    .min(FORM_CONSTANTS.MIN_GALLERY_IMAGES, { 
      message: `At least ${FORM_CONSTANTS.MIN_GALLERY_IMAGES} gallery images are required.` 
    })
    .max(FORM_CONSTANTS.MAX_GALLERY_IMAGES, { 
      message: `You can upload a maximum of ${FORM_CONSTANTS.MAX_GALLERY_IMAGES} images.` 
    })
    .refine((files) => {
      return files.every(file => {
        if (!(file instanceof File)) return false;
        return validateFile(file) === null;
      });
    }, "All gallery images must be valid (JPEG, PNG, or WebP, max 10MB each)."),
  otherSpecifications: z.string()
    .max(FORM_CONSTANTS.MAX_SPECIFICATIONS_LENGTH, { 
      message: `Cannot exceed ${FORM_CONSTANTS.MAX_SPECIFICATIONS_LENGTH} characters.`
    })
    .optional(),
  saDisp: createNumberPreprocessor(true),
  balDisp: createNumberPreprocessor(true),
  dispLen: createNumberPreprocessor(true),
  comfortRatio: createNumberPreprocessor(true),
  capsizeScreeningFormula: createNumberPreprocessor(true),
  sNum: createNumberPreprocessor(true),
  hullSpeed: createNumberPreprocessor(true),
  poundsPerInchImmersion: createNumberPreprocessor(true),
  loaM: createNumberPreprocessor(true),
  lwlM: createNumberPreprocessor(true),
  beamM: createNumberPreprocessor(true),
  draftM: createNumberPreprocessor(true),
  airDraftM: createNumberPreprocessor(true),
  headroomM: createNumberPreprocessor(true),
  country: z.string().optional(),
  designer: z.string().optional(),
  displacementT: createNumberPreprocessor(true),
  ballastTonnes: createNumberPreprocessor(true),
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
  fuelTankLitre: createNumberPreprocessor(true),
  levelIndicatorFuel: z.string().optional(),
  freshwaterTankLitre: createNumberPreprocessor(true),
  levelIndicatorFreshwater: z.string().optional(),
  wheelSteering: z.string().optional(),
  outsideHelmPosition: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

// Memoized step configuration
const STEPS = [
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
    ] as FieldName<FormValues>[]
  },
  { id: 'Step 2', name: 'Photos', fields: ['heroImage', 'galleryImages'] as FieldName<FormValues>[] },
] as const;

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Form error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Something went wrong with the form. Please refresh the page and try again.
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary>Error details</summary>
                <pre className="text-xs mt-1">{this.state.error?.stack}</pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Loading Skeleton Component
const FormSkeleton = React.memo(() => (
  <div className="space-y-8">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  </div>
));

FormSkeleton.displayName = 'FormSkeleton';

// Custom hook for image management
const useImageManager = () => {
  const [heroImagePreview, setHeroImagePreview] = React.useState<string | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = React.useState<string[]>([]);

  const createImagePreview = useCallback((file: File): string => {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error('Failed to create image preview:', error);
      return '';
    }
  }, []);

  const setHeroImage = useCallback((file: File | null) => {
    // Clean up previous preview
    if (heroImagePreview && heroImagePreview.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(heroImagePreview);
      } catch (error) {
        console.error('Failed to revoke hero image URL:', error);
      }
    }

    if (file) {
      const preview = createImagePreview(file);
      setHeroImagePreview(preview);
    } else {
      setHeroImagePreview(null);
    }
  }, [heroImagePreview, createImagePreview]);

  const setGalleryImages = useCallback((files: File[]) => {
    // Clean up previous previews
    galleryImagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Failed to revoke gallery image URL:', error);
        }
      }
    });

    const previews = files.map(file => createImagePreview(file)).filter(Boolean);
    setGalleryImagePreviews(previews);
  }, [galleryImagePreviews, createImagePreview]);

  const removeGalleryImage = useCallback((index: number, files: File[]) => {
    const urlToRevoke = galleryImagePreviews[index];
    if (urlToRevoke && urlToRevoke.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(urlToRevoke);
      } catch (error) {
        console.error('Failed to revoke gallery image URL:', error);
      }
    }

    const updatedPreviews = galleryImagePreviews.filter((_, i) => i !== index);
    setGalleryImagePreviews(updatedPreviews);
    
    return files.filter((_, i) => i !== index);
  }, [galleryImagePreviews]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (heroImagePreview && heroImagePreview.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(heroImagePreview);
        } catch (error) {
          console.error('Failed to revoke hero image URL on unmount:', error);
        }
      }
      
      galleryImagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Failed to revoke gallery image URL on unmount:', error);
          }
        }
      });
    };
  }, []);

  return {
    heroImagePreview,
    galleryImagePreviews,
    setHeroImage,
    setGalleryImages,
    removeGalleryImage
  };
};

// Custom hook for metadata with error handling
const useMetadata = () => {
  const [metadata, setMetadata] = React.useState<Metadata | null>(null);
  const [metadataLoading, setMetadataLoading] = React.useState(true);
  const [metadataError, setMetadataError] = React.useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchMetadata = async () => {
      try {
        setMetadataLoading(true);
        setMetadataError(null);
        const data = await getMetadata();
        
        if (mounted) {
          setMetadata(data);
        }
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
        if (mounted) {
          setMetadataError(
            error instanceof Error 
              ? error.message 
              : 'Failed to load form data. Please refresh the page.'
          );
        }
      } finally {
        if (mounted) {
          setMetadataLoading(false);
        }
      }
    };

    fetchMetadata();

    return () => {
      mounted = false;
    };
  }, []);

  const retryFetchMetadata = useCallback(() => {
    setMetadataError(null);
    setMetadataLoading(true);
    
    getMetadata()
      .then(setMetadata)
      .catch(error => {
        console.error('Retry failed:', error);
        setMetadataError('Failed to load form data. Please try again.');
      })
      .finally(() => setMetadataLoading(false));
  }, []);

  return { metadata, metadataLoading, metadataError, retryFetchMetadata };
};

// Main Form Component
export function SellForm() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isPreview, setIsPreview] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  
  const { metadata, metadataLoading, metadataError, retryFetchMetadata } = useMetadata();
  const { heroImagePreview, galleryImagePreviews, setHeroImage, setGalleryImages, removeGalleryImage } = useImageManager();

  const [aiState, aiFormAction, isAiPending] = useActionState(handleGenerateListingDetails, { 
    result: undefined, 
    error: undefined 
  });
  const [polishState, polishFormAction, isPolishPending] = useActionState(handlePolishDescription, { 
    result: undefined, 
    error: undefined 
  });

  // Memoized default values
  const defaultValues = useMemo<Partial<FormValues>>(() => ({
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
  }), []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  // AI effects with proper error handling
  useEffect(() => {
    if (aiState.error) {
      toast({
        variant: 'destructive',
        title: 'AI Generation Failed',
        description: aiState.error,
      });
    }
    
    if (aiState.result) {
      try {
        form.setValue('title', aiState.result.title, { shouldValidate: true });
        form.setValue('description', aiState.result.description, { shouldValidate: true });
        
        // Safely set optional fields
        if (aiState.result.detectedHullMaterial) {
          form.setValue('hullMaterial', aiState.result.detectedHullMaterial, { shouldValidate: true });
        }
        if (aiState.result.detectedTransomShape) {
          form.setValue('transomShape', aiState.result.detectedTransomShape, { shouldValidate: true });
        }
        if (aiState.result.detectedKeelType) {
          form.setValue('keelType', aiState.result.detectedKeelType, { shouldValidate: true });
        }
        if (aiState.result.detectedRudderType) {
          form.setValue('rudderType', aiState.result.detectedRudderType, { shouldValidate: true });
        }
        if (aiState.result.detectedPropellerType) {
          form.setValue('propellerType', aiState.result.detectedPropellerType, { shouldValidate: true });
        }
        if (aiState.result.detectedFuelType) {
          form.setValue('fuelType', aiState.result.detectedFuelType, { shouldValidate: true });
        }
        if (aiState.result.detectedDivisions) {
          form.setValue('divisions', aiState.result.detectedDivisions, { shouldValidate: true });
        }
        if (aiState.result.detectedFeatures) {
          form.setValue('features', aiState.result.detectedFeatures, { shouldValidate: true });
        }
        if (aiState.result.detectedDeck) {
          form.setValue('deck', aiState.result.detectedDeck, { shouldValidate: true });
        }
        if (aiState.result.detectedCabins) {
          form.setValue('accommodation.cabins', aiState.result.detectedCabins, { shouldValidate: true });
        }
        if (aiState.result.detectedSaloon) {
          form.setValue('accommodation.saloon', aiState.result.detectedSaloon, { shouldValidate: true });
        }
        if (aiState.result.detectedGalley) {
          form.setValue('accommodation.galley', aiState.result.detectedGalley, { shouldValidate: true });
        }
        if (aiState.result.detectedHeads) {
          form.setValue('accommodation.heads', aiState.result.detectedHeads, { shouldValidate: true });
        }
        
        toast({
          title: 'AI Magic Complete!',
          description: 'Your title and description have been generated, and we\'ve pre-selected some features for you.',
        });
      } catch (error) {
        console.error('Error applying AI results:', error);
        toast({
          variant: 'destructive',
          title: 'Error Applying AI Results',
          description: 'An error occurred while applying AI results. Please try again.',
        });
      }
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
        description: 'Your description has been enhanced by our AI assistant.',
      });
    }
  }, [polishState, form, toast]);


  const next = async () => {
    const fields = STEPS[currentStep].fields;
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((step) => step + 1);
    } else {
       // Final step, trigger preview
       setIsPreview(true);
    }
  };

  const prev = () => {
    if (isPreview) {
      setIsPreview(false);
      return;
    }
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    console.log(data);
    // Here you would typically send the data to your backend API
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Yacht Listed Successfully!',
        description: 'Your listing is now live. Redirecting you to the dashboard...',
      });
      // router.push('/dashboard/listings');
    }, 2000);
  };

  const handleGenerateClick = () => {
    const formData = new FormData();
    const data = form.getValues();
    
    // Check for required fields before calling AI
    if (!data.make || !data.model || !data.year || !data.length || !data.condition || !data.boatType) {
        toast({
            variant: 'destructive',
            title: 'Missing Details',
            description: 'Please fill in Make, Model, Year, Length, Condition, and Boat Type before using the AI generator.',
        });
        return;
    }
    
    formData.append('make', data.make);
    formData.append('model', data.model);
    formData.append('year', String(data.year));
    formData.append('length', String(data.length));
    formData.append('condition', data.condition);
    formData.append('boatType', data.boatType);
    (data.features || []).forEach(feature => formData.append('features', feature));
    
    aiFormAction(formData);
  };

  const handlePolishClick = () => {
    const formData = new FormData();
    const description = form.getValues('description');
    
    if (!description || description.length < FORM_CONSTANTS.MIN_DESCRIPTION_LENGTH) {
        toast({
            variant: 'destructive',
            title: 'Description Too Short',
            description: `Please write a description of at least ${FORM_CONSTANTS.MIN_DESCRIPTION_LENGTH} characters to use the AI polish feature.`,
        });
        return;
    }

    formData.append('description', description);
    polishFormAction(formData);
  };
  
  if (metadataLoading) {
    return <FormSkeleton />;
  }

  if (metadataError) {
    return (
        <Card className="mx-auto max-w-md text-center">
            <CardHeader>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-destructive">{metadataError}</p>
                <Button onClick={retryFetchMetadata}>Try Again</Button>
            </CardContent>
        </Card>
    );
  }

  // Fallback if metadata is somehow null after loading and no error
  if (!metadata) {
    return <div>Could not load form configuration. Please refresh the page.</div>;
  }

  return (
    <ErrorBoundary>
        <div>
            {isPreview ? (
                <div>
                    <div className="mb-8 flex justify-between items-center">
                        <Button variant="outline" onClick={prev}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Edit
                        </Button>
                         <h2 className="text-2xl font-bold">Listing Preview</h2>
                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                'Submit Listing'
                            )}
                        </Button>
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
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        
                        {/* Progress Bar and Navigation */}
                        <div className="space-y-4">
                            <Progress value={((currentStep + 1) / STEPS.length) * 100} />
                            <div className="flex justify-between items-center">
                                <Button
                                    type="button"
                                    onClick={prev}
                                    variant="ghost"
                                    disabled={currentStep === 0}
                                >
                                    <ArrowLeft className="mr-2" /> Go Back
                                </Button>
                                <div className="text-sm font-medium">
                                    Step {currentStep + 1} of {STEPS.length}: <span className="font-bold">{STEPS[currentStep].name}</span>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                {/* Step 1: General Information */}
                                {currentStep === 0 && (
                                    <div className="space-y-8">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Yacht Details</CardTitle>
                                                <CardDescription>Start with the basics of your yacht.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="listingType"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Listing Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select listing type" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {metadata.listingTypes.map(type => (
                                                                            <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="boatType"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Boat Type</FormLabel>
                                                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select boat type" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {metadata.boatTypes.map(type => (
                                                                            <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="condition"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Condition</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select condition" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {metadata.conditions.map(type => (
                                                                            <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="make"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Builder/Make</FormLabel>
                                                                <Combobox
                                                                    options={metadata.makes.map(make => ({ label: make.label, value: make.id }))}
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                    placeholder="Select or enter a builder"
                                                                    searchPlaceholder="Search builders..."
                                                                    notFoundText="No builder found."
                                                                />
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
                                                                    <Input placeholder="e.g., Oceanis 46.1" {...field} />
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
                                                                <FormLabel>Year</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" placeholder="YYYY" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="length"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Length (ft)</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" placeholder="Overall length in feet" {...field} />
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
                                                                <FormLabel>Price (USD)</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" placeholder="Asking price" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="location"
                                                        render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Location</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                <SelectValue placeholder="Select location" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {metadata.locationsByRegion.map((region) => (
                                                                <SelectGroup key={region.region}>
                                                                    <SelectLabel>{region.region}</SelectLabel>
                                                                    {region.locations.map((loc) => (
                                                                    <SelectItem key={loc.id} value={loc.id}>
                                                                        {loc.label}
                                                                    </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                                ))}
                                                            </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                         <Card>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle>Title & Description</CardTitle>
                                                        <CardDescription>
                                                            Craft a compelling narrative for your listing. Use our AI tools for a professional touch.
                                                        </CardDescription>
                                                    </div>
                                                    <Button type="button" onClick={handleGenerateClick} disabled={isAiPending}>
                                                        {isAiPending ? (
                                                            <LoaderCircle className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Sparkles className="mr-2" /> Generate with AI
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <FormField
                                                    control={form.control}
                                                    name="title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Listing Title</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="e.g., Immaculate 2022 Beneteau Oceanis 46.1 For Sale" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <FormLabel>Description</FormLabel>
                                                                <Button type="button" variant="outline" size="sm" onClick={handlePolishClick} disabled={isPolishPending}>
                                                                    {isPolishPending ? (
                                                                        <LoaderCircle className="animate-spin" />
                                                                    ) : (
                                                                        <>
                                                                            <Sparkles className="mr-2 h-3 w-3" /> Polish with AI
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                            <FormControl>
                                                                <TextEditor
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                    placeholder="Describe the yacht's history, features, condition, and recent upgrades..."
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                A detailed and engaging description helps attract more buyers.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                        
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Specifications & Features</CardTitle>
                                                <CardDescription>Provide the technical details and equipment of your yacht.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                     <FormField
                                                        control={form.control}
                                                        name="hullMaterial"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Hull Material</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        {metadata.hullMaterialOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="transomShape"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Transom Shape</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select shape" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        {metadata.transomShapeOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="bowShape"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Bow Shape</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select shape" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        {metadata.bowShapeOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                      <FormField
                                                        control={form.control}
                                                        name="keelType"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Keel Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        {metadata.keelTypeOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="rudderType"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Rudder Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        {metadata.rudderTypeOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                      <FormField
                                                        control={form.control}
                                                        name="propellerType"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Propeller Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        {metadata.propellerTypeOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="sailRigging"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Sail Rigging</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select rigging" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        {metadata.sailRiggingOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="fuelType"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Fuel Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select fuel type" /></SelectTrigger></FormControl>
                                                                    <SelectContent>
                                                                        {metadata.fuelTypes.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                 </div>

                                                <FormField
                                                    control={form.control}
                                                    name="otherSpecifications"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Other Key Specifications</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="List other important specifications, e.g., Engine: Yanmar 75hp, Water Capacity: 200L. Each on a new line."
                                                                    className="min-h-[120px]"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                             <FormDescription>This can be automatically populated using the "Generate with AI" feature.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="space-y-4">
                                                    <FormLabel>Features & Equipment</FormLabel>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        {metadata.featureOptions.map((item) => (
                                                            <FormField
                                                                key={item.id}
                                                                control={form.control}
                                                                name="features"
                                                                render={({ field }) => {
                                                                    return (
                                                                        <FormItem
                                                                            key={item.id}
                                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                                        >
                                                                            <FormControl>
                                                                                <Checkbox
                                                                                    checked={field.value?.includes(item.id)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        return checked
                                                                                            ? field.onChange([...(field.value || []), item.id])
                                                                                            : field.onChange(
                                                                                                field.value?.filter(
                                                                                                    (value) => value !== item.id
                                                                                                )
                                                                                            )
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="font-normal">
                                                                                {item.label}
                                                                            </FormLabel>
                                                                        </FormItem>
                                                                    )
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <FormLabel>Deck Features</FormLabel>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        {metadata.deckOptions.map((item) => (
                                                            <FormField
                                                                key={item.id}
                                                                control={form.control}
                                                                name="deck"
                                                                render={({ field }) => (
                                                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(item.id)}
                                                                                onCheckedChange={(checked) => (
                                                                                    checked
                                                                                    ? field.onChange([...(field.value || []), item.id])
                                                                                    : field.onChange(field.value?.filter(v => v !== item.id))
                                                                                )}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                 <div className="space-y-4">
                                                    <FormLabel>Accommodation Features</FormLabel>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        {metadata.cabinOptions.map((item) => (
                                                            <FormField
                                                                key={item.id}
                                                                control={form.control}
                                                                name="accommodation.cabins"
                                                                render={({ field }) => (
                                                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(item.id)}
                                                                                onCheckedChange={(checked) => (
                                                                                    checked
                                                                                    ? field.onChange([...(field.value || []), item.id])
                                                                                    : field.onChange(field.value?.filter(v => v !== item.id))
                                                                                )}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* Step 2: Photos */}
                                {currentStep === 1 && (
                                    <div className="space-y-8">
                                         <Card>
                                            <CardHeader>
                                                <CardTitle>Upload Photos</CardTitle>
                                                <CardDescription>
                                                    High-quality photos are crucial for attracting buyers. Upload one hero image and at least {FORM_CONSTANTS.MIN_GALLERY_IMAGES} additional photos.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-8">
                                                <FormField
                                                    control={form.control}
                                                    name="heroImage"
                                                    render={({ field: { onChange, value, ...rest } }) => (
                                                        <FormItem>
                                                            <FormLabel>Hero Image</FormLabel>
                                                            <FormDescription>This is the main image for your listing.</FormDescription>
                                                            <FormControl>
                                                                <div className="relative flex items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                                                                    <Input
                                                                        type="file"
                                                                        className="absolute w-full h-full opacity-0 cursor-pointer"
                                                                        accept={FORM_CONSTANTS.ALLOWED_IMAGE_TYPES.join(',')}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                onChange(file);
                                                                                setHeroImage(file);
                                                                            }
                                                                        }}
                                                                        {...rest}
                                                                    />
                                                                    {heroImagePreview ? (
                                                                        <>
                                                                            <Image src={heroImagePreview} alt="Hero preview" fill className="object-cover rounded-lg" />
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="icon"
                                                                                className="absolute top-2 right-2 z-10"
                                                                                onClick={() => {
                                                                                    onChange(null);
                                                                                    setHeroImage(null);
                                                                                }}
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </>
                                                                    ) : (
                                                                        <div className="text-center">
                                                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                                            <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                                                                            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
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
                                                    render={({ field: { onChange, value, ...rest } }) => (
                                                        <FormItem>
                                                            <FormLabel>Gallery Images</FormLabel>
                                                             <FormDescription>Upload between {FORM_CONSTANTS.MIN_GALLERY_IMAGES} and {FORM_CONSTANTS.MAX_GALLERY_IMAGES} additional photos.</FormDescription>
                                                            <FormControl>
                                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                                    {galleryImagePreviews.map((src, index) => (
                                                                        <div key={index} className="relative group">
                                                                            <Image src={src} alt={`Gallery preview ${index + 1}`} width={200} height={150} className="object-cover rounded-lg aspect-[4/3]" />
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="icon"
                                                                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                                                onClick={() => {
                                                                                    const updatedFiles = (value || []).filter((_: any, i: number) => i !== index);
                                                                                    onChange(updatedFiles);
                                                                                    removeGalleryImage(index, updatedFiles);
                                                                                }}
                                                                            >
                                                                                <X className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                    <div className="relative flex items-center justify-center w-full aspect-[4/3] border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                                                                        <Input
                                                                            type="file"
                                                                            multiple
                                                                            className="absolute w-full h-full opacity-0 cursor-pointer"
                                                                            accept={FORM_CONSTANTS.ALLOWED_IMAGE_TYPES.join(',')}
                                                                            onChange={(e) => {
                                                                                const files = Array.from(e.target.files || []);
                                                                                const currentFiles = value || [];
                                                                                const newFiles = [...currentFiles, ...files];
                                                                                onChange(newFiles);
                                                                                setGalleryImages(newFiles);
                                                                            }}
                                                                            {...rest}
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
                                    </div>
                                )}

                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-end">
                            <Button type="button" size="lg" onClick={next}>
                                {currentStep === STEPS.length - 1 ? 'Preview Listing' : 'Next Step'}
                                <Ship className="ml-2" />
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    </ErrorBoundary>
  );
}
