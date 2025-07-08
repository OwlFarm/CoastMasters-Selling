'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { boatTypes, makes as allMakes, locationsByRegion, conditions, fuelTypes, hullMaterials, featureOptions, usageStyles } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';

export function YachtFilters() {
  const [lengthUnit, setLengthUnit] = React.useState<'ft' | 'm'>('ft');
  const [builderSearch, setBuilderSearch] = React.useState('');
  const [selectedBuilders, setSelectedBuilders] = React.useState<string[]>([]);

  const handleBuilderSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBuilderSearch(value);

    if (value.trim() === '') {
        setSelectedBuilders([]);
        return;
    }

    const searchTerms = value.toLowerCase().split(',').map(term => term.trim()).filter(Boolean);

    const matchedMakeIds = allMakes
      .filter(make => searchTerms.some(term => make.label.toLowerCase() === term))
      .map(make => make.id);

    setSelectedBuilders(matchedMakeIds);
  };

  const handleBuilderCheckboxChange = (makeId: string, checked: boolean | 'indeterminate') => {
      setSelectedBuilders(prevSelected => {
          const isChecked = checked === true;
          const newSelection = isChecked 
            ? Array.from(new Set([...prevSelected, makeId]))
            : prevSelected.filter(id => id !== makeId);
          
          const newSearchText = allMakes
            .filter(make => newSelection.includes(make.id))
            .map(make => make.label)
            .join(', ');

          setBuilderSearch(newSearchText);
          return newSelection;
      });
  };

  const numCols = 5;
  const numRows = Math.ceil(allMakes.length / numCols);
  const columnSortedMakes = [];
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const index = j * numRows + i;
      if (index < allMakes.length) {
        columnSortedMakes.push(allMakes[index]);
      }
    }
  }

  const featureNumCols = 5;
  const featureNumRows = Math.ceil(featureOptions.length / featureNumCols);
  const columnSortedFeatures = [];
  for (let i = 0; i < featureNumRows; i++) {
    for (let j = 0; j < featureNumCols; j++) {
      const index = j * featureNumRows + i;
      if (index < featureOptions.length) {
        columnSortedFeatures.push(featureOptions[index]);
      }
    }
  }

  const slugify = (text: string) => text.toLowerCase().replace(/[\s/]+/g, '-').replace(/[^\w-]+/g, '');

  return (
    <>
      <input type="hidden" name="lengthUnit" value={lengthUnit} />

      <div className="flex flex-row justify-center gap-4 pb-8">
        {conditions.map((condition) => (
          <div key={condition.id} className="flex items-center space-x-2">
            <Checkbox id={`condition-${condition.id}`} name="conditions" value={condition.id} />
            <Label htmlFor={`condition-${condition.id}`} className="font-normal">{condition.label}</Label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 pb-8 md:grid-cols-3">
          <div className="space-y-2">
              <Label>Price (USD)</Label>
              <div className="flex items-center gap-2">
                  <Input name="priceMin" type="number" placeholder="Min" className="w-full" />
                  <span className="text-muted-foreground">-</span>
                  <Input name="priceMax" type="number" placeholder="Max" className="w-full" />
              </div>
          </div>
          <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <Label>Length ({lengthUnit})</Label>
                   <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Ft</span>
                      <Switch
                          checked={lengthUnit === 'm'}
                          onCheckedChange={(checked) => setLengthUnit(checked ? 'm' : 'ft')}
                          id="length-unit-switch-filter"
                      />
                      <span className="text-muted-foreground">M</span>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                  <Input name="lengthMin" type="number" placeholder="Min" className="w-full" />
                  <span className="text-muted-foreground">-</span>
                  <Input name="lengthMax" type="number" placeholder="Max" className="w-full" />
              </div>
          </div>
          <div className="space-y-2">
              <Label>Year</Label>
              <div className="flex items-center gap-2">
                  <Input name="yearMin" type="number" placeholder="Min" className="w-full" />
                  <span className="text-muted-foreground">-</span>
                  <Input name="yearMax" type="number" placeholder="Max" className="w-full" />
              </div>
          </div>
      </div>
      
      <Accordion type="multiple" defaultValue={['boatType', 'builder', 'location']} className="w-full">
        <AccordionItem value="boatType">
          <AccordionTrigger className="font-semibold">Boat Type</AccordionTrigger>
          <AccordionContent>
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex flex-row gap-4">
                  {boatTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox id={`type-${type.id}`} name="boatTypes" value={type.id} />
                      <Label htmlFor={`type-${type.id}`} className="font-normal">{type.label}</Label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-row gap-4">
                    {usageStyles.map((style) => (
                      <div key={style.id} className="flex items-center space-x-2">
                        <Checkbox id={`style-${style.id}`} name="usageStyles" value={style.id} />
                        <Label htmlFor={`style-${style.id}`} className="font-normal">{style.label}</Label>
                      </div>
                    ))}
                </div>
              </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="builder">
          <AccordionTrigger className="font-semibold">Builder</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-x-4 gap-y-4 pt-2">
              <div className="col-span-2">
                <Input 
                  id="builder-search"
                  name="builderSearch"
                  placeholder="Search Builders (comma-separated)"
                  value={builderSearch}
                  onChange={handleBuilderSearchChange}
                />
              </div>
              <div className="col-span-3" />
              {columnSortedMakes.map((make) => (
                <div key={make.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`make-${make.id}`}
                    name="builders"
                    value={make.id}
                    checked={selectedBuilders.includes(make.id)}
                    onCheckedChange={(checked) => handleBuilderCheckboxChange(make.id, checked)}
                  />
                  <Label htmlFor={`make-${make.id}`} className="font-normal">{make.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="location">
          <AccordionTrigger className="font-semibold">Location</AccordionTrigger>
          <AccordionContent>
             <Tabs defaultValue={slugify(locationsByRegion[0].region)} className="w-full pt-2">
                <TabsList className="flex h-auto w-full flex-wrap justify-evenly">
                  {locationsByRegion.map((regionData) => (
                    <TabsTrigger key={regionData.region} value={slugify(regionData.region)}>{regionData.region}</TabsTrigger>
                  ))}
                </TabsList>
                {locationsByRegion.map((regionData) => {
                    const groupedLocations = regionData.locations.reduce((acc, loc) => {
                        const sub = loc.subRegion as keyof typeof acc;
                        acc[sub] = acc[sub] || [];
                        acc[sub].push(loc);
                        return acc;
                    }, {} as Record<'North' | 'South' | 'East' | 'West', (typeof regionData.locations)>);

                    const subRegions = ['North', 'South', 'East', 'West'];
                    
                    return (
                        <TabsContent key={regionData.region} value={slugify(regionData.region)}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 pt-4">
                                {subRegions.map((subRegion) => {
                                    const locationsInSubRegion = groupedLocations[subRegion as keyof typeof groupedLocations] || [];
                                    return (
                                        <div key={subRegion}>
                                            <h4 className="font-medium mb-2 pb-1 border-b">{subRegion}</h4>
                                            <div className="flex flex-col gap-2 mt-2">
                                                {locationsInSubRegion.length > 0 ? (
                                                    locationsInSubRegion.map((location) => (
                                                        <div key={location.id} className="flex items-center space-x-2">
                                                            <Checkbox id={`location-${location.id}`} name="locations" value={location.id} />
                                                            <Label htmlFor={`location-${location.id}`} className="font-normal text-sm">
                                                                {location.label}
                                                            </Label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-muted-foreground italic">No locations</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    );
                })}
              </Tabs>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fuel">
          <AccordionTrigger className="font-semibold">Fuel</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {fuelTypes.map((fuel) => (
                <div key={fuel.id} className="flex items-center space-x-2">
                  <Checkbox id={`fuel-${fuel.id}`} name="fuelTypes" value={fuel.id} />
                  <Label htmlFor={`fuel-${fuel.id}`} className="font-normal">{fuel.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="hullMaterial">
          <AccordionTrigger className="font-semibold">Hull Material</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {hullMaterials.map((material) => (
                <div key={material.id} className="flex items-center space-x-2">
                  <Checkbox id={`material-${material.id}`} name="hullMaterials" value={material.id} />
                  <Label htmlFor={`material-${material.id}`} className="font-normal">{material.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="features">
          <AccordionTrigger className="font-semibold">Features & Equipment</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-x-4 gap-y-2 pt-2">
              {columnSortedFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox id={`feature-filter-${feature.id}`} name="features" value={feature.id} />
                  <Label htmlFor={`feature-filter-${feature.id}`} className="font-normal">{feature.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
