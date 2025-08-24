import os
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables
load_dotenv('.env.local')

def explore_metadata_collection():
    """
    Deep dive into the metadata collection to understand yacht specifications
    """
    print("🔍 DEEP METADATA EXPLORATION")
    print("=" * 50)
    
    try:
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
        
        db = firestore.client()
        
        # Get metadata collection
        print("\n📊 Exploring metadata collection...")
        metadata_docs = db.collection('metadata').stream()
        
        for doc in metadata_docs:
            print(f"\n📄 Document ID: {doc.id}")
            data = doc.to_dict()
            
            # Show all available fields
            print(f"📋 Total fields: {len(data)}")
            print("\n🔍 Available yacht specification categories:")
            
            for field_name, field_value in data.items():
                if isinstance(field_value, list):
                    print(f"   📁 {field_name}: {len(field_value)} options")
                    # Show first few options as examples
                    if field_value:
                        examples = field_value[:3]  # Show first 3
                        print(f"      Examples: {', '.join(str(ex) for ex in examples)}")
                        if len(field_value) > 3:
                            print(f"      ... and {len(field_value) - 3} more")
                elif isinstance(field_value, dict):
                    print(f"   📁 {field_name}: {len(field_value)} sub-categories")
                    # Show first few sub-categories
                    if field_value:
                        examples = list(field_value.keys())[:3]
                        print(f"      Examples: {', '.join(examples)}")
                        if len(field_value) > 3:
                            print(f"      ... and {len(field_value) - 3} more")
                else:
                    print(f"   📄 {field_name}: {field_value}")
        
        # Look for other collections that might contain yacht listings
        print("\n🔍 Searching for yacht listing collections...")
        all_collections = db.collections()
        
        yacht_keywords = ['yacht', 'boat', 'listing', 'vessel', 'marine', 'sale', 'broker']
        potential_collections = []
        
        for collection in all_collections:
            collection_name = collection.id.lower()
            if any(keyword in collection_name for keyword in yacht_keywords):
                potential_collections.append(collection.id)
        
        if potential_collections:
            print(f"🎯 Found potential yacht-related collections: {potential_collections}")
            
            # Explore each potential collection
            for collection_name in potential_collections:
                print(f"\n📊 Exploring collection: {collection_name}")
                try:
                    docs = list(db.collection(collection_name).stream())
                    print(f"   Documents: {len(docs)}")
                    
                    if docs:
                        # Show sample document structure
                        sample_doc = docs[0].to_dict()
                        print(f"   Sample fields: {list(sample_doc.keys())}")
                        
                        # Show a few sample values
                        for field, value in list(sample_doc.items())[:5]:
                            if isinstance(value, str) and len(value) < 100:
                                print(f"      {field}: {value}")
                            elif isinstance(value, (int, float)):
                                print(f"      {field}: {value}")
                            else:
                                print(f"      {field}: {type(value).__name__}")
                        
                except Exception as e:
                    print(f"   Error reading collection: {e}")
        else:
            print("❌ No obvious yacht listing collections found")
            print("💡 Let's check for any collections with documents")
            
            # Check all collections for any with documents
            print("\n🔍 Checking all collections for data...")
            for collection in all_collections:
                try:
                    docs = list(collection.stream())
                    if docs:
                        print(f"   📁 {collection.id}: {len(docs)} documents")
                        if len(docs) > 0:
                            sample_doc = docs[0].to_dict()
                            print(f"      Sample fields: {list(sample_doc.keys())}")
                except Exception as e:
                    print(f"   📁 {collection.id}: Error reading")
        
        print("\n🎉 Metadata exploration complete!")
        
    except Exception as e:
        print(f"❌ Metadata exploration failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    explore_metadata_collection()
