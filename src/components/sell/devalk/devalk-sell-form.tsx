'use client';

import React, { useState } from 'react';

export default function DeValkSellForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('');
  const [devalkUrl, setDevalkUrl] = useState('');
  
  // Simple state for form fields
  const [formData, setFormData] = useState({
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
    
    // Accommodation
    cabins: '',
    berths: '',
    interior: '',
    layout: '',
    galley: '',
    cooker: '',
    sink: '',
    fridge: '',
    
    // Machinery
    noOfEngines: '',
    make: '',
    engineType: '',
    hp: '',
    kw: '',
    fuel: '',
    
    // Navigation
    compass: '',
    depthSounder: '',
    log: '',
    windset: '',
    vhf: '',
    autopilot: '',
    radar: '',
    gps: '',
    plotter: '',
    
    // Equipment
    anchor: '',
    windlass: '',
    dinghy: '',
    outboard: '',
    davits: '',
    
    // Rigging
    mast: '',
    boom: '',
    mainsail: '',
    genoa: '',
    jib: '',
    spinnaker: '',
    spreaders: '',
    primarySheetWinch: '',
    secondarySheetWinch: '',
    genoaSheetwinches: '',
    halyardWinches: '',
    multifunctionalWinches: ''
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
    
    // Direct field mapping - De Valk to App
    const newFormData = { ...formData };
    
    // Key Details mapping
    if (data.keyDetails) {
      console.log('🔑 Mapping Key Details:', data.keyDetails);
      newFormData.dimensions = data.keyDetails.dimensions || '';
      newFormData.material = data.keyDetails.material || '';
      newFormData.built = data.keyDetails.built || '';
      newFormData.engines = data.keyDetails.engines || '';
      newFormData.hpKw = data.keyDetails.hpKw || '';
      newFormData.askingPrice = data.keyDetails.askingPrice || '';
    }
    
    // General Info mapping
    if (data.generalInfo) {
      console.log('📋 Mapping General Info:', data.generalInfo);
      newFormData.model = data.generalInfo.model || '';
      newFormData.yachtType = data.generalInfo.type || '';
      newFormData.loaM = data.generalInfo.loaM || '';
      newFormData.beamM = data.generalInfo.beamM || '';
      newFormData.draftM = data.generalInfo.draftM || '';
      newFormData.yearBuilt = data.generalInfo.yearBuilt || '';
      newFormData.builder = data.generalInfo.builder || '';
      newFormData.country = data.generalInfo.country || '';
      newFormData.designer = data.generalInfo.designer || '';
      newFormData.hullMaterial = data.generalInfo.hullMaterial || '';
    }
    
    // Accommodation mapping
    if (data.accommodation) {
      console.log('🏠 Mapping Accommodation:', data.accommodation);
      newFormData.cabins = data.accommodation.cabins || '';
      newFormData.berths = data.accommodation.berths || '';
      newFormData.interior = data.accommodation.interior || '';
      newFormData.layout = data.accommodation.layout || '';
      newFormData.galley = data.accommodation.galley || '';
      newFormData.cooker = data.accommodation.cooker || '';
      newFormData.sink = data.accommodation.sink || '';
      newFormData.fridge = data.accommodation.fridge || '';
    }
    
    // Machinery mapping
    if (data.machinery) {
      console.log('🔧 Mapping Machinery:', data.machinery);
      newFormData.noOfEngines = data.machinery.noOfEngines || '';
      newFormData.make = data.machinery.make || '';
      newFormData.engineType = data.machinery.type || '';
      newFormData.hp = data.machinery.hp || '';
      newFormData.kw = data.machinery.kw || '';
      newFormData.fuel = data.machinery.fuel || '';
    }
    
    // Navigation mapping
    if (data.navigation) {
      console.log('🧭 Mapping Navigation:', data.navigation);
      newFormData.compass = data.navigation.compass || '';
      newFormData.depthSounder = data.navigation.depthSounder || '';
      newFormData.log = data.navigation.log || '';
      newFormData.windset = data.navigation.windset || '';
      newFormData.vhf = data.navigation.vhf || '';
      newFormData.autopilot = data.navigation.autopilot || '';
      newFormData.radar = data.navigation.radar || '';
      newFormData.gps = data.navigation.gps || '';
      newFormData.plotter = data.navigation.plotter || '';
    }
    
    // Equipment mapping
    if (data.equipment) {
      console.log('🛠️ Mapping Equipment:', data.equipment);
      newFormData.anchor = data.equipment.anchor || '';
      newFormData.windlass = data.equipment.windlass || '';
      newFormData.dinghy = data.equipment.dinghy || '';
      newFormData.outboard = data.equipment.outboard || '';
      newFormData.davits = data.equipment.davits || '';
    }
    
    // Rigging mapping
    if (data.rigging) {
      console.log('⛵ Mapping Rigging:', data.rigging);
      newFormData.mast = data.rigging.mast || '';
      newFormData.boom = data.rigging.boom || '';
      newFormData.mainsail = data.rigging.mainsail || '';
      newFormData.genoa = data.rigging.genoa || '';
      newFormData.jib = data.rigging.jib || '';
      newFormData.spinnaker = data.rigging.spinnaker || '';
      newFormData.spreaders = data.rigging.spreaders || '';
      newFormData.primarySheetWinch = data.rigging.primarySheetWinch || '';
      newFormData.secondarySheetWinch = data.rigging.secondarySheetWinch || '';
      newFormData.genoaSheetwinches = data.rigging.genoaSheetwinches || '';
      newFormData.halyardWinches = data.rigging.halyardWinches || '';
      newFormData.multifunctionalWinches = data.rigging.multifunctionalWinches || '';
    }
    
    // Update form state
    setFormData(newFormData);
    
    console.log('✅ Form populated with De Valk data');
    console.log('🔍 New form data:', newFormData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 De Valk Form Data Submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚤 De Valk Aligned Yacht Form
          </h1>
          <p className="text-lg text-gray-600">
            Perfect 1:1 field mapping with De Valk source structure
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
