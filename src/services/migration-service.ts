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
    console.log('🔄 Mapping De Valk data to form fields...');
    
    try {
      // Map to your actual form field names
      const mappedData = {
        // Key Details
        title: scrapedData.title || scrapedData.brand + ' ' + scrapedData.model,
        brand: scrapedData.brand || '',
        model: scrapedData.model || '',
        year: scrapedData.year || '',
        dimensions: `${scrapedData.length || ''} x ${scrapedData.beam || ''} x ${scrapedData.draft || ''}`,
        material: scrapedData.hullMaterial || '',
        engine: scrapedData.engineMake + ' ' + scrapedData.engineType || '',
        hpKw: `${scrapedData.engineHP || ''} HP / ${scrapedData.engineKW || ''} KW`,
        lying: scrapedData.location || '',
        
        // Additional fields based on your form structure
        description: scrapedData.description || scrapedData.brokerComments || '',
        price: scrapedData.price || '',
        currency: scrapedData.currency || 'EUR',
        status: scrapedData.status || 'For Sale',
        vat: scrapedData.vat || '',
        
        // Accommodation
        cabins: scrapedData.cabins || '',
        berths: scrapedData.berths || '',
        interior: scrapedData.interior || '',
        
        // Equipment & Features
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
   * Calculate confidence score for scraped data
   */
  private static calculateConfidence(data: ScrapedYachtData): number {
    let score = 0;
    
    // Core fields (high weight)
    if (data.brand) score += 25;
    if (data.model) score += 25;
    if (data.length) score += 20;
    if (data.engineMake) score += 15;
    if (data.price) score += 15;
    
    // Additional fields (medium weight)
    if (data.year) score += 10;
    if (data.hullMaterial) score += 10;
    if (data.cabins) score += 5;
    if (data.berths) score += 5;
    
    return Math.min(score, 100);
  }
}