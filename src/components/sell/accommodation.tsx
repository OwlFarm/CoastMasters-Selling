
'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '../sell-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '../ui/switch';

export function Accommodation({ form }: { form: ReturnType<typeof useFormContext<FormValues>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accommodation</CardTitle>
        <CardDescription>Describe the interior layout, cabins, galley, and heads.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['acc-general', 'acc-galley', 'acc-owners', 'acc-guest1']} className="w-full">
            <AccordionItem value="acc-general">
                <AccordionTrigger>General Layout</AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="accommodation.numberOfCabins" render={({ field }) => (<FormItem><FormLabel>Number of Cabins</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.numberOfBerths" render={({ field }) => (<FormItem><FormLabel>Number of Berths</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.interiorMaterial" render={({ field }) => (<FormItem><FormLabel>Interior Material</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.layout" render={({ field }) => (<FormItem><FormLabel>Layout</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.floor" render={({ field }) => (<FormItem><FormLabel>Floor</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.saloonHeadroom" render={({ field }) => (<FormItem><FormLabel>Saloon Headroom (m)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.heating" render={({ field }) => (<FormItem><FormLabel>Heating</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm col-span-1">
                            <div className="space-y-0.5"><FormLabel>Open Cockpit</FormLabel></div>
                            <FormField control={form.control} name="accommodation.openCockpit" render={({ field }) => (<FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm col-span-1">
                            <div className="space-y-0.5"><FormLabel>Aft Deck</FormLabel></div>
                            <FormField control={form.control} name="accommodation.aftDeck" render={({ field }) => (<FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm col-span-1">
                            <div className="space-y-0.5"><FormLabel>Navigation Center</FormLabel></div>
                            <FormField control={form.control} name="accommodation.navigationCenter" render={({ field }) => (<FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm col-span-1">
                            <div className="space-y-0.5"><FormLabel>Chart Table</FormLabel></div>
                            <FormField control={form.control} name="accommodation.chartTable" render={({ field }) => (<FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="acc-galley">
                <AccordionTrigger>Galley</AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="accommodation.countertop" render={({ field }) => (<FormItem><FormLabel>Countertop</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.sink" render={({ field }) => (<FormItem><FormLabel>Sink</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.cooker" render={({ field }) => (<FormItem><FormLabel>Cooker</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.oven" render={({ field }) => (<FormItem><FormLabel>Oven</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.microwave" render={({ field }) => (<FormItem><FormLabel>Microwave</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.fridge" render={({ field }) => (<FormItem><FormLabel>Fridge</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.freezer" render={({ field }) => (<FormItem><FormLabel>Freezer</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.hotWaterSystem" render={({ field }) => (<FormItem><FormLabel>Hot Water System</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.waterPressureSystem" render={({ field }) => (<FormItem><FormLabel>Water Pressure System</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="acc-owners">
                <AccordionTrigger>Owner's Cabin</AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="accommodation.ownersCabin" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., Double bed" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.ownersCabinBedLength" render={({ field }) => (<FormItem><FormLabel>Bed Length (m)</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.ownersCabinWardrobe" render={({ field }) => (<FormItem><FormLabel>Wardrobe</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.ownersCabinBathroom" render={({ field }) => (<FormItem><FormLabel>Bathroom</FormLabel><FormControl><Input placeholder="e.g., En suite" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.ownersCabinToilet" render={({ field }) => (<FormItem><FormLabel>Toilet</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.ownersCabinToiletSystem" render={({ field }) => (<FormItem><FormLabel>Toilet System</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.ownersCabinWashBasin" render={({ field }) => (<FormItem><FormLabel>Wash Basin</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.ownersCabinShower" render={({ field }) => (<FormItem><FormLabel>Shower</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="acc-guest1">
                <AccordionTrigger>Guest Cabin 1</AccordionTrigger>
                <AccordionContent className="pt-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="accommodation.guestCabin1" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., Twin bunk" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.guestCabin1BedLength" render={({ field }) => (<FormItem><FormLabel>Bed Length (m)</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.guestCabin1Wardrobe" render={({ field }) => (<FormItem><FormLabel>Wardrobe</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="acc-guest2">
                <AccordionTrigger>Guest Cabin 2</AccordionTrigger>
                <AccordionContent className="pt-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="accommodation.guestCabin2" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.guestCabin2BedLength" render={({ field }) => (<FormItem><FormLabel>Bed Length (m)</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.guestCabin2Wardrobe" render={({ field }) => (<FormItem><FormLabel>Wardrobe</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="acc-bathroom">
                <AccordionTrigger>Shared Bathroom / Laundry</AccordionTrigger>
                <AccordionContent className="pt-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="accommodation.sharedBathroom" render={({ field }) => (<FormItem><FormLabel>Bathroom</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.sharedToilet" render={({ field }) => (<FormItem><FormLabel>Toilet</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.sharedToiletSystem" render={({ field }) => (<FormItem><FormLabel>Toilet System</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.sharedWashBasin" render={({ field }) => (<FormItem><FormLabel>Wash Basin</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.sharedShower" render={({ field }) => (<FormItem><FormLabel>Shower</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="accommodation.washingMachine" render={({ field }) => (<FormItem><FormLabel>Washing Machine / Dryer</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
