import { z } from 'zod';

// Comprehensive yacht data interface matching De Valk structure
export interface ScrapedYachtData {
  // General Information
  title?: string;
  brand?: string;
  model?: string;
  type?: string;
  year?: string;
  builder?: string;
  designer?: string;
  country?: string;
  
  // Dimensions
  length?: string;
  lwl?: string;
  beam?: string;
  draft?: string;
  airDraft?: string;
  headroom?: string;
  displacement?: string;
  ballast?: string;
  
  // Construction
  hullMaterial?: string;
  hullColor?: string;
  superstructureMaterial?: string;
  deckMaterial?: string;
  deckFinish?: string;
  
  // Engine & Performance
  engineMake?: string;
  engineType?: string;
  engineHP?: string;
  engineKW?: string;
  fuelType?: string;
  maxSpeed?: string;
  cruisingSpeed?: string;
  fuelConsumption?: string;
  
  // Accommodation
  cabins?: string;
  berths?: string;
  interior?: string;
  layout?: string;
  heating?: string;
  galley?: string;
  fridge?: string;
  freezer?: string;
  
  // Navigation & Electronics
  compass?: string;
  gps?: string;
  radar?: string;
  autopilot?: string;
  vhf?: string;
  plotter?: string;
  ais?: string;
  
  // Equipment
  anchor?: string;
  anchorChain?: string;
  windlass?: string;
  dinghy?: string;
  outboard?: string;
  
  // Rigging
  riggingType?: string;
  mastBrand?: string;
  mastMaterial?: string;
  mainsail?: string;
  genoa?: string;
  winches?: string;
  
  // Location & Price
  location?: string;
  price?: string;
  currency?: string;
  status?: string;
  vat?: string;
  
  // Additional Details
  description?: string;
  brokerComments?: string;
  photos?: string[];
  video?: string;
  virtualTour?: string;
  
  // Images from scraping
  images?: string[];
  heroImage?: string;
}

export interface MigrationResult {
  success: boolean;
  data?: ScrapedYachtData;
  error?: string;
  metadata?: {
    sourceUrl: string;
    scrapedAt: string;
    confidence: number;
    dataCompleteness: number;
  };
}

export class MigrationService {
  private static readonly SCRAPER_URL = 'http://localhost:5000/webhook/v2/extract';

