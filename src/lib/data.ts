
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
    sailRigging: 'sloop',
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
    sailRigging: 'sloop',
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
    sailRigging: 'sloop',
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
    sailRigging: 'ketch',
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

export const divisions = [
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
    { id: 'abeking-&-rasmussen', value: 'abeking-&-rasmussen', label: 'Abeking & Rasmussen' },
    { id: 'alberg', value: 'alberg', label: 'Alberg' },
    { id: 'alden', value: 'alden', label: 'Alden' },
    { id: 'allied', value: 'allied', label: 'Allied' },
    { id: 'alloy', value: 'alloy', label: 'Alloy' },
    { id: 'allures', value: 'allures', label: 'Allures' },
    { id: 'alubat', value: 'alubat', label: 'Alubat' },
    { id: 'alumarine', value: 'alumarine', label: 'Alumarine' },
    { id: 'amel', value: 'amel', label: 'Amel' },
    { id: 'azimut-benetti', value: 'azimut-benetti', label: 'Azimut-Benetti' },
    { id: 'baba', value: 'baba', label: 'Baba' },
    { id: 'baltic', value: 'baltic', label: 'Baltic' },
    { id: 'bavaria', value: 'bavaria', label: 'Bavaria' },
    { id: 'beneteau', value: 'beneteau', label: 'Beneteau' },
    { id: 'bestevaer', value: 'bestevaer', label: 'Bestevaer' },
    { id: 'bluewater', value: 'bluewater', label: 'Bluewater' },
    { id: 'bowman', value: 'bowman', label: 'Bowman' },
    { id: 'brewer', value: 'brewer', label: 'Brewer' },
    { id: 'bristol-channel-cutter', value: 'bristol-channel-cutter', label: 'Bristol Channel Cutter' },
    { id: 'bruce-roberts', value: 'bruce-roberts', label: 'Bruce Roberts' },
    { id: 'c&c', value: 'c&c', label: 'C&C' },
    { id: 'cal', value: 'cal', label: 'CAL' },
    { id: 'cabo-rico', value: 'cabo-rico', label: 'Cabo Rico' },
    { id: 'caliber', value: 'caliber', label: 'Caliber' },
    { id: 'cape-dory', value: 'cape-dory', label: 'Cape Dory' },
    { id: 'cape-george', value: 'cape-george', label: 'Cape George' },
    { id: 'catalina', value: 'catalina', label: 'Catalina' },
    { id: 'catana', value: 'catana', label: 'Catana' },
    { id: 'chris-white', value: 'chris-white', label: 'Chris White' },
    { id: 'colin-archer', value: 'colin-archer', label: 'Colin Archer' },
    { id: 'columbia', value: 'columbia', label: 'Columbia' },
    { id: 'colvin', value: 'colvin', label: 'Colvin' },
    { id: 'contest', value: 'contest', label: 'Contest' },
    { id: 'contessa', value: 'contessa', label: 'Contessa' },
    { id: 'corbin', value: 'corbin', label: 'Corbin' },
    { id: 'cutter', value: 'cutter', label: 'Cutter' },
    { id: 'dehler', value: 'dehler', label: 'Dehler' },
    { id: 'deerfoot', value: 'deerfoot', label: 'Deerfoot' },
    { id: 'dolphin', value: 'dolphin', label: 'Dolphin' },
    { id: 'dudley-dix', value: 'dudley-dix', label: 'Dudley Dix' },
    { id: 'dufour', value: 'dufour', label: 'Dufour' },
    { id: 'elan', value: 'elan', label: 'Elan' },
    { id: 'endeavour', value: 'endeavour', label: 'Endeavour' },
    { id: 'endurance', value: 'endurance', label: 'Endurance' },
    { id: 'excess', value: 'excess', label: 'Excess' },
    { id: 'farr', value: 'farr', label: 'Farr' },
    { id: 'fountaine-pajot', value: 'fountaine-pajot', label: 'Fountaine Pajot' },
    { id: 'frers', value: 'frers', label: 'Frers' },
    { id: 'fuji', value: 'fuji', label: 'Fuji' },
    { id: 'garcia', value: 'garcia', label: 'Garcia' },
    { id: 'gib\'sea', value: 'gib\'sea', label: 'Gib\'Sea' },
    { id: 'gozzard', value: 'gozzard', label: 'Gozzard' },
    { id: 'greenline', value: 'greenline', label: 'Greenline' },
    { id: 'gulfstar', value: 'gulfstar', label: 'Gulfstar' },
    { id: 'hallberg-rassy', value: 'hallberg-rassy', label: 'Hallberg-Rassy' },
    { id: 'hank-hinckley', value: 'hank-hinckley', label: 'Hank Hinckley' },
    { id: 'hans-christian', value: 'hans-christian', label: 'Hans Christian' },
    { id: 'hanse', value: 'hanse', label: 'Hanse' },
    { id: 'herreshoff', value: 'herreshoff', label: 'Herreshoff' },
    { id: 'hinckley', value: 'hinckley', label: 'Hinckley' },
    { id: 'hoek', value: 'hoek', label: 'Hoek' },
    { id: 'hughes', value: 'hughes', label: 'Hughes' },
    { id: 'hunter-marine', value: 'hunter-marine', label: 'Hunter Marine' },
    { id: 'hylas', value: 'hylas', label: 'Hylas' },
    { id: 'irwin', value: 'irwin', label: 'Irwin' },
    { id: 'island-packet', value: 'island-packet', label: 'Island Packet' },
    { id: 'islander', value: 'islander', label: 'Islander' },
    { id: 'j/boats', value: 'j/boats', label: 'J/Boats' },
    { id: 'jeanneau', value: 'jeanneau', label: 'Jeanneau' },
    { id: 'kanter', value: 'kanter', label: 'Kanter' },
    { id: 'kelly-peterson', value: 'kelly-peterson', label: 'Kelly Peterson' },
    { id: 'knysna', value: 'knysna', label: 'Knysna' },
    { id: 'koopmans', value: 'koopmans', label: 'Koopmans' },
    { id: 'kraken', value: 'kraken', label: 'Kraken' },
    { id: 'lafitte', value: 'lafitte', label: 'Lafitte' },
    { id: 'lagoon', value: 'lagoon', label: 'Lagoon' },
    { id: 'leopard-catamarans', value: 'leopard-catamarans', label: 'Leopard Catamarans' },
    { id: 'lerouge', value: 'lerouge', label: 'Lerouge' },
    { id: 'little-harbor', value: 'little-harbor', label: 'Little Harbor' },
    { id: 'malo', value: 'malo', label: 'Malo' },
    { id: 'maple-leaf', value: 'maple-leaf', label: 'Maple Leaf' },
    { id: 'mason', value: 'mason', label: 'Mason' },
    { id: 'meta', value: 'meta', label: 'Meta' },
    { id: 'moody', value: 'moody', label: 'Moody' },
    { id: 'morrelli-&-melvin', value: 'morrelli-&-melvin', label: 'Morrelli & Melvin' },
    { id: 'najad', value: 'najad', label: 'Najad' },
    { id: 'nautor-swan', value: 'nautor-swan', label: 'Nautor Swan' },
    { id: 'nauticat', value: 'nauticat', label: 'Nauticat' },
    { id: 'neel', value: 'neel', label: 'NEEL' },
    { id: 'nor\'sea', value: 'nor\'sea', label: 'Nor\'Sea' },
    { id: 'nordic', value: 'nordic', label: 'Nordic' },
    { id: 'norseman', value: 'norseman', label: 'Norseman' },
    { id: 'oceanis', value: 'oceanis', label: 'Oceanis' },
    { id: 'outbound', value: 'outbound', label: 'Outbound' },
    { id: 'outremer', value: 'outremer', label: 'Outremer' },
    { id: 'ovni', value: 'ovni', label: 'Ovni' },
    { id: 'oyster', value: 'oyster', label: 'Oyster' },
    { id: 'pacific-seacraft', value: 'pacific-seacraft', label: 'Pacific Seacraft' },
    { id: 'passport', value: 'passport', label: 'Passport' },
    { id: 'pearson', value: 'pearson', label: 'Pearson' },
    { id: 'perry', value: 'perry', label: 'Perry' },
    { id: 'puffin', value: 'puffin', label: 'Puffin' },
    { id: 'robert-perry', value: 'robert-perry', label: 'Robert Perry' },
    { id: 'rustler', value: 'rustler', label: 'Rustler' },
    { id: 'sabre', value: 'sabre', label: 'Sabre' },
    { id: 'saga', value: 'saga', label: 'Saga' },
    { id: 'santa-cruz', value: 'santa-cruz', label: 'Santa Cruz' },
    { id: 'schionning', value: 'schionning', label: 'Schionning' },
    { id: 'shannon', value: 'shannon', label: 'Shannon' },
    { id: 'slocum', value: 'slocum', label: 'Slocum' },
    { id: 'southerly', value: 'southerly', label: 'Southerly' },
    { id: 'southern-cross', value: 'southern-cross', label: 'Southern Cross' },
    { id: 'sparkman-&-stephens', value: 'sparkman-&-stephens', label: 'Sparkman & Stephens' },
    { id: 'spirit', value: 'spirit', label: 'Spirit' },
    { id: 'sun-odyssey', value: 'sun-odyssey', label: 'Sun Odyssey' },
    { id: 'sundeer', value: 'sundeer', label: 'Sundeer' },
    { id: 'sweden', value: 'sweden', label: 'Sweden' },
    { id: 'ta-chiao', value: 'ta-chiao', label: 'Ta Chiao' },
    { id: 'ta-shing', value: 'ta-shing', label: 'Ta Shing' },
    { id: 'tayana', value: 'tayana', label: 'Tayana' },
    { id: 'ted-brewer', value: 'ted-brewer', label: 'Ted Brewer' },
    { id: 'trintella', value: 'trintella', label: 'Trintella' },
    { id: 'tripp', value: 'tripp', label: 'Tripp' },
    { id: 'vagabond', value: 'vagabond', label: 'Vagabond' },
    { id: 'valiant', value: 'valiant', label: 'Valiant' },
    { id: 'van-de-stadt', value: 'van-de-stadt', label: 'Van De Stadt' },
    { id: 'westsail', value: 'westsail', label: 'Westsail' },
    { id: 'x-yachts', value: 'x-yachts', label: 'X-Yachts' },
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

export const transomShapeOptions = [
    { id: 'traditional', label: 'Traditional' },
    { id: 'plumb', label: 'Plumb' },
    { id: 'reverse', label: 'Reverse' },
    { id: 'scoop', label: 'Scoop' },
    { id: 'walk-through', label: 'Walk-through' },
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

export const sailRiggingOptions = [
    { id: 'sloop', label: 'Sloop' },
    { id: 'cutter', label: 'Cutter' },
    { id: 'ketch', label: 'Ketch' },
    { id: 'yawl', label: 'Yawl' },
    { id: 'schooner', label: 'Schooner' },
];


export const featureOptions = [
    { id: 'gps', label: 'GPS Navigation' },
    { id: 'autopilot', label: 'Autopilot System' },
    { id: 'radar', label: 'Radar' },
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

export const cabinFeatureOptions = [
    { id: 'v-berth', label: 'V-Berth' },
    { id: 'aft-cabin', label: 'Aft Cabin' },
    { id: 'air-conditioning', label: 'Air Conditioning' },
    { id: 'heating', label: 'Heating' },
    { id: 'cabin-fans', label: 'Cabin Fans' },
].sort((a, b) => a.label.localeCompare(b.label));

export const saloonOptions = [
    { id: 'tv-set', label: 'TV Set' },
    { id: 'nav-station', label: 'Navigation Station' },
    { id: 'hot-water', label: 'Hot Water System' },
].sort((a, b) => a.label.localeCompare(b.label));

export const galleyOptions = [
    { id: 'refrigerator', label: 'Refrigerator' },
    { id: 'freezer', label: 'Freezer' },
    { id: 'oven', label: 'Oven' },
    { id: 'microwave', label: 'Microwave' },
].sort((a, b) => a.label.localeCompare(b.label));

export const headsOptions = [
    { id: 'electric-head', label: 'Electric Head' },
    { id: 'manual-head', label: 'Manual Head' },
    { id: 'holding-tank', label: 'Holding Tank' },
].sort((a, b) => a.label.localeCompare(b.label));
    

    
