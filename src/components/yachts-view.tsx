
'use client';

import * as React from 'react';
import { useActionState } from 'react';
import type { Yacht } from '@/lib/types';
import { YachtListings } from '@/components/yacht-listings';
import { YachtFilters } from '@/components/yacht-filters';
import { Button } from '@/components/ui/button';
import { LoaderCircle, SearchX } from 'lucide-react';
import { handleFilteredSearch, FilteredSearchState } from '@/lib/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

type YachtsViewProps = {
  initialYachts: Yacht[];
};

export function YachtsView({ initialYachts }: YachtsViewProps) {
  const initialState: FilteredSearchState = { result: { yachts: initialYachts, message: `Showing ${initialYachts.length} featured results.` } };
  const [state, formAction, isPending] = useActionState(handleFilteredSearch, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [isDebouncing, setIsDebouncing] = React.useState(false);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleFormChange = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsDebouncing(true);

    timeoutRef.current = setTimeout(() => {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        formAction(formData);
      }
      setIsDebouncing(false);
    }, 750);
  };
  
  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Search Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const yachtsToShow = state?.result?.yachts ?? initialYachts;
  const message = state?.result?.message ?? `Showing ${initialYachts.length} featured results.`;

  return (
    <>
      <form ref={formRef} onChange={handleFormChange}>
          <div className="container mx-auto px-4 py-8 md:py-12">
              <div className="text-left mb-8">
                  <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                      Find Your Yacht
                  </h1>
                  <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
                      Use our detailed filters to discover the perfect vessel. Your results will update automatically as you refine your search.
                  </p>
              </div>
              
              <div className="mb-8">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="default"
                      className="h-16 px-10 text-xl bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Search
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[clamp(500px,50vw,600px)] flex flex-col p-0">
                    <SheetHeader className="p-6 pb-4">
                      <SheetTitle>Search</SheetTitle>
                      <SheetDescription>
                        Apply filters to find the perfect yacht. Results will update automatically.
                      </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="flex-1">
                      <div className="px-6 pb-6">
                        <YachtFilters />
                      </div>
                    </ScrollArea>
                    <SheetFooter className="p-6 pt-4 bg-background border-t">
                      <Button size="lg" variant="outline" type="reset" className="w-full">Clear All Filters</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {message}
                    </p>
                    {(isPending || isDebouncing) && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  </div>
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

              {yachtsToShow.length > 0 ? (
                <YachtListings yachts={yachtsToShow} />
              ) : (
                  <div className="text-center py-16 border rounded-lg bg-card">
                    <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="font-semibold mt-4">No Yachts Found</p>
                    <p className="text-muted-foreground mt-2">Try adjusting your filters for a broader search.</p>
                  </div>
              )}
          </div>
      </form>
    </>
  );
}
