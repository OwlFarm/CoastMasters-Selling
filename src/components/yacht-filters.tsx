
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

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
              <Select>
                  <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="motor">Motor</SelectItem>
                      <SelectItem value="sailing">Sailing</SelectItem>
                      <SelectItem value="catamaran">Catamaran</SelectItem>
                  </SelectContent>
              </Select>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="make">
          <AccordionTrigger className="font-semibold">Make</AccordionTrigger>
          <AccordionContent>
              <Select>
                  <SelectTrigger><SelectValue placeholder="All Makes" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="beneteau">Beneteau</SelectItem>
                      <SelectItem value="jeanneau">Jeanneau</SelectItem>
                      <SelectItem value="moody">Moody</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="little-harbor">Little Harbor</SelectItem>
                  </SelectContent>
              </Select>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="location">
          <AccordionTrigger className="font-semibold">Location</AccordionTrigger>
          <AccordionContent>
              <Select>
                  <SelectTrigger><SelectValue placeholder="All Locations" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="miami">Miami, FL</SelectItem>
                      <SelectItem value="newport">Newport, RI</SelectItem>
                      <SelectItem value="monaco">Monaco</SelectItem>
                      <SelectItem value="fort-lauderdale">Fort Lauderdale, FL</SelectItem>
                      <SelectItem value="annapolis">Annapolis, MD</SelectItem>
                  </SelectContent>
              </Select>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="condition">
          <AccordionTrigger className="font-semibold">Condition</AccordionTrigger>
          <AccordionContent>
              <Select>
                  <SelectTrigger><SelectValue placeholder="All Conditions" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
              </Select>
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
              <Select>
                  <SelectTrigger><SelectValue placeholder="All Fuel Types" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="gas">Gasoline</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
              </Select>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="hullMaterial">
          <AccordionTrigger className="font-semibold">Hull Material</AccordionTrigger>
          <AccordionContent>
              <Select>
                  <SelectTrigger><SelectValue placeholder="All Hull Materials" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="fiberglass">Fiberglass</SelectItem>
                      <SelectItem value="aluminum">Aluminum</SelectItem>
                      <SelectItem value="steel">Steel</SelectItem>
                  </SelectContent>
              </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
