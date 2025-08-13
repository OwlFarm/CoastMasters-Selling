
'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '@/components/sell-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function Equipment() {
  const form = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment</CardTitle>
        <CardDescription>Details about the yacht's equipment.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="equipment.fixedWindscreen" render={({ field }) => (<FormItem><FormLabel>Fixed Windscreen</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.cockpitTable" render={({ field }) => (<FormItem><FormLabel>Cockpit Table</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.bathingPlatform" render={({ field }) => (<FormItem><FormLabel>Bathing Platform</FormLabel><FormControl><Input placeholder="e.g., Custom made stainless steel and teak" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.boardingLadder" render={({ field }) => (<FormItem><FormLabel>Boarding Ladder</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.deckShower" render={({ field }) => (<FormItem><FormLabel>Deck Shower</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.anchor" render={({ field }) => (<FormItem><FormLabel>Anchor</FormLabel><FormControl><Input placeholder="e.g., 40 kg Rocna" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.anchorChain" render={({ field }) => (<FormItem><FormLabel>Anchor Chain</FormLabel><FormControl><Input placeholder="e.g., 80 mtr calibrated chain" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.anchor2" render={({ field }) => (<FormItem><FormLabel>Anchor 2</FormLabel><FormControl><Input placeholder="e.g., Spare Aluminium 34 kg CQR" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.windlass" render={({ field }) => (<FormItem><FormLabel>Windlass</FormLabel><FormControl><Input placeholder="e.g., electrical Lofrans Albatross 1500 W" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.deckWash" render={({ field }) => (<FormItem><FormLabel>Deck Wash</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.dinghy" render={({ field }) => (<FormItem><FormLabel>Dinghy</FormLabel><FormControl><Input placeholder="e.g., Avon 2.8 mtr." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.outboard" render={({ field }) => (<FormItem><FormLabel>Outboard</FormLabel><FormControl><Input placeholder="e.g., New 2022 | Mariner F4 4hp 4 stroke" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.davits" render={({ field }) => (<FormItem><FormLabel>Davits</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.seaRailing" render={({ field }) => (<FormItem><FormLabel>Sea Railing</FormLabel><FormControl><Input placeholder="e.g., wire" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.pushpit" render={({ field }) => (<FormItem><FormLabel>Pushpit</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.pulpit" render={({ field }) => (<FormItem><FormLabel>Pulpit</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.lifebuoy" render={({ field }) => (<FormItem><FormLabel>Lifebuoy</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.radarReflector" render={({ field }) => (<FormItem><FormLabel>Radar Reflector</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.fenders" render={({ field }) => (<FormItem><FormLabel>Fenders</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.mooringLines" render={({ field }) => (<FormItem><FormLabel>Mooring Lines</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.radio" render={({ field }) => (<FormItem><FormLabel>Radio</FormLabel><FormControl><Input placeholder="e.g., Sony" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.cockpitSpeakers" render={({ field }) => (<FormItem><FormLabel>Cockpit Speakers</FormLabel><FormControl><Input placeholder="e.g., 2x Sony xplod" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.speakersInSalon" render={({ field }) => (<FormItem><FormLabel>Speakers in Salon</FormLabel><FormControl><Input placeholder="e.g., 2x Sony xplod" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="equipment.fireExtinguisher" render={({ field }) => (<FormItem><FormLabel>Fire Extinguisher</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
        </div>
      </CardContent>
    </Card>
  );
}
