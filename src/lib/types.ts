
export type Yacht = {
  id: string;
  name: string;
  price: number;
  year: number;
  length: number; // in feet
  location: string;
  locationId?: string;
  imageUrl: string;
  imageHint: string;
  images?: string[];
  make: string;
  model: string;
  listingType: 'Private' | 'Broker';
  boatType: 'Sailing' | 'Catamaran' | string;
  condition: 'New' | 'Used' | string;
  description?: string;
  fuelType?: string;
  hullMaterial?: string;
  hullShape?: string;
  bowShape?: string;
  keelType?: string;
  rudderType?: string;
  propellerType?: string;
  sailRigging?: string;
  divisions?: string[];
  features?: string[];
  deck?: string[];
  accommodation?: {
      cabins?: string[];
      saloon?: string[];
      galley?: string[];
      heads?: string[];
  };
  otherSpecifications?: string;
  saDisp?: number;
  balDisp?: number;
  dispLen?: number;
  comfortRatio?: number;
  capsizeScreeningFormula?: number;
  sNum?: number;
  hullSpeed?: number;
  poundsPerInchImmersion?: number;
};

    