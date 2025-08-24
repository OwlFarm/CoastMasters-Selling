#!/usr/bin/env python3
"""
🚀 PDF PROCESSOR FOR YACHT RAG SYSTEM
Extracts text from yacht PDFs, chunks it, and prepares for Pinecone embeddings
"""

import os
import re
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, storage
from pinecone import Pinecone, ServerlessSpec
import PyPDF2
import io

class YachtPDFProcessor:
    def __init__(self):
        # Initialize Firebase
        service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
        storage_bucket = os.getenv('FIREBASE_STORAGE_BUCKET')
        
        if not service_account_path or not storage_bucket:
            raise ValueError("FIREBASE_SERVICE_ACCOUNT_PATH and FIREBASE_STORAGE_BUCKET required")
        
        # Initialize Firebase if not already done
        try:
            firebase_admin.get_app()
        except ValueError:
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred, {'storageBucket': storage_bucket})
        
        self.storage_bucket = storage.bucket()
        
        # Initialize Pinecone
        self.pinecone_client = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
        self.index_name = 'coast-masters-yacht-rag'
        
        print("✅ Yacht PDF Processor initialized!")
        print(f"📁 Firebase Storage: {storage_bucket}")
        print(f"🎯 Pinecone Index: {self.index_name}")
    
    def list_pdf_files(self) -> List[Dict[str, Any]]:
        """List all PDF files in Firebase Storage"""
        try:
            blobs = self.storage_bucket.list_blobs(prefix='boat_pdfs/')
            pdf_files = []
            
            for blob in blobs:
                if blob.name.endswith('.pdf'):
                    pdf_files.append({
                        'name': blob.name,
                        'size': blob.size,
                        'created': blob.time_created.isoformat() if blob.time_created else None
                    })
            
            print(f"📚 Found {len(pdf_files)} PDF files")
            return pdf_files
            
        except Exception as e:
            print(f"❌ Error listing PDF files: {e}")
            return []
    
    def download_pdf(self, pdf_name: str) -> Optional[bytes]:
        """Download a PDF file from Firebase Storage"""
        try:
            blob = self.storage_bucket.blob(pdf_name)
            pdf_content = blob.download_as_bytes()
            print(f"📥 Downloaded: {pdf_name} ({len(pdf_content)} bytes)")
            return pdf_content
            
        except Exception as e:
            print(f"❌ Error downloading {pdf_name}: {e}")
            return None
    
    def extract_text_from_pdf(self, pdf_content: bytes) -> Optional[str]:
        """Extract text content from PDF bytes"""
        try:
            pdf_file = io.BytesIO(pdf_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text_content = ""
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text_content += f"\n--- PAGE {page_num + 1} ---\n{page_text}\n"
            
            print(f"📄 Extracted {len(text_content)} characters of text")
            return text_content
            
        except Exception as e:
            print(f"❌ Error extracting text: {e}")
            return None
    
    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Split text into overlapping chunks for better context"""
        if len(text) <= chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            
            # Try to break at sentence boundary
            if end < len(text):
                # Look for sentence endings
                for i in range(end, max(start, end - 100), -1):
                    if text[i] in '.!?':
                        end = i + 1
                        break
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            start = end - overlap
            if start >= len(text):
                break
        
        print(f"✂️  Created {len(chunks)} text chunks")
        return chunks
    
    def process_single_pdf(self, pdf_name: str) -> List[Dict[str, Any]]:
        """Process a single PDF and return chunks with metadata"""
        print(f"\n🔄 Processing: {pdf_name}")
        
        # Download PDF
        pdf_content = self.download_pdf(pdf_name)
        if not pdf_content:
            return []
        
        # Extract text
        text_content = self.extract_text_from_pdf(pdf_content)
        if not text_content:
            return []
        
        # Create chunks
        chunks = self.chunk_text(text_content)
        
        # Prepare chunks with metadata
        processed_chunks = []
        for i, chunk in enumerate(chunks):
            processed_chunks.append({
                'id': f"{pdf_name.replace('/', '_')}_chunk_{i}",
                'text': chunk,
                'metadata': {
                    'pdf_name': pdf_name,
                    'chunk_index': i,
                    'total_chunks': len(chunks),
                    'pdf_size': len(pdf_content),
                    'processed_at': datetime.now().isoformat()
                }
            })
        
        print(f"✅ Processed {pdf_name}: {len(processed_chunks)} chunks")
        return processed_chunks
    
    def process_all_pdfs_fast(self, max_files: int = 100) -> List[Dict[str, Any]]:
        """Process PDFs without duplicate checking for speed"""
        print(f"\n🚀 FAST PROCESSING UP TO {max_files} PDF FILES")
        print("=" * 50)
        
        # List available PDFs
        pdf_files = self.list_pdf_files()
        if not pdf_files:
            print("❌ No PDF files found")
            return []
        
        # Process first N files
        files_to_process = pdf_files[:max_files]
        all_chunks = []
        
        for i, pdf_file in enumerate(files_to_process):
            print(f"\n🔄 Processing file {i+1}/{len(files_to_process)}: {pdf_file['name']}")
            chunks = self.process_single_pdf(pdf_file['name'])
            all_chunks.extend(chunks)
        
        print(f"\n🎉 FAST PROCESSING COMPLETE!")
        print(f"📊 Total chunks created: {len(all_chunks)}")
        print(f"📁 PDFs processed: {len(files_to_process)}")
        
        # Save all chunks to JSON file
        if all_chunks:
            self.save_processed_data(all_chunks, f"processed_pdf_chunks_{len(all_chunks)}.json")
            print(f"💾 Saved {len(all_chunks)} chunks to JSON file")
        
        return all_chunks
    
    def save_processed_data(self, chunks: List[Dict[str, Any]], filename: str = "processed_pdf_chunks.json"):
        """Save processed chunks to JSON for review"""
        try:
            with open(filename, 'w') as f:
                json.dump({
                    'processed_at': datetime.now().isoformat(),
                    'total_chunks': len(chunks),
                    'chunks': chunks
                }, f, indent=2)
            
            print(f"💾 Saved processed data to: {filename}")
            
        except Exception as e:
            print(f"❌ Error saving data: {e}")

def main():
    """Main processing function"""
    print("🚀 YACHT PDF PROCESSING PIPELINE")
    print("=" * 50)
    
    try:
        # Initialize processor
        processor = YachtPDFProcessor()
        
        # Process 100 PDFs for testing (fast mode)
        chunks = processor.process_all_pdfs_fast(max_files=100)
        
        if chunks:
            print(f"\n✅ SUCCESS! Processed {len(chunks)} text chunks")
            print("🔄 Next step: Generate embeddings and store in Pinecone")
        else:
            print("❌ No chunks processed")
            
    except Exception as e:
        print(f"❌ Processing failed: {e}")

if __name__ == "__main__":
    main()
