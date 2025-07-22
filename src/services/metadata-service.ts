
import { cache } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
    boatTypes as defaultBoatTypes,
    makes as defaultMakes,
    locationsByRegion as defaultLocationsByRegion,
    conditions as defaultConditions,
    fuelTypes as defaultFuelTypes,
    hullMaterialOptions as defaultHullMaterialOptions,
    hullShapeOptions as defaultHullShapeOptions,
    bowShapeOptions as defaultBowShapeOptions,
    keelTypeOptions as defaultKeelTypeOptions,
    rudderTypeOptions as defaultRudderTypeOptions,
    propellerTypeOptions as defaultPropellerTypeOptions,
    featureOptions as defaultFeatureOptions,
    usageStyles as defaultUsageStyles,
    deckOptions as defaultDeckOptions,
    cabinOptions as defaultCabinOptions,
    listingTypes as defaultListingTypes,
    priceValues as defaultPriceValues,
} from '@/lib/data';

export type Option = {
    id: string;
    label: string;
    value?: string;
};

export type RegionOption = {
    region: string;
    locations: Option[];
}

export type Metadata = {
    boatTypes: Option[];
    makes: Option[];
    locationsByRegion: RegionOption[];
    conditions: Option[];
    fuelTypes: Option[];
    hullMaterialOptions: Option[];
    hullShapeOptions: Option[];
    bowShapeOptions: Option[];
    keelTypeOptions: Option[];
    rudderTypeOptions: Option[];
    propellerTypeOptions: Option[];
    featureOptions: Option[];
    usageStyles: Option[];
    deckOptions: Option[];
    cabinOptions: Option[];
    listingTypes: Option[];
    priceValues: string[];
};

// In-memory cache
let metadataCache: Metadata | null = null;

// ****** DEVELOPMENT ONLY: Force re-initialization ******
const FORCE_REINIT = false; 
// ******************************************************

async function initializeMetadata() {
    console.log('Initializing metadata from default data...');
    const metadataRef = doc(db, 'metadata', 'options');
    const defaultData: Metadata = {
        boatTypes: defaultBoatTypes,
        makes: defaultMakes,
        locationsByRegion: defaultLocationsByRegion,
        conditions: defaultConditions,
        fuelTypes: defaultFuelTypes,
        hullMaterialOptions: defaultHullMaterialOptions,
        hullShapeOptions: defaultHullShapeOptions,
        bowShapeOptions: defaultBowShapeOptions,
        keelTypeOptions: defaultKeelTypeOptions,
        rudderTypeOptions: defaultRudderTypeOptions,
        propellerTypeOptions: defaultPropellerTypeOptions,
        featureOptions: defaultFeatureOptions,
        usageStyles: defaultUsageStyles,
        deckOptions: defaultDeckOptions,
        cabinOptions: defaultCabinOptions,
        listingTypes: defaultListingTypes,
        priceValues: defaultPriceValues,
    };
    await setDoc(metadataRef, defaultData, { merge: true });
    console.log('Metadata initialized in Firestore.');
    return defaultData;
}

export const getMetadata = cache(async (): Promise<Metadata> => {
    if (metadataCache && !FORCE_REINIT) {
        return metadataCache;
    }

    const metadataRef = doc(db, 'metadata', 'options');
    try {
        const docSnap = await getDoc(metadataRef);

        if (docSnap.exists() && !FORCE_REINIT) {
            console.log("Metadata fetched from Firestore.");
            const data = docSnap.data();
            // Ensure all keys exist, falling back to defaults if not present
            metadataCache = {
                boatTypes: data.boatTypes || defaultBoatTypes,
                makes: data.makes || defaultMakes,
                locationsByRegion: data.locationsByRegion || defaultLocationsByRegion,
                conditions: data.conditions || defaultConditions,
                fuelTypes: data.fuelTypes || defaultFuelTypes,
                hullMaterialOptions: data.hullMaterialOptions || defaultHullMaterialOptions,
                hullShapeOptions: data.hullShapeOptions || defaultHullShapeOptions,
                bowShapeOptions: data.bowShapeOptions || defaultBowShapeOptions,
                keelTypeOptions: data.keelTypeOptions || defaultKeelTypeOptions,
                rudderTypeOptions: data.rudderTypeOptions || defaultRudderTypeOptions,
                propellerTypeOptions: data.propellerTypeOptions || defaultPropellerTypeOptions,
                featureOptions: data.featureOptions || defaultFeatureOptions,
                usageStyles: data.usageStyles || defaultUsageStyles,
                deckOptions: data.deckOptions || defaultDeckOptions,
                cabinOptions: data.cabinOptions || defaultCabinOptions,
                listingTypes: data.listingTypes || defaultListingTypes,
                priceValues: data.priceValues || defaultPriceValues,
            };
            return metadataCache;
        } else {
            const reason = FORCE_REINIT ? "Forced re-initialization" : "No metadata found in Firestore";
            console.log(`${reason}. Initializing with default data.`);
            const defaultMetadata = await initializeMetadata();
            metadataCache = defaultMetadata;
            return metadataCache;
        }
    } catch (error) {
        console.error("Error fetching metadata from Firestore:", error);
        console.log("Falling back to initializing default metadata.");
        const defaultMetadata = await initializeMetadata();
        metadataCache = defaultMetadata;
        return metadataCache;
    }
});

    
