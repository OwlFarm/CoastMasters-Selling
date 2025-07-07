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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, Ship, X } from 'lucide-react';

const formSchema = z.object({
  make: z.string().min(2, { message: 'Make must be at least 2 characters.' }),
  model: z.string().min(2, { message: 'Model must be at least 2 characters.' }),
  year: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year')
  ),
  length: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Must be a positive number')),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Must be a positive number')),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  features: z.array(z.string()).optional(),
  images: z.array(z.any()).min(5, { message: 'At least 5 high-quality images are required.' }).max(10, { message: 'You can upload a maximum of 10 images.' }),
});

const featureOptions = [
    { id: 'gps', label: 'GPS Navigation' },
    { id: 'autopilot', label: 'Autopilot System' },
    { id: 'radar', label: 'Radar' },
    { id: 'airConditioning', label: 'Air Conditioning' },
    { id: 'heating', label: 'Heating' },
    { id: 'generator', label: 'Generator' },
    { id: 'bowThruster', label: 'Bow Thruster' },
    { id: 'sternThruster', label: 'Stern Thruster' },
    { id: 'waterMaker', label: 'Water Maker' },
    { id: 'inverter', label: 'Inverter' },
    { id: 'solarPanels', label: 'Solar Panels' },
    { id: 'dinghy', label: 'Dinghy Included' },
];

export function SellForm() {
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            make: '',
            model: '',
            year: new Date().getFullYear(),
            length: undefined,
            price: undefined,
            description: '',
            features: [],
            images: [],
        },
    });
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Form Submitted:', { ...values, images: imagePreviews });
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
                        <FormField control={form.control} name="make" render={({ field }) => (
                            <FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="e.g., Beneteau" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="model" render={({ field }) => (
                            <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., Oceanis 46.1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="year" render={({ field }) => (
                            <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2022" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="length" render={({ field }) => (
                            <FormItem><FormLabel>Length (ft)</FormLabel><FormControl><Input type="number" placeholder="e.g., 46" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem className="md:col-span-2"><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl><FormMessage /></FormItem>
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
