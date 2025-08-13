
'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '@/components/sell-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function IndicationRatios() {
  const form = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indication Ratios</CardTitle>
        <CardDescription>Performance and comfort ratios for the yacht.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField control={form.control} name="saDisp" render={({ field }) => (<FormItem><FormLabel>S.A. / Displ.</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="balDisp" render={({ field }) => (<FormItem><FormLabel>Bal. / Displ.</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="dispLen" render={({ field }) => (<FormItem><FormLabel>Disp: / Len:</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="comfortRatio" render={({ field }) => (<FormItem><FormLabel>Comfort Ratio</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="capsizeScreeningFormula" render={({ field }) => (<FormItem><FormLabel>Capsize Screening Formula</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="sNum" render={({ field }) => (<FormItem><FormLabel>S#</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="hullSpeed" render={({ field }) => (<FormItem><FormLabel>Hull Speed (kn)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="poundsPerInchImmersion" render={({ field }) => (<FormItem><FormLabel>Pounds/Inch Immersion</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
        </div>
      </CardContent>
    </Card>
  );
}
