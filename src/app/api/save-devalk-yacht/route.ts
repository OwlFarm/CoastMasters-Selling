import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🚀 Saving De Valk yacht data:', body);
    
    // Validate required fields
    if (!body.model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }
    
    // Create yacht record in database
    const yacht = await prisma.deValkYacht.create({
      data: {
        // Source metadata
        sourceUrl: body.sourceUrl || null,
        scrapedAt: new Date(),
        
        // Key Details
        dimensions: body.dimensions || null,
        material: body.material || null,
        built: body.built || null,
        engines: body.engines || null,
        hpKw: body.hpKw || null,
        lying: body.lying || null,
        salesOffice: body.salesOffice || null,
        status: body.status || null,
        vat: body.vat || null,
        askingPrice: body.askingPrice || null,
        
        // General Information
        model: body.model,
        yachtType: body.yachtType || null,
        loaM: body.loaM || null,
        lwlM: body.lwlM || null,
        beamM: body.beamM || null,
        draftM: body.draftM || null,
        airDraftM: body.airDraftM || null,
        headroomM: body.headroomM || null,
        yearBuilt: body.yearBuilt || null,
        builder: body.builder || null,
        country: body.country || null,
        designer: body.designer || null,
        displacementT: body.displacementT || null,
        ballastTonnes: body.ballastTonnes || null,
        hullMaterial: body.hullMaterial || null,
        hullColour: body.hullColour || null,
        hullShape: body.hullShape || null,
        keelType: body.keelType || null,
        superstructureMaterial: body.superstructureMaterial || null,
        deckMaterial: body.deckMaterial || null,
        deckFinish: body.deckFinish || null,
        superstructureDeckFinish: body.superstructureDeckFinish || null,
        cockpitDeckFinish: body.cockpitDeckFinish || null,
        
        // Accommodation
        cabins: body.cabins || null,
        berths: body.berths || null,
        interior: body.interior || null,
        layout: body.layout || null,
        floor: body.floor || null,
        openCockpit: body.openCockpit || null,
        aftDeck: body.aftDeck || null,
        saloon: body.saloon || null,
        headroomSalonM: body.headroomSalonM || null,
        heating: body.heating || null,
        navigationCenter: body.navigationCenter || null,
        chartTable: body.chartTable || null,
        galley: body.galley || null,
        countertop: body.countertop || null,
        sink: body.sink || null,
        cooker: body.cooker || null,
        oven: body.oven || null,
        microwave: body.microwave || null,
        fridge: body.fridge || null,
        freezer: body.freezer || null,
        hotWaterSystem: body.hotWaterSystem || null,
        waterPressureSystem: body.waterPressureSystem || null,
        ownersCabin: body.ownersCabin || null,
        bedLength: body.bedLength || null,
        wardrobe: body.wardrobe || null,
        bathroom: body.bathroom || null,
        toilet: body.toilet || null,
        toiletSystem: body.toiletSystem || null,
        washBasin: body.washBasin || null,
        shower: body.shower || null,
        guestCabin1: body.guestCabin1 || null,
        guestCabin2: body.guestCabin2 || null,
        washingMachine: body.washingMachine || null,
        
        // Machinery
        noOfEngines: body.noOfEngines || null,
        make: body.make || null,
        type: body.type || null,
        hp: body.hp || null,
        kw: body.kw || null,
        fuel: body.fuel || null,
        yearInstalled: body.yearInstalled || null,
        yearOfOverhaul: body.yearOfOverhaul || null,
        maximumSpeedKn: body.maximumSpeedKn || null,
        cruisingSpeedKn: body.cruisingSpeedKn || null,
        consumptionLhr: body.consumptionLhr || null,
        engineCoolingSystem: body.engineCoolingSystem || null,
        drive: body.drive || null,
        shaftSeal: body.shaftSeal || null,
        engineControls: body.engineControls || null,
        gearbox: body.gearbox || null,
        bowthruster: body.bowthruster || null,
        propellerType: body.propellerType || null,
        manualBilgePump: body.manualBilgePump || null,
        electricBilgePump: body.electricBilgePump || null,
        electricalInstallation: body.electricalInstallation || null,
        generator: body.generator || null,
        batteries: body.batteries || null,
        startBattery: body.startBattery || null,
        serviceBattery: body.serviceBattery || null,
        batteryMonitor: body.batteryMonitor || null,
        batteryCharger: body.batteryCharger || null,
        solarPanel: body.solarPanel || null,
        shorepower: body.shorepower || null,
        watermaker: body.watermaker || null,
        
        // Navigation
        compass: body.compass || null,
        electricCompass: body.electricCompass || null,
        depthSounder: body.depthSounder || null,
        log: body.log || null,
        windset: body.windset || null,
        repeater: body.repeater || null,
        vhf: body.vhf || null,
        vhfHandheld: body.vhfHandheld || null,
        autopilot: body.autopilot || null,
        rudderAngleIndicator: body.rudderAngleIndicator || null,
        radar: body.radar || null,
        plotterGps: body.plotterGps || null,
        electronicCharts: body.electronicCharts || null,
        aisTransceiver: body.aisTransceiver || null,
        epirb: body.epirb || null,
        navigationLights: body.navigationLights || null,
        
        // Equipment
        anchor: body.anchor || null,
        anchorChain: body.anchorChain || null,
        anchor2: body.anchor2 || null,
        windlass: body.windlass || null,
        deckWash: body.deckWash || null,
        dinghy: body.dinghy || null,
        outboard: body.outboard || null,
        davits: body.davits || null,
        seaRailing: body.seaRailing || null,
        pushpit: body.pushpit || null,
        pulpit: body.pulpit || null,
        lifebuoy: body.lifebuoy || null,
        radarReflector: body.radarReflector || null,
        fenders: body.fenders || null,
        mooringLines: body.mooringLines || null,
        radio: body.radio || null,
        cockpitSpeakers: body.cockpitSpeakers || null,
        speakersInSalon: body.speakersInSalon || null,
        fireExtinguisher: body.fireExtinguisher || null,
        fixedWindscreen: body.fixedWindscreen || null,
        cockpitTable: body.cockpitTable || null,
        bathingPlatform: body.bathingPlatform || null,
        boardingLadder: body.boardingLadder || null,
        deckShower: body.deckShower || null,
        
        // Rigging
        rigging: body.rigging || null,
        standingRigging: body.standingRigging || null,
        brandMast: body.brandMast || null,
        materialMast: body.materialMast || null,
        spreaders: body.spreaders || null,
        mainsail: body.mainsail || null,
        stowayMast: body.stowayMast || null,
        cutterstay: body.cutterstay || null,
        jib: body.jib || null,
        genoa: body.genoa || null,
        genoaFurler: body.genoaFurler || null,
        cutterFurler: body.cutterFurler || null,
        gennaker: body.gennaker || null,
        spinnaker: body.spinnaker || null,
        reefingSystem: body.reefingSystem || null,
        backstayAdjuster: body.backstayAdjuster || null,
        primarySheetWinch: body.primarySheetWinch || null,
        secondarySheetWinch: body.secondarySheetWinch || null,
        genoaSheetwinches: body.genoaSheetwinches || null,
        halyardWinches: body.halyardWinches || null,
        multifunctionalWinches: body.multifunctionalWinches || null,
        spiPole: body.spiPole || null,
        
        // Indication Ratios
        saDispl: body.saDispl || null,
        balDispl: body.balDispl || null,
        dispLen: body.dispLen || null,
        comfortRatio: body.comfortRatio || null,
        capsizeScreeningFormula: body.capsizeScreeningFormula || null,
        s: body.s || null,
        hullSpeed: body.hullSpeed || null,
        poundsInchImmersion: body.poundsInchImmersion || null,
        
        // Additional metadata
        notes: body.notes || null,
        tags: body.tags || null,
      },
    });
    
    console.log('✅ Yacht saved successfully:', yacht.id);
    
    return NextResponse.json({
      success: true,
      message: 'De Valk yacht data saved successfully',
      yacht: {
        id: yacht.id,
        model: yacht.model,
        createdAt: yacht.createdAt,
      },
    });
    
  } catch (error) {
    console.error('❌ Error saving yacht data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to save yacht data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const yachts = await prisma.deValkYacht.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        model: true,
        yachtType: true,
        yearBuilt: true,
        builder: true,
        askingPrice: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      yachts,
      count: yachts.length,
    });
    
  } catch (error) {
    console.error('❌ Error fetching yachts:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch yachts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
