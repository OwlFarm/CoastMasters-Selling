
'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '@/components/sell-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function Rigging() {
  const form = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rigging</CardTitle>
        <CardDescription>Details about the yacht's rigging and sails, based on the reference specs.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="rigging.rigging" render={({ field }) => (<FormItem><FormLabel>Rigging</FormLabel><FormControl><Input placeholder="e.g., sloop" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.standingRigging" render={({ field }) => (<FormItem><FormLabel>Standing Rigging</FormLabel><FormControl><Input placeholder="e.g., wire" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.brandMast" render={({ field }) => (<FormItem><FormLabel>Brand Mast</FormLabel><FormControl><Input placeholder="e.g., Seldén" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.materialMast" render={({ field }) => (<FormItem><FormLabel>Material Mast</FormLabel><FormControl><Input placeholder="e.g., aluminium" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.spreaders" render={({ field }) => (<FormItem><FormLabel>Spreaders</FormLabel><FormControl><Input placeholder="e.g., 3 sets" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.mainsail" render={({ field }) => (<FormItem><FormLabel>Mainsail</FormLabel><FormControl><Input placeholder="e.g., New 2023 De vries maritiem lemmer 55m2" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.stowayMast" render={({ field }) => (<FormItem><FormLabel>Stoway Mast</FormLabel><FormControl><Input placeholder="e.g., Seldén electric" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.cutterstay" render={({ field }) => (<FormItem><FormLabel>Cutterstay</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.jib" render={({ field }) => (<FormItem><FormLabel>Jib</FormLabel><FormControl><Input placeholder="e.g., Ullman sails" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.genoa" render={({ field }) => (<FormItem><FormLabel>Genoa</FormLabel><FormControl><Input placeholder="e.g., New 2023 De vries maritiem lemmer 77 m2" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.genoaFurler" render={({ field }) => (<FormItem><FormLabel>Genoa Furler</FormLabel><FormControl><Input placeholder="e.g., Furlex 400e Electric" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.cutterFurler" render={({ field }) => (<FormItem><FormLabel>Cutter Furler</FormLabel><FormControl><Input placeholder="e.g., Furlex" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.gennaker" render={({ field }) => (<FormItem><FormLabel>Gennaker</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.spinnaker" render={({ field }) => (<FormItem><FormLabel>Spinnaker</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.reefingSystem" render={({ field }) => (<FormItem><FormLabel>Reefing System</FormLabel><FormControl><Input placeholder="e.g., main in-mast furling" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.backstayAdjuster" render={({ field }) => (<FormItem><FormLabel>Backstay Adjuster</FormLabel><FormControl><Input placeholder="e.g., hydraulic | Navtec" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.primarySheetWinch" render={({ field }) => (<FormItem><FormLabel>Primary Sheet Winch</FormLabel><FormControl><Input placeholder="e.g., 2x Lewmar 43 self tailing" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.secondarySheetWinch" render={({ field }) => (<FormItem><FormLabel>Secondary Sheet Winch</FormLabel><FormControl><Input placeholder="e.g., Lewmar 46 self tailing" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.genoaSheetwinches" render={({ field }) => (<FormItem><FormLabel>Genoa Sheetwinches</FormLabel><FormControl><Input placeholder="e.g., 2x Lewmar 64 self tailing electric" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.halyardWinches" render={({ field }) => (<FormItem><FormLabel>Halyard Winches</FormLabel><FormControl><Input placeholder="e.g., 2x Lewmar 43 self tailing" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.multifunctionalWinches" render={({ field }) => (<FormItem><FormLabel>Multifunctional Winches</FormLabel><FormControl><Input placeholder="e.g., Lewmar 8 Pole hoist winch | Lewmar ocean electric 40" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="rigging.spiPole" render={({ field }) => (<FormItem><FormLabel>Spi-Pole</FormLabel><FormControl><Input placeholder="e.g., aluminium" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
        </div>
      </CardContent>
    </Card>
  );
}
