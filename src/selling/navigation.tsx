
'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '@/components/sell-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function Navigation() {
  const form = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation</CardTitle>
        <CardDescription>Details about the yacht's navigation equipment.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="navigation.compass" render={({ field }) => (<FormItem><FormLabel>Compass</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.depthSounder" render={({ field }) => (<FormItem><FormLabel>Depth Sounder</FormLabel><FormControl><Input placeholder="e.g., B&G" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.log" render={({ field }) => (<FormItem><FormLabel>Log</FormLabel><FormControl><Input placeholder="e.g., B&G" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.windset" render={({ field }) => (<FormItem><FormLabel>Windset</FormLabel><FormControl><Input placeholder="e.g., B&G" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.vhf" render={({ field }) => (<FormItem><FormLabel>VHF</FormLabel><FormControl><Input placeholder="e.g., Icom IC-M423G" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.autopilot" render={({ field }) => (<FormItem><FormLabel>Autopilot</FormLabel><FormControl><Input placeholder="e.g., B&G Hydro Pilot needs service" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.radar" render={({ field }) => (<FormItem><FormLabel>Radar</FormLabel><FormControl><Input placeholder="e.g., New 2018 | B&G 4G" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.gps" render={({ field }) => (<FormItem><FormLabel>GPS</FormLabel><FormControl><Input placeholder="e.g., Furuno GP32 GPS" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.plotter" render={({ field }) => (<FormItem><FormLabel>Plotter</FormLabel><FormControl><Input placeholder="e.g., B&G 12\'\' Zeus Touch" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.navtex" render={({ field }) => (<FormItem><FormLabel>Navtex</FormLabel><FormControl><Input placeholder="e.g., ISC NAV6" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.aisTransceiver" render={({ field }) => (<FormItem><FormLabel>AIS Transceiver</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="navigation.navigationLights" render={({ field }) => (<FormItem><FormLabel>Navigation Lights</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          <FormField
            control={form.control}
            name="navigation.extraInfo"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Extra Info</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., New 2019 | Iridium GO satellite receiver..."
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
