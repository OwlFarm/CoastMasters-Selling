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

export const usageStyles = [
  { id: 'ocean', label: 'Ocean' },
  { id: 'coast', label: 'Coast' },
  { id: 'island', label: 'Island' },
  { id: 'off-grid', label: 'Off Grid' },
  { id: 'project', label: 'Project' },
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
        region: 'North America',
        locations: [
            { id: 'seattle', label: 'Seattle, WA', subRegion: 'North' },
            { id: 'vancouver', label: 'Vancouver, BC', subRegion: 'North' },
            { id: 'san-diego', label: 'San Diego, CA', subRegion: 'West' },
            { id: 'los-angeles', label: 'Los Angeles, CA', subRegion: 'West' },
            { id: 'miami', label: 'Miami, FL', subRegion: 'East' },
            { id: 'newport', label: 'Newport, RI', subRegion: 'East' },
            { id: 'fort-lauderdale', label: 'Fort Lauderdale, FL', subRegion: 'East' },
            { id: 'annapolis', label: 'Annapolis, MD', subRegion: 'East' },
        ],
    },
    {
        region: 'Europe',
        locations: [
            { id: 'oslo', label: 'Oslo, Norway', subRegion: 'North' },
            { id: 'london', label: 'London, UK', subRegion: 'North' },
            { id: 'monaco', label: 'Monaco', subRegion: 'South' },
            { id: 'santorini', label: 'Santorini, Greece', subRegion: 'South' },
            { id: 'palma', label: 'Palma de Mallorca', subRegion: 'South' },
            { id: 'lisbon', label: 'Lisbon, Portugal', subRegion: 'West' },
        ],
    },
    {
        region: 'Africa',
        locations: [],
    },
    {
        region: 'South America',
        locations: [
            { id: 'cancun', label: 'Cancun, Mexico', subRegion: 'North' },
            { id: 'cartagena', label: 'Cartagena, Colombia', subRegion: 'North' },
            { id: 'rio', label: 'Rio de Janeiro, Brazil', subRegion: 'East' },
        ],
    },
    {
        region: 'Asia',
        locations: [
            { id: 'dubai', label: 'Dubai, UAE', subRegion: 'West' },
            { id: 'phuket', label: 'Phuket, Thailand', subRegion: 'East' },
            { id: 'singapore', label: 'Singapore', subRegion: 'East' },
        ],
    },
    {
        region: 'Australia',
        locations: [
            { id: 'cairns', label: 'Cairns', subRegion: 'North' },
            { id: 'hobart', label: 'Hobart', subRegion: 'South' },
            { id: 'sydney', label: 'Sydney', subRegion: 'East' },
            { id: 'perth', label: 'Perth', subRegion: 'West' },
        ],
    },
    {
        region: 'New Zealand',
        locations: [
            { id: 'auckland', label: 'Auckland', subRegion: 'North' },
            { id: 'wellington', label: 'Wellington', subRegion: 'South' },
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

export const hullMaterialOptions = [
  { id: 'fiberglass', label: 'Fiberglass' },
  { id: 'aluminum', label: 'Aluminum' },
  { id: 'steel', label: 'Steel' },
  { id: 'wood', label: 'Wood' },
  { id: 'composite', label: 'Composite' },
];

export const hullShapeOptions = [
    { id: 'displacement', label: 'Displacement' },
    { id: 'semi-displacement', label: 'Semi-Displacement' },
    { id: 'planing', label: 'Planing' },
    { id: 'catamaran', label: 'Catamaran' },
    { id: 'trimaran', label: 'Trimaran' },
];

export const keelTypeOptions = [
    { id: 'full', label: 'Full Keel' },
    { id: 'fin', label: 'Fin Keel' },
    { id: 'winged', label: 'Winged Keel' },
    { id: 'bulb', label: 'Bulb Keel' },
    { id: 'daggerboard', label: 'Daggerboard' },
];

export const rudderTypeOptions = [
    { id: 'skeg-hung', label: 'Skeg-Hung' },
    { id: 'spade', label: 'Spade' },
    { id: 'transom-hung', label: 'Transom-Hung' },
    { id: 'keel-hung', label: 'Keel-Hung' },
];

export const propellerTypeOptions = [
    { id: 'fixed-pitch', label: 'Fixed-Pitch' },
    { id: 'folding', label: 'Folding' },
    { id: 'feathering', label: 'Feathering' },
    { id: 'controllable-pitch', label: 'Controllable-Pitch' },
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
