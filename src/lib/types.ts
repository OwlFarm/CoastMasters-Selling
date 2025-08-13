

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

  // Accommodation
  accommodation?: {
      cabins?: string[];
      saloon?: string[];
      galley?: string[];
      heads?: string[];
      
      // New Accommodation fields
      numberOfCabins?: number;
      numberOfBerths?: number;
      interiorMaterial?: string;
      layout?: string;
      floor?: string;
      openCockpit?: boolean;
      aftDeck?: boolean;
      saloonHeadroom?: number;
      heating?: string;
      navigationCenter?: boolean;
      chartTable?: boolean;

      // Galley
      countertop?: string;
      sink?: string;
      cooker?: string;
      oven?: string;
      microwave?: string;
      fridge?: string;
      freezer?: string;
      hotWaterSystem?: string;
      waterPressureSystem?: string;

      // Owner's Cabin
      ownersCabin?: string;
      ownersCabinBedLength?: string;
      ownersCabinWardrobe?: string;
      ownersCabinBathroom?: string;
      ownersCabinToilet?: string;
      ownersCabinToiletSystem?: string;
      ownersCabinWashBasin?: string;
      ownersCabinShower?: string;

      // Guest Cabin 1
      guestCabin1?: string;
      guestCabin1BedLength?: string;
      guestCabin1Wardrobe?: string;

      // Guest Cabin 2
      guestCabin2?: string;
      guestCabin2BedLength?: string;
      guestCabin2Wardrobe?: string;

      // Shared Bathroom
      sharedBathroom?: string;
      sharedToilet?: string;
      sharedToiletSystem?: string;
      sharedWashBasin?: string;
      sharedShower?: string;
      washingMachine?: string;
  };
  machinery?: {
    numberOfEngines?: number;
    make?: string;
    type?: string;
    hp?: number;
    kw?: number;
    fuel?: string;
    yearInstalled?: number;
    yearOfOverhaul?: string;
    maxSpeedKnots?: number;
    cruisingSpeedKnots?: number;
    consumptionLhr?: number;
    engineCoolingSystem?: string;
    drive?: string;
    shaftSeal?: string;
    engineControls?: string;
    gearbox?: string;
    bowthruster?: string;
    propellerType?: string;
    manualBilgePump?: string;
    electricBilgePump?: string;
    electricalInstallation?: string;
    generator?: string;
    batteries?: string;
    startBattery?: string;
    serviceBattery?: string;
    batteryMonitor?: string;
    batteryCharger?: string;
    solarPanel?: string;
    shorepower?: string;
    watermaker?: string;
    extraInfo?: string;
  };
  navigation?: {
    compass?: string;
    depthSounder?: string;
    log?: string;
    windset?: string;
    vhf?: string;
    autopilot?: string;
    radar?: string;
    gps?: string;
    plotter?: string;
    navtex?: string;
    aisTransceiver?: string;
    navigationLights?: string;
    extraInfo?: string;
  };
  equipment?: {
    fixedWindscreen?: string;
    cockpitTable?: string;
    bathingPlatform?: string;
    boardingLadder?: string;
    deckShower?: string;
    anchor?: string;
    anchorChain?: string;
    anchor2?: string;
    windlass?: string;
    deckWash?: string;
    dinghy?: string;
    outboard?: string;
    davits?: string;
    seaRailing?: string;
    pushpit?: string;
    pulpit?: string;
    lifebuoy?: string;
    radarReflector?: string;
    fenders?: string;
    mooringLines?: string;
    radio?: string;
    cockpitSpeakers?: string;
    speakersInSalon?: string;
    fireExtinguisher?: string;
  };
  rigging?: {
    rigging?: string;
    standingRigging?: string;
    brandMast?: string;
    materialMast?: string;
    spreaders?: string;
    mainsail?: string;
    stowayMast?: string;
    cutterstay?: string;
    jib?: string;
    genoa?: string;
    genoaFurler?: string;
    cutterFurler?: string;
    gennaker?: string;
    spinnaker?: string;
    reefingSystem?: string;
    backstayAdjuster?: string;
    primarySheetWinch?: string;
    secondarySheetWinch?: string;
    genoaSheetwinches?: string;
    halyardWinches?: string;
    multifunctionalWinches?: string;
    spiPole?: string;
  };
};

