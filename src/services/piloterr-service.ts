
import type { Yacht } from '@/lib/types';

export interface PiloterrSearchQuery {
    query: string;
    country?: string;
    currency?: string;
    min_price?: number;
    max_price?: number;
    min_year?: number;
    max_year?: number;
    min_length?: number;
    max_length?: number;
    page?: number;
}

interface PiloterrYacht {
    title: string;
    price: string; // e.g., "$1,250,000"
    location: string;
    url: string;
    image_url: string;
    year: string;
    boat_details: { name: string; value: string }[];
    broker?: { name: string; };
}

function toYacht(piloterrYacht: PiloterrYacht, index: number): Yacht {
    const { title, price, year, image_url, location, boat_details, broker } = piloterrYacht;

    const name = title.replace(`${year} `, '').split(' for sale')[0];
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ''), 10);
    
    const getDetail = (key: string): string | undefined => {
        return boat_details.find(d => d.name.toLowerCase() === key.toLowerCase())?.value;
    }

    const lengthFt = getDetail('Length');
    const length = lengthFt ? parseInt(lengthFt.replace(' ft', '')) : 0;
    
    const make = getDetail('Make') || name.split(' ')[0];
    const model = getDetail('Model') || name.replace(make, '').trim();

    return {
        id: piloterrYacht.url || `piloterr-${index}-${Date.now()}`,
        name: name,
        price: isNaN(numericPrice) ? 0 : numericPrice,
        year: parseInt(year, 10),
        length: isNaN(length) ? 0 : length,
        location: location,
        imageUrl: image_url,
        imageHint: 'yacht',
        make: make,
        model: model,
        listingType: broker ? 'Broker' : 'Private',
        boatType: 'Sailing', // The API seems to focus on sailboats
        condition: getDetail('Condition') || 'Used',
        hullMaterial: getDetail('Hull Material'),
        fuelType: getDetail('Fuel Type'),
        description: boat_details.map(d => `${d.name}: ${d.value}`).join('\n'),
    };
}


export async function searchYachts(query: PiloterrSearchQuery): Promise<Yacht[]> {
    const apiKey = process.env.BOAT_LISTINGS_API_KEY;
    if (!apiKey) {
        console.warn('Piloterr API key is not configured. Please set BOAT_LISTINGS_API_KEY in your .env file. Falling back to static data.');
        return [];
    }

    const params = new URLSearchParams();
    
    // Add all defined query parameters to the URLSearchParams object
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, value.toString());
        }
    });

    const url = `https://api.piloterr.com/v2/yachtworld/search?${params.toString()}`;

    try {
        const response = await fetch(url, {
            headers: {
                'X-API-KEY': apiKey,
            },
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Piloterr API Error:', errorBody);
            throw new Error(`API request failed with status ${response.status}: ${errorBody.message || 'Unknown error'}`);
        }

        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
            return result.data.map((yacht: PiloterrYacht, index: number) => toYacht(yacht, index));
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch from Piloterr API:', error);
        throw error;
    }
}
