#!/usr/bin/env python3
"""
De Valk Yacht Parser - Dedicated parser for maximum data extraction
Extracts ALL available fields from De Valk yacht listings for knowledge base integrity
"""

import re
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DeValkParser:
    """Dedicated De Valk yacht listing parser for maximum data extraction"""
    
    def __init__(self):
        """Initialize the De Valk parser"""
        self.driver = None
        self.soup = None
        
    def parse_yacht_listing(self, url: str) -> Dict[str, Any]:
        """
        Parse a De Valk yacht listing URL and extract ALL available data
        
        Args:
            url: De Valk yacht listing URL
            
        Returns:
            Dictionary containing all extracted yacht data
        """
        try:
            logger.info(f"🚀 Starting De Valk parsing: {url}")
            
            # Initialize Selenium driver
            self._setup_driver()
            
            # Load the page
            self.driver.get(url)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Get page source and create BeautifulSoup
            page_source = self.driver.page_source
            self.soup = BeautifulSoup(page_source, 'html.parser')
            
            # Extract ALL sections
            data = {
                'source_url': url,
                'scraped_at': datetime.now().isoformat(),
                'source': 'devalk',
                'parser_version': '1.0.0'
            }
            
            # Extract all sections
            data.update(self._extract_key_details())
            data.update(self._extract_general_information())
            data.update(self._extract_accommodation())
            data.update(self._extract_machinery())
            data.update(self._extract_navigation())
            data.update(self._extract_equipment())
            data.update(self._extract_rigging())
            data.update(self._extract_indication_ratios())
            
            # Calculate overall completeness
            data['data_completeness'] = self._calculate_completeness(data)
            
            logger.info(f"✅ De Valk parsing completed. Completeness: {data['data_completeness']}%")
            logger.info(f"📊 Total fields extracted: {self._count_total_fields(data)}")
            
            return data
            
        except Exception as e:
            logger.error(f"❌ Error in De Valk parsing: {e}")
            return {'error': str(e), 'source_url': url}
            
        finally:
            if self.driver:
                self.driver.quit()
    
    def _setup_driver(self):
        """Setup Selenium Chrome driver"""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            
        except Exception as e:
            logger.error(f"Failed to setup Chrome driver: {e}")
            raise
    
    def _extract_key_details(self) -> Dict[str, Any]:
        """Extract Key Details section with ALL fields"""
        logger.info("🔑 Extracting Key Details section...")
        
        key_details = {}
        
        # Look for Key Details section
        section = self._find_section('Key Details')
        if section:
            logger.info("✅ Found Key Details section")
            
            # Extract all key detail fields
            fields_to_extract = [
                'DIMENSIONS', 'MATERIAL', 'BUILT', 'ENGINE(S)', 'HP/ KW',
                'LYING', 'SALES OFFICE', 'STATUS', 'VAT', 'ASKING PRICE'
            ]
            
            for field in fields_to_extract:
                value = self._extract_field_value(section, field)
                if value:
                    key_details[field.lower().replace('/', '_').replace(' ', '_')] = value
                    logger.info(f"✅ Key Detail: {field} = {value}")
        
        return {'key_details': key_details}
    
    def _extract_general_information(self) -> Dict[str, Any]:
        """Extract General Information section with ALL 35+ fields"""
        logger.info("📋 Extracting General Information section...")
        
        general = {}
        
        # Look for General Information section
        section = self._find_section('General Information')
        if section:
            logger.info("✅ Found General Information section")
            
            # Extract ALL General Information fields
            fields_to_extract = [
                'MODEL', 'TYPE', 'LOA (M)', 'LWL (M)', 'BEAM (M)', 'DRAFT (M)',
                'AIR DRAFT (M)', 'HEADROOM (M)', 'YEAR BUILT', 'BUILDER',
                'COUNTRY', 'DESIGNER', 'DISPLACEMENT (T)', 'BALLAST (TONNES)',
                'HULL MATERIAL', 'HULL COLOUR', 'HULL SHAPE', 'KEEL TYPE',
                'SUPERSTRUCTURE MATERIAL', 'DECK MATERIAL', 'DECK FINISH',
                'SUPERSTRUCTURE DECK FINISH', 'COCKPIT DECK FINISH',
                'DORADES', 'WINDOW FRAME', 'WINDOW MATERIAL', 'DECKHATCH',
                'FUEL TANK (LITRE)', 'LEVEL INDICATOR (FUEL TANK)',
                'FRESHWATER TANK (LITRE)', 'LEVEL INDICATOR (FRESHWATER)',
                'WHEEL STEERING', 'OUTSIDE HELM POSITION'
            ]
            
            for field in fields_to_extract:
                value = self._extract_field_value(section, field)
                if value:
                    # Convert field name to clean key
                    clean_key = self._clean_field_name(field)
                    general[clean_key] = value
                    logger.info(f"✅ General: {field} = {value}")
        
        return {'general': general}
    
    def _extract_accommodation(self) -> Dict[str, Any]:
        """Extract Accommodation section with ALL fields"""
        logger.info("🏠 Extracting Accommodation section...")
        
        accommodation = {}
        
        # Look for Accommodation section
        section = self._find_section('Accommodation')
        if section:
            logger.info("✅ Found Accommodation section")
            
            # Extract ALL Accommodation fields
            fields_to_extract = [
                'CABINS', 'BERTHS', 'INTERIOR', 'LAYOUT', 'FLOOR',
                'OPEN COCKPIT', 'AFT DECK', 'SALOON', 'HEADROOM SALOON (M)',
                'HEATING', 'NAVIGATION CENTER', 'CHART TABLE', 'GALLEY',
                'COUNTERTOP', 'SINK', 'COOKER', 'OVEN', 'MICROWAVE',
                'FRIDGE', 'FREEZER', 'HOT WATER SYSTEM', 'WATER PRESSURE SYSTEM',
                'OWNERS CABIN', 'BED LENGTH (M)', 'WARDROBE', 'BATHROOM',
                'TOILET', 'TOILET SYSTEM', 'WASH BASIN', 'SHOWER',
                'GUEST CABIN 1', 'GUEST CABIN 2', 'WASHING MACHINE'
            ]
            
            for field in fields_to_extract:
                value = self._extract_field_value(section, field)
                if value:
                    clean_key = self._clean_field_name(field)
                    accommodation[clean_key] = value
                    logger.info(f"✅ Accommodation: {field} = {value}")
        
        return {'accommodation': accommodation}
    
    def _extract_machinery(self) -> Dict[str, Any]:
        """Extract Machinery section with ALL fields"""
        logger.info("🔧 Extracting Machinery section...")
        
        machinery = {}
        
        # Look for Machinery section
        section = self._find_section('Machinery')
        if section:
            logger.info("✅ Found Machinery section")
            
            # Extract ALL Machinery fields
            fields_to_extract = [
                'NO OF ENGINES', 'MAKE', 'TYPE', 'HP', 'KW', 'FUEL',
                'YEAR INSTALLED', 'YEAR OF OVERHAUL', 'MAXIMUM SPEED (KN)',
                'CRUISING SPEED (KN)', 'CONSUMPTION (L/HR)', 'ENGINE COOLING SYSTEM',
                'DRIVE', 'SHAFT SEAL', 'ENGINE CONTROLS', 'GEARBOX',
                'BOWTHRUSTER', 'PROPELLER TYPE', 'MANUAL BILGE PUMP',
                'ELECTRIC BILGE PUMP', 'ELECTRICAL INSTALLATION', 'GENERATOR',
                'BATTERIES', 'START BATTERY', 'SERVICE BATTERY', 'BATTERY MONITOR',
                'BATTERY CHARGER', 'SOLAR PANEL', 'SHOREPOWER', 'WATERMAKER',
                'EXTRA INFO'
            ]
            
            for field in fields_to_extract:
                value = self._extract_field_value(section, field)
                if value:
                    clean_key = self._clean_field_name(field)
                    machinery[clean_key] = value
                    logger.info(f"✅ Machinery: {field} = {value}")
        
        return {'machinery': machinery}
    
    def _extract_navigation(self) -> Dict[str, Any]:
        """Extract Navigation section with ALL fields"""
        logger.info("🧭 Extracting Navigation section...")
        
        navigation = {}
        
        # Look for Navigation section
        section = self._find_section('Navigation')
        if section:
            logger.info("✅ Found Navigation section")
            
            # Extract ALL Navigation fields
            fields_to_extract = [
                'COMPASS', 'DEPTH SOUNDER', 'LOG', 'WINDSET', 'VHF',
                'AUTOPILOT', 'RADAR', 'GPS', 'PLOTTER', 'NAVTEX',
                'AIS TRANSCEIVER', 'NAVIGATION LIGHTS', 'EXTRA INFO'
            ]
            
            for field in fields_to_extract:
                value = self._extract_field_value(section, field)
                if value:
                    clean_key = self._clean_field_name(field)
                    navigation[clean_key] = value
                    logger.info(f"✅ Navigation: {field} = {value}")
        
        return {'navigation': navigation}
    
    def _extract_equipment(self) -> Dict[str, Any]:
        """Extract Equipment section with ALL fields"""
        logger.info("🛠️ Extracting Equipment section...")
        
        equipment = {}
        
        # Look for Equipment section
        section = self._find_section('Equipment')
        if section:
            logger.info("✅ Found Equipment section")
            
            # Extract ALL Equipment fields
            fields_to_extract = [
                'FIXED WINDSCREEN', 'COCKPIT TABLE', 'BATHING PLATFORM',
                'BOARDING LADDER', 'DECK SHOWER', 'ANCHOR', 'ANCHOR CHAIN',
                'ANCHOR 2', 'WINDLASS', 'DECK WASH', 'DINGHY', 'OUTBOARD',
                'DAVITS', 'SEA RAILING', 'PUSHPIT', 'PULPIT', 'LIFEBUOY',
                'RADAR REFLECTOR', 'FENDERS', 'MOORING LINES', 'RADIO',
                'COCKPIT SPEAKERS', 'SPEAKERS IN SALON', 'FIRE EXTINGUISHER'
            ]
            
            for field in fields_to_extract:
                value = self._extract_field_value(section, field)
                if value:
                    clean_key = self._clean_field_name(field)
                    equipment[clean_key] = value
                    logger.info(f"✅ Equipment: {field} = {value}")
        
        return {'equipment': equipment}
    
    def _extract_rigging(self) -> Dict[str, Any]:
        """Extract Rigging section with ALL fields including detailed winches"""
        logger.info("⛵ Extracting Rigging section...")
        
        rigging = {}
        
        # Look for Rigging section
        section = self._find_section('Rigging')
        if section:
            logger.info("✅ Found Rigging section")
            
            # Extract ALL Rigging fields including detailed winches
            fields_to_extract = [
                'RIGGING', 'STANDING RIGGING', 'BRAND MAST', 'MATERIAL MAST',
                'SPREADERS', 'MAINSAIL', 'STOWAY MAST', 'CUTTERSTAY',
                'JIB', 'GENOA', 'GENOA FURLER', 'CUTTER FURLER',
                'GENNAKER', 'SPINNAKER', 'REEFING SYSTEM', 'BACKSTAY ADJUSTER',
                'PRIMARY SHEET WINCH', 'SECONDARY SHEET WINCH',
                'GENOA SHEETWINCHES', 'HALYARD WINCHES',
                'MULTIFUNCTIONAL WINCHES', 'SPI-POLE'
            ]
            
            for field in fields_to_extract:
                value = self._extract_field_value(section, field)
                if value:
                    clean_key = self._clean_field_name(field)
                    rigging[clean_key] = value
                    logger.info(f"✅ Rigging: {field} = {value}")
        
        return {'rigging': rigging}
    
    def _extract_indication_ratios(self) -> Dict[str, Any]:
        """Extract Indication Ratios section with ALL fields"""
        logger.info("📊 Extracting Indication Ratios section...")
        
        ratios = {}
        
        # Look for Indication Ratios section
        section = self._find_section('Indication Ratios')
        if section:
            logger.info("✅ Found Indication Ratios section")
            
            # Extract ALL Indication Ratios fields
            fields_to_extract = [
                'S.A. / Displ.', 'Bal. / Displ.', 'Disp: / Len:',
                'Comfort Ratio:', 'Capsize Screening Formula:', 'S#:',
                'Hull Speed:', 'Pounds/Inch Immersion:'
            ]
            
            for field in fields_to_extract:
                value = self._extract_field_value(section, field)
                if value:
                    clean_key = self._clean_field_name(field)
                    ratios[clean_key] = value
                    logger.info(f"✅ Ratio: {field} = {value}")
        
        return {'indication_ratios': ratios}
    
    def _find_section(self, section_name: str) -> Optional[Any]:
        """Find a specific section in the HTML"""
        try:
            # Look for section headers
            headers = self.soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
            
            for header in headers:
                if section_name.lower() in header.get_text().lower():
                    logger.info(f"📍 Found section: {header.get_text()}")
                    return header
            
            return None
            
        except Exception as e:
            logger.error(f"Error finding section {section_name}: {e}")
            return None
    
    def _extract_field_value(self, section: Any, field_name: str) -> Optional[str]:
        """Extract value for a specific field from a section"""
        try:
            if not section:
                return None
            
            # Look for the field in the section content
            section_text = section.get_text()
            
            # Pattern to match: * FIELD_NAME - VALUE
            pattern = rf'\*\s*{re.escape(field_name)}\s*-\s*(.+)'
            match = re.search(pattern, section_text, re.IGNORECASE)
            
            if match:
                value = match.group(1).strip()
                return value
            
            return None
            
        except Exception as e:
            logger.error(f"Error extracting field {field_name}: {e}")
            return None
    
    def _clean_field_name(self, field_name: str) -> str:
        """Convert field name to clean key format"""
        # Remove parentheses and units, convert to lowercase with underscores
        clean = re.sub(r'\([^)]*\)', '', field_name)  # Remove (M), (T), etc.
        clean = re.sub(r'[^\w\s]', '', clean)  # Remove special characters
        clean = clean.strip().lower().replace(' ', '_')
        return clean
    
    def _calculate_completeness(self, data: Dict[str, Any]) -> float:
        """Calculate overall data completeness percentage"""
        try:
            total_fields = 0
            populated_fields = 0
            
            # Count fields in each section
            sections = ['key_details', 'general', 'accommodation', 'machinery', 
                       'navigation', 'equipment', 'rigging', 'indication_ratios']
            
            for section in sections:
                if section in data and isinstance(data[section], dict):
                    section_data = data[section]
                    for field_name, field_value in section_data.items():
                        total_fields += 1
                        if field_value and str(field_value).strip() and str(field_value).lower() not in ['none', 'n/a', '']:
                            populated_fields += 1
            
            if total_fields == 0:
                return 0.0
                
            completeness = round((populated_fields / total_fields) * 100, 1)
            logger.info(f"📊 Completeness: {populated_fields}/{total_fields} fields = {completeness}%")
            
            return completeness
            
        except Exception as e:
            logger.error(f"Error calculating completeness: {e}")
            return 0.0
    
    def _count_total_fields(self, data: Dict[str, Any]) -> int:
        """Count total number of fields extracted"""
        try:
            total = 0
            sections = ['key_details', 'general', 'accommodation', 'machinery', 
                       'navigation', 'equipment', 'rigging', 'indication_ratios']
            
            for section in sections:
                if section in data and isinstance(data[section], dict):
                    total += len(data[section])
            
            return total
            
        except Exception as e:
            logger.error(f"Error counting fields: {e}")
            return 0


# Example usage
if __name__ == "__main__":
    parser = DeValkParser()
    
    # Test with a De Valk URL
    test_url = "https://www.devalk.nl/en/yacht/12345"  # Replace with actual URL
    result = parser.parse_yacht_listing(test_url)
    
    print("Parsing Result:")
    print(f"Completeness: {result.get('data_completeness', 0)}%")
    print(f"Total Fields: {parser._count_total_fields(result)}")
    print(f"Error: {result.get('error', 'None')}")
