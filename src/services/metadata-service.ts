
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
    transomShapeOptions as defaultTransomShapeOptions,
    bowShapeOptions as defaultBowShapeOptions,
    keelTypeOptions as defaultKeelTypeOptions,
    rudderTypeOptions as defaultRudderTypeOptions,
    propellerTypeOptions as defaultPropellerTypeOptions,
    sailRiggingOptions as defaultSailRiggingOptions,
    featureOptions as defaultFeatureOptions,
    divisions as defaultDivisions,
    deckOptions as defaultDeckOptions,
    cabinFeatureOptions as defaultCabinFeatureOptions,
    saloonOptions as defaultSaloonOptions,
    galleyOptions as defaultGalleyOptions,
    headsOptions as defaultHeadsOptions,
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
    transomShapeOptions: Option[];
    bowShapeOptions: Option[];
    keelTypeOptions: Option[];
    rudderTypeOptions: Option[];
    propellerTypeOptions: Option[];
    sailRiggingOptions: Option[];
    featureOptions: Option[];
    divisions: Option[];
    deckOptions: Option[];
    cabinFeatureOptions: Option[];
    saloonOptions: Option[];
    galleyOptions: Option[];
    headsOptions: Option[];
    listingTypes: Option[];
    priceValues: string[];
    // This is a new type that combines cabin, saloon, galley, and heads for the preview component.
    // It's not stored in the database.
    cabinOptions: Option[];
};

// In-memory cache
let metadataCache: Metadata | null = null;

// ****** DEVELOPMENT ONLY: Force re-initialization ******
const FORCE_REINIT = true; 
// ******************************************************

async function initializeMetadata() {
    console.log('Initializing metadata from default data...');
    const metadataRef = doc(db, 'metadata', 'options');
    const defaultData = {
        boatTypes: defaultBoatTypes,
        makes: defaultMakes,
        locationsByRegion: defaultLocationsByRegion,
        conditions: defaultConditions,
        fuelTypes: defaultFuelTypes,
        hullMaterialOptions: defaultHullMaterialOptions,
        transomShapeOptions: defaultTransomShapeOptions,
        bowShapeOptions: defaultBowShapeOptions,
        keelTypeOptions: defaultKeelTypeOptions,
        rudderTypeOptions: defaultRudderTypeOptions,
        propellerTypeOptions: defaultPropellerTypeOptions,
        sailRiggingOptions: defaultSailRiggingOptions,
        featureOptions: defaultFeatureOptions,
        divisions: defaultDivisions,
        deckOptions: defaultDeckOptions,
        cabinFeatureOptions: defaultCabinFeatureOptions,
        saloonOptions: defaultSaloonOptions,
        galleyOptions: defaultGalleyOptions,
        headsOptions: defaultHeadsOptions,
        listingTypes: defaultListingTypes,
        priceValues: defaultPriceValues,
    };
    await setDoc(metadataRef, defaultData, { merge: true });
    console.log('Metadata initialized in Firestore.');
    // The full metadata object needs to be constructed after setting the doc
     const fullMetadata: Metadata = {
        ...defaultData,
        cabinOptions: [
            ...defaultCabinFeatureOptions,
            ...defaultSaloonOptions,
            ...defaultGalleyOptions,
            ...defaultHeadsOptions,
        ],
    };
    return fullMetadata;
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
                transomShapeOptions: data.transomShapeOptions || defaultTransomShapeOptions,
                bowShapeOptions: data.bowShapeOptions || defaultBowShapeOptions,
                keelTypeOptions: data.keelTypeOptions || defaultKeelTypeOptions,
                rudderTypeOptions: data.rudderTypeOptions || defaultRudderTypeOptions,
                propellerTypeOptions: data.propellerTypeOptions || defaultPropellerTypeOptions,
                sailRiggingOptions: data.sailRiggingOptions || defaultSailRiggingOptions,
                featureOptions: data.featureOptions || defaultFeatureOptions,
                divisions: data.divisions || defaultDivisions,
                deckOptions: data.deckOptions || defaultDeckOptions,
                cabinFeatureOptions: data.cabinFeatureOptions || defaultCabinFeatureOptions,
                saloonOptions: data.saloonOptions || defaultSaloonOptions,
                galleyOptions: data.galleyOptions || defaultGalleyOptions,
                headsOptions: data.headsOptions || defaultHeadsOptions,
                listingTypes: data.listingTypes || defaultListingTypes,
                priceValues: data.priceValues || defaultPriceValues,
                cabinOptions: [
                    ...(data.cabinFeatureOptions || defaultCabinFeatureOptions),
                    ...(data.saloonOptions || defaultSaloonOptions),
                    ...(data.galleyOptions || defaultGalleyOptions),
                    ...(data.headsOptions || defaultHeadsOptions),
                ]
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
