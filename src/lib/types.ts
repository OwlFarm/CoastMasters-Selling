

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
  transomShape?: string;
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

  // New General Fields from HALLBERG RASSY 49
  loaM?: number;
  lwlM?: number;
  beamM?: number;
  draftM?: number;
  airDraftM?: number;
  headroomM?: number;
  country?: string;
  designer?: string;
  displacementT?: number;
  ballastTonnes?: number;
  hullColor?: string;
  hullShape?: string;
  superstructureMaterial?: string;
  deckMaterial?: string;
  deckFinish?: string;
  superstructureDeckFinish?: string;
  cockpitDeckFinish?: string;
  dorades?: string;
  windowFrame?: string;
  windowMaterial?: string;
  deckhatch?: string;
  fuelTankLitre?: number;
  levelIndicatorFuel?: string;
  freshwaterTankLitre?: number;
  levelIndicatorFreshwater?: string;
  wheelSteering?: string;
  outsideHelmPosition?: string;
};
