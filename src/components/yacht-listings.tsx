import type { Yacht } from '@/lib/types';
import { YachtCard } from './yacht-card';

type YachtListingsProps = {
  yachts: Yacht[];
};

export function YachtListings({ yachts }: YachtListingsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {yachts.map((yacht) => (
        <YachtCard key={yacht.id} yacht={yacht} />
      ))}
    </div>
  );
}
