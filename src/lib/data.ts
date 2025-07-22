
import type { Yacht } from './types';

export const featuredYachts: Yacht[] = [
  {
    id: '2',
    name: 'Ocean Voyager',
    boatType: 'Sailing',
    listingType: 'Private',
    price: 850000,
    year: 2020,
    length: 60,
    location: 'Newport, RI',
    locationId: 'newport',
    imageUrl: 'https://placehold.co/600x400/34495E/FFFFFF.png',
    imageHint: 'sailing yacht',
    make: "Nautor's Swan",
    model: 'Swan 60',
    condition: 'Used',
    images: ['https://placehold.co/600x400/34495E/FFFFFF.png'],
    description: 'A performance cruiser with elegant lines and a powerful sail plan. Perfect for both competitive racing and comfortable blue-water cruising. Well-maintained by a single owner.',
    fuelType: 'diesel',
    hullMaterial: 'composite',
  },
  {
    id: '5',
    name: 'Wind Whisperer',
    boatType: 'Sailing',
    listingType: 'Private',
    price: 480000,
    year: 2019,
    length: 45,
    location: 'Santorini, Greece',
    locationId: 'santorini',
    imageUrl: 'https://placehold.co/600x400/E0E0E0/363636.png',
    imageHint: 'sailboat sunset',
    make: 'Beneteau',
    model: 'Oceanis 45',
    condition: 'Used',
    images: ['https://placehold.co/600x400/E0E0E0/363636.png'],
    description: 'The ideal Mediterranean cruiser. This Beneteau Oceanis 45 is easy to handle, comfortable, and has been lovingly cared for. Equipped with solar panels and a water maker for extended cruising.',
    fuelType: 'diesel',
    hullMaterial: 'fiberglass',
  },
  {
    id: '9',
    name: 'Gale Force',
    boatType: 'Sailing',
    listingType: 'Broker',
    price: 650000,
    year: 2018,
    length: 52,
    location: 'Auckland, NZ',
    locationId: 'auckland',
    imageUrl: 'https://placehold.co/600x400/581845/FFC300.png',
    imageHint: 'racing sailboat',
    make: 'Hanse',
    model: '508',
    condition: 'Used',
    images: ['https://placehold.co/600x400/581845/FFC300.png'],
    description: 'A fast and comfortable cruiser from Hanse. Known for its easy-to-handle self-tacking jib and spacious, modern interior. Ready for coastal hopping or offshore passages.',
    fuelType: 'diesel',
    hullMaterial: 'fiberglass',
  },
  {
    id: '1',
    name: 'Serenity Cruiser',
    boatType: 'Sailing',
    listingType: 'Broker',
    price: 1250000,
    year: 2022,
    length: 75,
    location: 'Miami, FL',
    locationId: 'miami',
    imageUrl: 'https://placehold.co/600x400/A2B9D1/34495E.png',
    imageHint: 'modern yacht',
    make: 'Benetti',
    model: 'Oasis 40M',
    condition: 'Used',
    images: [
      'https://placehold.co/600x400/a2b9d1/34495E.png',
      'https://placehold.co/600x400/a2b9d2/34495E.png',
      'https://placehold.co/600x400/a2b9d3/34495E.png',
      'https://placehold.co/600x400/a2b9d4/34495E.png',
      'https://placehold.co/600x400/a2b9d5/34495E.png',
      'https://placehold.co/600x400/a2b9d6/34495E.png',
    ],
    description: 'A stunning example of modern yacht design, offering unparalleled luxury and comfort. Features a spacious open-plan layout, a beach club at the stern, and state-of-the-art navigation systems.',
    fuelType: 'diesel',
    hullMaterial: 'fiberglass',
  },
];

export const priceValues = [
    '10000', '20000', '30000', '40000', '50000', '60000', '70000', '80000', '90000', '100000',
    '150000', '200000', '250000', '300000', '350000', '400000', '450000', '500000',
    '750000', '1000000', '1500000', '2000000', '3000000', '5000000', '10000000'
];

export const boatTypes = [
  { id: 'sailing', label: 'Sailing' },
];

export const usageStyles = [
  { id: 'monohull', label: 'Monohull' },
  { id: 'catamaran', label: 'Catamaran' },
  { id: 'trimaran', label: 'Trimaran' },
  { id: 'expedition', label: 'Expedition' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'off-shore', label: 'Off Shore' },
  { id: 'in-shore', label: 'In Shore' },
  { id: 'racing', label: 'Racing' },
  { id: 'off-grid', label: 'Off Grid' },
  { id: 'project', label: 'Project' },
];

export const makes = [
  { id: '2-bar', value: '2-bar', label: '2 Bar' },
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

export const bowShapeOptions = [
    { id: 'plumb', label: 'Plumb' },
    { id: 'raked', label: 'Raked' },
    { id: 'spoon', label: 'Spoon' },
    { id: 'clipper', label: 'Clipper' },
    { id: 'reverse', label: 'Reverse/Wave-Piercing' },
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

    