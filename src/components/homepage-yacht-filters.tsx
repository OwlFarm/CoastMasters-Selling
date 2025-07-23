
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
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const InfoTooltip = ({ children }: { children: React.ReactNode }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <button type="button" className="ml-1.5 flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <Info className="h-3.5 w-3.5" />
                    <span className="sr-only">More info</span>
                </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" className="max-w-xs z-50">
                {children}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export function HomepageYachtFilters() {
  const [lengthUnit, setLengthUnit] = React.useState<'ft' | 'm'>('ft');
  const [selectedCurrency, setSelectedCurrency] = React.useState('usd');
  const [builderSearch, setBuilderSearch] = React.useState('');
  const [selectedBuilders, setSelectedBuilders] = React.useState<string[]>([]);
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

  return (
    <>
      <datalist id="price-list">
        {metadata.priceValues.map(value => <option key={value} value={value} />)}
      </datalist>
      <input type="hidden" name="lengthUnit" value={lengthUnit} />
      <input type="hidden" name="boatTypes" value="sailing" />


      <div className="space-y-6 pb-8">
        <div className="flex h-8 justify-center items-center gap-6">
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
                  <Checkbox id="listing-type-private" name="listingTypes" value="private" />
                  <Label htmlFor="listing-type-private" className="font-normal">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox id="listing-type-broker" name="listingTypes" value="broker" />
                  <Label htmlFor="listing-type-broker" className="font-normal">Broker</Label>
              </div>
            </div>
        </div>
      </div>
      
      <Separator className="mb-8"/>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
          <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Price</Label>
                 <Select name="currency" value={selectedCurrency} onValueChange={setSelectedCurrency}>
                     <SelectTrigger id="currency-select" className="w-[90px] h-7 text-xs">
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
              </div>
              <div className="flex items-center gap-2">
                  <Input name="priceMin" type="number" placeholder="Min" className="w-full" list="price-list" />
                  <span className="text-muted-foreground">-</span>
                  <Input name="priceMax" type="number" placeholder="Max" className="w-full" list="price-list" />
              </div>
          </div>
          <div className="space-y-2">
               <div className="flex items-center justify-between">
                <Label>LOA</Label>
                 <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground text-xs">Ft</span>
                    <Switch
                        checked={lengthUnit === 'm'}
                        onCheckedChange={(checked) => setLengthUnit(checked ? 'm' : 'ft')}
                        id="length-unit-switch-filter-top"
                    />
                    <span className="text-muted-foreground text-xs">M</span>
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
      
      <Accordion type="multiple" defaultValue={['boatType', 'builder']} className="w-full">
        <AccordionItem value="calculations">
          <AccordionTrigger className="font-semibold">Calculations</AccordionTrigger>
            <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 pt-4 pb-4">
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="sa-disp-min">SA/Disp.</Label>
                            <InfoTooltip>
                                <div className="space-y-2 text-left">
                                    <p>A sail area/displacement ratio below 16 is underpowered; 16 to 20 is good performance; above 20 is high performance.</p>
                                    <code className="text-xs">SA/D = SA (ft²) ÷ [Disp (lbs) / 64]^0.666</code>
                                </div>
                            </InfoTooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input name="saDispMin" id="sa-disp-min" type="number" placeholder="Min" className="w-full" />
                            <span className="text-muted-foreground">-</span>
                            <Input name="saDispMax" type="number" placeholder="Max" className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="bal-disp-min">Bal./Disp.</Label>
                            <InfoTooltip>
                                <div className="space-y-2 text-left">
                                    <p>A Ballast/Displacement ratio of 40 or more means a stiffer, more powerful boat.</p>
                                    <code className="text-xs">Bal./Disp = ballast (lbs) / displacement (lbs) * 100</code>
                                </div>
                            </InfoTooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input name="balDispMin" id="bal-disp-min" type="number" placeholder="Min" className="w-full" />
                            <span className="text-muted-foreground">-</span>
                            <Input name="balDispMax" type="number" placeholder="Max" className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="disp-len-min">Disp./Len.</Label>
                            <InfoTooltip>
                                <div className="space-y-2 text-left">
                                    <p>The lower the ratio, the less power is needed to reach hull speed. &lt;100: Ultralight, 100-200: Light, 200-275: Moderate, 275-350: Heavy, 350+: Ultraheavy.</p>
                                    <code className="text-xs">D/L = (Disp / 2240) / (0.01*LWL)^3</code>
                                </div>
                            </InfoTooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input name="dispLenMin" id="disp-len-min" type="number" placeholder="Min" className="w-full" />
                            <span className="text-muted-foreground">-</span>
                            <Input name="dispLenMax" type="number" placeholder="Max" className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="comfort-ratio-min">Comfort Ratio</Label>
                            <InfoTooltip>
                                <div className="space-y-2 text-left">
                                    <p>A measure of motion comfort by Ted Brewer. &lt;20: Racing, 20-30: Coastal Cruiser, 30-40: Moderate Bluewater, 40-50: Heavy Bluewater, 50+: Extremely Heavy Bluewater.</p>
                                    <code className="text-xs">CR = D ÷ (.65 x (.7 LWL + .3 LOA) x Beam^1.33)</code>
                                </div>
                            </InfoTooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input name="comfortRatioMin" id="comfort-ratio-min" type="number" placeholder="Min" className="w-full" />
                            <span className="text-muted-foreground">-</span>
                            <Input name="comfortRatioMax" type="number" placeholder="Max" className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                         <div className="flex items-center">
                            <Label htmlFor="csf-min">Capsize Screen</Label>
                             <InfoTooltip>
                                <div className="space-y-2 text-left">
                                    <p>Determines blue water capability. A result of 2.0 or less is better suited for ocean passages. The lower the better.</p>
                                    <code className="text-xs">CSF = Beam / (Disp / 64)^0.333</code>
                                </div>
                            </InfoTooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input name="csfMin" id="csf-min" type="number" placeholder="Min" className="w-full" />
                            <span className="text-muted-foreground">-</span>
                            <Input name="csfMax" type="number" placeholder="Max" className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                         <div className="flex items-center">
                            <Label htmlFor="s-num-min">S#</Label>
                             <InfoTooltip>
                                <div className="space-y-2 text-left">
                                    <p>A guide to probable boat performance. For boats of the same length, a higher S# generally means a lower PHRF. &lt;2: Slow, 2-3: Cruiser, 3-5: Racer Cruiser, 5+: Fast/Racing.</p>
                                    <code className="text-xs">S# = 3.972*(10^(-[Dsp/LWL]/526+(0.691*(LOG([SA/Dp]])-1)^0.8)))</code>
                                </div>
                            </InfoTooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input name="sNumMin" id="s-num-min" type="number" placeholder="Min" className="w-full" />
                            <span className="text-muted-foreground">-</span>
                            <Input name="sNumMax" type="number" placeholder="Max" className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                         <div className="flex items-center">
                            <Label htmlFor="hull-speed-min">Hull Speed</Label>
                             <InfoTooltip>
                                <div className="space-y-2 text-left">
                                    <p>The maximum speed of a displacement hull.</p>
                                    <code className="text-xs">HS = 1.34 x &#8730;LWL (in feet)</code>
                                </div>
                            </InfoTooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input name="hullSpeedMin" id="hull-speed-min" type="number" placeholder="Min" className="w-full" />
                            <span className="text-muted-foreground">-</span>
                            <Input name="hullSpeedMax" type="number" placeholder="Max" className="w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                         <div className="flex items-center">
                            <Label htmlFor="ppi-min">PPI</Label>
                             <InfoTooltip>
                                <p className="text-left">Pounds per Inch Immersion.</p>
                            </InfoTooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input name="ppiMin" id="ppi-min" type="number" placeholder="Min" className="w-full" />
                            <span className="text-muted-foreground">-</span>
                            <Input name="ppiMax" type="number" placeholder="Max" className="w-full" />
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="boatType">
          <AccordionTrigger className="font-semibold">Division</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4 pt-4 pb-4">
                    <div className="grid grid-cols-5 gap-x-2 gap-y-4">
                      {metadata.divisions.map(style => (
                        <div key={style.id} className="flex items-center space-x-2">
                            <Checkbox id={`style-${style.id}`} name="divisions" value={style.id} />
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
        <AccordionItem value="sail-rigging">
            <AccordionTrigger className="font-semibold">Sail Rigging</AccordionTrigger>
            <AccordionContent>
                <div className="grid grid-cols-5 gap-x-2 gap-y-4 pt-4 pb-4">
                    {metadata.sailRiggingOptions.map(rig => (
                        <div key={rig.id} className="flex items-center space-x-2">
                            <Checkbox id={`rig-${rig.id}`} name="sailRiggings" value={rig.id} />
                            <Label htmlFor={`rig-${rig.id}`} className="font-normal">{rig.label}</Label>
                        </div>
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="hull">
          <AccordionTrigger className="font-semibold">Hull Details</AccordionTrigger>
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
        <AccordionItem value="accommodation">
          <AccordionTrigger className="font-semibold">Accommodation</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-x-6 gap-y-4 pt-4 pb-4">
                <div>
                    <h4 className="font-medium mb-2 pb-1 border-b">Cabins</h4>
                    <div className="flex flex-col gap-4 mt-2">
                        {metadata.cabinFeatureOptions.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox id={`accommodation-cabins-${feature.id}`} name="accommodation.cabins" value={feature.id} />
                            <Label htmlFor={`accommodation-cabins-${feature.id}`} className="font-normal text-sm">{feature.label}</Label>
                        </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-medium mb-2 pb-1 border-b">Saloon</h4>
                    <div className="flex flex-col gap-4 mt-2">
                        {metadata.saloonOptions.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox id={`accommodation-saloon-${feature.id}`} name="accommodation.saloon" value={feature.id} />
                            <Label htmlFor={`accommodation-saloon-${feature.id}`} className="font-normal text-sm">{feature.label}</Label>
                        </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-medium mb-2 pb-1 border-b">Galley</h4>
                    <div className="flex flex-col gap-4 mt-2">
                        {metadata.galleyOptions.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox id={`accommodation-galley-${feature.id}`} name="accommodation.galley" value={feature.id} />
                            <Label htmlFor={`accommodation-galley-${feature.id}`} className="font-normal text-sm">{feature.label}</Label>
                        </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-medium mb-2 pb-1 border-b">Heads</h4>
                    <div className="flex flex-col gap-4 mt-2">
                        {metadata.headsOptions.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox id={`accommodation-heads-${feature.id}`} name="accommodation.heads" value={feature.id} />
                            <Label htmlFor={`accommodation-heads-${feature.id}`} className="font-normal text-sm">{feature.label}</Label>
                        </div>
                        ))}
                    </div>
                </div>
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

    