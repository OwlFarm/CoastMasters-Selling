
import type { Yacht } from '@/lib/types';
import { featuredYachts } from '@/lib/data';
import { searchYachts } from '@/services/piloterr-service';

export async function getFeaturedYachts(): Promise<Yacht[]> {
  try {
    // By default, let's fetch some popular sailboats to show on the homepage.
    const yachts = await searchYachts({ query: 'Beneteau' });
    
    // If the API returns no results for the default query, fall back to static data.
    if (yachts.length === 0) {
      console.log('Piloterr API returned no results for featured, using static data.');
      return featuredYachts;
    }
    
    return yachts;
  } catch (error) {
    console.error("Error fetching yachts from Piloterr API. Returning sample data as a fallback.", error);
    // In case of any error (e.g., config not set up), fall back to sample data.
    return featuredYachts;
  }
}
