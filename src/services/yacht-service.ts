import { db } from '@/lib/firebase';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { Yacht } from '@/lib/types';
import { featuredYachts } from '@/lib/data';

// Helper function to convert a Firestore document to our Yacht type
function toYacht(doc: QueryDocumentSnapshot<DocumentData>): Yacht {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || 'Unnamed Yacht',
    price: data.price || 0,
    year: data.year || new Date().getFullYear(),
    length: data.length || 0,
    location: data.location || 'Unknown',
    imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
    imageHint: data.imageHint || 'yacht',
    images: data.images || [],
    make: data.make || 'Unknown',
    model: data.model || 'Unknown',
    listingType: data.listingType || 'Broker',
    boatType: data.boatType || 'Motor',
    condition: data.condition || 'Used',
    description: data.description || '',
    fuelType: data.fuelType || 'diesel',
    hullMaterial: data.hullMaterial || 'fiberglass',
    hullShape: data.hullShape || '',
    bowShape: data.bowShape || '',
    keelType: data.keelType || '',
    rudderType: data.rudderType || '',
    propellerType: data.propellerType || '',
    usageStyles: data.usageStyles || [],
    features: data.features || [],
    deck: data.deck || [],
    cabin: data.cabin || [],
    otherSpecifications: data.otherSpecifications || '',
  };
}

export async function getFeaturedYachts(): Promise<Yacht[]> {
  try {
    const yachtsCol = collection(db, 'yachts');
    const yachtSnapshot = await getDocs(yachtsCol);
    
    // If the database is empty, return the sample data so the page isn't blank.
    if (yachtSnapshot.empty) {
      console.log('Firestore `yachts` collection is empty, returning sample data.');
      return featuredYachts;
    }

    const yachtList = yachtSnapshot.docs.map(toYacht);
    return yachtList;
  } catch (error) {
    console.error("Error fetching yachts from Firestore. Returning sample data as a fallback.", error);
    // In case of any other error (e.g., config not set up), fall back to sample data.
    return featuredYachts;
  }
}
