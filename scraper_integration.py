import os
import json
import re
from datetime import datetime
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, storage
from pinecone import Pinecone
from openai import OpenAI

# Load environment variables
load_dotenv('.env.local')

class ScraperIntegration:
    """
    Integrates existing scraper yacht listings with Pinecone RAG system
    Creates unified knowledge base from PDFs + Scraper data
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
        self.storage_bucket = storage.bucket()
        
        # Initialize OpenAI for embeddings
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if not openai_api_key:
            raise ValueError("OPENAI_API_KEY not found in environment")
        self.openai_client = OpenAI(api_key=openai_api_key)
        
        # Initialize Pinecone
        pinecone_api_key = os.getenv('PINECONE_API_KEY')
        if not pinecone_api_key:
            raise ValueError("PINECONE_API_KEY not found in environment")
        self.pinecone_client = Pinecone(api_key=pinecone_api_key)
        self.index_name = 'coast-masters-yacht-rag'
        
        print("🚀 Scraper Integration initialized!")
        print("✅ Firebase: Ready for data access")
        print("✅ OpenAI: Ready for embeddings")
        print("✅ Pinecone: Ready for RAG storage")
    
    def export_scraper_listings(self, collection_name: str = "yacht_listings") -> List[Dict[str, Any]]:
        """
        Export yacht listings from Firestore scraper collection
        Returns structured data ready for RAG processing
        """
        try:
            print(f"🔍 Exporting yacht listings from '{collection_name}'...")
            
            # Get all documents from the collection
            docs = self.db.collection(collection_name).stream()
            
            yacht_listings = []
            for doc in docs:
                data = doc.to_dict()
                doc_id = doc.id
                
                # Structure the data for RAG processing
                yacht_data = {
                    'id': doc_id,
                    'source': 'scraper',
                    'timestamp': datetime.now().isoformat(),
                    'raw_data': data,
                    'processed_text': self._extract_text_from_listing(data),
                    'metadata': self._extract_metadata(data)
                }
                
                yacht_listings.append(yacht_data)
            
            print(f"✅ Exported {len(yacht_listings)} yacht listings")
            return yacht_listings
            
        except Exception as e:
            print(f"❌ Error exporting scraper listings: {e}")
            return []
    
    def _extract_text_from_listing(self, listing_data: Dict[str, Any]) -> str:
        """
        Extract meaningful text from yacht listing data
        Combines all relevant fields into searchable text
        """
        text_parts = []
        
        # Extract key yacht information
        if 'name' in listing_data:
            text_parts.append(f"Yacht Name: {listing_data['name']}")
        
        if 'make' in listing_data:
            text_parts.append(f"Make: {listing_data['make']}")
        
        if 'model' in listing_data:
            text_parts.append(f"Model: {listing_data['model']}")
        
        if 'year' in listing_data:
            text_parts.append(f"Year: {listing_data['year']}")
        
        if 'length' in listing_data:
            text_parts.append(f"Length: {listing_data['length']}")
        
        if 'price' in listing_data:
            text_parts.append(f"Price: {listing_data['price']}")
        
        if 'description' in listing_data:
            text_parts.append(f"Description: {listing_data['description']}")
        
        if 'specifications' in listing_data:
            specs = listing_data['specifications']
            if isinstance(specs, dict):
                for key, value in specs.items():
                    text_parts.append(f"{key}: {value}")
            elif isinstance(specs, str):
                text_parts.append(f"Specifications: {specs}")
        
        if 'features' in listing_data:
            features = listing_data['features']
            if isinstance(features, list):
                text_parts.append(f"Features: {', '.join(features)}")
            elif isinstance(features, str):
                text_parts.append(f"Features: {features}")
        
        # Combine all text parts
        combined_text = " | ".join(text_parts)
        return combined_text
    
    def _extract_metadata(self, listing_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract structured metadata from yacht listing
        """
        metadata = {
            'source_type': 'scraper',
            'data_type': 'yacht_listing'
        }
        
        # Copy key fields as metadata
        key_fields = ['name', 'make', 'model', 'year', 'length', 'price', 'broker']
        for field in key_fields:
            if field in listing_data:
                metadata[field] = listing_data[field]
        
        return metadata
    
    def generate_embeddings(self, yacht_listings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generate OpenAI embeddings for yacht listing text
        """
        print(f"🤖 Generating embeddings for {len(yacht_listings)} yacht listings...")
        
        enhanced_listings = []
        for i, listing in enumerate(yacht_listings):
            try:
                # Generate embedding for the processed text
                response = self.openai_client.embeddings.create(
                    model="text-embedding-ada-002",
                    input=listing['processed_text']
                )
                
                embedding = response.data[0].embedding
                
                # Add embedding to listing data
                enhanced_listing = {
                    **listing,
                    'embedding': embedding,
                    'embedding_dimensions': len(embedding)
                }
                
                enhanced_listings.append(enhanced_listing)
                
                if (i + 1) % 10 == 0:
                    print(f"   Generated {i + 1}/{len(yacht_listings)} embeddings")
                
            except Exception as e:
                print(f"❌ Error generating embedding for listing {i}: {e}")
                continue
        
        print(f"✅ Generated embeddings for {len(enhanced_listings)} listings")
        return enhanced_listings
    
    def store_in_pinecone(self, enhanced_listings: List[Dict[str, Any]], batch_size: int = 100) -> bool:
        """
        Store enhanced yacht listings in Pinecone RAG index
        Uses batching to handle large datasets
        """
        try:
            print(f"🎯 Storing {len(enhanced_listings)} yacht listings in Pinecone...")
            
            # Get or create Pinecone index
            index = self._get_or_create_index()
            
            # Process in batches
            for i in range(0, len(enhanced_listings), batch_size):
                batch = enhanced_listings[i:i + batch_size]
                
                # Prepare batch for Pinecone
                vectors = []
                for listing in batch:
                    vector_data = {
                        'id': f"scraper_{listing['id']}",
                        'values': listing['embedding'],
                        'metadata': {
                            **listing['metadata'],
                            'processed_text': listing['processed_text'],
                            'source': 'scraper',
                            'timestamp': listing['timestamp']
                        }
                    }
                    vectors.append(vector_data)
                
                # Upsert batch to Pinecone
                index.upsert(vectors=vectors)
                print(f"   Stored batch {i//batch_size + 1}/{(len(enhanced_listings) + batch_size - 1)//batch_size}")
            
            print("✅ Successfully stored all yacht listings in Pinecone!")
            return True
            
        except Exception as e:
            print(f"❌ Error storing in Pinecone: {e}")
            return False
    
    def _get_or_create_index(self):
        """
        Get existing Pinecone index or create new one
        """
        try:
            existing_indexes = [index.name for index in self.pinecone_client.list_indexes()]
            
            if self.index_name in existing_indexes:
                print(f"✅ Using existing index: {self.index_name}")
                return self.pinecone_client.Index(self.index_name)
            
            # Create new index if it doesn't exist
            print(f"🆕 Creating new index: {self.index_name}")
            self.pinecone_client.create_index(
                name=self.index_name,
                dimension=1536,
                metric='cosine'
            )
            
            # Wait for index to be ready
            import time
            time.sleep(10)
            
            return self.pinecone_client.Index(self.index_name)
            
        except Exception as e:
            print(f"❌ Error with Pinecone index: {e}")
            raise
    
    def get_unified_knowledge_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the unified knowledge base
        Shows PDF + Scraper data coverage
        """
        try:
            index = self.pinecone_client.Index(self.index_name)
            stats = index.describe_index_stats()
            
            # Count documents by source
            source_counts = {}
            if 'namespaces' in stats:
                for namespace, namespace_stats in stats['namespaces'].items():
                    if 'metadata' in namespace_stats:
                        for doc_metadata in namespace_stats['metadata']:
                            source = doc_metadata.get('source', 'unknown')
                            source_counts[source] = source_counts.get(source, 0) + 1
            
            return {
                'total_vectors': stats.get('total_vector_count', 0),
                'source_breakdown': source_counts,
                'index_dimension': stats.get('dimension', 0),
                'index_metric': stats.get('metric', 'unknown')
            }
            
        except Exception as e:
            print(f"❌ Error getting knowledge stats: {e}")
            return {}
    
    def search_unified_knowledge(self, query: str, top_k: int = 5, source_filter: str = None) -> List[Dict[str, Any]]:
        """
        Search unified knowledge base (PDFs + Scraper data)
        Can filter by source type
        """
        try:
            # Generate query embedding
            response = self.openai_client.embeddings.create(
                model="text-embedding-ada-002",
                input=query
            )
            query_embedding = response.data[0].embedding
            
            # Search Pinecone
            index = self.pinecone_client.Index(self.index_name)
            
            # Build filter if source specified
            filter_dict = None
            if source_filter:
                filter_dict = {"source": source_filter}
            
            search_results = index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                filter=filter_dict
            )
            
            # Format results
            formatted_results = []
            for match in search_results.matches:
                result = {
                    'score': match.score,
                    'metadata': match.metadata,
                    'id': match.id
                }
                formatted_results.append(result)
            
            return formatted_results
            
        except Exception as e:
            print(f"❌ Error searching unified knowledge: {e}")
            return []

