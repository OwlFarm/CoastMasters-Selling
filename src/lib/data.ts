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
  { id: 'beneteau', label: 'Beneteau' },
  { id: 'jeanneau', label: 'Jeanneau' },
  { id: 'moody', label: 'Moody' },
  { id: 'passport', label: 'Passport' },
  { id: 'little-harbor', label: 'Little Harbor' },
];

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
        region: 'Australia/NZ',
        locations: [
            { id: 'sydney', label: 'Sydney, Australia' },
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
];
