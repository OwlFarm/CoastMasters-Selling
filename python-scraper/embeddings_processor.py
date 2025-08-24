#!/usr/bin/env python3
"""
🚀 EMBEDDINGS PROCESSOR FOR YACHT RAG SYSTEM
Generates OpenAI embeddings for PDF chunks and stores them in Pinecone
"""

import os
import json
from openai import OpenAI
from typing import List, Dict, Any, Optional
from datetime import datetime
from pinecone import Pinecone
import time

class YachtEmbeddingsProcessor:
    def __init__(self):
        # Initialize OpenAI
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if not openai_api_key:
            raise ValueError("OPENAI_API_KEY not found in environment")
        
        self.client = OpenAI(api_key=openai_api_key)
        
        # Initialize Pinecone
        self.pinecone_client = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
        self.index_name = 'coast-masters-yacht-rag'
        self.index = self.pinecone_client.Index(self.index_name)
        
        print("✅ Yacht Embeddings Processor initialized!")
        print(f"🤖 OpenAI: Ready for embeddings")
        print(f"🎯 Pinecone Index: {self.index_name}")
    
    def load_processed_chunks(self, filename: str = "processed_pdf_chunks_156.json") -> List[Dict[str, Any]]:
        """Load the processed PDF chunks from JSON"""
        try:
            with open(filename, 'r') as f:
                data = json.load(f)
            
            chunks = data.get('chunks', [])
            print(f"📚 Loaded {len(chunks)} processed chunks from {filename}")
            return chunks
            
        except FileNotFoundError:
            print(f"❌ File not found: {filename}")
            print("💡 Run pdf_processor.py first to create chunks")
            return []
        except Exception as e:
            print(f"❌ Error loading chunks: {e}")
            return []
    
    def generate_embedding(self, text: str) -> Optional[List[float]]:
        """Generate OpenAI embedding for text"""
        try:
            response = self.client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            
            embedding = response.data[0].embedding
            print(f"🤖 Generated embedding: {len(embedding)} dimensions")
            return embedding
            
        except Exception as e:
            print(f"❌ Error generating embedding: {e}")
            return None
    
    def process_chunks_to_embeddings(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process all chunks and generate embeddings"""
        print(f"\n🚀 GENERATING EMBEDDINGS FOR {len(chunks)} CHUNKS")
        print("=" * 50)
        
        processed_chunks = []
        
        for i, chunk in enumerate(chunks):
            print(f"\n🔄 Processing chunk {i+1}/{len(chunks)}: {chunk['id']}")
            
            # Generate embedding
            embedding = self.generate_embedding(chunk['text'])
            if embedding:
                # Prepare for Pinecone
                processed_chunk = {
                    'id': chunk['id'],
                    'values': embedding,
                    'metadata': {
                        **chunk['metadata'],
                        'embedding_generated_at': datetime.now().isoformat(),
                        'embedding_model': 'text-embedding-ada-002',
                        'embedding_dimensions': len(embedding)
                    }
                }
                
                processed_chunks.append(processed_chunk)
                print(f"✅ Embedding generated and prepared for Pinecone")
                
                # Rate limiting - OpenAI has limits
                time.sleep(0.1)
            else:
                print(f"❌ Failed to generate embedding for chunk {i+1}")
        
        print(f"\n🎉 EMBEDDINGS GENERATION COMPLETE!")
        print(f"📊 Successfully processed: {len(processed_chunks)}/{len(chunks)} chunks")
        
        return processed_chunks
    
    def store_in_pinecone(self, processed_chunks: List[Dict[str, Any]]) -> bool:
        """Store embeddings in Pinecone index"""
        if not processed_chunks:
            print("❌ No processed chunks to store")
            return False
        
        try:
            print(f"\n🚀 STORING {len(processed_chunks)} EMBEDDINGS IN PINECONE")
            print("=" * 50)
            
            # Prepare data for Pinecone upsert
            vectors = []
            for chunk in processed_chunks:
                vectors.append({
                    'id': chunk['id'],
                    'values': chunk['values'],
                    'metadata': chunk['metadata']
                })
            
            # Upsert to Pinecone
            self.index.upsert(vectors=vectors)
            
            print(f"✅ Successfully stored {len(vectors)} embeddings in Pinecone!")
            print(f"🎯 Index: {self.index_name}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error storing in Pinecone: {e}")
            return False
    
    def store_in_pinecone_batched(self, processed_chunks: List[Dict[str, Any]], batch_size: int = 100) -> bool:
        """Store embeddings in Pinecone index using batching to handle large datasets"""
        if not processed_chunks:
            print("❌ No processed chunks to store")
            return False
        
        try:
            print(f"\n🚀 STORING {len(processed_chunks)} EMBEDDINGS IN PINECONE (BATCHED)")
            print("=" * 50)
            
            total_stored = 0
            total_batches = (len(processed_chunks) + batch_size - 1) // batch_size
            
            for i in range(0, len(processed_chunks), batch_size):
                batch_num = (i // batch_size) + 1
                batch_end = min(i + batch_size, len(processed_chunks))
                batch_chunks = processed_chunks[i:batch_end]
                
                print(f"\n🔄 Processing batch {batch_num}/{total_batches} ({len(batch_chunks)} chunks)")
                
                # Prepare batch data for Pinecone upsert
                vectors = []
                for chunk in batch_chunks:
                    vectors.append({
                        'id': chunk['id'],
                        'values': chunk['values'],
                        'metadata': chunk['metadata']
                    })
                
                # Upsert batch to Pinecone
                self.index.upsert(vectors=vectors)
                
                total_stored += len(vectors)
                print(f"✅ Batch {batch_num} stored: {len(vectors)} embeddings")
                print(f"📊 Total stored so far: {total_stored}/{len(processed_chunks)}")
            
            print(f"\n🎉 ALL BATCHES STORED SUCCESSFULLY!")
            print(f"📊 Total embeddings stored: {total_stored}")
            print(f"🎯 Index: {self.index_name}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error storing in Pinecone: {e}")
            return False
    
    def test_search(self, query: str = "yacht specifications", top_k: int = 5) -> List[Dict[str, Any]]:
        """Test search functionality with a sample query"""
        try:
            print(f"\n🔍 TESTING SEARCH: '{query}'")
            print("=" * 30)
            
            # Generate embedding for query
            query_embedding = self.generate_embedding(query)
            if not query_embedding:
                print("❌ Failed to generate query embedding")
                return []
            
            # Search Pinecone
            search_results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                namespace=""
            )
            
            print(f"✅ Search completed! Found {len(search_results.matches)} results")
            
            # Display results
            for i, match in enumerate(search_results.matches):
                print(f"\n📊 Result {i+1}:")
                print(f"   ID: {match.id}")
                print(f"   Score: {match.score:.4f}")
                print(f"   PDF: {match.metadata.get('pdf_name', 'Unknown')}")
                print(f"   Chunk: {match.metadata.get('chunk_index', 'Unknown')}")
                
                # Show first 100 characters of text
                text_preview = match.metadata.get('text', '')[:100]
                print(f"   Text: {text_preview}...")
            
            return search_results.matches
            
        except Exception as e:
            print(f"❌ Search test failed: {e}")
            return []
    
    def get_index_stats(self) -> Dict[str, Any]:
        """Get statistics about the Pinecone index"""
        try:
            stats = self.index.describe_index_stats()
            print(f"\n📊 PINECONE INDEX STATISTICS")
            print("=" * 30)
            print(f"🎯 Index: {self.index_name}")
            print(f"📊 Total vectors: {stats.total_vector_count}")
            print(f"🌍 Dimension: {stats.dimension}")
            print(f"📁 Namespaces: {list(stats.namespaces.keys()) if stats.namespaces else 'None'}")
            
            return stats
            
        except Exception as e:
            print(f"❌ Error getting index stats: {e}")
            return {}

def main():
    """Main processing function"""
    print("🚀 YACHT EMBEDDINGS PROCESSING PIPELINE")
    print("=" * 50)
    
    try:
        # Initialize processor
        processor = YachtEmbeddingsProcessor()
        
        # Load processed chunks
        chunks = processor.load_processed_chunks()
        if not chunks:
            print("❌ No chunks to process. Run pdf_processor.py first.")
            return
        
        # Generate embeddings
        processed_chunks = processor.process_chunks_to_embeddings(chunks)
        if not processed_chunks:
            print("❌ No embeddings generated")
            return
        
        # Store in Pinecone
        success = processor.store_in_pinecone(processed_chunks)
        if not success:
            print("❌ Failed to store in Pinecone")
            return
        
        # Get index statistics
        processor.get_index_stats()
        
        # Test search functionality
        processor.test_search("yacht specifications length beam draft")
        
        print(f"\n🎉 SUCCESS! Your yacht RAG system is now operational!")
        print("🔄 Ready to process more PDFs and scale up!")
        
    except Exception as e:
        print(f"❌ Processing failed: {e}")

if __name__ == "__main__":
    main()
