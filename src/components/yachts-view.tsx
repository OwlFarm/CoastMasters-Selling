'use client';

import * as React from 'react';
import { useActionState } from 'react';
import type { Yacht } from '@/lib/types';
import { YachtListings } from '@/components/yacht-listings';
import { YachtFilters } from '@/components/yacht-filters';
import { Button } from '@/components/ui/button';
import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { handleFilteredSearch, FilteredSearchState } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';

type YachtsViewProps = {
  initialYachts: Yacht[];
};

export function YachtsView({ initialYachts }: YachtsViewProps) {
  const initialState: FilteredSearchState = {};
  const [state, formAction] = useActionState(handleFilteredSearch, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [isFiltering, setIsFiltering] = React.useState(false);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleFormChange = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsFiltering(true);

    timeoutRef.current = setTimeout(() => {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        formAction(formData);
      }
    }, 750);
  };
  
  React.useEffect(() => {
    setIsFiltering(false);
  }, [state]);


  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Search Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <main className="flex-1">
      <form ref={formRef} action={formAction} onChange={handleFormChange}>
          <div className="container mx-auto px-4 py-8 md:py-12">
              <div className="text-left mb-8">
                  <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                      Find Your Yacht
                  </h1>
                  <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
                      Use our detailed filters and AI-powered search to discover the perfect vessel. Your results will update automatically as you refine your search.
                  </p>
              </div>
              
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                  <aside className="lg:col-span-1">
                    <div className="sticky top-20 space-y-6">
                      <YachtFilters />
                       <div className="flex flex-col gap-2">
                        <Button size="lg" variant="outline" type="reset">Clear Filters</Button>
                      </div>
                    </div>
                  </aside>
                  <div className="lg:col-span-3">
                      <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              {state?.result ? `Showing AI recommendations` : `Showing ${initialYachts.length} featured results`}
                            </p>
                            {isFiltering && <LoaderCircle className="h-4 w-4 animate-spin" />}
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

                      {state?.result ? (
                        <div className="space-y-4">
                          {!state.result.hasExactResults && state.result.explanation && (
                            <Alert>
                              <TriangleAlert className="h-4 w-4" />
                              <AlertTitle>Could not find exact matches</AlertTitle>
                              <AlertDescription>
                                {state.result.explanation}
                              </AlertDescription>
                            </Alert>
                          )}
                          {state.result.yachtRecommendations ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md border bg-card p-6 text-card-foreground shadow-sm">
                              {state.result.yachtRecommendations}
                            </div>
                          ) : (
                             <div className="text-center py-16 border rounded-lg bg-card">
                                <p className="font-semibold">No Recommendations Found</p>
                                <p className="text-muted-foreground mt-2">Try adjusting your filters for a broader search.</p>
                             </div>
                          )}
                        </div>
                      ) : (
                        <YachtListings yachts={initialYachts} />
                      )}
                  </div>
              </div>
          </div>
      </form>
    </main>
  );
}
