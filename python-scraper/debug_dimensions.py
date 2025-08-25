#!/usr/bin/env python3
"""
Debug script to see what HTML we're getting for dimensions
"""

import requests
from bs4 import BeautifulSoup

def debug_dimensions():
    """Debug dimension extraction"""
    url = "https://www.devalk.nl/en/yachtbrokerage/810010/NAJAD-460.html"
    
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    })
    
    response = session.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    print("🔍 DEBUGGING DIMENSION EXTRACTION")
    print("=" * 50)
    
    # Look for dimensions in meta description
    meta_desc = soup.find('meta', {'name': 'description'})
    if meta_desc:
        print(f"Meta description: {meta_desc.get('content', '')}")
        
        # Check if dimensions are in meta description
        if 'Dimensions:' in meta_desc.get('content', ''):
            print("✅ Dimensions found in meta description!")
        else:
            print("❌ No dimensions in meta description")
    
    # Look for dimensions in the actual HTML
    print("\n🔍 Looking for dimensions in HTML...")
    
    # Search for dimensions text
    dimensions_text = soup.find(text=lambda text: text and 'Dimensions' in text)
    if dimensions_text:
        print(f"Found dimensions text: {dimensions_text}")
        parent = dimensions_text.parent
        if parent:
            print(f"Parent element: {parent}")
            # Look for the actual dimensions value
            next_sibling = parent.find_next_sibling()
            if next_sibling:
                print(f"Next sibling: {next_sibling}")
    
    # Search for dimensions in list items
    dimensions_li = soup.find('li', text=lambda text: text and 'Dimensions' in text)
    if dimensions_li:
        print(f"Found dimensions li: {dimensions_li}")
        # Look for the next li with dimensions
        next_li = dimensions_li.find_next_sibling('li')
        if next_li:
            print(f"Next li: {next_li}")
    
    # Search for any text containing dimensions pattern
    import re
    text_content = soup.get_text()
    dimension_pattern = r'(\d+(?:,\d+)?\s*x\s*\d+(?:,\d+)?\s*x\s*\d+(?:,\d+)?)'
    matches = re.findall(dimension_pattern, text_content)
    print(f"\nDimension pattern matches: {matches}")
    
    # Look for specific dimension values
    loa_pattern = r'(\d+(?:,\d+)?)\s*x\s*\d+(?:,\d+)?\s*x\s*\d+(?:,\d+)?'
    loa_matches = re.findall(loa_pattern, text_content)
    print(f"LOA pattern matches: {loa_matches}")

if __name__ == "__main__":
    debug_dimensions()
