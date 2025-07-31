
'use client';

import * as React from 'react';
import type { Yacht } from '@/lib/types';
import { YachtListings } from '@/components/yacht-listings';
import { YachtFilters } from '@/components/yacht-filters';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { SheetFooter } from '@/components/ui/sheet';


type YachtsViewProps = {
  initialYachts: Yacht[];
};

export function YachtsView({ initialYachts }: YachtsViewProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [yachts, setYachts] = React.useState(initialYachts);

  const message = `Showing ${yachts.length} results.`;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="container mx-auto px-4 py-8 md:py-12">
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <SidebarTrigger asChild>
                    <Button
                        variant="default"
                        className="h-12 w-full text-base bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                        Search & Filter
                    </Button>
                </SidebarTrigger>
              </div>

              <div className="flex items-center gap-2 justify-start md:justify-center">
                <p className="text-sm text-muted-foreground">
                  {message}
                </p>
              </div>

              <div className="flex items-center gap-2 justify-start md:justify-end">
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <Sidebar>
                <SidebarHeader>
                    <h2 className="text-lg font-semibold text-foreground">Search</h2>
                    <p className="text-sm text-muted-foreground">
                        Apply filters to find the perfect yacht.
                    </p>
                </SidebarHeader>
                <SidebarContent>
                    <form ref={formRef} className="p-4 pt-0">
                        <YachtFilters />
                    </form>
                </SidebarContent>
                <SheetFooter className="p-4 pt-2 bg-card border-t">
                     <Button size="lg" type="submit" className="w-full">Search</Button>
                </SheetFooter>
              </Sidebar>

              <SidebarInset className="lg:col-span-3 group-data-[state=expanded]/sidebar-wrapper:lg:col-span-2">
                <YachtListings yachts={yachts} />
              </SidebarInset>
            </div>
        </div>
    </SidebarProvider>
  );
}
