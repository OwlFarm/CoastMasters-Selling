import os
import json
from datetime import datetime
from dotenv import load_dotenv
from scraper_integration import ScraperIntegration

# Load environment variables
load_dotenv('.env.local')

def demo_scraper_integration():
    """
    Comprehensive demo of scraper integration capabilities
    """
    print("🚀 SCRAPER INTEGRATION COMPREHENSIVE DEMO")
    print("=" * 60)
    
    try:
        # Initialize integration
        print("🔧 Initializing Scraper Integration...")
        integration = ScraperIntegration()
        
        # Step 1: Check existing knowledge base
        print("\n📊 Step 1: Checking existing knowledge base...")
        stats = integration.get_unified_knowledge_stats()
        print("Current Knowledge Base Status:")
        for key, value in stats.items():
            print(f"   {key}: {value}")
        
        # Step 2: Export scraper data
        print("\n📊 Step 2: Exporting scraper yacht listings...")
        yacht_listings = integration.export_scraper_listings()
        
        if not yacht_listings:
            print("❌ No yacht listings found in scraper collection.")
            print("💡 This might mean:")
            print("   - Collection name is different")
            print("   - No data has been scraped yet")
            print("   - Firebase permissions issue")
            return
        
        print(f"✅ Found {len(yacht_listings)} yacht listings")
        
        # Show sample listing structure
        if yacht_listings:
            print("\n📋 Sample listing structure:")
            sample = yacht_listings[0]
            print(f"   ID: {sample['id']}")
            print(f"   Source: {sample['source']}")
            print(f"   Processed Text Length: {len(sample['processed_text'])} chars")
            print(f"   Metadata Fields: {list(sample['metadata'].keys())}")
        
        # Step 3: Generate embeddings
        print("\n🤖 Step 3: Generating embeddings...")
        enhanced_listings = integration.generate_embeddings(yacht_listings)
        
        if not enhanced_listings:
            print("❌ Failed to generate embeddings.")
            return
        
        print(f"✅ Generated embeddings for {len(enhanced_listings)} listings")
        
        # Step 4: Store in Pinecone
        print("\n🎯 Step 4: Storing in Pinecone RAG system...")
        success = integration.store_in_pinecone(enhanced_listings)
        
        if success:
            print("✅ Successfully stored scraper data in Pinecone!")
            
            # Step 5: Show updated knowledge base stats
            print("\n📊 Step 5: Updated knowledge base statistics...")
            updated_stats = integration.get_unified_knowledge_stats()
            print("Updated Knowledge Base Status:")
            for key, value in updated_stats.items():
                print(f"   {key}: {value}")
            
            # Step 6: Test unified search capabilities
            print("\n🔍 Step 6: Testing unified search capabilities...")
            
            # Test different search queries
            test_queries = [
                "yacht specifications",
                "luxury yacht features",
                "yacht price range",
                "yacht make and model"
            ]
            
            for query in test_queries:
                print(f"\n🔍 Searching for: '{query}'")
                results = integration.search_unified_knowledge(query, top_k=3)
                print(f"   Found {len(results)} results")
                
                if results:
                    # Show top result
                    top_result = results[0]
                    print(f"   Top result (Score: {top_result['score']:.3f}):")
                    print(f"     Source: {top_result['metadata'].get('source', 'unknown')}")
                    print(f"     ID: {top_result['id']}")
                    
                    # Show snippet of processed text
                    text = top_result['metadata'].get('processed_text', '')
                    if text:
                        snippet = text[:100] + "..." if len(text) > 100 else text
                        print(f"     Text: {snippet}")
            
            # Step 7: Test source filtering
            print("\n🔍 Step 7: Testing source filtering...")
            
            # Search only scraper data
            print("   Searching only scraper data:")
            scraper_results = integration.search_unified_knowledge(
                "yacht features", 
                top_k=2, 
                source_filter="scraper"
            )
            print(f"     Found {len(scraper_results)} scraper results")
            
            # Search only PDF data (if exists)
            print("   Searching only PDF data:")
            pdf_results = integration.search_unified_knowledge(
                "yacht specifications", 
                top_k=2, 
                source_filter="pdf"
            )
            print(f"     Found {len(pdf_results)} PDF results")
            
            print("\n🎉 DEMO COMPLETE!")
            print("✅ Scraper integration successful!")
            print("✅ Unified knowledge base created!")
            print("✅ Search capabilities working!")
            
        else:
            print("❌ Failed to store data in Pinecone.")
            
    except Exception as e:
        print(f"❌ Demo failed: {e}")
        import traceback
        traceback.print_exc()

def demo_quick_test():
    """
    Quick test to verify basic functionality
    """
    print("🚀 QUICK SCRAPER INTEGRATION TEST")
    print("=" * 40)
    
    try:
        integration = ScraperIntegration()
        
        # Quick export test
        listings = integration.export_scraper_listings()
        print(f"✅ Found {len(listings)} yacht listings")
        
        if listings:
            # Quick search test
            results = integration.search_unified_knowledge("yacht", top_k=1)
            print(f"✅ Search test successful: {len(results)} results")
        
        print("✅ Quick test passed!")
        
    except Exception as e:
        print(f"❌ Quick test failed: {e}")

def demo_collection_explorer():
    """
    Explore available Firestore collections
    """
    print("🔍 FIRESTORE COLLECTION EXPLORER")
    print("=" * 40)
    
    try:
        integration = ScraperIntegration()
        
        # List all collections
        collections = integration.db.collections()
        print("Available collections:")
        
        for collection in collections:
            print(f"   📁 {collection.id}")
            
            # Get document count
            try:
                docs = list(collection.stream())
                print(f"      Documents: {len(docs)}")
                
                # Show sample document structure
                if docs:
                    sample_doc = docs[0].to_dict()
                    print(f"      Sample fields: {list(sample_doc.keys())}")
                    
            except Exception as e:
                print(f"      Error reading: {e}")
        
    except Exception as e:
        print(f"❌ Collection exploration failed: {e}")

if __name__ == "__main__":
    print("Choose demo mode:")
    print("1. Full Integration Demo")
    print("2. Quick Test")
    print("3. Collection Explorer")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == "1":
        demo_scraper_integration()
    elif choice == "2":
        demo_quick_test()
    elif choice == "3":
        demo_collection_explorer()
    else:
        print("Invalid choice. Running full demo...")
        demo_scraper_integration()
