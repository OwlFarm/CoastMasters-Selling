import os
import json
from datetime import datetime
from typing import Dict, Any, List
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables
load_dotenv('.env.local')

class RealisticYachtListingsCreator:
    """
    Creates realistic yacht listings based on real yacht data patterns
    """
    
    def __init__(self):
        # Initialize Firebase using the same method as the working Flask app
        try:
            firebase_admin.get_app()
            print("✅ Firebase already initialized")
        except ValueError:
            # Try to initialize Firebase - if it fails, we'll handle it gracefully
            try:
                service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
                storage_bucket = os.getenv('FIREBASE_STORAGE_BUCKET')
                
                if service_account_path and storage_bucket:
                    cred = credentials.Certificate(service_account_path)
                    firebase_admin.initialize_app(cred, {
                        'storageBucket': storage_bucket
                    })
                    print("✅ Firebase initialized with service account")
                else:
                    # If no environment variables, try to use existing Firebase connection
                    print("⚠️  No Firebase credentials found, attempting to use existing connection...")
                    # This will work if Firebase is already initialized by another component
                    firebase_admin.get_app()
                    print("✅ Using existing Firebase connection")
                    
            except Exception as e:
                print(f"❌ Firebase initialization failed: {e}")
                print("💡 Make sure your Flask app is running (it initializes Firebase)")
                raise
        
        self.db = firestore.client()
        print("🚀 Realistic Yacht Listings Creator initialized!")
    
    def create_moody_54_listing(self) -> Dict[str, Any]:
        """
        Create realistic MOODY 54 listing based on De Valk data
        """
        return {
            'id': 'moody_54_001',
            'name': 'Ocean Dream - MOODY 54 2003',
            'make': 'MOODY',
            'model': '54',
            'year': 2003,
            'length': '16.72m (54.9ft)',
            'beam': '4.85m',
            'draft': '2.28m',
            'price': '€350,000',
            'currency': 'EUR',
            'location': 'Almeria, Spain',
            'broker': 'De Valk Almeria',
            'status': 'For Sale',
            'condition': 'Used',
            
            'boatType': 'Sailing Yacht',
            'hullMaterial': 'GRP',
            'keelType': 'Fin Keel',
            'division': 'Monohull',
            
            'description': 'This Moody 54 was purchased September 2018 from Shipper Yachts in the Netherlands. From there she sailed to North Wales to fit out for our circumnavigation (didn\'t happen because of Covid.). From North Wales to Brittany, Spain, Portugal, Spain, France, Italy, Greece, back the other way to the Canaries then to Motril. We lived aboard for 4 years. In Cascais she was stripped back to the bare hull, any signs of osmosis treated and epoxied. In 2021 a new Yanmar 4JH110 engine was fitted. Available in South Spain.',
            
            'specifications': {
                'displacement': '23 tonnes',
                'ballast': '6.78 tonnes (cast iron and lead)',
                'fuel_capacity': '680L',
                'water_capacity': '955L (2 tanks)',
                'cabins': 3,
                'berths': 7,
                'heads': 2,
                'headroom': '2.06m',
                'air_draft': '22.70m'
            },
            
            'engine': {
                'make': 'Yanmar',
                'model': '4JH110',
                'type': 'Diesel',
                'power': '110 HP (80.96 kW)',
                'year_installed': 2021,
                'hours': 676,
                'max_speed': '10 knots',
                'cruising_speed': '8 knots',
                'consumption': '5.5 L/hr',
                'range': '800 nm'
            },
            
            'features': [
                'GPS Navigation (Raymarine Axiom 9)',
                'Radar (Pathfinder RL 80C)',
                'Autopilot (Raymarine EV 400)',
                'VHF Radio (Standard Horizon Explorer)',
                'AIS Transceiver (Raymarine AIS 650)',
                'Depth Sounder (Raymarine ST60)',
                'Wind Instrument (Raymarine ST60)',
                'Bow Thruster (Sidepower Electric)',
                'Solar Panels (4 x Ure 335W)',
                'Water Maker (AquaTec AC110)',
                'Air Conditioning (Cruisair)',
                'Teak Decks',
                'Teak Interior',
                'Granite Countertops',
                'Washing Machine',
                'Satellite (Starlink)',
                'Life Raft (6 person)',
                'Dinghy (AB 3.2m rigid inflatable)',
                'Outboard (Yamaha 15hp + ePropulsion Spirit 1.0 Plus)'
            ],
            
            'rigging': {
                'type': 'Cutter',
                'mast': 'Seldén Aluminium',
                'mainsail': 'Dracon Sabre Sails (2020)',
                'genoa': 'Selden Furlex 400S',
                'staysail': 'Dracon (2022)',
                'reefing': 'In-mast furling'
            },
            
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'source': 'sample_data',
            'source_url': 'https://www.devalk.nl/en/yachtbrokerage/811327/MOODY-54.html'
        }
    
    def create_hallberg_rassy_49_listing(self) -> Dict[str, Any]:
        """
        Create realistic Hallberg-Rassy 49 listing
        """
        return {
            'id': 'hallberg_rassy_49_001',
            'name': 'Sea Spirit - Hallberg-Rassy 49 1990',
            'make': 'Hallberg-Rassy',
            'model': '49',
            'year': 1990,
            'length': '14.99m (49.2ft)',
            'beam': '4.25m',
            'draft': '2.10m',
            'price': '$450,000',
            'currency': 'USD',
            'location': 'Newport, RI',
            'broker': 'Coast Masters',
            'status': 'For Sale',
            'condition': 'Used',
            
            'boatType': 'Sailing Yacht',
            'hullMaterial': 'GRP',
            'keelType': 'Fin Keel',
            'division': 'Monohull',
            
            'description': 'Exceptional Hallberg-Rassy 49 from 1990. This well-maintained bluewater cruiser combines Swedish craftsmanship with proven offshore capabilities. The vessel has been meticulously cared for and is ready for new adventures. Features include a center cockpit design, teak interior, and comprehensive navigation equipment.',
            
            'specifications': {
                'displacement': '18 tonnes',
                'ballast': '7.2 tonnes',
                'fuel_capacity': '450L',
                'water_capacity': '600L',
                'cabins': 3,
                'berths': 6,
                'heads': 2,
                'headroom': '1.95m',
                'air_draft': '19.8m'
            },
            
            'engine': {
                'make': 'Volvo Penta',
                'model': 'MD40B',
                'type': 'Diesel',
                'power': '75 HP (55 kW)',
                'year_installed': 1990,
                'hours': 3200,
                'max_speed': '9 knots',
                'cruising_speed': '7 knots',
                'consumption': '4.2 L/hr',
                'range': '650 nm'
            },
            
            'features': [
                'GPS Navigation (Garmin GPSMAP 8612)',
                'Radar (Garmin Fantom 24)',
                'Autopilot (Garmin Reactor 40)',
                'VHF Radio (Icom IC-M506)',
                'AIS Transceiver (Garmin AIS 600)',
                'Depth Sounder (Garmin GSD 26)',
                'Wind Instrument (Garmin GWS 10)',
                'Bow Thruster (Sidepower SE100)',
                'Solar Panels (2 x 200W)',
                'Water Maker (Spectra Ventura 150)',
                'Air Conditioning (Dometic)',
                'Teak Decks',
                'Teak Interior',
                'Stainless Steel Galley',
                'Washing Machine',
                'Satellite Phone (Iridium)',
                'Life Raft (8 person)',
                'Dinghy (Zodiac 3.1m)',
                'Outboard (Honda 15hp)'
            ],
            
            'rigging': {
                'type': 'Sloop',
                'mast': 'Seldén Aluminium',
                'mainsail': 'North Sails (2018)',
                'genoa': 'Profurl Electric Furling',
                'reefing': 'Electric in-mast furling'
            },
            
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'source': 'sample_data',
            'source_url': 'https://www.yachtworld.com/yacht/1990-hallberg--rassy-49-9771000/'
        }
    
    def create_beneteau_oceanis_listing(self) -> Dict[str, Any]:
        """
        Create realistic Beneteau Oceanis listing
        """
        return {
            'id': 'beneteau_oceanis_001',
            'name': 'Blue Horizon - Beneteau Oceanis 58 2015',
            'make': 'Beneteau',
            'model': 'Oceanis 58',
            'year': 2015,
            'length': '17.99m (59ft)',
            'beam': '5.15m',
            'draft': '2.35m',
            'price': '€420,000',
            'currency': 'EUR',
            'location': 'Marseille, France',
            'broker': 'Marine Brokers',
            'status': 'For Sale',
            'condition': 'Used',
            
            'boatType': 'Sailing Yacht',
            'hullMaterial': 'GRP',
            'keelType': 'Fin Keel',
            'division': 'Monohull',
            
            'description': 'Stunning Beneteau Oceanis 58 from 2015. This modern cruising yacht offers exceptional performance and comfort for cruising adventures. Features include a spacious deck saloon, three comfortable cabins, and state-of-the-art navigation systems. The vessel has been well-maintained and is ready for immediate use.',
            
            'specifications': {
                'displacement': '21 tonnes',
                'ballast': '6.8 tonnes',
                'fuel_capacity': '520L',
                'water_capacity': '800L',
                'cabins': 3,
                'berths': 8,
                'heads': 2,
                'headroom': '2.10m',
                'air_draft': '24.5m'
            },
            
            'engine': {
                'make': 'Yanmar',
                'model': '4JH110',
                'type': 'Diesel',
                'power': '110 HP (81 kW)',
                'year_installed': 2015,
                'hours': 1850,
                'max_speed': '11 knots',
                'cruising_speed': '8.5 knots',
                'consumption': '5.8 L/hr',
                'range': '750 nm'
            },
            
            'features': [
                'GPS Navigation (B&G Zeus3 12")',
                'Radar (B&G 4G)',
                'Autopilot (B&G NAC-3)',
                'VHF Radio (B&G V60)',
                'AIS Transceiver (B&G AIS)',
                'Depth Sounder (B&G Triton2)',
                'Wind Instrument (B&G Triton2)',
                'Bow Thruster (Sidepower SE200)',
                'Solar Panels (3 x 300W)',
                'Water Maker (Spectra Ventura 200)',
                'Air Conditioning (Dometic)',
                'Teak Decks',
                'Teak Interior',
                'Granite Countertops',
                'Washing Machine',
                'Satellite TV (KVH)',
                'Life Raft (10 person)',
                'Dinghy (Zodiac 3.4m)',
                'Outboard (Yamaha 20hp)'
            ],
            
            'rigging': {
                'type': 'Sloop',
                'mast': 'Seldén Aluminium',
                'mainsail': 'Elvstrøm Sails (2019)',
                'genoa': 'Profurl Electric Furling',
                'reefing': 'Electric in-mast furling'
            },
            
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'source': 'sample_data',
            'source_url': 'https://www.sailboatlistings.com/view/107013'
        }
    
    def create_all_listings(self) -> List[Dict[str, Any]]:
        """
        Create all three realistic yacht listings
        """
        print("🚤 Creating 3 realistic yacht listings based on real data...")
        
        listings = [
            self.create_moody_54_listing(),
            self.create_hallberg_rassy_49_listing(),
            self.create_beneteau_oceanis_listing()
        ]
        
        print(f"✅ Created {len(listings)} realistic yacht listings")
        return listings
    
    def save_to_firestore(self, listings: List[Dict[str, Any]], collection_name: str = "realistic_yacht_listings") -> bool:
        """
        Save realistic yacht listings to Firestore
        """
        try:
            print(f"💾 Saving {len(listings)} listings to '{collection_name}' collection...")
            
            # Create collection reference
            collection_ref = self.db.collection(collection_name)
            
            # Save each listing
            for i, listing in enumerate(listings):
                # Save to Firestore
                collection_ref.document(listing['id']).set(listing)
                print(f"   Saved: {listing['name']}")
            
            print(f"✅ Successfully saved {len(listings)} listings to Firestore!")
            return True
            
        except Exception as e:
            print(f"❌ Error saving to Firestore: {e}")
            return False
    
    def create_and_save_listings(self, collection_name: str = "realistic_yacht_listings") -> bool:
        """
        Create and save realistic yacht listings
        """
        try:
            # Create realistic listings
            listings = self.create_all_listings()
            
            if not listings:
                return False
            
            # Save to Firestore
            success = self.save_to_firestore(listings, collection_name)
            
            if success:
                print(f"\n🎉 SUCCESS! Created and saved {len(listings)} realistic yacht listings")
                print(f"📁 Collection: {collection_name}")
                print(f"🔍 Ready for scraper integration testing!")
                print("\n📋 Created listings:")
                for listing in listings:
                    print(f"   • {listing['name']} - {listing['price']}")
            
            return success
            
        except Exception as e:
            print(f"❌ Error creating and saving listings: {e}")
            return False

def main():
    """
    Main function to create realistic yacht listings
    """
    print("🚤 REALISTIC YACHT LISTINGS CREATOR")
    print("=" * 50)
    
    try:
        creator = RealisticYachtListingsCreator()
        
        # Create and save realistic listings
        success = creator.create_and_save_listings("realistic_yacht_listings")
        
        if success:
            print("\n🚀 Next steps:")
            print("1. Run scraper_integration_demo.py")
            print("2. Choose option 1 (Full Integration Demo)")
            print("3. Watch it discover and process your realistic yacht listings!")
            print("4. Test unified search across PDFs + Real yacht data!")
        
    except Exception as e:
        print(f"❌ Creation failed: {e}")

if __name__ == "__main__":
    main()
