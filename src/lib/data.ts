import type { Yacht } from './types';

export const featuredYachts: Yacht[] = [
  {
    id: 1,
    name: 'Serenity Cruiser',
    type: 'Motor',
    listingType: 'Broker',
    price: 1250000,
    year: 2022,
    length: 75,
    location: 'Miami, FL',
    imageUrl: 'https://placehold.co/600x400/A2B9D1/34495E.png',
    imageHint: 'modern yacht',
  },
  {
    id: 2,
    name: 'Ocean Voyager',
    type: 'Sailing',
    listingType: 'Private',
    price: 850000,
    year: 2020,
    length: 60,
    location: 'Newport, RI',
    imageUrl: 'https://placehold.co/600x400/34495E/FFFFFF.png',
    imageHint: 'sailing yacht',
  },
  {
    id: 3,
    name: 'Twin Hull Drifter',
    type: 'Catamaran',
    listingType: 'Broker',
    price: 975000,
    year: 2023,
    length: 55,
    location: 'Fort Lauderdale, FL',
    imageUrl: 'https://placehold.co/600x400/4ECCA3/232931.png',
    imageHint: 'catamaran boat',
  },
  {
    id: 4,
    name: 'Azure Dream',
    type: 'Motor',
    listingType: 'Broker',
    price: 2500000,
    year: 2021,
    length: 90,
    location: 'Monaco',
    imageUrl: 'https://placehold.co/600x400/00BFFF/FFFFFF.png',
    imageHint: 'luxury yacht',
  },
  {
    id: 5,
    name: 'Wind Whisperer',
    type: 'Sailing',
    listingType: 'Private',
    price: 480000,
    year: 2019,
    length: 45,
    location: 'Santorini, Greece',
    imageUrl: 'https://placehold.co/600x400/E0E0E0/363636.png',
    imageHint: 'sailboat sunset',
  },
  {
    id: 6,
    name: 'Coastal Runner',
    type: 'Motor',
    listingType: 'Broker',
    price: 720000,
    year: 2022,
    length: 50,
    location: 'San Diego, CA',
    imageUrl: 'https://placehold.co/600x400/F5DEB3/8B4513.png',
    imageHint: 'fast yacht',
  },
  {
    id: 7,
    name: 'Sun Chaser',
    type: 'Catamaran',
    listingType: 'Private',
    price: 1100000,
    year: 2021,
    length: 62,
    location: 'The Bahamas',
    imageUrl: 'https://placehold.co/600x400/FFC300/581845.png',
    imageHint: 'catamaran caribbean',
  },
  {
    id: 8,
    name: 'Starlight Express',
    type: 'Motor',
    listingType: 'Broker',
    price: 3200000,
    year: 2023,
    length: 110,
    location: 'Ibiza, Spain',
    imageUrl: 'https://placehold.co/600x400/900C3F/FFFFFF.png',
    imageHint: 'superyacht night',
  },
  {
    id: 9,
    name: 'Gale Force',
    type: 'Sailing',
    listingType: 'Broker',
    price: 650000,
    year: 2018,
    length: 52,
    location: 'Auckland, NZ',
    imageUrl: 'https://placehold.co/600x400/581845/FFC300.png',
    imageHint: 'racing sailboat',
  },
];

export const priceValues = [
    '10000', '20000', '30000', '40000', '50000', '60000', '70000', '80000', '90000', '100000',
    '150000', '200000', '250000', '300000', '350000', '400000', '450000', '500000',
    '750000', '1000000', '1500000', '2000000', '3000000', '5000000', '10000000'
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

export const listingTypes = [
  { id: 'private', label: 'Private' },
  { id: 'broker', label: 'Broker' },
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

export const deckOptions = [
    { id: 'teak-deck', label: 'Teak Deck' },
    { id: 'dodger', label: 'Dodger' },
    { id: 'bimini', label: 'Bimini Top' },
    { id: 'cockpit-table', label: 'Cockpit Table' },
    { id: 'cockpit-shower', label: 'Cockpit Shower' },
    { id: 'electric-winch', label: 'Electric Winch' },
    { id: 'wheel-steering', label: 'Wheel Steering' },
    { id: 'tiller-steering', label: 'Tiller Steering' },
    { id: 'windlass', label: 'Electric Windlass' },
    { id: 'swim-platform', label: 'Swim Platform' },
].sort((a, b) => a.label.localeCompare(b.label));

export const cabinOptions = [
    { id: 'nav-station', label: 'Navigation Station' },
    { id: 'galley-fridge', label: 'Refrigerator' },
    { id: 'galley-freezer', label: 'Freezer' },
    { id: 'galley-oven', label: 'Oven' },
    { id: 'microwave', label: 'Microwave' },
    { id: 'cabin-fans', label: 'Cabin Fans' },
    { id: 'electric-head', label: 'Electric Head' },
    { id: 'manual-head', label: 'Manual Head' },
    { id: 'hot-water', label: 'Hot Water System' },
    { id: 'tv-set', label: 'TV Set' },
].sort((a, b) => a.label.localeCompare(b.label));
