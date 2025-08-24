import os
import json
import random
from datetime import datetime
from typing import Dict, Any, List
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables
load_dotenv('.env.local')

class SampleYachtListingsCreator:
    """
    Creates realistic sample yacht listings using existing metadata
    """
    
    def __init__(self):
        # Initialize Firebase
        try:
            firebase_admin.get_app()
            print("✅ Firebase already initialized")
        except ValueError:
            service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
            storage_bucket = os.getenv('FIREBASE_STORAGE_BUCKET')
            
            if not service_account_path:
                raise ValueError("FIREBASE_SERVICE_ACCOUNT_PATH not found in environment")
            if not storage_bucket:
                raise ValueError("FIREBASE_STORAGE_BUCKET not found in environment")
            
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred, {
                'storageBucket': storage_bucket
            })
            print("✅ Firebase initialized")
        
        self.db = firestore.client()
        self.metadata = self._load_metadata()
        
        print("🚀 Sample Yacht Listings Creator initialized!")
    
    def _load_metadata(self) -> Dict[str, Any]:
        """
        Load yacht specifications from metadata collection
        """
        try:
            metadata_docs = self.db.collection('metadata').stream()
            metadata = {}
            
            for doc in metadata_docs:
                data = doc.to_dict()
                metadata.update(data)
            
            print(f"✅ Loaded {len(metadata)} metadata categories")
            return metadata
            
        except Exception as e:
            print(f"❌ Error loading metadata: {e}")
            return {}
    
    def _generate_yacht_name(self, make: str, model: str, year: int) -> str:
        """
        Generate realistic yacht names
        """
        yacht_names = [
            "Ocean Dream", "Sea Spirit", "Wind Dancer", "Blue Horizon", "Island Time",
            "Freedom", "Serenity", "Adventure", "Discovery", "Voyager",
            "Pacific Star", "Atlantic Breeze", "Caribbean Queen", "Mediterranean Sun",
            "Northern Light", "Southern Cross", "Eastern Promise", "Western Wind"
        ]
        
        return f"{random.choice(yacht_names)} - {make} {model} {year}"
    
    def _generate_description(self, yacht_data: Dict[str, Any]) -> str:
        """
        Generate realistic yacht descriptions
        """
        make = yacht_data.get('make', '')
        model = yacht_data.get('model', '')
        year = yacht_data.get('year', '')
        length = yacht_data.get('length', '')
        boat_type = yacht_data.get('boatType', '')
        
        descriptions = [
            f"Beautiful {year} {make} {model} {boat_type} in excellent condition. This {length} vessel offers exceptional performance and comfort for cruising adventures.",
            f"Stunning {make} {model} {boat_type} from {year}. This well-maintained {length} yacht combines luxury with seaworthiness for unforgettable journeys.",
            f"Exceptional {year} {make} {model} {boat_type} measuring {length}. This vessel has been meticulously cared for and is ready for new adventures.",
            f"Gorgeous {make} {model} {boat_type} built in {year}. This {length} yacht offers the perfect blend of style, comfort, and performance."
        ]
        
        return random.choice(descriptions)
    
    def _generate_specifications(self, yacht_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate realistic yacht specifications
        """
        specs = {}
        
        # Engine specifications
        if yacht_data.get('boatType') in ['motor', 'power']:
            specs['engines'] = random.choice(['Twin Diesel', 'Single Diesel', 'Twin Gas', 'Single Gas'])
            specs['engine_hours'] = random.randint(100, 2000)
            specs['fuel_capacity'] = f"{random.randint(50, 500)}L"
            specs['cruising_speed'] = f"{random.randint(8, 25)} knots"
            specs['max_speed'] = f"{random.randint(12, 35)} knots"
        
        # Sailing specifications
        if yacht_data.get('boatType') in ['sailing', 'sail']:
            specs['sail_area'] = f"{random.randint(200, 800)} sq ft"
            specs['mast_height'] = f"{random.randint(30, 60)} ft"
            specs['keel_depth'] = f"{random.randint(4, 8)} ft"
            specs['displacement'] = f"{random.randint(5000, 25000)} lbs"
        
        # General specifications
        specs['beam'] = f"{random.randint(8, 20)} ft"
        specs['draft'] = f"{random.randint(3, 7)} ft"
        specs['water_capacity'] = f"{random.randint(50, 200)}L"
        specs['holding_tank'] = f"{random.randint(20, 80)}L"
        
        return specs
    
    def _generate_features(self, yacht_data: Dict[str, Any]) -> List[str]:
        """
        Generate realistic yacht features
        """
        all_features = [
            'GPS Navigation', 'Radar', 'Autopilot', 'VHF Radio', 'Depth Sounder',
            'Bow Thruster', 'Electric Winches', 'Furling Sails', 'Bimini Top',
            'Swim Platform', 'Dinghy Davits', 'Solar Panels', 'Wind Generator',
            'Air Conditioning', 'Heating System', 'Refrigerator', 'Freezer',
            'Microwave', 'Stove', 'Oven', 'Coffee Maker', 'Water Maker',
            'Generator', 'Inverter', 'Battery Charger', 'LED Lighting',
            'Teak Decks', 'Teak Interior', 'Leather Upholstery', 'Flat Screen TV',
            'Stereo System', 'WiFi', 'Satellite Phone', 'EPIRB', 'Life Raft'
        ]
        
        # Select 8-15 random features
        num_features = random.randint(8, 15)
        return random.sample(all_features, num_features)
    
    def create_sample_listings(self, num_listings: int = 20) -> List[Dict[str, Any]]:
        """
        Create realistic sample yacht listings
        """
        print(f"🚤 Creating {num_listings} sample yacht listings...")
        
        if not self.metadata:
            print("❌ No metadata available")
            return []
        
        # Get available options from metadata
        makes = self.metadata.get('makes', [])
        boat_types = self.metadata.get('boatTypes', [])
        hull_materials = self.metadata.get('hullMaterialOptions', [])
        keel_types = self.metadata.get('keelTypeOptions', [])
        divisions = self.metadata.get('divisions', [])
        
        if not makes or not boat_types:
            print("❌ Missing required metadata (makes, boatTypes)")
            return []
        
        sample_listings = []
        
        for i in range(num_listings):
            # Select random specifications
            make_data = random.choice(makes)
            boat_type_data = random.choice(boat_types)
            hull_material = random.choice(hull_materials) if hull_materials else None
            keel_type = random.choice(keel_types) if keel_types else None
            division = random.choice(divisions) if divisions else None
            
            # Generate yacht data
            year = random.randint(1990, 2024)
            length = random.randint(25, 80)
            price = random.randint(50000, 5000000)
            
            yacht_data = {
                'name': self._generate_yacht_name(make_data.get('label', ''), 'Model', year),
                'make': make_data.get('label', ''),
                'model': f"Model {random.randint(1, 999)}",
                'year': year,
                'length': f"{length} ft",
                'price': f"${price:,}",
                'boatType': boat_type_data.get('label', ''),
                'hullMaterial': hull_material.get('label', '') if hull_material else None,
                'keelType': keel_type.get('label', '') if keel_type else None,
                'division': division.get('label', '') if division else None,
                'description': '',
                'specifications': {},
                'features': [],
                'condition': random.choice(['New', 'Used']),
                'location': random.choice(['Seattle, WA', 'Miami, FL', 'Newport, RI', 'San Diego, CA']),
                'broker': random.choice(['Coast Masters', 'Marine Brokers', 'Yacht Sales Co', 'Ocean Brokers']),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            # Generate additional data
            yacht_data['description'] = self._generate_description(yacht_data)
            yacht_data['specifications'] = self._generate_specifications(yacht_data)
            yacht_data['features'] = self._generate_features(yacht_data)
            
            sample_listings.append(yacht_data)
            
            if (i + 1) % 5 == 0:
                print(f"   Created {i + 1}/{num_listings} listings")
        
        print(f"✅ Created {len(sample_listings)} sample yacht listings")
        return sample_listings
    
    def save_to_firestore(self, listings: List[Dict[str, Any]], collection_name: str = "sample_yacht_listings") -> bool:
        """
        Save sample listings to Firestore
        """
        try:
            print(f"💾 Saving {len(listings)} listings to '{collection_name}' collection...")
            
            # Create collection reference
            collection_ref = self.db.collection(collection_name)
            
            # Save each listing
            for i, listing in enumerate(listings):
                # Add Firestore document ID
                doc_id = f"sample_{i+1:03d}"
                listing['id'] = doc_id
                
                # Save to Firestore
                collection_ref.document(doc_id).set(listing)
                
                if (i + 1) % 5 == 0:
                    print(f"   Saved {i + 1}/{len(listings)} listings")
            
            print(f"✅ Successfully saved {len(listings)} listings to Firestore!")
            return True
            
        except Exception as e:
            print(f"❌ Error saving to Firestore: {e}")
            return False
    
    def create_and_save_listings(self, num_listings: int = 20, collection_name: str = "sample_yacht_listings") -> bool:
        """
        Create and save sample yacht listings
        """
        try:
            # Create sample listings
            listings = self.create_sample_listings(num_listings)
            
            if not listings:
                return False
            
            # Save to Firestore
            success = self.save_to_firestore(listings, collection_name)
            
            if success:
                print(f"\n🎉 SUCCESS! Created and saved {len(listings)} sample yacht listings")
                print(f"📁 Collection: {collection_name}")
                print(f"🔍 Ready for scraper integration testing!")
            
            return success
            
        except Exception as e:
            print(f"❌ Error creating and saving listings: {e}")
            return False

def main():
    """
    Main function to create sample yacht listings
    """
    print("🚤 SAMPLE YACHT LISTINGS CREATOR")
    print("=" * 50)
    
    try:
        creator = SampleYachtListingsCreator()
        
        # Create and save 3 sample listings (perfect for testing)
        success = creator.create_and_save_listings(3, "sample_yacht_listings")
        
        if success:
            print("\n🎉 SUCCESS! Created and saved 3 sample yacht listings")
            print(f"📁 Collection: sample_yacht_listings")
            print(f"🔍 Ready for scraper integration testing!")
            print("\n🚀 Next steps:")
            print("1. Run scraper_integration_demo.py")
            print("2. Choose option 1 (Full Integration Demo)")
            print("3. Watch it discover and process your 3 sample listings!")
            print("4. Test the unified search across PDFs + Yacht listings!")
        
    except Exception as e:
        print(f"❌ Creation failed: {e}")

if __name__ == "__main__":
    main()
