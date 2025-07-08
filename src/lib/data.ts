import type { Yacht } from './types';

export const featuredYachts: Yacht[] = [
  {
    id: 1,
    name: 'Serenity Cruiser',
    type: 'Motor',
    price: 1250000,
    year: 2022,
    length: 75,
    location: 'Miami, FL',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'modern yacht',
  },
  {
    id: 2,
    name: 'Ocean Voyager',
    type: 'Sailing',
    price: 850000,
    year: 2020,
    length: 60,
    location: 'Newport, RI',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'sailing yacht',
  },
  {
    id: 3,
    name: 'Twin Hull Drifter',
    type: 'Catamaran',
    price: 975000,
    year: 2023,
    length: 55,
    location: 'Fort Lauderdale, FL',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'catamaran boat',
  },
  {
    id: 4,
    name: 'Azure Dream',
    type: 'Motor',
    price: 2500000,
    year: 2021,
    length: 90,
    location: 'Monaco',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'luxury yacht',
  },
  {
    id: 5,
    name: 'Wind Whisperer',
    type: 'Sailing',
    price: 480000,
    year: 2019,
    length: 45,
    location: 'Santorini, Greece',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'sailboat sunset',
  },
  {
    id: 6,
    name: 'Coastal Runner',
    type: 'Motor',
    price: 720000,
    year: 2022,
    length: 50,
    location: 'San Diego, CA',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'fast yacht',
  },
];

export const boatTypes = [
  { id: 'motor', label: 'Motor' },
  { id: 'sailing', label: 'Sailing' },
  { id: 'catamaran', label: 'Catamaran' },
];

export const makes = [
  { id: 'absolute', label: 'Absolute' },
  { id: 'admiral', label: 'Admiral' },
  { id: 'amels', label: 'Amels' },
  { id: 'azimut', label: 'Azimut' },
  { id: 'baglietto', label: 'Baglietto' },
  { id: 'bavaria', label: 'Bavaria' },
  { id: 'beneteau', label: 'Beneteau' },
  { id: 'benetti', label: 'Benetti' },
  { id: 'bertram', label: 'Bertram' },
  { id: 'blohm-voss', label: 'Blohm+Voss' },
  { id: 'burger', label: 'Burger' },
  { id: 'catalina', label: 'Catalina' },
  { id: 'chris-craft', label: 'Chris-Craft' },
  { id: 'christensen', label: 'Christensen' },
  { id: 'crn', label: 'CRN' },
  { id: 'delta-marine', label: 'Delta Marine' },
  { id: 'dufour', label: 'Dufour' },
  { id: 'fairline', label: 'Fairline' },
  { id: 'feadship', label: 'Feadship' },
  { id: 'ferretti', label: 'Ferretti' },
  { id: 'gulf-craft', label: 'Gulf Craft' },
  { id: 'hakvoort', label: 'Hakvoort' },
  { id: 'hanse', label: 'Hanse' },
  { id: 'hatteras', label: 'Hatteras' },
  { id: 'heesen', label: 'Heesen' },
  { id: 'hinckley', label: 'Hinckley' },
  { id: 'hunter', label: 'Hunter' },
  { id: 'isa-yachts', label: 'ISA Yachts' },
  { id: 'island-packet', label: 'Island Packet' },
  { id: 'jeanneau', label: 'Jeanneau' },
  { id: 'lagoon', label: 'Lagoon' },
  { id: 'leopard', label: 'Leopard' },
  { id: 'little-harbor', label: 'Little Harbor' },
  { id: 'lurssen', label: 'Lürssen' },
  { id: 'majesty', label: 'Majesty' },
  { id: 'mangusta', label: 'Mangusta' },
  { id: 'moody', label: 'Moody' },
  { id: 'nautor-swan', label: "Nautor's Swan" },
  { id: 'oceanco', label: 'Oceanco' },
  { id: 'overmarine', label: 'Overmarine' },
  { id: 'palmer-johnson', label: 'Palmer Johnson' },
  { id: 'perini-navi', label: 'Perini Navi' },
  { id: 'pershing', label: 'Pershing' },
  { id: 'princess', label: 'Princess' },
  { id: 'riva', label: 'Riva' },
  { id: 'sanlorenzo', label: 'Sanlorenzo' },
  { id: 'sunseeker', label: 'Sunseeker' },
  { id: 'trinity', label: 'Trinity' },
  { id: 'viking', label: 'Viking' },
  { id: 'westport', label: 'Westport' },
].sort((a, b) => a.label.localeCompare(b.label));

export const locationsByRegion = [
    {
        region: 'USA',
        locations: [
            { id: 'miami', label: 'Miami, FL' },
            { id: 'newport', label: 'Newport, RI' },
            { id: 'fort-lauderdale', label: 'Fort Lauderdale, FL' },
            { id: 'annapolis', label: 'Annapolis, MD' },
            { id: 'san-diego', label: 'San Diego, CA' },
        ],
    },
    {
        region: 'Europe',
        locations: [
            { id: 'monaco', label: 'Monaco' },
            { id: 'santorini', label: 'Santorini, Greece' },
        ],
    },
    {
        region: 'Central America',
        locations: [
            { id: 'cancun', label: 'Cancun, Mexico' },
        ],
    },
    {
        region: 'Asia',
        locations: [
            { id: 'phuket', label: 'Phuket, Thailand' },
        ],
    },
    {
        region: 'Australia',
        locations: [
            { id: 'sydney', label: 'Sydney, Australia' },
        ],
    },
    {
        region: 'New Zealand',
        locations: [
            { id: 'auckland', label: 'Auckland, New Zealand' },
        ],
    },
];

export const conditions = [
  { id: 'new', label: 'New' },
  { id: 'used', label: 'Used' },
];

export const fuelTypes = [
  { id: 'diesel', label: 'Diesel' },
  { id: 'gas', label: 'Gasoline' },
  { id: 'electric', label: 'Electric' },
];

export const hullMaterials = [
  { id: 'fiberglass', label: 'Fiberglass' },
  { id: 'aluminum', label: 'Aluminum' },
  { id: 'steel', label: 'Steel' },
];

export const featureOptions = [
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
].sort((a, b) => a.label.localeCompare(b.label));
