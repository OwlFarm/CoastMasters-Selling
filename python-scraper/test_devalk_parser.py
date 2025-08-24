#!/usr/bin/env python3
"""
Test script for De Valk Parser
Tests the parser with sample data to ensure it works correctly
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from devalk_parser import DeValkParser

def test_parser():
    """Test the De Valk parser with sample data"""
    print("🧪 Testing De Valk Parser...")
    
    # Create parser instance
    parser = DeValkParser()
    
    # Test with a sample De Valk URL (you'll need to replace this with a real one)
    test_url = "https://www.devalk.nl/en/yacht/12345"  # Replace with actual URL
    
    print(f"🔗 Testing URL: {test_url}")
    
    try:
        # Parse the listing
        result = parser.parse_yacht_listing(test_url)
        
        if 'error' in result:
            print(f"❌ Error occurred: {result['error']}")
            return False
        
        # Display results
        print("\n📊 PARSING RESULTS:")
        print(f"✅ Completeness: {result.get('data_completeness', 0)}%")
        print(f"📋 Total Fields: {parser._count_total_fields(result)}")
        print(f"🔗 Source: {result.get('source', 'Unknown')}")
        print(f"⏰ Scraped: {result.get('scraped_at', 'Unknown')}")
        
        # Display section summaries
        sections = ['key_details', 'general', 'accommodation', 'machinery', 
                   'navigation', 'equipment', 'rigging', 'indication_ratios']
        
        for section in sections:
            if section in result and result[section]:
                field_count = len(result[section])
                print(f"\n🏷️ {section.upper().replace('_', ' ')}: {field_count} fields")
                
                # Show first few fields as examples
                for i, (field, value) in enumerate(result[section].items()):
                    if i < 3:  # Show first 3 fields
                        print(f"  • {field}: {value}")
                    else:
                        print(f"  • ... and {field_count - 3} more fields")
                        break
        
        print("\n🎉 Parser test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        return False

if __name__ == "__main__":
    success = test_parser()
    sys.exit(0 if success else 1)
