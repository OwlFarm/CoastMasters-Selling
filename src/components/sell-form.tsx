'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, Ship, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { boatTypes, makes, locationsByRegion, conditions, fuelTypes, hullMaterials, featureOptions, usageStyles } from '@/lib/data';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  boatType: z.string({ required_error: 'Please select a boat type.' }),
  condition: z.string({ required_error: 'Please select the condition.' }),
  location: z.string({ required_error: 'Please select a location.' }),
  fuelType: z.string({ required_error: 'Please select a fuel type.' }),
  hullMaterial: z.string({ required_error: 'Please select a hull material.' }),
  make: z.string({ required_error: 'Please select a builder.' }),
  model: z.string().min(2, { message: 'Model must be at least 2 characters.' }),
  year: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year')
  ),
  length: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Must be a positive number')),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Must be a positive number')),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  features: z.array(z.string()).optional(),
  usageStyles: z.array(z.string()).optional(),
  images: z.array(z.any()).min(5, { message: 'At least 5 high-quality images are required.' }).max(10, { message: 'You can upload a maximum of 10 images.' }),
});

export function SellForm() {
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const [lengthUnit, setLengthUnit] = React.useState<'ft' | 'm'>('ft');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            make: undefined,
            model: '',
            year: new Date().getFullYear(),
            length: undefined,
            price: undefined,
            description: '',
            features: [],
            images: [],
            boatType: undefined,
            usageStyles: [],
            condition: undefined,
            location: undefined,
            fuelType: undefined,
            hullMaterial: undefined,
        },
    });
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Form Submitted:', { ...values, images: imagePreviews, lengthUnit });
        // In a real app, you would upload images and submit form data to a server.
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Yacht Photos</CardTitle>
                        <CardDescription>Upload a minimum of 5 and up to 10 high-quality images. The first image will be the main one.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex w-full items-center justify-center">
                                            <label htmlFor="dropzone-file" className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card hover:bg-muted">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (Min 5, max 10 images)</p>
                                                </div>
                                                <Input
                                                  id="dropzone-file"
                                                  type="file"
                                                  className="hidden"
                                                  multiple
                                                  accept="image/*"
                                                  onChange={(e) => {
                                                    if (e.target.files) {
                                                      const newFiles = Array.from(e.target.files);
                                                      const currentFiles = field.value || [];
                                                      const combinedFiles = [...currentFiles, ...newFiles];
                                                      const limitedFiles = combinedFiles.slice(0, 10);
                                                      
                                                      field.onChange(limitedFiles);

                                                      const previews = limitedFiles.map(file => {
                                                        if (typeof file === 'string') return file;
                                                        if (file instanceof File) {
                                                          return URL.createObjectURL(file);
                                                        }
                                                        return '';
                                                      }).filter(p => p);
                                                      setImagePreviews(previews);
                                                    }
                                                  }}
                                                />
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                                            {imagePreviews.map((src, index) => (
                                                <div key={index} className="relative aspect-video">
                                                    <Image src={src} alt={`Preview ${index + 1}`} fill className="rounded-md object-cover" />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full"
                                                        onClick={() => {
                                                            const updatedFiles = field.value.filter((_: any, i: number) => i !== index);
                                                            field.onChange(updatedFiles);

                                                            const updatedPreviews = imagePreviews.filter((_: any, i: number) => i !== index);
                                                            setImagePreviews(updatedPreviews);
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Yacht Details</CardTitle>
                        <CardDescription>Provide the essential details about your yacht.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField control={form.control} name="boatType" render={({ field }) => (
                            <FormItem className="space-y-3"><FormLabel>Boat Type</FormLabel><FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                                    {boatTypes.map((type) => (<FormItem key={type.id} className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value={type.id} /></FormControl>
                                        <FormLabel className="font-normal">{type.label}</FormLabel>
                                    </FormItem>))}
                                </RadioGroup>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="condition" render={({ field }) => (
                            <FormItem className="space-y-3"><FormLabel>Condition</FormLabel><FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                                    {conditions.map((c) => (<FormItem key={c.id} className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value={c.id} /></FormControl>
                                        <FormLabel className="font-normal">{c.label}</FormLabel>
                                    </FormItem>))}
                                </RadioGroup>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="usageStyles" render={() => (
                            <FormItem className="space-y-3 md:col-span-2">
                                <FormLabel>Usage Styles</FormLabel>
                                <FormControl>
                                    <div className="flex flex-row items-center flex-wrap gap-x-4 gap-y-2">
                                        {usageStyles.map((item) => (
                                            <FormField key={item.id} control={form.control} name="usageStyles" render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                                const currentValue = field.value || [];
                                                                return checked
                                                                    ? field.onChange([...currentValue, item.id])
                                                                    : field.onChange(currentValue.filter((value) => value !== item.id));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                                </FormItem>
                                            )} />
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="make" render={({ field }) => (
                            <FormItem><FormLabel>Builder</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a builder" /></SelectTrigger></FormControl>
                                    <SelectContent>{makes.map(make => <SelectItem key={make.id} value={make.id}>{make.label}</SelectItem>)}</SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="model" render={({ field }) => (
                            <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., Oceanis 46.1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="year" render={({ field }) => (
                            <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2022" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="length" render={({ field }) => (
                           <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Length ({lengthUnit})</FormLabel>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Ft</span>
                                        <Switch
                                            checked={lengthUnit === 'm'}
                                            onCheckedChange={(checked) => setLengthUnit(checked ? 'm' : 'ft')}
                                            id="length-unit-switch-form"
                                        />
                                        <span className="text-muted-foreground">M</span>
                                    </div>
                                </div>
                                <FormControl><Input type="number" placeholder={lengthUnit === 'ft' ? "e.g., 46" : "e.g., 14"} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem className="md:col-span-2"><FormLabel>Location</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {locationsByRegion.map((region) => (
                                            <SelectGroup key={region.region}>
                                                <SelectLabel>{region.region}</SelectLabel>
                                                {region.locations.map(loc => <SelectItem key={loc.id} value={loc.id}>{loc.label}</SelectItem>)}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem className="md:col-span-2"><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="fuelType" render={({ field }) => (
                            <FormItem className="space-y-3"><FormLabel>Fuel Type</FormLabel><FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                                    {fuelTypes.map((type) => (<FormItem key={type.id} className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value={type.id} /></FormControl>
                                        <FormLabel className="font-normal">{type.label}</FormLabel>
                                    </FormItem>))}
                                </RadioGroup>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="hullMaterial" render={({ field }) => (
                            <FormItem className="space-y-3"><FormLabel>Hull Material</FormLabel><FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                                    {hullMaterials.map((mat) => (<FormItem key={mat.id} className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value={mat.id} /></FormControl>
                                        <FormLabel className="font-normal">{mat.label}</FormLabel>
                                    </FormItem>))}
                                </RadioGroup>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                        <CardDescription>Write a compelling description that highlights your yacht's best features.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormControl><Textarea placeholder="Describe your yacht's condition, history, and unique features..." className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Features & Equipment</CardTitle>
                        <CardDescription>Select all features and equipment included with your yacht.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField control={form.control} name="features" render={() => (
                            <FormItem className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {featureOptions.map((item) => (
                                    <FormField key={item.id} control={form.control} name="features" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        const currentValue = field.value || [];
                                                        return checked
                                                            ? field.onChange([...currentValue, item.id])
                                                            : field.onChange(currentValue.filter((value) => value !== item.id));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                        </FormItem>
                                    )} />
                                ))}
                            </FormItem>
                        )} />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Ship className="mr-2 h-5 w-5" />
                        List My Yacht
                    </Button>
                </div>
            </form>
        </Form>
    );
}
