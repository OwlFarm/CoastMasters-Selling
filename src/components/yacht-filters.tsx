'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const boatTypes = [
  { id: 'motor', label: 'Motor' },
  { id: 'sailing', label: 'Sailing' },
  { id: 'catamaran', label: 'Catamaran' },
];

const makes = [
  { id: 'beneteau', label: 'Beneteau' },
  { id: 'jeanneau', label: 'Jeanneau' },
  { id: 'moody', label: 'Moody' },
  { id: 'passport', label: 'Passport' },
  { id: 'little-harbor', label: 'Little Harbor' },
];

const locations = [
  { id: 'miami', label: 'Miami, FL' },
  { id: 'newport', label: 'Newport, RI' },
  { id: 'monaco', label: 'Monaco' },
  { id: 'fort-lauderdale', label: 'Fort Lauderdale, FL' },
  { id: 'annapolis', label: 'Annapolis, MD' },
];

const conditions = [
  { id: 'new', label: 'New' },
  { id: 'used', label: 'Used' },
];

const fuelTypes = [
  { id: 'diesel', label: 'Diesel' },
  { id: 'gas', label: 'Gasoline' },
  { id: 'electric', label: 'Electric' },
];

const hullMaterials = [
  { id: 'fiberglass', label: 'Fiberglass' },
  { id: 'aluminum', label: 'Aluminum' },
  { id: 'steel', label: 'Steel' },
];


export function YachtFilters() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button className="w-full">Save Search</Button>
      </div>
      
      <Accordion type="multiple" defaultValue={['boatType', 'price', 'year', 'length']} className="w-full">
        <AccordionItem value="boatType">
          <AccordionTrigger className="font-semibold">Boat Type</AccordionTrigger>
          <AccordionContent>
              <div className="space-y-2 pt-2">
                {boatTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox id={`type-${type.id}`} />
                    <Label htmlFor={`type-${type.id}`} className="font-normal">{type.label}</Label>
                  </div>
                ))}
              </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="make">
          <AccordionTrigger className="font-semibold">Make</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {makes.map((make) => (
                <div key={make.id} className="flex items-center space-x-2">
                  <Checkbox id={`make-${make.id}`} />
                  <Label htmlFor={`make-${make.id}`} className="font-normal">{make.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="location">
          <AccordionTrigger className="font-semibold">Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox id={`location-${location.id}`} />
                  <Label htmlFor={`location-${location.id}`} className="font-normal">{location.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="condition">
          <AccordionTrigger className="font-semibold">Condition</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {conditions.map((condition) => (
                <div key={condition.id} className="flex items-center space-x-2">
                  <Checkbox id={`condition-${condition.id}`} />
                  <Label htmlFor={`condition-${condition.id}`} className="font-normal">{condition.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="length">
          <AccordionTrigger className="font-semibold">Length</AccordionTrigger>
          <AccordionContent className="pt-4">
              <Label>Between 20 ft and 150 ft</Label>
              <Slider defaultValue={[20, 150]} max={200} step={5} className="mt-4" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="font-semibold">Price</AccordionTrigger>
          <AccordionContent className="pt-4">
              <Label>Between $100,000 and $2,000,000</Label>
              <Slider defaultValue={[100000, 2000000]} max={5000000} step={50000} className="mt-4"/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="year">
          <AccordionTrigger className="font-semibold">Year</AccordionTrigger>
          <AccordionContent className="pt-4">
              <Label>Between 2010 and 2024</Label>
              <Slider defaultValue={[2010, 2024]} min={1980} max={new Date().getFullYear()} step={1} className="mt-4" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="engineDetails">
          <AccordionTrigger className="font-semibold">Engine Details</AccordionTrigger>
          <AccordionContent>
              <Select disabled>
                  <SelectTrigger><SelectValue placeholder="Coming Soon" /></SelectTrigger>
              </Select>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fuel">
          <AccordionTrigger className="font-semibold">Fuel</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {fuelTypes.map((fuel) => (
                <div key={fuel.id} className="flex items-center space-x-2">
                  <Checkbox id={`fuel-${fuel.id}`} />
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
                  <Checkbox id={`material-${material.id}`} />
                  <Label htmlFor={`material-${material.id}`} className="font-normal">{material.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
