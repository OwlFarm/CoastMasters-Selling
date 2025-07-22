
/**
 * @fileOverview A service to provide detailed specifications for specific yacht models.
 * This acts as a knowledge base for pre-populating new listings.
 */

export interface YachtModelSpecification {
  model: string;
  hullType: string;
  rudderType: string;
  riggingType: string;
  loa: number; // in feet
  lwl: number; // in feet
  saReported: number; // in sq feet
  beam: number; // in feet
  displacement: number; // in lbs
  ballast: number; // in lbs
  maxDraft: number; // in feet
  construction: string;
  firstBuilt: number;
  builder: string;
  designer: string;
  auxiliaryPower: {
    make: string;
    model: string;
    type: string;
    hp: number;
  };
  tanks: {
    fuel: number; // in gals
    water: number; // in gals
  };
  accommodations: {
    headroom: number; // in feet
    sleeps: number;
    heads: number;
  };
  mastHeightFromDWL: number; // in feet
}

// In a real application, this data would likely come from a Firestore collection.
// For now, we'll hardcode the data for known models.
const yachtModelData: Record<string, YachtModelSpecification> = {
  'Najad 460': {
    model: 'Najad 460',
    hullType: 'Fin w/ bulb',
    rudderType: 'Spade rudder',
    riggingType: 'Fractional Sloop',
    loa: 45.77,
    lwl: 38.98,
    saReported: 1065.63,
    beam: 14.04,
    displacement: 34171,
    ballast: 11905,
    maxDraft: 7.05,
    construction: 'Fibre Glass',
    firstBuilt: 2000,
    builder: 'Najad Yachts (SWE)',
    designer: 'Judel/Vrolijk',
    auxiliaryPower: {
      make: 'Yanmar',
      model: '4JH4G-HTE',
      type: 'Diesel',
      hp: 96,
    },
    tanks: {
      fuel: 122,
      water: 149,
    },
    accommodations: {
      headroom: 6.46,
      sleeps: 8,
      heads: 2,
    },
    mastHeightFromDWL: 65.00,
  },
};

/**
 * Finds the specifications for a given yacht model.
 * @param modelName - The name of the model to look up (e.g., "Najad 460").
 * @returns The specification object if found, otherwise null.
 */
export async function getYachtModelSpecs(modelName: string): Promise<YachtModelSpecification | null> {
  // Case-insensitive lookup
  const modelKey = Object.keys(yachtModelData).find(key => key.toLowerCase() === modelName.toLowerCase());
  if (modelKey) {
    return yachtModelData[modelKey];
  }
  return null;
}
