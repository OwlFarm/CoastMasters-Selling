import { db } from '@/lib/firebase';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { Yacht } from '@/lib/types';

// Helper function to convert a Firestore document to our Yacht type
function toYacht(doc: QueryDocumentSnapshot<DocumentData>): Yacht {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    type: data.type,
    listingType: data.listingType,
    price: data.price,
    year: data.year,
    length: data.length,
    location: data.location,
    imageUrl: data.imageUrl,
    imageHint: data.imageHint,
  } as Yacht;
}

export async function getFeaturedYachts(): Promise<Yacht[]> {
  try {
    const yachtsCol = collection(db, 'yachts');
    const yachtSnapshot = await getDocs(yachtsCol);
    const yachtList = yachtSnapshot.docs.map(toYacht);
    return yachtList;
  } catch (error) {
    console.error("Error fetching yachts from Firestore:", error);
    // In case of an error, you might want to return an empty array 
    // or handle it in another way, like showing a friendly error message to the user.
    return [];
  }
}
