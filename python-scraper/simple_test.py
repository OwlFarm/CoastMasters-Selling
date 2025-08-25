#!/usr/bin/env python3
"""
Simple regex test
"""

import re

def simple_test():
    """Simple regex test"""
    
    text = '13.95 x 4.28 x 1.90 (m)'
    print(f"Text: '{text}'")
    
    # Test different patterns
    patterns = [
        r'(\d+\.\d+ x \d+\.\d+ x \d+\.\d+)',
        r'(\d+\.\d+\s+x\s+\d+\.\d+\s+x\s+\d+\.\d+)',
        r'(\d+\.\d+ x \d+\.\d+ x \d+\.\d+)',
        r'(\d+ x \d+ x \d+)',
    ]
    
    for i, pattern in enumerate(patterns):
        print(f"\nPattern {i+1}: {pattern}")
        try:
            match = re.search(pattern, text)
            if match:
                print(f"✅ Match: {match.group(1)}")
            else:
                print("❌ No match")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    simple_test()
