
'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '@/components/sell-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function Machinery() {
    const form = useFormContext<FormValues>();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Machinery</CardTitle>
                <CardDescription>Details about the yacht's machinery and electrical systems.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="machinery.numberOfEngines" render={({ field }) => (<FormItem><FormLabel>No. of Engines</FormLabel><FormControl><Input type="number" placeholder="e.g., 1" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.make" render={({ field }) => (<FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="e.g., Volvo Penta" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., TMD41A" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.hp" render={({ field }) => (<FormItem><FormLabel>HP</FormLabel><FormControl><Input type="number" placeholder="e.g., 143" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.kw" render={({ field }) => (<FormItem><FormLabel>kW</FormLabel><FormControl><Input type="number" placeholder="e.g., 105.25" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.fuel" render={({ field }) => (<FormItem><FormLabel>Fuel</FormLabel><FormControl><Input placeholder="e.g., diesel" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.yearInstalled" render={({ field }) => (<FormItem><FormLabel>Year Installed</FormLabel><FormControl><Input type="number" placeholder="e.g., 1991" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.yearOfOverhaul" render={({ field }) => (<FormItem><FormLabel>Year of Overhaul</FormLabel><FormControl><Input placeholder="e.g., Major cooling system service 2018" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.maxSpeedKnots" render={({ field }) => (<FormItem><FormLabel>Max Speed (kn)</FormLabel><FormControl><Input type="number" placeholder="e.g., 9" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.cruisingSpeedKnots" render={({ field }) => (<FormItem><FormLabel>Cruising Speed (kn)</FormLabel><FormControl><Input type="number" placeholder="e.g., 7.5" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.consumptionLhr" render={({ field }) => (<FormItem><FormLabel>Consumption (L/hr)</FormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.engineCoolingSystem" render={({ field }) => (<FormItem><FormLabel>Engine Cooling System</FormLabel><FormControl><Input placeholder="e.g., seawater" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.drive" render={({ field }) => (<FormItem><FormLabel>Drive</FormLabel><FormControl><Input placeholder="e.g., shaft" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.shaftSeal" render={({ field }) => (<FormItem><FormLabel>Shaft Seal</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.engineControls" render={({ field }) => (<FormItem><FormLabel>Engine Controls</FormLabel><FormControl><Input placeholder="e.g., bowden cable" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.gearbox" render={({ field }) => (<FormItem><FormLabel>Gearbox</FormLabel><FormControl><Input placeholder="e.g., mechanical" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.bowthruster" render={({ field }) => (<FormItem><FormLabel>Bowthruster</FormLabel><FormControl><Input placeholder="e.g., electric | Sleipner 7 hp" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.propellerType" render={({ field }) => (<FormItem><FormLabel>Propeller Type</FormLabel><FormControl><Input placeholder="e.g., fixed | blades" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.manualBilgePump" render={({ field }) => (<FormItem><FormLabel>Manual Bilge Pump</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.electricBilgePump" render={({ field }) => (<FormItem><FormLabel>Electric Bilge Pump</FormLabel><FormControl><Input placeholder="e.g., yes" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.electricalInstallation" render={({ field }) => (<FormItem><FormLabel>Electrical Installation</FormLabel><FormControl><Input placeholder="e.g., 12-24-230 V" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.generator" render={({ field }) => (<FormItem><FormLabel>Generator</FormLabel><FormControl><Input placeholder="e.g., wet exhaust Westerbeke 8 kW" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.batteries" render={({ field }) => (<FormItem><FormLabel>Batteries</FormLabel><FormControl><Input placeholder="e.g., 5 x Greenline 12V - 105Ah deep cycle" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.startBattery" render={({ field }) => (<FormItem><FormLabel>Start Battery</FormLabel><FormControl><Input placeholder="e.g., 1 x 105Ah" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.serviceBattery" render={({ field }) => (<FormItem><FormLabel>Service Battery</FormLabel><FormControl><Input placeholder="e.g., 4 x 105Ah for 24V - 210 Ah" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.batteryMonitor" render={({ field }) => (<FormItem><FormLabel>Battery Monitor</FormLabel><FormControl><Input placeholder="e.g., Odelco DCC 2000" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.batteryCharger" render={({ field }) => (<FormItem><FormLabel>Battery Charger</FormLabel><FormControl><Input placeholder="e.g., Victron Centaur 24v 60Ah" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.solarPanel" render={({ field }) => (<FormItem><FormLabel>Solar Panel</FormLabel><FormControl><Input placeholder="e.g., Solbian 2 x SR166 2023" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.shorepower" render={({ field }) => (<FormItem><FormLabel>Shorepower</FormLabel><FormControl><Input placeholder="e.g., with cable" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.watermaker" render={({ field }) => (<FormItem><FormLabel>Watermaker</FormLabel><FormControl><Input placeholder="e.g., Not connected" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="machinery.extraInfo" render={({ field }) => (<FormItem className="md:col-span-3"><FormLabel>Extra Info</FormLabel><FormControl><Textarea placeholder="e.g., Major maintenance service 2022" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </CardContent>
        </Card>
    );
}
