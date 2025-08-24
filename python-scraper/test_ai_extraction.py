#!/usr/bin/env python3
"""
Test script for AI-powered yacht data extraction
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_extractor import AIYachtExtractor

def test_ai_extraction():
    """Test the AI extraction with sample HTML"""
    
    # Check if OpenAI API key is available
    if not os.getenv('OPENAI_API_KEY'):
        print("❌ OPENAI_API_KEY not found in environment variables")
        print("Please set your OpenAI API key:")
        print("export OPENAI_API_KEY='your_api_key_here'")
        return False
    
    # Sample HTML content (simplified De Valk listing)
    sample_html = """
    <html>
        <head><title>MOODY 54 for sale</title></head>
        <body>
            <h1>MOODY 54</h1>
            <div class="price">€ 350.000</div>
            <div class="specs">
                <p>Built: 2003</p>
                <p>Dimensions: 16.72m x 4.85m x 2.28m</p>
                <p>Engine: 1x Yanmar 4JH110 diesel</p>
                <p>Material: GRP</p>
            </div>
        </body>
    </html>
    """
    
    print("🧪 Testing AI-powered yacht data extraction...")
    print(f"OpenAI API Key: {'✅ Set' if os.getenv('OPENAI_API_KEY') else '❌ Missing'}")
    
    try:
        # Initialize AI extractor
        ai_extractor = AIYachtExtractor()
        print("✅ AI Extractor initialized")
        
        # Test extraction
        print("🔄 Testing extraction...")
        result = ai_extractor.extract_yacht_data(sample_html, "https://test.devalk.nl")
        
        if result:
            print("✅ AI extraction successful!")
            print("📊 Extracted data:")
            for key, value in result.items():
                print(f"  {key}: {value}")
        else:
            print("❌ AI extraction failed")
            return False
            
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False
    
    print("\n🎯 AI extraction test completed successfully!")
    return True

if __name__ == "__main__":
    success = test_ai_extraction()
    sys.exit(0 if success else 1)
