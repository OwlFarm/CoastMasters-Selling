
import type { Yacht } from '@/lib/types';
import { featuredYachts } from '@/lib/data';

export async function getFeaturedYachts(): Promise<Yacht[]> {
  // Piloterr service has been removed, returning static data.
  return featuredYachts;
}
