#!/usr/bin/env python3
"""
Test script to verify field count and pattern coverage
"""

from super_enhanced_devalk_parser import SuperEnhancedDeValkParser

def test_field_coverage():
    """Test our field coverage calculation"""
    parser = SuperEnhancedDeValkParser()
    
    print("🔍 FIELD COVERAGE ANALYSIS")
    print("=" * 50)
    
    # Count patterns in each section
    key_details_count = len(parser.patterns_key_details)
    general_info_count = len(parser.patterns_general_info)
    accommodation_count = len(parser.patterns_accommodation)
    machinery_count = len(parser.patterns_machinery)
    indication_ratios_count = len(parser.patterns_indication_ratios)
    
    print(f"📊 Pattern Counts:")
    print(f"   Key Details: {key_details_count}")
    print(f"   General Info: {general_info_count}")
    print(f"   Accommodation: {accommodation_count}")
    print(f"   Machinery: {machinery_count}")
    print(f"   Indication Ratios: {indication_ratios_count}")
    
    # Count other pattern sections
    # Equipment patterns are defined in the method
    equipment_count = 46  # From our analysis
    navigation_count = 26  # From our analysis
    rigging_count = 22     # From our analysis
    
    print(f"   Equipment: {equipment_count}")
    print(f"   Navigation: {navigation_count}")
    print(f"   Rigging: {rigging_count}")
    
    total_patterns = (key_details_count + general_info_count + accommodation_count + 
                     machinery_count + indication_ratios_count + equipment_count + 
                     navigation_count + rigging_count)
    
    print(f"\n🎯 Total Expected Fields: {total_patterns}")
    
    # Expected field count should be 200+
    if total_patterns >= 200:
        print("✅ Field coverage looks excellent!")
    elif total_patterns >= 150:
        print("⚠️  Field coverage is good but could be better")
    else:
        print("❌ Field coverage needs improvement")
    
    print(f"\n📋 Pattern Examples:")
    print(f"   LOA patterns: {[k for k in parser.patterns_key_details.keys() if 'loa' in k.lower()]}")
    print(f"   Beam patterns: {[k for k in parser.patterns_key_details.keys() if 'beam' in k.lower()]}")
    print(f"   Draft patterns: {[k for k in parser.patterns_key_details.keys() if 'draft' in k.lower()]}")

if __name__ == "__main__":
    test_field_coverage()
