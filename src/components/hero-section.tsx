
'use client';

import * as React from 'react';
import Link from 'next/link';
import { YachtSearch } from '@/components/yacht-search';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { YachtFilters } from './yacht-filters';

export function HeroSection() {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <div className="relative">
                <section
                    className="w-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
                    data-ai-hint="ocean yacht"
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="container relative mx-auto px-4 text-center text-white">
                        <div className="flex flex-col items-center justify-center pt-24 pb-16 md:pt-32 md:pb-16">
                            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                Your Voyage Begins Here
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
                                Discover the world's most exclusive yachts. Use our AI-powered search to find the perfect vessel for your next adventure.
                            </p>
                            <div className="mt-8 w-full">
                                <YachtSearch />
                            </div>
                            <div className="mt-16 flex flex-col gap-4 sm:flex-row">
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="bg-accent px-10 text-lg text-accent-foreground hover:bg-accent/90 md:text-xl"
                                    >
                                        Buy a Boat
                                    </Button>
                                </CollapsibleTrigger>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="px-10 text-lg md:text-xl"
                                    asChild
                                >
                                    <Link href="/sell">Sell a Boat</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <CollapsibleContent className="w-full overflow-hidden bg-background pt-16 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="container mx-auto px-4 pb-16 md:pb-24">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="mb-10 text-center font-headline text-3xl font-bold tracking-tight md:text-4xl">
                            Refine Your Search
                        </h2>
                        <YachtFilters />
                         <div className="mt-8 flex justify-center gap-4">
                            <Button size="lg" variant="outline">Save Search</Button>
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Apply Filters</Button>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}
