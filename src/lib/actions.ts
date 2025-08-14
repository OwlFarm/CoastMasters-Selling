
'use server';

import { smartSearch, type SmartSearchInput, type SmartSearchOutput } from '@/ai/flows/smart-search';
import { generateListingDetails, type GenerateListingDetailsOutput } from '@/ai/flows/generate-listing-details';
import { polishDescription } from '@/ai/flows/polish-description';
import { GenerateListingDetailsInputSchema } from '@/ai/schemas/listing-details-schemas';
import { z } from 'zod';
import type { Yacht } from '@/lib/types';
import { sellFormSchema } from '@/lib/schemas';
import { db, storage } from './firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const searchSchema = z.object({
  query: z.string().min(3, 'Search query must be at least 3 characters long.'),
});

type SearchState = {
  result?: string;
  error?: string;
};

export async function handleSmartSearch(
  prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const validatedFields = searchSchema.safeParse({
    query: formData.get('query'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.query?.join(', '),
    };
  }
  
  const input: SmartSearchInput = { query: validatedFields.data.query };

  try {
    const output = await smartSearch(input);
    return { result: output.yachtRecommendations };
  } catch (error) {
    console.error('Smart search failed:', error);
    return { error: 'An error occurred during the search. Please try again.' };
  }
}

// AI Action for the Sell Form
type GenerateDetailsState = {
  result?: GenerateListingDetailsOutput;
  error?: string;
}

export async function handleGenerateListingDetails(
  prevState: GenerateDetailsState,
  formData: FormData
): Promise<GenerateDetailsState> {
   const validatedFields = GenerateListingDetailsInputSchema.safeParse({
    make: formData.get('make'),
    model: formData.get('model'),
    year: Number(formData.get('year')),
    length: Number(formData.get('length')),
    condition: formData.get('condition'),
    boatType: formData.get('boatType'),
    features: formData.getAll('features').map(String),
  });

  if (!validatedFields.success) {
    return {
      error: 'Missing required details to generate listing. Please fill out the yacht details first.',
    };
  }

  try {
    const output = await generateListingDetails(validatedFields.data);
    return { result: output };
  } catch (error) {
    console.error('Generate details failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: errorMessage };
  }
}

// AI Action to Polish Description
const polishDescriptionSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
});

type PolishDescriptionState = {
  result?: string;
  error?: string;
};

export async function handlePolishDescription(
  prevState: PolishDescriptionState,
  formData: FormData
): Promise<PolishDescriptionState> {
  const validatedFields = polishDescriptionSchema.safeParse({
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Description is too short to polish.',
    };
  }

  try {
    const polishedText = await polishDescription(validatedFields.data);
    return { result: polishedText };
  } catch (error) {
    console.error('Polish description failed:', error);
    return { error: 'An error occurred while polishing the description. Please try again.' };
  }
}


// Form Submission Action
type CreateListingState = {
    errors?: z.ZodError<any>['formErrors']['fieldErrors'];
    message?: string;
    newListingId?: string;
};

async function uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

export async function handleCreateListing(
    prevState: CreateListingState,
    formData: FormData
): Promise<CreateListingState> {
    const json_data = JSON.parse(formData.get('json_data') as string);
    const validatedFields = sellFormSchema.safeParse(json_data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed. Please check your inputs.',
        };
    }

    try {
        const docRef = await addDoc(collection(db, 'listings'), {
            ...validatedFields.data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            imageUrl: '',
            images: [],
        });
        console.log('Document written with ID: ', docRef.id);

        let heroImageUrl = '';
        const galleryImageUrls: string[] = [];
        
        const heroImageFile = formData.get('heroImage') as File | null;
        if (heroImageFile) {
            console.log('Uploading hero image...');
            const path = `listings/${docRef.id}/${heroImageFile.name}`;
            heroImageUrl = await uploadFile(heroImageFile, path);
            console.log('Hero image uploaded to:', heroImageUrl);
        }

        const galleryImageFiles = formData.getAll('galleryImages') as File[];
        if (galleryImageFiles.length > 0) {
            console.log(`Uploading ${galleryImageFiles.length} gallery images...`);
            for (const file of galleryImageFiles) {
                const path = `listings/${docRef.id}/${file.name}`;
                const url = await uploadFile(file, path);
                galleryImageUrls.push(url);
            }
            console.log('Gallery images uploaded.');
        }

        // Update the document with image URLs
        await updateDoc(doc(db, 'listings', docRef.id), {
            imageUrl: heroImageUrl,
            images: galleryImageUrls,
            updatedAt: serverTimestamp(),
        });
        console.log('Document updated with image URLs.');


        revalidatePath('/yachts');
        return { message: 'success', newListingId: docRef.id };
    } catch (e) {
        console.error('Error adding document: ', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            message: `Failed to create listing: ${errorMessage}`,
        };
    }
}