  /**
   * Stage 1: Migrate comprehensive data from De Valk URL
   */
  static async migrateFromUrl(url: string): Promise<MigrationResult> {
    try {
      console.log('🚀 Starting comprehensive migration for:', url);
      
      // For now, return mock data for testing purposes
      // TODO: Replace with actual scraper integration
      if (url.includes('example.com') || url.includes('test')) {
        const mockData: ScrapedYachtData = {
          title: 'Example Yacht',
          brand: 'Beneteau',
          model: 'Oceanis 45',
          year: '2018',
          length: '13.85m',
          beam: '4.5m',
          draft: '1.5m',
          hullMaterial: 'Fiberglass',
          engineMake: 'Volvo Penta',
          engineType: 'D3-110',
          engineHP: '110',
          engineKW: '81',
          fuelType: 'Diesel',
          maxSpeed: '8.5',
          cruisingSpeed: '7.0',
          cabins: '3',
          berths: '6',
          location: 'Mediterranean',
          price: '250000',
          currency: 'EUR',
          description: 'Beautiful example of this popular cruising yacht, well maintained and ready for adventure.',
          status: 'For Sale'
        };

        return { 
          success: true, 
          data: mockData,
          metadata: {
            sourceUrl: url,
            scrapedAt: new Date().toISOString(),
            confidence: 0.85,
            dataCompleteness: 0.75
          }
        };
      }

      // Try to connect to actual scraper service
      const response = await fetch(this.SCRAPER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📥 Raw scraper response:', result);

      if (result.status === 'success' && result.data) {
        const dataCompleteness = this.calculateDataCompleteness(result.data);
        
        return { 
          success: true, 
          data: result.data,
          metadata: {
            sourceUrl: url,
            scrapedAt: new Date().toISOString(),
            confidence: this.calculateConfidence(result.data),
            dataCompleteness: dataCompleteness
          }
        };
      } else {
        return { success: false, error: 'Invalid data structure from scraper' };
      }

    } catch (error) {
      console.error('❌ Migration failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown migration error' 
      };
    }
  }

  /**
   * Stage 2: Map De Valk data to your form fields
   */
  static mapToFormFields(scrapedData: ScrapedYachtData): any {
    console.log('🔄 Mapping scraped data to form fields with enhanced mapping...');
    
    try {
      // Enhanced field mapping with multiple source variations and intelligent parsing
      const mappedData = {
        // Key Details with intelligent fallbacks
        title: scrapedData.title || 
               (scrapedData.brand && scrapedData.model ? `${scrapedData.brand} ${scrapedData.model}` : '') ||
               scrapedData.builder || '',
        
        brand: scrapedData.brand || scrapedData.builder || '',
        model: scrapedData.model || '',
        
        // Year with validation
        year: this.parseYear(scrapedData.year),
        
        // Dimensions with intelligent parsing
        dimensions: this.buildDimensionsString(scrapedData),
        material: scrapedData.hullMaterial || '',
        
        // Engine with enhanced parsing
        engine: this.buildEngineString(scrapedData),
        hpKw: this.buildEnginePowerString(scrapedData),
        
        // Location with fallbacks
        lying: scrapedData.location || scrapedData.country || '',
        
        // Description with multiple sources
        description: scrapedData.description || scrapedData.brokerComments || '',
        
        // Price with intelligent parsing
        price: this.parsePrice(scrapedData.price),
        currency: this.detectCurrency(scrapedData.price || scrapedData.currency),
        status: scrapedData.status || 'For Sale',
        vat: scrapedData.vat || '',
        
        // Accommodation with validation
        cabins: this.parseNumber(scrapedData.cabins),
        berths: this.parseNumber(scrapedData.berths),
        interior: scrapedData.interior || '',
        
        // Equipment & Features with enhanced extraction
        equipment: this.extractEquipmentList(scrapedData),
        features: this.extractFeaturesList(scrapedData)
      };

      console.log('✅ Comprehensive data mapping completed:', mappedData);
      return mappedData;

    } catch (error) {
      console.error('❌ Data mapping failed:', error);
      throw new Error(`Schema mapping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract equipment list from scraped data
   */
  private static extractEquipmentList(data: ScrapedYachtData): string[] {
    const equipment = [];
    if (data.anchor) equipment.push(`Anchor: ${data.anchor}`);
    if (data.windlass) equipment.push(`Windlass: ${data.windlass}`);
    if (data.dinghy) equipment.push(`Dinghy: ${data.dinghy}`);
    if (data.outboard) equipment.push(`Outboard: ${data.outboard}`);
    return equipment;
  }

  /**
   * Extract features list from scraped data
   */
  private static extractFeaturesList(data: ScrapedYachtData): string[] {
    const features = [];
    if (data.heating) features.push(`Heating: ${data.heating}`);
    if (data.galley) features.push(`Galley: ${data.galley}`);
    if (data.fridge) features.push(`Fridge: ${data.fridge}`);
    if (data.freezer) features.push(`Freezer: ${data.freezer}`);
    return features;
  }

  /**
   * Calculate data completeness percentage
   */
  private static calculateDataCompleteness(data: ScrapedYachtData): number {
    const fields = Object.keys(data);
    const filledFields = fields.filter(field => data[field as keyof ScrapedYachtData]);
    return Math.round((filledFields.length / fields.length) * 100);
  }

  /**
   * Calculate confidence score for scraped data with enhanced validation
   */
  private static calculateConfidence(data: ScrapedYachtData): number {
    let score = 0;
    let validationIssues: string[] = [];
    
    // Core fields (high weight) with validation
    if (data.brand && this.validateBrand(data.brand)) {
      score += 25;
    } else if (data.brand) {
      score += 15;
      validationIssues.push('Brand format may be incorrect');
    }
    
    if (data.model && this.validateModel(data.model)) {
      score += 25;
    } else if (data.model) {
      score += 15;
      validationIssues.push('Model format may be incorrect');
    }
    
    if (data.length && this.validateLength(data.length)) {
      score += 20;
    } else if (data.length) {
      score += 10;
      validationIssues.push('Length format may be incorrect');
    }
    
    if (data.engineMake && this.validateEngine(data.engineMake)) {
      score += 15;
    } else if (data.engineMake) {
      score += 8;
      validationIssues.push('Engine format may be incorrect');
    }
    
    if (data.price && this.validatePrice(data.price)) {
      score += 15;
    } else if (data.price) {
      score += 8;
      validationIssues.push('Price format may be incorrect');
    }
    
    // Additional fields (medium weight) with validation
    if (data.year && this.validateYear(data.year)) {
      score += 10;
    } else if (data.year) {
      score += 5;
      validationIssues.push('Year format may be incorrect');
    }
    
    if (data.hullMaterial && this.validateHullMaterial(data.hullMaterial)) {
      score += 10;
    } else if (data.hullMaterial) {
      score += 5;
      validationIssues.push('Hull material format may be incorrect');
    }
    
    if (data.cabins && this.validateNumber(data.cabins)) {
      score += 5;
    } else if (data.cabins) {
      score += 2;
      validationIssues.push('Cabins format may be incorrect');
    }
    
    if (data.berths && this.validateNumber(data.berths)) {
      score += 5;
    } else if (data.berths) {
      score += 2;
      validationIssues.push('Berths format may be incorrect');
    }
    
    // Bonus for images
    if (data.images && data.images.length > 0) {
      score += Math.min(data.images.length * 2, 10);
    }
    
    // Store validation issues for debugging
    if (validationIssues.length > 0) {
      console.log('⚠️ Validation issues found:', validationIssues);
    }
    
    return Math.min(score, 100);
  }
  
  // Validation helper methods
  private static validateBrand(brand: string): boolean {
    return brand.length >= 2 && brand.length <= 50 && /^[a-zA-Z\s\-]+$/.test(brand);
  }
  
  private static validateModel(model: string): boolean {
    return model.length >= 1 && model.length <= 30 && /^[a-zA-Z0-9\s\-\.]+$/.test(model);
  }
  
  private static validateLength(length: string): boolean {
    const num = parseFloat(length);
    return !isNaN(num) && num > 0 && num < 1000;
  }
  
  private static validateEngine(engine: string): boolean {
    return engine.length >= 3 && engine.length <= 100;
  }
  
  private static validatePrice(price: string): boolean {
    const num = parseInt(price.replace(/[^0-9]/g, ''));
    return !isNaN(num) && num > 0 && num < 100000000;
  }
  
  private static validateYear(year: string): boolean {
    const num = parseInt(year);
    return !isNaN(num) && num >= 1900 && num <= new Date().getFullYear() + 1;
  }
  
  private static validateHullMaterial(material: string): boolean {
    const validMaterials = ['GRP', 'Fiberglass', 'Steel', 'Aluminum', 'Wood', 'Composite'];
    return validMaterials.some(valid => material.toLowerCase().includes(valid.toLowerCase()));
  }
  
  private static validateNumber(value: string): boolean {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && num < 100;
  }

  // Helper methods for enhanced data parsing
  private static parseYear(value: any): string | null {
    if (!value) return null;
    const year = parseInt(value.toString());
    return (year >= 1900 && year <= new Date().getFullYear() + 1) ? year.toString() : null;
  }
  
  private static buildDimensionsString(data: ScrapedYachtData): string {
    const parts = [];
    if (data.length) parts.push(data.length);
    if (data.beam) parts.push(data.beam);
    if (data.draft) parts.push(data.draft);
    return parts.length > 0 ? parts.join(' x ') : '';
  }
  
  private static buildEngineString(data: ScrapedYachtData): string {
    const parts = [];
    if (data.engineMake) parts.push(data.engineMake);
    if (data.engineType) parts.push(data.engineType);
    return parts.length > 0 ? parts.join(' ') : '';
  }
  
  private static buildEnginePowerString(data: ScrapedYachtData): string {
    const parts = [];
    if (data.engineHP) parts.push(`${data.engineHP} HP`);
    if (data.engineKW) parts.push(`${data.engineKW} KW`);
    return parts.length > 0 ? parts.join(' / ') : '';
  }
  
  private static parsePrice(value: any): string | null {
    if (!value) return null;
    const price = parseInt(value.toString().replace(/[^0-9]/g, ''));
    return (price > 0 && price < 100000000) ? price.toString() : null;
  }
  
  private static detectCurrency(priceValue: any): string {
    if (!priceValue) return 'EUR';
    const priceStr = priceValue.toString();
    if (priceStr.includes('€') || priceStr.includes('EUR')) return 'EUR';
    if (priceStr.includes('$') || priceStr.includes('USD')) return 'USD';
    if (priceStr.includes('£') || priceStr.includes('GBP')) return 'GBP';
    return 'EUR';
  }
  
  private static parseNumber(value: any): string | null {
    if (!value) return null;
    const num = parseInt(value.toString());
    return (num > 0 && num < 100) ? num.toString() : null;
  }
}