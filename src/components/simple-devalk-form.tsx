'use client';

import React, { useState } from 'react';

export default function SimpleDeValkForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('');
  const [devalkUrl, setDevalkUrl] = useState('');
  
  // Simple state for form fields
  const [formData, setFormData] = useState(() => {
    // Try to load saved data from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devalk-form-data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('📥 Loaded saved form data from localStorage:', parsed);
          return parsed;
        } catch (error) {
          console.error('❌ Error parsing saved form data:', error);
        }
      }
    }
    
    // Return default empty state if no saved data
    return {
    // Key Details
    dimensions: '',
    material: '',
    built: '',
    engines: '',
    hpKw: '',
    askingPrice: '',
    // General Info
    model: '',
    yachtType: '',
    loaM: '',
    beamM: '',
    draftM: '',
    yearBuilt: '',
    builder: '',
    country: '',
    designer: '',
    hullMaterial: '',
    lwlM: '',
    airDraftM: '',
    headroomM: '',
    displacementT: '',
    ballastTonnes: '',
    hullColour: '',
    hullShape: '',
    keelType: '',
    superstructureMaterial: '',
    deckMaterial: '',
    deckFinish: '',
    superstructureDeckFinish: '',
    cockpitDeckFinish: '',
    // Accommodation
    cabins: '',
    berths: '',
    interior: '',
    layout: '',
    floor: '',
    openCockpit: '',
    aftDeck: '',
    saloon: '',
    headroomSalonM: '',
    heating: '',
    navigationCenter: '',
    chartTable: '',
    galley: '',
    countertop: '',
    sink: '',
    cooker: '',
    oven: '',
    microwave: '',
    fridge: '',
    freezer: '',
    hotWaterSystem: '',
    waterPressureSystem: '',
    ownersCabin: '',
    bedLength: '',
    wardrobe: '',
    bathroom: '',
    toilet: '',
    toiletSystem: '',
    washBasin: '',
    shower: '',
    guestCabin1: '',
    guestCabin2: '',
    washingMachine: '',
    // Machinery
    noOfEngines: '',
    make: '',
    type: '',
    hp: '',
    kw: '',
    fuel: '',
    yearInstalled: '',
    yearOfOverhaul: '',
    maximumSpeedKn: '',
    cruisingSpeedKn: '',
    consumptionLhr: '',
    engineCoolingSystem: '',
    drive: '',
    shaftSeal: '',
    engineControls: '',
    gearbox: '',
    bowthruster: '',
    propellerType: '',
    manualBilgePump: '',
    electricBilgePump: '',
    electricalInstallation: '',
    generator: '',
    batteries: '',
    startBattery: '',
    serviceBattery: '',
    batteryMonitor: '',
    batteryCharger: '',
    solarPanel: '',
    shorepower: '',
    watermaker: '',
    // Navigation
    compass: '',
    electricCompass: '',
    depthSounder: '',
    log: '',
    windset: '',
    repeater: '',
    vhf: '',
    vhfHandheld: '',
    autopilot: '',
    rudderAngleIndicator: '',
    radar: '',
    plotterGps: '',
    electronicCharts: '',
    aisTransceiver: '',
    epirb: '',
    navigationLights: '',
    // Equipment
    anchor: '',
    anchorChain: '',
    anchor2: '',
    windlass: '',
    deckWash: '',
    dinghy: '',
    outboard: '',
    davits: '',
    seaRailing: '',
    pushpit: '',
    pulpit: '',
    lifebuoy: '',
    radarReflector: '',
    fenders: '',
    mooringLines: '',
    radio: '',
    cockpitSpeakers: '',
    speakersInSalon: '',
    fireExtinguisher: '',
    fixedWindscreen: '',
    cockpitTable: '',
    bathingPlatform: '',
    boardingLadder: '',
    deckShower: '',
    // Rigging
    rigging: '',
    standingRigging: '',
    brandMast: '',
    materialMast: '',
    spreaders: '',
    mainsail: '',
    stowayMast: '',
    cutterstay: '',
    jib: '',
    genoa: '',
    genoaFurler: '',
    cutterFurler: '',
    gennaker: '',
    spinnaker: '',
    reefingSystem: '',
    backstayAdjuster: '',
    primarySheetWinch: '',
    secondarySheetWinch: '',
    genoaSheetwinches: '',
    halyardWinches: '',
    multifunctionalWinches: '',
    spiPole: '',
    // Indication Ratios
    saDispl: '',
    balDispl: '',
    dispLen: '',
    comfortRatio: '',
    capsizeScreeningFormula: '',
    s: '',
    hullSpeed: '',
    poundsInchImmersion: '',
  };
  });

  const handleMigration = async () => {
    if (!devalkUrl.trim()) {
      setMigrationStatus('❌ Please enter a De Valk URL');
      return;
    }

    setIsLoading(true);
    setMigrationStatus('🔄 Starting De Valk migration...');

    try {
      // Call our De Valk parser
      const response = await fetch('/api/scrape-devalk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: devalkUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMigrationStatus('✅ De Valk data extracted successfully!');
        
        // Populate form with extracted data
        populateFormWithDeValkData(data.data);
        
      } else {
        setMigrationStatus(`❌ Migration failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus(`❌ Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const populateFormWithDeValkData = (data: any) => {
    console.log('🚀 Populating form with De Valk data:', data);
    console.log('🔍 Data type:', typeof data);
    console.log('🔍 Data keys:', Object.keys(data));
    console.log('🔍 Full data structure:', JSON.stringify(data, null, 2));
    
    // Direct field mapping - De Valk to App
    const newFormData = { ...formData };
    
    // Key Details mapping - Fix: access data.data.keyDetails
    if (data.data && data.data.keyDetails) {
      console.log('🔑 Mapping Key Details:', data.data.keyDetails);
      console.log('🔍 keyDetails type:', typeof data.data.keyDetails);
      console.log('🔍 keyDetails keys:', Object.keys(data.data.keyDetails));
      newFormData.dimensions = data.data.keyDetails.dimensions || '';
      newFormData.material = data.data.keyDetails.material || '';
      newFormData.built = data.data.keyDetails.built || '';
      newFormData.engines = data.data.keyDetails.engines || '';
      newFormData.hpKw = data.data.keyDetails.hpKw || '';
      newFormData.askingPrice = data.data.keyDetails.askingPrice || '';
      
      console.log('🔍 Key Details mapped:', {
        dimensions: newFormData.dimensions,
        material: newFormData.material,
        built: newFormData.built,
        engines: newFormData.engines,
        hpKw: newFormData.hpKw,
        askingPrice: newFormData.askingPrice
      });
    } else {
      console.log('❌ No keyDetails found in data.data');
    }
    
    // General Info mapping - Fix: access data.data.generalInfo
    if (data.data && data.data.generalInfo) {
      console.log('📋 Mapping General Info:', data.data.generalInfo);
      console.log('🔍 generalInfo type:', typeof data.data.generalInfo);
      console.log('🔍 generalInfo keys:', Object.keys(data.data.generalInfo));
      newFormData.model = data.data.generalInfo.model || '';
      newFormData.yachtType = data.data.generalInfo.type || '';
      newFormData.loaM = data.data.generalInfo.loaM || '';
      newFormData.beamM = data.data.generalInfo.beamM || '';
      newFormData.draftM = data.data.generalInfo.draftM || '';
      newFormData.yearBuilt = data.data.generalInfo.yearBuilt || '';
      newFormData.builder = data.data.generalInfo.builder || '';
      newFormData.country = data.data.generalInfo.country || '';
      newFormData.designer = data.data.generalInfo.designer || '';
      newFormData.hullMaterial = data.data.generalInfo.hullMaterial || '';
      newFormData.lwlM = data.data.generalInfo.lwlM || '';
      newFormData.airDraftM = data.data.generalInfo.airDraftM || '';
      newFormData.headroomM = data.data.generalInfo.headroomM || '';
      newFormData.displacementT = data.data.generalInfo.displacementT || '';
      newFormData.ballastTonnes = data.data.generalInfo.ballastTonnes || '';
      newFormData.hullColour = data.data.generalInfo.hullColour || '';
      newFormData.hullShape = data.data.generalInfo.hullShape || '';
      newFormData.keelType = data.data.generalInfo.keelType || '';
      newFormData.superstructureMaterial = data.data.generalInfo.superstructureMaterial || '';
      newFormData.deckMaterial = data.data.generalInfo.deckMaterial || '';
      newFormData.deckFinish = data.data.generalInfo.deckFinish || '';
      newFormData.superstructureDeckFinish = data.data.generalInfo.superstructureDeckFinish || '';
      newFormData.cockpitDeckFinish = data.data.generalInfo.cockpitDeckFinish || '';
      
      console.log('🔍 General Info mapped:', {
        model: newFormData.model,
        type: newFormData.type,
        loaM: newFormData.loaM,
        beamM: newFormData.beamM,
        draftM: newFormData.draftM,
        yearBuilt: newFormData.yearBuilt,
        builder: newFormData.builder,
        country: newFormData.country,
        designer: newFormData.designer,
        hullMaterial: newFormData.hullMaterial,
        lwlM: newFormData.lwlM,
        airDraftM: newFormData.airDraftM,
        headroomM: newFormData.headroomM,
        displacementT: newFormData.displacementT,
        ballastTonnes: newFormData.ballastTonnes,
        hullColour: newFormData.hullColour,
        hullShape: newFormData.hullShape,
        keelType: newFormData.keelType,
        superstructureMaterial: newFormData.superstructureMaterial,
        deckMaterial: newFormData.deckMaterial,
        deckFinish: newFormData.deckFinish,
        superstructureDeckFinish: newFormData.superstructureDeckFinish,
        cockpitDeckFinish: newFormData.cockpitDeckFinish
      });
    } else {
      console.log('❌ No generalInfo found in data.data');
    }
    
    // Accommodation mapping
    if (data.data && data.data.accommodation) {
      console.log('🏠 Mapping Accommodation:', data.data.accommodation);
      console.log('🔍 accommodation type:', typeof data.data.accommodation);
      console.log('🔍 accommodation keys:', Object.keys(data.data.accommodation));
      newFormData.cabins = data.data.accommodation.cabins || '';
      newFormData.berths = data.data.accommodation.berths || '';
      newFormData.interior = data.data.accommodation.interior || '';
      newFormData.layout = data.data.accommodation.layout || '';
      newFormData.floor = data.data.accommodation.floor || '';
      newFormData.openCockpit = data.data.accommodation.openCockpit || '';
      newFormData.aftDeck = data.data.accommodation.aftDeck || '';
      newFormData.saloon = data.data.accommodation.saloon || '';
      newFormData.headroomSalonM = data.data.accommodation.headroomSalonM || '';
      newFormData.heating = data.data.accommodation.heating || '';
      newFormData.navigationCenter = data.data.accommodation.navigationCenter || '';
      newFormData.chartTable = data.data.accommodation.chartTable || '';
      newFormData.galley = data.data.accommodation.galley || '';
      newFormData.countertop = data.data.accommodation.countertop || '';
      newFormData.sink = data.data.accommodation.sink || '';
      newFormData.cooker = data.data.accommodation.cooker || '';
      newFormData.oven = data.data.accommodation.oven || '';
      newFormData.microwave = data.data.accommodation.microwave || '';
      newFormData.fridge = data.data.accommodation.fridge || '';
      newFormData.freezer = data.data.accommodation.freezer || '';
      newFormData.hotWaterSystem = data.data.accommodation.hotWaterSystem || '';
      newFormData.waterPressureSystem = data.data.accommodation.waterPressureSystem || '';
      newFormData.ownersCabin = data.data.accommodation.ownersCabin || '';
      newFormData.bedLength = data.data.accommodation.bedLength || '';
      newFormData.wardrobe = data.data.accommodation.wardrobe || '';
      newFormData.bathroom = data.data.accommodation.bathroom || '';
      newFormData.toilet = data.data.accommodation.toilet || '';
      newFormData.toiletSystem = data.data.accommodation.toiletSystem || '';
      newFormData.washBasin = data.data.accommodation.washBasin || '';
      newFormData.shower = data.data.accommodation.shower || '';
      newFormData.guestCabin1 = data.data.accommodation.guestCabin1 || '';
      newFormData.guestCabin2 = data.data.accommodation.guestCabin2 || '';
      newFormData.washingMachine = data.data.accommodation.washingMachine || '';
      
      console.log('🔍 Accommodation mapped:', {
        cabins: newFormData.cabins,
        berths: newFormData.berths,
        interior: newFormData.interior,
        layout: newFormData.layout,
        floor: newFormData.floor,
        openCockpit: newFormData.openCockpit,
        aftDeck: newFormData.aftDeck,
        saloon: newFormData.saloon,
        headroomSalonM: newFormData.headroomSalonM,
        heating: newFormData.heating,
        navigationCenter: newFormData.navigationCenter,
        chartTable: newFormData.chartTable,
        galley: newFormData.galley,
        countertop: newFormData.countertop,
        sink: newFormData.sink,
        cooker: newFormData.cooker,
        oven: newFormData.oven,
        microwave: newFormData.microwave,
        fridge: newFormData.fridge,
        freezer: newFormData.freezer,
        hotWaterSystem: newFormData.hotWaterSystem,
        waterPressureSystem: newFormData.waterPressureSystem,
        ownersCabin: newFormData.ownersCabin,
        bedLength: newFormData.bedLength,
        wardrobe: newFormData.wardrobe,
        bathroom: newFormData.bathroom,
        toilet: newFormData.toilet,
        toiletSystem: newFormData.toiletSystem,
        washBasin: newFormData.washBasin,
        shower: newFormData.shower,
        guestCabin1: newFormData.guestCabin1,
        guestCabin2: newFormData.guestCabin2,
        washingMachine: newFormData.washingMachine
      });
    } else {
      console.log('❌ No accommodation found in data.data');
    }
    
    // Machinery mapping
    if (data.data && data.data.machinery) {
      console.log('⚙️ Mapping Machinery:', data.data.machinery);
      console.log('🔍 machinery type:', typeof data.data.machinery);
      console.log('🔍 machinery keys:', Object.keys(data.data.machinery));
      newFormData.noOfEngines = data.data.machinery.noOfEngines || '';
      newFormData.make = data.data.machinery.make || '';
      newFormData.type = data.data.machinery.type || '';
      newFormData.hp = data.data.machinery.hp || '';
      newFormData.kw = data.data.machinery.kw || '';
      newFormData.fuel = data.data.machinery.fuel || '';
      newFormData.yearInstalled = data.data.machinery.yearInstalled || '';
      newFormData.yearOfOverhaul = data.data.machinery.yearOfOverhaul || '';
      newFormData.maximumSpeedKn = data.data.machinery.maximumSpeedKn || '';
      newFormData.cruisingSpeedKn = data.data.machinery.cruisingSpeedKn || '';
      newFormData.consumptionLhr = data.data.machinery.consumptionLhr || '';
      newFormData.engineCoolingSystem = data.data.machinery.engineCoolingSystem || '';
      newFormData.drive = data.data.machinery.drive || '';
      newFormData.shaftSeal = data.data.machinery.shaftSeal || '';
      newFormData.engineControls = data.data.machinery.engineControls || '';
      newFormData.gearbox = data.data.machinery.gearbox || '';
      newFormData.bowthruster = data.data.machinery.bowthruster || '';
      newFormData.propellerType = data.data.machinery.propellerType || '';
      newFormData.manualBilgePump = data.data.machinery.manualBilgePump || '';
      newFormData.electricBilgePump = data.data.machinery.electricBilgePump || '';
      newFormData.electricalInstallation = data.data.machinery.electricalInstallation || '';
      newFormData.generator = data.data.machinery.generator || '';
      newFormData.batteries = data.data.machinery.batteries || '';
      newFormData.startBattery = data.data.machinery.startBattery || '';
      newFormData.serviceBattery = data.data.machinery.serviceBattery || '';
      newFormData.batteryMonitor = data.data.machinery.batteryMonitor || '';
      newFormData.batteryCharger = data.data.machinery.batteryCharger || '';
      newFormData.solarPanel = data.data.machinery.solarPanel || '';
      newFormData.shorepower = data.data.machinery.shorepower || '';
      newFormData.watermaker = data.data.machinery.watermaker || '';
      
      console.log('🔍 Machinery mapped:', {
        noOfEngines: newFormData.noOfEngines,
        make: newFormData.make,
        type: newFormData.type,
        hp: newFormData.hp,
        kw: newFormData.kw,
        fuel: newFormData.fuel,
        yearInstalled: newFormData.yearInstalled,
        yearOfOverhaul: newFormData.yearOfOverhaul,
        maximumSpeedKn: newFormData.maximumSpeedKn,
        cruisingSpeedKn: newFormData.cruisingSpeedKn,
        consumptionLhr: newFormData.consumptionLhr,
        engineCoolingSystem: newFormData.engineCoolingSystem,
        drive: newFormData.drive,
        shaftSeal: newFormData.shaftSeal,
        engineControls: newFormData.engineControls,
        gearbox: newFormData.gearbox,
        bowthruster: newFormData.bowthruster,
        propellerType: newFormData.propellerType,
        manualBilgePump: newFormData.manualBilgePump,
        electricBilgePump: newFormData.electricBilgePump,
        electricalInstallation: newFormData.electricalInstallation,
        generator: newFormData.generator,
        batteries: newFormData.batteries,
        startBattery: newFormData.startBattery,
        serviceBattery: newFormData.serviceBattery,
        batteryMonitor: newFormData.batteryMonitor,
        batteryCharger: newFormData.batteryCharger,
        solarPanel: newFormData.solarPanel,
        shorepower: newFormData.shorepower,
        watermaker: newFormData.watermaker
      });
    } else {
      console.log('❌ No machinery found in data.data');
    }
    
    // Navigation mapping
    if (data.data && data.data.navigation) {
      console.log('🧭 Mapping Navigation:', data.data.navigation);
      console.log('🔍 navigation type:', typeof data.data.navigation);
      console.log('🔍 navigation keys:', Object.keys(data.data.navigation));
      newFormData.compass = data.data.navigation.compass || '';
      newFormData.electricCompass = data.data.navigation.electricCompass || '';
      newFormData.depthSounder = data.data.navigation.depthSounder || '';
      newFormData.log = data.data.navigation.log || '';
      newFormData.windset = data.data.navigation.windset || '';
      newFormData.repeater = data.data.navigation.repeater || '';
      newFormData.vhf = data.data.navigation.vhf || '';
      newFormData.vhfHandheld = data.data.navigation.vhfHandheld || '';
      newFormData.autopilot = data.data.navigation.autopilot || '';
      newFormData.rudderAngleIndicator = data.data.navigation.rudderAngleIndicator || '';
      newFormData.radar = data.data.navigation.radar || '';
      newFormData.plotterGps = data.data.navigation.plotterGps || '';
      newFormData.electronicCharts = data.data.navigation.electronicCharts || '';
      newFormData.aisTransceiver = data.data.navigation.aisTransceiver || '';
      newFormData.epirb = data.data.navigation.epirb || '';
      newFormData.navigationLights = data.data.navigation.navigationLights || '';
      
      console.log('🔍 Navigation mapped:', {
        compass: newFormData.compass,
        electricCompass: newFormData.electricCompass,
        depthSounder: newFormData.depthSounder,
        log: newFormData.log,
        windset: newFormData.windset,
        repeater: newFormData.repeater,
        vhf: newFormData.vhf,
        vhfHandheld: newFormData.vhfHandheld,
        autopilot: newFormData.autopilot,
        rudderAngleIndicator: newFormData.rudderAngleIndicator,
        radar: newFormData.radar,
        plotterGps: newFormData.plotterGps,
        electronicCharts: newFormData.electronicCharts,
        aisTransceiver: newFormData.aisTransceiver,
        epirb: newFormData.epirb,
        navigationLights: newFormData.navigationLights
      });
    } else {
      console.log('❌ No navigation found in data.data');
    }
    
    // Equipment mapping
    if (data.data && data.data.equipment) {
      console.log('🛠️ Mapping Equipment:', data.data.equipment);
      console.log('🔍 equipment type:', typeof data.data.equipment);
      console.log('🔍 equipment keys:', Object.keys(data.data.equipment));
      newFormData.anchor = data.data.equipment.anchor || '';
      newFormData.anchorChain = data.data.equipment.anchorChain || '';
      newFormData.anchor2 = data.data.equipment.anchor2 || '';
      newFormData.windlass = data.data.equipment.windlass || '';
      newFormData.deckWash = data.data.equipment.deckWash || '';
      newFormData.dinghy = data.data.equipment.dinghy || '';
      newFormData.outboard = data.data.equipment.outboard || '';
      newFormData.davits = data.data.equipment.davits || '';
      newFormData.seaRailing = data.data.equipment.seaRailing || '';
      newFormData.pushpit = data.data.equipment.pushpit || '';
      newFormData.pulpit = data.data.equipment.pulpit || '';
      newFormData.lifebuoy = data.data.equipment.lifebuoy || '';
      newFormData.radarReflector = data.data.equipment.radarReflector || '';
      newFormData.fenders = data.data.equipment.fenders || '';
      newFormData.mooringLines = data.data.equipment.mooringLines || '';
      newFormData.radio = data.data.equipment.radio || '';
      newFormData.cockpitSpeakers = data.data.equipment.cockpitSpeakers || '';
      newFormData.speakersInSalon = data.data.equipment.speakersInSalon || '';
      newFormData.fireExtinguisher = data.data.equipment.fireExtinguisher || '';
      newFormData.fixedWindscreen = data.data.equipment.fixedWindscreen || '';
      newFormData.cockpitTable = data.data.equipment.cockpitTable || '';
      newFormData.bathingPlatform = data.data.equipment.bathingPlatform || '';
      newFormData.boardingLadder = data.data.equipment.boardingLadder || '';
      newFormData.deckShower = data.data.equipment.deckShower || '';
      
      console.log('🔍 Equipment mapped:', {
        anchor: newFormData.anchor,
        anchorChain: newFormData.anchorChain,
        anchor2: newFormData.anchor2,
        windlass: newFormData.windlass,
        deckWash: newFormData.deckWash,
        dinghy: newFormData.dinghy,
        outboard: newFormData.outboard,
        davits: newFormData.davits,
        seaRailing: newFormData.seaRailing,
        pushpit: newFormData.pushpit,
        pulpit: newFormData.pulpit,
        lifebuoy: newFormData.lifebuoy,
        radarReflector: newFormData.radarReflector,
        fenders: newFormData.fenders,
        mooringLines: newFormData.mooringLines,
        radio: newFormData.radio,
        cockpitSpeakers: newFormData.cockpitSpeakers,
        speakersInSalon: newFormData.speakersInSalon,
        fireExtinguisher: newFormData.fireExtinguisher,
        fixedWindscreen: newFormData.fixedWindscreen,
        cockpitTable: newFormData.cockpitTable,
        bathingPlatform: newFormData.bathingPlatform,
        boardingLadder: newFormData.boardingLadder,
        deckShower: newFormData.deckShower
      });
    } else {
      console.log('❌ No equipment found in data.data');
    }
    
    // Rigging mapping
    if (data.data && data.data.rigging) {
      console.log('⛵ Mapping Rigging:', data.data.rigging);
      console.log('🔍 rigging type:', typeof data.data.rigging);
      console.log('🔍 rigging keys:', Object.keys(data.data.rigging));
      newFormData.rigging = data.data.rigging.rigging || '';
      newFormData.standingRigging = data.data.rigging.standingRigging || '';
      newFormData.brandMast = data.data.rigging.brandMast || '';
      newFormData.materialMast = data.data.rigging.materialMast || '';
      newFormData.spreaders = data.data.rigging.spreaders || '';
      newFormData.mainsail = data.data.rigging.mainsail || '';
      newFormData.stowayMast = data.data.rigging.stowayMast || '';
      newFormData.cutterstay = data.data.rigging.cutterstay || '';
      newFormData.jib = data.data.rigging.jib || '';
      newFormData.genoa = data.data.rigging.genoa || '';
      newFormData.genoaFurler = data.data.rigging.genoaFurler || '';
      newFormData.cutterFurler = data.data.rigging.cutterFurler || '';
      newFormData.gennaker = data.data.rigging.gennaker || '';
      newFormData.spinnaker = data.data.rigging.spinnaker || '';
      newFormData.reefingSystem = data.data.rigging.reefingSystem || '';
      newFormData.backstayAdjuster = data.data.rigging.backstayAdjuster || '';
      newFormData.primarySheetWinch = data.data.rigging.primarySheetWinch || '';
      newFormData.secondarySheetWinch = data.data.rigging.secondarySheetWinch || '';
      newFormData.genoaSheetwinches = data.data.rigging.genoaSheetwinches || '';
      newFormData.halyardWinches = data.data.rigging.halyardWinches || '';
      newFormData.multifunctionalWinches = data.data.rigging.multifunctionalWinches || '';
      newFormData.spiPole = data.data.rigging.spiPole || '';
      
      console.log('🔍 Rigging mapped:', {
        rigging: newFormData.rigging,
        standingRigging: newFormData.standingRigging,
        brandMast: newFormData.brandMast,
        materialMast: newFormData.materialMast,
        spreaders: newFormData.spreaders,
        mainsail: newFormData.mainsail,
        stowayMast: newFormData.stowayMast,
        cutterstay: newFormData.cutterstay,
        jib: newFormData.jib,
        genoa: newFormData.genoa,
        genoaFurler: newFormData.genoaFurler,
        cutterFurler: newFormData.cutterFurler,
        gennaker: newFormData.gennaker,
        spinnaker: newFormData.spinnaker,
        reefingSystem: newFormData.reefingSystem,
        backstayAdjuster: newFormData.backstayAdjuster,
        primarySheetWinch: newFormData.primarySheetWinch,
        secondarySheetWinch: newFormData.secondarySheetWinch,
        genoaSheetwinches: newFormData.genoaSheetwinches,
        halyardWinches: newFormData.halyardWinches,
        multifunctionalWinches: newFormData.multifunctionalWinches,
        spiPole: newFormData.spiPole
      });
    } else {
      console.log('❌ No rigging found in data.data');
    }
    
    // Indication Ratios mapping
    if (data.data && data.data.indicationRatios) {
      console.log('📊 Mapping Indication Ratios:', data.data.indicationRatios);
      console.log('🔍 indicationRatios type:', typeof data.data.indicationRatios);
      console.log('🔍 indicationRatios keys:', Object.keys(data.data.indicationRatios));
      newFormData.saDispl = data.data.indicationRatios.saDispl || '';
      newFormData.balDispl = data.data.indicationRatios.balDispl || '';
      newFormData.dispLen = data.data.indicationRatios.dispLen || '';
      newFormData.comfortRatio = data.data.indicationRatios.comfortRatio || '';
      newFormData.capsizeScreeningFormula = data.data.indicationRatios.capsizeScreeningFormula || '';
      newFormData.s = data.data.indicationRatios.s || '';
      newFormData.hullSpeed = data.data.indicationRatios.hullSpeed || '';
      newFormData.poundsInchImmersion = data.data.indicationRatios.poundsInchImmersion || '';
      
      console.log('🔍 Indication Ratios mapped:', {
        saDispl: newFormData.saDispl,
        balDispl: newFormData.balDispl,
        dispLen: newFormData.dispLen,
        comfortRatio: newFormData.comfortRatio,
        capsizeScreeningFormula: newFormData.capsizeScreeningFormula,
        s: newFormData.s,
        hullSpeed: newFormData.hullSpeed,
        poundsInchImmersion: newFormData.poundsInchImmersion
      });
    } else {
      console.log('❌ No indicationRatios found in data.data');
    }
    
    // Update form state with a callback to ensure it's the latest
    setFormData((prevData: any) => {
      console.log('🔄 Previous form data:', prevData);
      console.log('🔄 New form data to set:', newFormData);
      return newFormData;
    });
    
    console.log('✅ Form populated with De Valk data');
    console.log('🔍 New form data object:', newFormData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Save to localStorage whenever form data changes
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('devalk-form-data', JSON.stringify(newData));
          console.log('💾 Form data saved to localStorage');
        } catch (error) {
          console.error('❌ Error saving to localStorage:', error);
        }
      }
      
      return newData;
    });
  };

  // Enhanced data export functions
  const exportToJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devalk-yacht-${formData.model || 'data'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    console.log('✅ JSON file exported successfully!');
    // You can enhance this with toast notifications later
  };

  const exportToCSV = () => {
    // Convert form data to CSV format
    const csvRows = [];
    
    // Add header row
    const headers = Object.keys(formData);
    csvRows.push(headers.join(','));
    
    // Add data row
    const values = Object.values(formData);
    csvRows.push(values.map(value => `"${value}"`).join(','));
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devalk-yacht-${formData.model || 'data'}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    console.log('✅ CSV file exported successfully!');
    // You can enhance this with toast notifications later
  };

  const copyToClipboard = async () => {
    try {
      const dataStr = JSON.stringify(formData, null, 2);
      await navigator.clipboard.writeText(dataStr);
      // Show success feedback (you can enhance this with toast notifications)
      console.log('✅ Data copied to clipboard successfully!');
    } catch (err) {
      console.error('❌ Failed to copy to clipboard:', err);
    }
  };

  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('devalk-form-data');
        console.log('🗑️ localStorage cleared successfully');
        // Reset form to empty state
        setFormData({
          // Key Details
          dimensions: '', material: '', built: '', engines: '', hpKw: '', askingPrice: '',
          // General Info
          model: '', yachtType: '', loaM: '', beamM: '', draftM: '', yearBuilt: '', builder: '', country: '', designer: '', hullMaterial: '',
          lwlM: '', airDraftM: '', headroomM: '', displacementT: '', ballastTonnes: '', hullColour: '', hullShape: '', keelType: '',
          superstructureMaterial: '', deckMaterial: '', deckFinish: '', superstructureDeckFinish: '', cockpitDeckFinish: '',
          // Accommodation
          cabins: '', berths: '', interior: '', layout: '', floor: '', openCockpit: '', aftDeck: '', saloon: '', headroomSalonM: '',
          heating: '', navigationCenter: '', chartTable: '', galley: '', countertop: '', sink: '', cooker: '', oven: '', microwave: '',
          fridge: '', freezer: '', hotWaterSystem: '', waterPressureSystem: '', ownersCabin: '', bedLength: '', wardrobe: '',
          bathroom: '', toilet: '', toiletSystem: '', washBasin: '', shower: '', guestCabin1: '', guestCabin2: '', washingMachine: '',
          // Machinery
          noOfEngines: '', make: '', type: '', hp: '', kw: '', fuel: '', yearInstalled: '', yearOfOverhaul: '', maximumSpeedKn: '',
          cruisingSpeedKn: '', consumptionLhr: '', engineCoolingSystem: '', drive: '', shaftSeal: '', engineControls: '', gearbox: '',
          bowthruster: '', propellerType: '', manualBilgePump: '', electricBilgePump: '', electricalInstallation: '', generator: '',
          batteries: '', startBattery: '', serviceBattery: '', batteryMonitor: '', batteryCharger: '', solarPanel: '', shorepower: '',
          watermaker: '',
          // Navigation
          compass: '', electricCompass: '', depthSounder: '', log: '', windset: '', repeater: '', vhf: '', vhfHandheld: '',
          autopilot: '', rudderAngleIndicator: '', radar: '', plotterGps: '', electronicCharts: '', aisTransceiver: '', epirb: '',
          navigationLights: '',
          // Equipment
          anchor: '', anchorChain: '', anchor2: '', windlass: '', deckWash: '', dinghy: '', outboard: '', davits: '', seaRailing: '',
          pushpit: '', pulpit: '', lifebuoy: '', radarReflector: '', fenders: '', mooringLines: '', radio: '', cockpitSpeakers: '',
          speakersInSalon: '', fireExtinguisher: '', fixedWindscreen: '', cockpitTable: '', bathingPlatform: '', boardingLadder: '',
          deckShower: '',
          // Rigging
          rigging: '', standingRigging: '', brandMast: '', materialMast: '', spreaders: '', mainsail: '', stowayMast: '', cutterstay: '',
          jib: '', genoa: '', genoaFurler: '', cutterFurler: '', gennaker: '', spinnaker: '', reefingSystem: '', backstayAdjuster: '',
          primarySheetWinch: '', secondarySheetWinch: '', genoaSheetwinches: '', halyardWinches: '', multifunctionalWinches: '', spiPole: '',
          // Indication Ratios
          saDispl: '', balDispl: '', dispLen: '', comfortRatio: '', capsizeScreeningFormula: '', s: '', hullSpeed: '', poundsInchImmersion: '',
        });
      } catch (err) {
        console.error('❌ Error clearing localStorage:', err);
      }
    }
  };

  const validateFormData = () => {
    const filledFields = Object.values(formData).filter(value => value && value.toString().trim() !== '').length;
    const totalFields = Object.keys(formData).length;
    const completionPercentage = Math.round((filledFields / totalFields) * 100);
    
    return {
      filledFields,
      totalFields,
      completionPercentage,
      isValid: completionPercentage > 0
    };
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced console logging with validation
    const validation = validateFormData();
    console.log('🚀 De Valk Form Data Submitted:', formData);
    console.log('📊 Form Validation Summary:');
    console.log(`  - Filled Fields: ${validation.filledFields}/${validation.totalFields}`);
    console.log(`  - Completion: ${validation.completionPercentage}%`);
    console.log(`  - Valid for submission: ${validation.isValid ? '✅ Yes' : '❌ No'}`);
    
    // Show validation summary to user
    if (validation.isValid) {
      console.log('🎯 Form data is ready for processing!');
      console.log('💡 Use export buttons to save your data.');
    } else {
      console.log('⚠️ Form has no data - consider filling some fields first.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚤 Simple De Valk Aligned Form
          </h1>
          <p className="text-lg text-gray-600">
            Working De Valk field mapping - no complex validation
          </p>
        </div>

        {/* Migration Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔄 De Valk Migration</h2>
          
          <div className="flex gap-4 mb-4">
            <input
              type="url"
              value={devalkUrl}
              onChange={(e) => setDevalkUrl(e.target.value)}
              placeholder="Enter De Valk URL (e.g., https://www.devalk.nl/en/yachtbrokerage/yachts/...)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleMigration}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '🔄 Migrating...' : '🚀 Migrate'}
            </button>
          </div>
          
          {migrationStatus && (
            <div className={`p-4 rounded-md ${
              migrationStatus.includes('✅') ? 'bg-green-50 text-green-800' :
              migrationStatus.includes('❌') ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              {migrationStatus}
            </div>
          )}
        </div>

        {/* Form Content */}
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Key Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔑 Key Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DIMENSIONS</label>
                <input 
                  type="text" 
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  placeholder="e.g., 14.96 x 4.42 x 2.20 (m)" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MATERIAL</label>
                <input 
                  type="text" 
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  placeholder="e.g., GRP" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BUILT</label>
                <input 
                  type="text" 
                  value={formData.built}
                  onChange={(e) => handleInputChange('built', e.target.value)}
                  placeholder="e.g., 1990" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ENGINE(S)</label>
                <input 
                  type="text" 
                  value={formData.engines}
                  onChange={(e) => handleInputChange('engines', e.target.value)}
                  placeholder="e.g., 1x Volvo Penta TMD41A diesel" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HP/KW</label>
                <input 
                  type="text" 
                  value={formData.hpKw}
                  onChange={(e) => handleInputChange('hpKw', e.target.value)}
                  placeholder="e.g., 1x 143.00(hp), 105.25(kw)" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ASKING PRICE</label>
                <input 
                  type="text" 
                  value={formData.askingPrice}
                  onChange={(e) => handleInputChange('askingPrice', e.target.value)}
                  placeholder="e.g., € 275.000" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* General Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MODEL</label>
                <input 
                  type="text" 
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="e.g., HALLBERG RASSY 49" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TYPE</label>
                <input 
                  type="text" 
                  value={formData.yachtType}
                  onChange={(e) => handleInputChange('yachtType', e.target.value)}
                  placeholder="e.g., monohull sailing yacht" 
                  className="w-full px-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LOA (M)</label>
                <input 
                  type="text" 
                  value={formData.loaM}
                  onChange={(e) => handleInputChange('loaM', e.target.value)}
                  placeholder="e.g., 14.96" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BEAM (M)</label>
                <input 
                  type="text" 
                  value={formData.beamM}
                  onChange={(e) => handleInputChange('beamM', e.target.value)}
                  placeholder="e.g., 4.42" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DRAFT (M)</label>
                <input 
                  type="text" 
                  value={formData.draftM}
                  onChange={(e) => handleInputChange('draftM', e.target.value)}
                  placeholder="e.g., 2.20" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YEAR BUILT</label>
                <input 
                  type="text" 
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  placeholder="e.g., 1990" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BUILDER</label>
                <input 
                  type="text" 
                  value={formData.builder}
                  onChange={(e) => handleInputChange('builder', e.target.value)}
                  placeholder="e.g., Hallberg Rassy" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COUNTRY</label>
                <input 
                  type="text" 
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="e.g., Sweden" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DESIGNER</label>
                <input 
                  type="text" 
                  value={formData.designer}
                  onChange={(e) => handleInputChange('designer', e.target.value)}
                  placeholder="e.g., Olle Enderlein" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HULL MATERIAL</label>
                <input 
                  type="text" 
                  value={formData.hullMaterial}
                  onChange={(e) => handleInputChange('hullMaterial', e.target.value)}
                  placeholder="e.g., GRP" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LWL (M)</label>
                <input 
                  type="text" 
                  value={formData.lwlM}
                  onChange={(e) => handleInputChange('lwlM', e.target.value)}
                  placeholder="e.g., 12.50" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AIR DRAFT (M)</label>
                <input 
                  type="text" 
                  value={formData.airDraftM}
                  onChange={(e) => handleInputChange('airDraftM', e.target.value)}
                  placeholder="e.g., 21.45" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HEADROOM (M)</label>
                <input 
                  type="text" 
                  value={formData.headroomM}
                  onChange={(e) => handleInputChange('headroomM', e.target.value)}
                  placeholder="e.g., 2.00" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DISPLACEMENT (T)</label>
                <input 
                  type="text" 
                  value={formData.displacementT}
                  onChange={(e) => handleInputChange('displacementT', e.target.value)}
                  placeholder="e.g., 18" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BALLAST (TONNES)</label>
                <input 
                  type="text" 
                  value={formData.ballastTonnes}
                  onChange={(e) => handleInputChange('ballastTonnes', e.target.value)}
                  placeholder="e.g., 8.1" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HULL COLOUR</label>
                <input 
                  type="text" 
                  value={formData.hullColour}
                  onChange={(e) => handleInputChange('hullColour', e.target.value)}
                  placeholder="e.g., white" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HULL SHAPE</label>
                <input 
                  type="text" 
                  value={formData.hullShape}
                  onChange={(e) => handleInputChange('hullShape', e.target.value)}
                  placeholder="e.g., S-bilged" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KEEL TYPE</label>
                <input 
                  type="text" 
                  value={formData.keelType}
                  onChange={(e) => handleInputChange('keelType', e.target.value)}
                  placeholder="e.g., long keel" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SUPERSTRUCTURE MATERIAL</label>
                <input 
                  type="text" 
                  value={formData.superstructureMaterial}
                  onChange={(e) => handleInputChange('superstructureMaterial', e.target.value)}
                  placeholder="e.g., GRP" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DECK MATERIAL</label>
                <input 
                  type="text" 
                  value={formData.deckMaterial}
                  onChange={(e) => handleInputChange('deckMaterial', e.target.value)}
                  placeholder="e.g., GRP" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DECK FINISH</label>
                <input 
                  type="text" 
                  value={formData.deckFinish}
                  onChange={(e) => handleInputChange('deckFinish', e.target.value)}
                  placeholder="e.g., teak 2019" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SUPERSTRUCTURE DECK FINISH</label>
                <input 
                  type="text" 
                  value={formData.superstructureDeckFinish}
                  onChange={(e) => handleInputChange('superstructureDeckFinish', e.target.value)}
                  placeholder="e.g., teak 2019" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COCKPIT DECK FINISH</label>
                <input 
                  type="text" 
                  value={formData.cockpitDeckFinish}
                  onChange={(e) => handleInputChange('cockpitDeckFinish', e.target.value)}
                  placeholder="e.g., teak" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Accommodation Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏠 Accommodation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CABINS</label>
                <input 
                  type="text" 
                  value={formData.cabins}
                  onChange={(e) => handleInputChange('cabins', e.target.value)}
                  placeholder="e.g., 3" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BERTHS</label>
                <input 
                  type="text" 
                  value={formData.berths}
                  onChange={(e) => handleInputChange('berths', e.target.value)}
                  placeholder="e.g., 6" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">INTERIOR</label>
                <input 
                  type="text" 
                  value={formData.interior}
                  onChange={(e) => handleInputChange('interior', e.target.value)}
                  placeholder="e.g., Teak" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LAYOUT</label>
                <input 
                  type="text" 
                  value={formData.layout}
                  onChange={(e) => handleInputChange('layout', e.target.value)}
                  placeholder="e.g., Salon layout" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FLOOR</label>
                <input 
                  type="text" 
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  placeholder="e.g., Teak and holly" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OPEN COCKPIT</label>
                <input 
                  type="text" 
                  value={formData.openCockpit}
                  onChange={(e) => handleInputChange('openCockpit', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AFT DECK</label>
                <input 
                  type="text" 
                  value={formData.aftDeck}
                  onChange={(e) => handleInputChange('aftDeck', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SALOON</label>
                <input 
                  type="text" 
                  value={formData.saloon}
                  onChange={(e) => handleInputChange('saloon', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HEADROOM SALOON (M)</label>
                <input 
                  type="text" 
                  value={formData.headroomSalonM}
                  onChange={(e) => handleInputChange('headroomSalonM', e.target.value)}
                  placeholder="e.g., 2.00" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HEATING</label>
                <input 
                  type="text" 
                  value={formData.heating}
                  onChange={(e) => handleInputChange('heating', e.target.value)}
                  placeholder="e.g., Webasto diesel heater" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NAVIGATION CENTER</label>
                <input 
                  type="text" 
                  value={formData.navigationCenter}
                  onChange={(e) => handleInputChange('navigationCenter', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CHART TABLE</label>
                <input 
                  type="text" 
                  value={formData.chartTable}
                  onChange={(e) => handleInputChange('chartTable', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GALLEY</label>
                <input 
                  type="text" 
                  value={formData.galley}
                  onChange={(e) => handleInputChange('galley', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COUNTERTOP</label>
                <input 
                  type="text" 
                  value={formData.countertop}
                  onChange={(e) => handleInputChange('countertop', e.target.value)}
                  placeholder="e.g., Wood" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SINK</label>
                <input 
                  type="text" 
                  value={formData.sink}
                  onChange={(e) => handleInputChange('sink', e.target.value)}
                  placeholder="e.g., Stainless steel double" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COOKER</label>
                <input 
                  type="text" 
                  value={formData.cooker}
                  onChange={(e) => handleInputChange('cooker', e.target.value)}
                  placeholder="e.g., Calor gas 4 burner" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OVEN</label>
                <input 
                  type="text" 
                  value={formData.oven}
                  onChange={(e) => handleInputChange('oven', e.target.value)}
                  placeholder="e.g., In cooker" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MICROWAVE</label>
                <input 
                  type="text" 
                  value={formData.microwave}
                  onChange={(e) => handleInputChange('microwave', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FRIDGE</label>
                <input 
                  type="text" 
                  value={formData.fridge}
                  onChange={(e) => handleInputChange('fridge', e.target.value)}
                  placeholder="e.g., Dometic" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FREEZER</label>
                <input 
                  type="text" 
                  value={formData.freezer}
                  onChange={(e) => handleInputChange('freezer', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Machinery Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ Machinery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NO OF ENGINES</label>
                <input 
                  type="text" 
                  value={formData.noOfEngines}
                  onChange={(e) => handleInputChange('noOfEngines', e.target.value)}
                  placeholder="e.g., 1" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MAKE</label>
                <input 
                  type="text" 
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  placeholder="e.g., Yanmar" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TYPE</label>
                <input 
                  type="text" 
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  placeholder="e.g., 4JH110" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HP</label>
                <input 
                  type="text" 
                  value={formData.hp}
                  onChange={(e) => handleInputChange('hp', e.target.value)}
                  placeholder="e.g., 110" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KW</label>
                <input 
                  type="text" 
                  value={formData.kw}
                  onChange={(e) => handleInputChange('kw', e.target.value)}
                  placeholder="e.g., 80.96" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FUEL</label>
                <input 
                  type="text" 
                  value={formData.fuel}
                  onChange={(e) => handleInputChange('fuel', e.target.value)}
                  placeholder="e.g., Diesel" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YEAR INSTALLED</label>
                <input 
                  type="text" 
                  value={formData.yearInstalled}
                  onChange={(e) => handleInputChange('yearInstalled', e.target.value)}
                  placeholder="e.g., 2021" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YEAR OF OVERHAUL</label>
                <input 
                  type="text" 
                  value={formData.yearOfOverhaul}
                  onChange={(e) => handleInputChange('yearOfOverhaul', e.target.value)}
                  placeholder="e.g., 2022" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MAXIMUM SPEED (KN)</label>
                <input 
                  type="text" 
                  value={formData.maximumSpeedKn}
                  onChange={(e) => handleInputChange('maximumSpeedKn', e.target.value)}
                  placeholder="e.g., 9.5" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CRUISING SPEED (KN)</label>
                <input 
                  type="text" 
                  value={formData.cruisingSpeedKn}
                  onChange={(e) => handleInputChange('cruisingSpeedKn', e.target.value)}
                  placeholder="e.g., 7.5" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CONSUMPTION (L/HR)</label>
                <input 
                  type="text" 
                  value={formData.consumptionLhr}
                  onChange={(e) => handleInputChange('consumptionLhr', e.target.value)}
                  placeholder="e.g., 8" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ENGINE COOLING SYSTEM</label>
                <input 
                  type="text" 
                  value={formData.engineCoolingSystem}
                  onChange={(e) => handleInputChange('engineCoolingSystem', e.target.value)}
                  placeholder="e.g., Seawater" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DRIVE</label>
                <input 
                  type="text" 
                  value={formData.drive}
                  onChange={(e) => handleInputChange('drive', e.target.value)}
                  placeholder="e.g., Shaft" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SHAFT SEAL</label>
                <input 
                  type="text" 
                  value={formData.shaftSeal}
                  onChange={(e) => handleInputChange('shaftSeal', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ENGINE CONTROLS</label>
                <input 
                  type="text" 
                  value={formData.engineControls}
                  onChange={(e) => handleInputChange('engineControls', e.target.value)}
                  placeholder="e.g., Bowden cable" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GEARBOX</label>
                <input 
                  type="text" 
                  value={formData.gearbox}
                  onChange={(e) => handleInputChange('gearbox', e.target.value)}
                  placeholder="e.g., Mechanical" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BOWTHRUSTER</label>
                <input 
                  type="text" 
                  value={formData.bowthruster}
                  onChange={(e) => handleInputChange('bowthruster', e.target.value)}
                  placeholder="e.g., Electric 7 hp" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PROPELLER TYPE</label>
                <input 
                  type="text" 
                  value={formData.propellerType}
                  onChange={(e) => handleInputChange('propellerType', e.target.value)}
                  placeholder="e.g., Fixed 3 blade" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MANUAL BILGE PUMP</label>
                <input 
                  type="text" 
                  value={formData.manualBilgePump}
                  onChange={(e) => handleInputChange('manualBilgePump', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ELECTRIC BILGE PUMP</label>
                <input 
                  type="text" 
                  value={formData.electricBilgePump}
                  onChange={(e) => handleInputChange('electricBilgePump', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ELECTRICAL INSTALLATION</label>
                <input 
                  type="text" 
                  value={formData.electricalInstallation}
                  onChange={(e) => handleInputChange('electricalInstallation', e.target.value)}
                  placeholder="e.g., 12V/24V/230V" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GENERATOR</label>
                <input 
                  type="text" 
                  value={formData.generator}
                  onChange={(e) => handleInputChange('generator', e.target.value)}
                  placeholder="e.g., Westerbeke 8 kW" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BATTERIES</label>
                <input 
                  type="text" 
                  value={formData.batteries}
                  onChange={(e) => handleInputChange('batteries', e.target.value)}
                  placeholder="e.g., 6 x 105Ah deep cycle" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">START BATTERY</label>
                <input 
                  type="text" 
                  value={formData.startBattery}
                  onChange={(e) => handleInputChange('startBattery', e.target.value)}
                  placeholder="e.g., 1 x 105Ah" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SERVICE BATTERY</label>
                <input 
                  type="text" 
                  value={formData.serviceBattery}
                  onChange={(e) => handleInputChange('serviceBattery', e.target.value)}
                  placeholder="e.g., 5 x 105Ah" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BATTERY MONITOR</label>
                <input 
                  type="text" 
                  value={formData.batteryMonitor}
                  onChange={(e) => handleInputChange('batteryMonitor', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BATTERY CHARGER</label>
                <input 
                  type="text" 
                  value={formData.batteryCharger}
                  onChange={(e) => handleInputChange('batteryCharger', e.target.value)}
                  placeholder="e.g., Victron 60A" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SOLAR PANEL</label>
                <input 
                  type="text" 
                  value={formData.solarPanel}
                  onChange={(e) => handleInputChange('solarPanel', e.target.value)}
                  placeholder="e.g., 2 x 200W" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SHOREPOWER</label>
                <input 
                  type="text" 
                  value={formData.shorepower}
                  onChange={(e) => handleInputChange('shorepower', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WATERMAKER</label>
                <input 
                  type="text" 
                  value={formData.watermaker}
                  onChange={(e) => handleInputChange('watermaker', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🧭 Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COMPASS</label>
                <input 
                  type="text" 
                  value={formData.compass}
                  onChange={(e) => handleInputChange('compass', e.target.value)}
                  placeholder="e.g., Plastimo" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ELECTRIC COMPASS</label>
                <input 
                  type="text" 
                  value={formData.electricCompass}
                  onChange={(e) => handleInputChange('electricCompass', e.target.value)}
                  placeholder="e.g., Raymarine" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DEPTH SOUNDER</label>
                <input 
                  type="text" 
                  value={formData.depthSounder}
                  onChange={(e) => handleInputChange('depthSounder', e.target.value)}
                  placeholder="e.g., Raymarine ST60" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LOG</label>
                <input 
                  type="text" 
                  value={formData.log}
                  onChange={(e) => handleInputChange('log', e.target.value)}
                  placeholder="e.g., Raymarine ST60" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WINDSET</label>
                <input 
                  type="text" 
                  value={formData.windset}
                  onChange={(e) => handleInputChange('windset', e.target.value)}
                  placeholder="e.g., Raymarine ST60" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">REPEATER</label>
                <input 
                  type="text" 
                  value={formData.repeater}
                  onChange={(e) => handleInputChange('repeater', e.target.value)}
                  placeholder="e.g., 2 x Raymarine i70" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VHF</label>
                <input 
                  type="text" 
                  value={formData.vhf}
                  onChange={(e) => handleInputChange('vhf', e.target.value)}
                  placeholder="e.g., Standard Horizon Explorer" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VHF HANDHELD</label>
                <input 
                  type="text" 
                  value={formData.vhfHandheld}
                  onChange={(e) => handleInputChange('vhfHandheld', e.target.value)}
                  placeholder="e.g., Standard Horizon" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AUTOPILOT</label>
                <input 
                  type="text" 
                  value={formData.autopilot}
                  onChange={(e) => handleInputChange('autopilot', e.target.value)}
                  placeholder="e.g., Raymarine EV 400 (p70)" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUDDER ANGLE INDICATOR</label>
                <input 
                  type="text" 
                  value={formData.rudderAngleIndicator}
                  onChange={(e) => handleInputChange('rudderAngleIndicator', e.target.value)}
                  placeholder="e.g., Raymarine p70" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RADAR</label>
                <input 
                  type="text" 
                  value={formData.radar}
                  onChange={(e) => handleInputChange('radar', e.target.value)}
                  placeholder="e.g., Pathfinder RL 80C" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PLOTTER GPS</label>
                <input 
                  type="text" 
                  value={formData.plotterGps}
                  onChange={(e) => handleInputChange('plotterGps', e.target.value)}
                  placeholder="e.g., Raymarine Axiom 9" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ELECTRONIC CHARTS</label>
                <input 
                  type="text" 
                  value={formData.electronicCharts}
                  onChange={(e) => handleInputChange('electronicCharts', e.target.value)}
                  placeholder="e.g., Navionics" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AIS TRANSCEIVER</label>
                <input 
                  type="text" 
                  value={formData.aisTransceiver}
                  onChange={(e) => handleInputChange('aisTransceiver', e.target.value)}
                  placeholder="e.g., Raymarine AIS 650" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EPIRB</label>
                <input 
                  type="text" 
                  value={formData.epirb}
                  onChange={(e) => handleInputChange('epirb', e.target.value)}
                  placeholder="e.g., RescueMe Ocean Signal" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NAVIGATION LIGHTS</label>
                <input 
                  type="text" 
                  value={formData.navigationLights}
                  onChange={(e) => handleInputChange('navigationLights', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Equipment Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🛠️ Equipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ANCHOR</label>
                <input 
                  type="text" 
                  value={formData.anchor}
                  onChange={(e) => handleInputChange('anchor', e.target.value)}
                  placeholder="e.g., 15kg" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ANCHOR CHAIN</label>
                <input 
                  type="text" 
                  value={formData.anchorChain}
                  onChange={(e) => handleInputChange('anchorChain', e.target.value)}
                  placeholder="e.g., 10mm" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ANCHOR 2</label>
                <input 
                  type="text" 
                  value={formData.anchor2}
                  onChange={(e) => handleInputChange('anchor2', e.target.value)}
                  placeholder="e.g., 10kg" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WINDLASS</label>
                <input 
                  type="text" 
                  value={formData.windlass}
                  onChange={(e) => handleInputChange('windlass', e.target.value)}
                  placeholder="e.g., 12V/24V" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DECK WASH</label>
                <input 
                  type="text" 
                  value={formData.deckWash}
                  onChange={(e) => handleInputChange('deckWash', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DINGHY</label>
                <input 
                  type="text" 
                  value={formData.dinghy}
                  onChange={(e) => handleInputChange('dinghy', e.target.value)}
                  placeholder="e.g., 3.5m" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OUTBOARD</label>
                <input 
                  type="text" 
                  value={formData.outboard}
                  onChange={(e) => handleInputChange('outboard', e.target.value)}
                  placeholder="e.g., 150hp" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DAVITS</label>
                <input 
                  type="text" 
                  value={formData.davits}
                  onChange={(e) => handleInputChange('davits', e.target.value)}
                  placeholder="e.g., 2 x 100kg" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEA RAILING</label>
                <input 
                  type="text" 
                  value={formData.seaRailing}
                  onChange={(e) => handleInputChange('seaRailing', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PUSHPIT</label>
                <input 
                  type="text" 
                  value={formData.pushpit}
                  onChange={(e) => handleInputChange('pushpit', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PULPIT</label>
                <input 
                  type="text" 
                  value={formData.pulpit}
                  onChange={(e) => handleInputChange('pulpit', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LIFEBUOY</label>
                <input 
                  type="text" 
                  value={formData.lifebuoy}
                  onChange={(e) => handleInputChange('lifebuoy', e.target.value)}
                  placeholder="e.g., 2 x 10kg" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RADAR REFLECTOR</label>
                <input 
                  type="text" 
                  value={formData.radarReflector}
                  onChange={(e) => handleInputChange('radarReflector', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FENDERS</label>
                <input 
                  type="text" 
                  value={formData.fenders}
                  onChange={(e) => handleInputChange('fenders', e.target.value)}
                  placeholder="e.g., 2 x 100kg" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MOORING LINES</label>
                <input 
                  type="text" 
                  value={formData.mooringLines}
                  onChange={(e) => handleInputChange('mooringLines', e.target.value)}
                  placeholder="e.g., 2 x 100m" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RADIO</label>
                <input 
                  type="text" 
                  value={formData.radio}
                  onChange={(e) => handleInputChange('radio', e.target.value)}
                  placeholder="e.g., Standard Horizon" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COCKPIT SPEAKERS</label>
                <input 
                  type="text" 
                  value={formData.cockpitSpeakers}
                  onChange={(e) => handleInputChange('cockpitSpeakers', e.target.value)}
                  placeholder="e.g., 2 x 100W" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SPEAKERS IN SALON</label>
                <input 
                  type="text" 
                  value={formData.speakersInSalon}
                  onChange={(e) => handleInputChange('speakersInSalon', e.target.value)}
                  placeholder="e.g., 2 x 100W" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FIRE EXTINGUISHER</label>
                <input 
                  type="text" 
                  value={formData.fireExtinguisher}
                  onChange={(e) => handleInputChange('fireExtinguisher', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FIXED WINDSCREEN</label>
                <input 
                  type="text" 
                  value={formData.fixedWindscreen}
                  onChange={(e) => handleInputChange('fixedWindscreen', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COCKPIT TABLE</label>
                <input 
                  type="text" 
                  value={formData.cockpitTable}
                  onChange={(e) => handleInputChange('cockpitTable', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BATHING PLATFORM</label>
                <input 
                  type="text" 
                  value={formData.bathingPlatform}
                  onChange={(e) => handleInputChange('bathingPlatform', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BOARDING LADDER</label>
                <input 
                  type="text" 
                  value={formData.boardingLadder}
                  onChange={(e) => handleInputChange('boardingLadder', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DECK SHOWER</label>
                <input 
                  type="text" 
                  value={formData.deckShower}
                  onChange={(e) => handleInputChange('deckShower', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Rigging Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏗️ Rigging</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rigging</label>
                <input 
                  type="text" 
                  value={formData.rigging}
                  onChange={(e) => handleInputChange('rigging', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standing Rigging</label>
                <input 
                  type="text" 
                  value={formData.standingRigging}
                  onChange={(e) => handleInputChange('standingRigging', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Mast</label>
                <input 
                  type="text" 
                  value={formData.brandMast}
                  onChange={(e) => handleInputChange('brandMast', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material Mast</label>
                <input 
                  type="text" 
                  value={formData.materialMast}
                  onChange={(e) => handleInputChange('materialMast', e.target.value)}
                  placeholder="e.g., GRP" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spreaders</label>
                <input 
                  type="text" 
                  value={formData.spreaders}
                  onChange={(e) => handleInputChange('spreaders', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mainsail</label>
                <input 
                  type="text" 
                  value={formData.mainsail}
                  onChange={(e) => handleInputChange('mainsail', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stoway Mast</label>
                <input 
                  type="text" 
                  value={formData.stowayMast}
                  onChange={(e) => handleInputChange('stowayMast', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cutterstay</label>
                <input 
                  type="text" 
                  value={formData.cutterstay}
                  onChange={(e) => handleInputChange('cutterstay', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jib</label>
                <input 
                  type="text" 
                  value={formData.jib}
                  onChange={(e) => handleInputChange('jib', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genoa</label>
                <input 
                  type="text" 
                  value={formData.genoa}
                  onChange={(e) => handleInputChange('genoa', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genoa Furler</label>
                <input 
                  type="text" 
                  value={formData.genoaFurler}
                  onChange={(e) => handleInputChange('genoaFurler', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cutter Furler</label>
                <input 
                  type="text" 
                  value={formData.cutterFurler}
                  onChange={(e) => handleInputChange('cutterFurler', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gennaker</label>
                <input 
                  type="text" 
                  value={formData.gennaker}
                  onChange={(e) => handleInputChange('gennaker', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spinnaker</label>
                <input 
                  type="text" 
                  value={formData.spinnaker}
                  onChange={(e) => handleInputChange('spinnaker', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reefing System</label>
                <input 
                  type="text" 
                  value={formData.reefingSystem}
                  onChange={(e) => handleInputChange('reefingSystem', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Backstay Adjuster</label>
                <input 
                  type="text" 
                  value={formData.backstayAdjuster}
                  onChange={(e) => handleInputChange('backstayAdjuster', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Sheet Winch</label>
                <input 
                  type="text" 
                  value={formData.primarySheetWinch}
                  onChange={(e) => handleInputChange('primarySheetWinch', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Sheet Winch</label>
                <input 
                  type="text" 
                  value={formData.secondarySheetWinch}
                  onChange={(e) => handleInputChange('secondarySheetWinch', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genoa Sheet Winches</label>
                <input 
                  type="text" 
                  value={formData.genoaSheetwinches}
                  onChange={(e) => handleInputChange('genoaSheetwinches', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Halyard Winches</label>
                <input 
                  type="text" 
                  value={formData.halyardWinches}
                  onChange={(e) => handleInputChange('halyardWinches', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Multifunctional Winches</label>
                <input 
                  type="text" 
                  value={formData.multifunctionalWinches}
                  onChange={(e) => handleInputChange('multifunctionalWinches', e.target.value)}
                  placeholder="e.g., Full" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SPI Pole</label>
                <input 
                  type="text" 
                  value={formData.spiPole}
                  onChange={(e) => handleInputChange('spiPole', e.target.value)}
                  placeholder="e.g., Yes" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Indication Ratios Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Indication Ratios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">S.A. / DISPL.</label>
                <input 
                  type="text" 
                  value={formData.saDispl}
                  onChange={(e) => handleInputChange('saDispl', e.target.value)}
                  placeholder="e.g., 16.59" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BAL. / DISPL.</label>
                <input 
                  type="text" 
                  value={formData.balDispl}
                  onChange={(e) => handleInputChange('balDispl', e.target.value)}
                  placeholder="e.g., 33.90" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DISP: / LEN.</label>
                <input 
                  type="text" 
                  value={formData.dispLen}
                  onChange={(e) => handleInputChange('dispLen', e.target.value)}
                  placeholder="e.g., 201.36" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COMFORT RATIO</label>
                <input 
                  type="text" 
                  value={formData.comfortRatio}
                  onChange={(e) => handleInputChange('comfortRatio', e.target.value)}
                  placeholder="e.g., 35.33" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CAPSIZE SCREENING FORMULA</label>
                <input 
                  type="text" 
                  value={formData.capsizeScreeningFormula}
                  onChange={(e) => handleInputChange('capsizeScreeningFormula', e.target.value)}
                  placeholder="e.g., 1.81" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">S#</label>
                <input 
                  type="text" 
                  value={formData.s}
                  onChange={(e) => handleInputChange('s', e.target.value)}
                  placeholder="e.g., 2.64" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HULL SPEED</label>
                <input 
                  type="text" 
                  value={formData.hullSpeed}
                  onChange={(e) => handleInputChange('hullSpeed', e.target.value)}
                  placeholder="e.g., 9.10 kn" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">POUNDS/INCH IMMERSION</label>
                <input 
                  type="text" 
                  value={formData.poundsInchImmersion}
                  onChange={(e) => handleInputChange('poundsInchImmersion', e.target.value)}
                  placeholder="e.g., 2,621.21 pounds/inch" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Data Export Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💾 Data Export & Management</h2>
            
            {/* Export Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <button
                type="button"
                onClick={exportToJSON}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                📄 Export to JSON
              </button>
              
              <button
                type="button"
                onClick={exportToCSV}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                📊 Export to CSV
              </button>
              
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                📋 Copy to Clipboard
              </button>
              
              <button
                type="button"
                onClick={clearLocalStorage}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                🗑️ Clear Data
              </button>
            </div>
            
            {/* Data Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Form Data Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Total Fields:</span>
                  <span className="ml-2 text-gray-900">{Object.keys(formData).length}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Filled Fields:</span>
                  <span className="ml-2 text-gray-900">{Object.values(formData).filter(value => value && value.toString().trim() !== '').length}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Completion:</span>
                  <span className="ml-2 text-gray-900">{Math.round((Object.values(formData).filter(value => value && value.toString().trim() !== '').length / Object.keys(formData).length) * 100)}%</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Model:</span>
                  <span className="ml-2 text-gray-900">{formData.model || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              🚀 Submit De Valk Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