def main():
    """
    Main function to demonstrate scraper integration
    """
    print("🚀 SCRAPER INTEGRATION DEMO")
    print("=" * 50)
    
    try:
        # Initialize integration
        integration = ScraperIntegration()
        
        # Export scraper listings
        print("\n📊 Step 1: Exporting scraper data...")
        yacht_listings = integration.export_scraper_listings()
        
        if not yacht_listings:
            print("❌ No yacht listings found. Check collection name and data.")
            return
        
        # Generate embeddings
        print("\n🤖 Step 2: Generating embeddings...")
        enhanced_listings = integration.generate_embeddings(yacht_listings)
        
        if not enhanced_listings:
            print("❌ Failed to generate embeddings.")
            return
        
        # Store in Pinecone
        print("\n🎯 Step 3: Storing in Pinecone...")
        success = integration.store_in_pinecone(enhanced_listings)
        
        if success:
            print("\n✅ SUCCESS! Scraper integration complete!")
            
            # Show unified knowledge stats
            print("\n📊 Unified Knowledge Base Stats:")
            stats = integration.get_unified_knowledge_stats()
            for key, value in stats.items():
                print(f"   {key}: {value}")
            
            # Test search
            print("\n🔍 Testing unified search...")
            search_results = integration.search_unified_knowledge("yacht specifications", top_k=3)
            print(f"   Found {len(search_results)} results")
            
        else:
            print("❌ Failed to store in Pinecone.")
            
    except Exception as e:
        print(f"❌ Integration failed: {e}")

if __name__ == "__main__":
    main()
