import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { YachtListings } from '@/components/yacht-listings';
import { featuredYachts } from '@/lib/data';
import { YachtFilters } from '@/components/yacht-filters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function YachtsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="text-left mb-8">
                <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                    Sail boats for sale
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
                    Sailboats are available in a variety of models and rigs, including racing boats, sloops, schooners, catamarans, trimarans, sailing cruisers, and others.
                </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <aside className="lg:col-span-1">
                    <YachtFilters />
                </aside>
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-muted-foreground">Showing {featuredYachts.length} results</p>
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-medium">Sort By:</span>
                           <Select defaultValue="recommended">
                             <SelectTrigger className="w-[180px]">
                               <SelectValue placeholder="Sort by" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="recommended">Recommended</SelectItem>
                               <SelectItem value="price-asc">Price: Low to High</SelectItem>
                               <SelectItem value="price-desc">Price: High to Low</SelectItem>
                               <SelectItem value="year-desc">Year: Newest</SelectItem>
                               <SelectItem value="year-asc">Year: Oldest</SelectItem>
                             </SelectContent>
                           </Select>
                        </div>
                    </div>
                    <YachtListings yachts={featuredYachts} />
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
