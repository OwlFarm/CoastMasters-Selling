
'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getMetadata, type Metadata } from '@/services/metadata-service';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Combobox } from './ui/combobox';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';

export function HomepageYachtFilters() {
  const [lengthUnit, setLengthUnit] = React.useState<'ft' | 'm'>('ft');
  const [selectedCurrency, setSelectedCurrency] = React.useState('usd');
  const [builderSearch, setBuilderSearch] = React.useState('');
  const [selectedBuilders, setSelectedBuilders] = React.useState<string[]>([]);
  const [isSailingChecked, setIsSailingChecked] = React.useState(false);
  const [isPowerChecked, setIsPowerChecked] = React.useState(false);
  const [metadata, setMetadata] = React.useState<Metadata | null>(null);

  React.useEffect(() => {
    async function fetchMetadata() {
        const data = await getMetadata();
        setMetadata(data);
    }
    fetchMetadata();
  }, []);

  const handleBuilderSearchChange = (value: string) => {
    setBuilderSearch(value);

    const searchTerms = value.toLowerCase().split(',').map(term => term.trim()).filter(Boolean);

    if (searchTerms.length === 0) {
        setSelectedBuilders([]);
        return;
    }

    if (!metadata) return;

    const matchedMakeIds = metadata.makes
      .filter(make => searchTerms.some(term => make.label.toLowerCase().includes(term)))
      .map(make => make.id);

    setSelectedBuilders(matchedMakeIds);
  };

  const handleBuilderCheckboxChange = (makeId: string, checked: boolean | 'indeterminate') => {
      if (!metadata) return;
      setSelectedBuilders(prevSelected => {
          const isChecked = checked === true;
          const newSelection = isChecked 
            ? Array.from(new Set([...prevSelected, makeId]))
            : prevSelected.filter(id => id !== makeId);
          
          const newSearchText = metadata.makes
            .filter(make => newSelection.includes(make.id))
            .map(make => make.label)
            .join(', ');

          setBuilderSearch(newSearchText);
          return newSelection;
      });
  };

  const sortIntoColumns = <T extends { id: string; label: string; value?: string; }>(items: T[], numCols: number): T[][] => {
    if (!items || items.length === 0) return [];
    const sortedItems = [...items].sort((a, b) => a.label.localeCompare(b.label));
    const columns: T[][] = Array.from({ length: numCols }, () => []);
    
    sortedItems.forEach((item, index) => {
        const colIndex = index % numCols;
        columns[colIndex].push(item);
    });

    return columns;
  };

  if (!metadata) {
      return (
          <div className="space-y-6">
              <Skeleton className="h-8 w-full" />
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
          </div>
      );
  }

  const columnSortedMakes = sortIntoColumns(metadata.makes, 5);
  const columnSortedFeatures = sortIntoColumns(metadata.featureOptions, 5);
  const columnSortedDeck = sortIntoColumns(metadata.deckOptions, 5);
  const columnSortedCabin = sortIntoColumns(metadata.cabinOptions, 5);
  const columnSortedPowerSubTypes = sortIntoColumns(metadata.powerBoatSubTypes, 3);
  const columnSortedUsageStyles = sortIntoColumns(metadata.usageStyles, 3);


  return (
    <>
      <datalist id="price-list">
        {metadata.priceValues.map(value => <option key={value} value={value} />)}
      </datalist>
      <input type="hidden" name="lengthUnit" value={lengthUnit} />

      <div className="space-y-6 pb-8">
        <div className="flex h-8 justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                  <Checkbox id="condition-new" name="conditions" value="new" />
                  <Label htmlFor="condition-new" className="font-normal">New</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox id="condition-used" name="conditions" value="used" />
                  <Label htmlFor="condition-used" className="font-normal">Used</Label>
              </div>
            </div>

            <Separator orientation="vertical" />
            
             <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="type-power" 
                        name="boatTypes" 
                        value="power"
                        checked={isPowerChecked}
                        onCheckedChange={(checked) => setIsPowerChecked(checked === true)}
                     />
                    <Label htmlFor="type-power" className="font-normal">Power</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="type-sailing" 
                        name="boatTypes" 
                        value="sailing" 
                        checked={isSailingChecked}
                        onCheckedChange={(checked) => setIsSailingChecked(checked === true)}
                    />
                    <Label htmlFor="type-sailing" className="font-normal">Sailing</Label>
                </div>
            </div>

            <Separator orientation="vertical" />

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                  <Checkbox id="listing-type-private" name="listingTypes" value="private" />
                  <Label htmlFor="listing-type-private" className="font-normal">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox id="listing-type-broker" name="listingTypes" value="broker" />
                  <Label htmlFor="listing-type-broker" className="font-normal">Broker</Label>
              </div>
            </div>

            <Separator orientation="vertical" />
            
            <div className="flex items-center gap-6">
                 <Label htmlFor="currency-select" className="font-normal sr-only">Currency</Label>
                 <Select name="currency" value={selectedCurrency} onValueChange={setSelectedCurrency}>
                     <SelectTrigger id="currency-select" className="w-[90px]">
                         <SelectValue placeholder="Currency" />
                     </SelectTrigger>
                     <SelectContent>
                         <SelectItem value="usd">USD</SelectItem>
                         <SelectItem value="eur">EUR</SelectItem>
                         <SelectItem value="gbp">GBP</SelectItem>
                         <SelectItem value="aud">AUD</SelectItem>
                         <SelectItem value="nzd">NZD</SelectItem>
                     </SelectContent>
                 </Select>
                 <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Ft</span>
                    <Switch
                        checked={lengthUnit === 'm'}
                        onCheckedChange={(checked) => setLengthUnit(checked ? 'm' : 'ft')}
                        id="length-unit-switch-filter-top"
                    />
                    <span className="text-muted-foreground">M</span>
                </div>
            </div>
        </div>
      </div>
      
      <Separator className="mb-8"/>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
          <div className="space-y-2">
              <Label>Price ({selectedCurrency.toUpperCase()})</Label>
              <div className="flex items-center gap-2">
                  <Input name="priceMin" type="number" placeholder="Min" className="w-full" list="price-list" />
                  <span className="text-muted-foreground">-</span>
                  <Input name="priceMax" type="number" placeholder="Max" className="w-full" list="price-list" />
              </div>
          </div>
          <div className="space-y-2">
              <Label>LOA ({lengthUnit})</Label>
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
      
      <Accordion type="multiple" defaultValue={['boatType', 'builder', 'hull']} className="w-full">
        <AccordionItem value="boatType">
          <AccordionTrigger className="font-semibold">Boat Type Details</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4 pt-4 pb-4">
                    {isPowerChecked && (
                        <>
                            <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                              {metadata.powerBoatSubTypes.map(subType => (
                                <div key={subType.id} className="flex items-center space-x-2">
                                    <Checkbox id={`subtype-${subType.id}`} name="powerSubTypes" value={subType.id} />
                                    <Label htmlFor={`subtype-${subType.id}`} className="font-normal">{subType.label}</Label>
                                </div>
                              ))}
                            </div>
                        </>
                    )}
                    {isSailingChecked && (
                        <>
                            {isPowerChecked && <Separator className="bg-border/50 my-4" />}
                            <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                              {metadata.usageStyles.map(style => (
                                <div key={style.id} className="flex items-center space-x-2">
                                    <Checkbox id={`style-${style.id}`} name="usageStyles" value={style.id} />
                                    <Label htmlFor={`style-${style.id}`} className="font-normal">{style.label}</Label>

                                </div>
                              ))}
                            </div>
                        </>
                    )}
                    {!isPowerChecked && !isSailingChecked && (
                        <p className="text-sm text-muted-foreground">Select a boat type above (Power or Sailing) to see more specific options.</p>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="builder">
          <AccordionTrigger className="font-semibold">Builder</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <div className="col-span-full mb-4">
                 <Combobox
                    options={metadata.makes.map(m => ({ label: m.label, value: m.value || m.id }))}
                    value={builderSearch}
                    onChange={handleBuilderSearchChange}
                    placeholder="Select or enter builders..."
                    searchPlaceholder="Search builders (comma-separated)..."
                    notFoundText="No builder found."
                 />
              </div>
              <ScrollArea className="h-[27rem]">
                <div className="grid grid-cols-5 gap-x-2 gap-y-4 pr-6">
                  {columnSortedMakes.map((column, colIndex) => (
                      <div key={colIndex} className="flex flex-col space-y-4">
                          {column.map((make) => (
                              <div key={make.value} className="flex items-center space-x-2">
                                  <Checkbox
                                      id={`make-${make.value}`}
                                      name="builders"
                                      value={make.value}
                                      checked={selectedBuilders.includes(make.value || '')}
                                      onCheckedChange={(checked) => handleBuilderCheckboxChange(make.value || '', checked)}
                                  />
                                  <Label htmlFor={`make-${make.value}`} className="font-normal text-sm">{make.label}</Label>
                              </div>
                          ))}
                      </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="hull">
          <AccordionTrigger className="font-semibold">Hull</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-x-6 gap-y-4 pt-4 pb-4">
              <div>
                  <h4 className="font-medium mb-2 pb-1 border-b">Material</h4>
                  <div className="flex flex-col gap-4 mt-2">
                    {metadata.hullMaterialOptions.map((material) => (
                      <div key={material.id} className="flex items-center space-x-2">
                        <Checkbox id={`material-${material.id}`} name="hullMaterials" value={material.id} />
                        <Label htmlFor={`material-${material.id}`} className="font-normal text-sm">{material.label}</Label>
                      </div>
                    ))}
                  </div>
              </div>
              <div>
                  <h4 className="font-medium mb-2 pb-1 border-b">Shape</h4>
                  <div className="flex flex-col gap-4 mt-2">
                    {metadata.hullShapeOptions.map((shape) => (
                      <div key={shape.id} className="flex items-center space-x-2">
                        <Checkbox id={`shape-${shape.id}`} name="hullShapes" value={shape.id} />
                        <Label htmlFor={`shape-${shape.id}`} className="font-normal text-sm">{shape.label}</Label>
                      </div>
                    ))}
                  </div>
              </div>
              <div>
                  <h4 className="font-medium mb-2 pb-1 border-b">Keel</h4>
                  <div className="flex flex-col gap-4 mt-2">
                    {metadata.keelTypeOptions.map((keel) => (
                      <div key={keel.id} className="flex items-center space-x-2">
                        <Checkbox id={`keel-${keel.id}`} name="keelTypes" value={keel.id} />
                        <Label htmlFor={`keel-${keel.id}`} className="font-normal text-sm">{keel.label}</Label>
                      </div>
                    ))}
                  </div>
              </div>
              <div>
                  <h4 className="font-medium mb-2 pb-1 border-b">Rudder</h4>
                  <div className="flex flex-col gap-4 mt-2">
                    {metadata.rudderTypeOptions.map((rudder) => (
                      <div key={rudder.id} className="flex items-center space-x-2">
                        <Checkbox id={`rudder-${rudder.id}`} name="rudderTypes" value={rudder.id} />
                        <Label htmlFor={`rudder-${rudder.id}`} className="font-normal text-sm">{rudder.label}</Label>
                      </div>
                    ))}
                  </div>
              </div>
               <div>
                  <h4 className="font-medium mb-2 pb-1 border-b">Propeller</h4>
                  <div className="flex flex-col gap-4 mt-2">
                    {metadata.propellerTypeOptions.map((prop) => (
                      <div key={prop.id} className="flex items-center space-x-2">
                        <Checkbox id={`propeller-${prop.id}`} name="propellerTypes" value={prop.id} />
                        <Label htmlFor={`propeller-${prop.id}`} className="font-normal text-sm">{prop.label}</Label>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deck">
          <AccordionTrigger className="font-semibold">Deck</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-x-2 gap-y-4 pt-4 pb-4">
              {columnSortedDeck.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col space-y-4">
                      {column.map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-2">
                              <Checkbox id={`deck-filter-${feature.id}`} name="deck" value={feature.id} />
                              <Label htmlFor={`deck-filter-${feature.id}`} className="font-normal">{feature.label}</Label>
                          </div>
                      ))}
                  </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="cabin">
          <AccordionTrigger className="font-semibold">Cabin</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-x-2 gap-y-4 pt-4 pb-4">
              {columnSortedCabin.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col space-y-4">
                      {column.map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-2">
                              <Checkbox id={`cabin-filter-${feature.id}`} name="cabin" value={feature.id} />
                              <Label htmlFor={`cabin-filter-${feature.id}`} className="font-normal">{feature.label}</Label>
                          </div>
                      ))}
                  </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="features">
          <AccordionTrigger className="font-semibold">Features & Equipment</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-x-2 gap-y-4 pt-4 pb-4">
              {columnSortedFeatures.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col space-y-4">
                      {column.map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-2">
                              <Checkbox id={`feature-filter-${feature.id}`} name="features" value={feature.id} />
                              <Label htmlFor={`feature-filter-${feature.id}`} className="font-normal">{feature.label}</Label>
                          </div>
                      ))}
                  </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fuel">
          <AccordionTrigger className="font-semibold">Fuel</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-x-2 gap-y-4 pt-4 pb-4">
              {metadata.fuelTypes.map((fuel) => (
                <div key={fuel.id} className="flex items-center space-x-2">
                  <Checkbox id={`fuel-${fuel.id}`} name="fuelTypes" value={fuel.id} />
                  <Label htmlFor={`fuel-${fuel.id}`} className="font-normal">{fuel.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
         <AccordionItem value="location">
          <AccordionTrigger className="font-semibold">Location</AccordionTrigger>
          <AccordionContent>
             <Accordion type="multiple" className="w-full pt-2 pb-4">
                {metadata.locationsByRegion.map((regionData) => {
                  if (regionData.locations.length === 0) {
                    return null;
                  }
                  return (
                    <AccordionItem key={regionData.region} value={regionData.region}>
                      <AccordionTrigger className="text-sm py-3">
                        {regionData.region}
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <div className="grid grid-cols-3 gap-x-2 gap-y-2 pt-2">
                          {regionData.locations.map((location) => (
                            <div key={location.id} className="flex items-center space-x-2">
                              <Checkbox id={`location-${location.id}`} name="locations" value={location.id} />
                              <Label htmlFor={`location-${location.id}`} className="font-normal text-sm">
                                {location.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

    