#!/usr/bin/env python3
"""
Test script to verify our dimension patterns work
"""

import re

def test_patterns():
    """Test our dimension patterns"""
    
    # Test HTML from the actual page
    test_html = '<li>13.95 x 4.28 x 1.90 (m)</li>'
    
    print("🔍 TESTING DIMENSION PATTERNS")
    print("=" * 50)
    print(f"Test HTML: {test_html}")
    
    # Test our patterns - FIXED regex syntax with correct spacing
    patterns = {
        'dimensions_direct': re.compile(r'<li>(\d+(?:,\d+)?\s+x\s+\d+(?:,\d+)?\s+x\s+\d+(?:,\d+)?)\s*\(m\)</li>', re.IGNORECASE),
        'loaM_direct': re.compile(r'<li>(\d+(?:,\d+)?)\s+x\s+\d+(?:,\d+)?\s+x\s+\d+(?:,\d+)?\s*\(m\)</li>', re.IGNORECASE),
        'beamM_direct': re.compile(r'<li>\d+(?:,\d+)?\s+x\s+(\d+(?:,\d+)?)\s+x\s+\d+(?:,\d+)?\s*\(m\)</li>', re.IGNORECASE),
        'draftM_direct': re.compile(r'<li>\d+(?:,\d+)?\s+x\s+\d+(?:,\d+)?\s+x\s+(\d+(?:,\d+)?)\s*\(m\)</li>', re.IGNORECASE),
    }
    
    for name, pattern in patterns.items():
        match = pattern.search(test_html)
        if match:
            print(f"✅ {name}: {match.group(1)}")
        else:
            print(f"❌ {name}: No match")
    
    # Test the general dimensions pattern
    general_pattern = re.compile(r'(\d+(?:,\d+)?\s+x\s+\d+(?:,\d+)?\s+x\s+\d+(?:,\d+)?)', re.IGNORECASE)
    match = general_pattern.search(test_html)
    if match:
        print(f"✅ General dimensions: {match.group(1)}")
    else:
        print(f"❌ General dimensions: No match")
    
    # Test with the actual text content (without HTML tags)
    text_content = '13.95 x 4.28 x 1.90 (m)'
    print(f"\nTest text: {text_content}")
    
    text_pattern = re.compile(r'(\d+(?:,\d+)?\s+x\s+\d+(?:,\d+)?\s+x\s+\d+(?:,\d+)?)', re.IGNORECASE)
    match = text_pattern.search(text_content)
    if match:
        print(f"✅ Text pattern: {match.group(1)}")
    else:
        print(f"❌ Text pattern: No match")
    
    # Test with the exact spacing from the HTML
    exact_pattern = re.compile(r'(\d+(?:,\d+)? x \d+(?:,\d+)? x \d+(?:,\d+)?)', re.IGNORECASE)
    match = exact_pattern.search(text_content)
    if match:
        print(f"✅ Exact pattern: {match.group(1)}")
    else:
        print(f"❌ Exact pattern: No match")

if __name__ == "__main__":
    test_patterns()
