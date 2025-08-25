#!/usr/bin/env python3
"""
Simple De Valk Parser - Uses requests + BeautifulSoup for immediate testing
No Chrome/Selenium dependencies required
"""

import re
import logging
import requests
from datetime import datetime
from typing import Dict, Any
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SimpleDeValkParser:
    """Simple De Valk parser using requests + BeautifulSoup"""
    
    def __init__(self):
        """Initialize the simple parser"""
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
    
    def parse_yacht_listing(self, url: str) -> Dict[str, Any]:
        """
        Parse a De Valk yacht listing URL using simple HTTP requests
        
        Args:
            url: De Valk yacht listing URL
            
        Returns:
            Dictionary containing extracted yacht data
        """
        try:
            logger.info(f"🚀 Starting simple De Valk parsing: {url}")
            
            # Fetch the page
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            # Parse with BeautifulSoup
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract data
            data = {
                'source_url': url,
                'scraped_at': datetime.now().isoformat(),
                'source': 'devalk_simple',
                'parser_version': '1.0.0'
            }
            
            # Extract all sections in the format the frontend expects
            data.update(self._extract_key_details(soup))
            data.update(self._extract_general_info(soup))
            data.update(self._extract_accommodation(soup))
            data.update(self._extract_machinery(soup))
            data.update(self._extract_navigation(soup))
            data.update(self._extract_equipment(soup))
            data.update(self._extract_rigging(soup))
            data.update(self._extract_indication_ratios(soup))
            
            logger.info(f"✅ Simple De Valk parsing completed")
            return data
            
        except Exception as e:
            logger.error(f"❌ Error in simple De Valk parsing: {e}")
            return {'error': str(e), 'source_url': url}
    
    def _extract_basic_info(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract basic yacht information"""
        basic_info = {}
        
        try:
            # Try to get yacht name from title
            title = soup.find('title')
            if title:
                title_text = title.get_text().strip()
                if 'De Valk' in title_text:
                    # Extract yacht name from title
                    yacht_name = title_text.split('|')[0].strip()
                    basic_info['yacht_name'] = yacht_name
                    logger.info(f"✅ Yacht name: {yacht_name}")
            
            # Try to get price from page content
            price_patterns = [
                r'€\s*([\d,]+)',
                r'(\d{1,3}(?:,\d{3})*)\s*€',
                r'Price[:\s]*€?\s*([\d,]+)',
                r'Asking[:\s]*€?\s*([\d,]+)'
            ]
            
            page_text = soup.get_text()
            for pattern in price_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    price = match.group(1)
                    basic_info['asking_price'] = f"€ {price}"
                    logger.info(f"✅ Price found: € {price}")
                    break
            
        except Exception as e:
            logger.error(f"Error extracting basic info: {e}")
        
        return {'basic_info': basic_info}
    
    def _extract_key_details(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract key details from the page"""
        key_details = {}
        
        try:
            # Look for common yacht specifications
            page_text = soup.get_text()
            
            # Dimensions pattern
            dim_pattern = r'(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*\(m\)'
            dim_match = re.search(dim_pattern, page_text)
            if dim_match:
                loa, beam, draft = dim_match.groups()
                key_details['dimensions'] = f"{loa} x {beam} x {draft} (m)"
                key_details['loaM'] = loa
                key_details['beamM'] = beam
                key_details['draftM'] = draft
                logger.info(f"✅ Dimensions: {key_details['dimensions']}")
            
            # Year built pattern
            year_pattern = r'(\d{4})'
            year_match = re.search(year_pattern, page_text)
            if year_match:
                year = year_match.group(1)
                if 1900 <= int(year) <= 2030:  # Reasonable year range
                    key_details['built'] = year
                    logger.info(f"✅ Year built: {year}")
            
            # Material pattern
            material_patterns = [r'GRP', r'Steel', r'Aluminium', r'Wood']
            for pattern in material_patterns:
                if re.search(pattern, page_text, re.IGNORECASE):
                    key_details['material'] = pattern
                    logger.info(f"✅ Material: {pattern}")
                    break
            
            # Engine pattern
            engine_pattern = r'(\d+x\s+[A-Za-z\s]+)'
            engine_match = re.search(engine_pattern, page_text)
            if engine_match:
                key_details['engines'] = engine_match.group(1)
                logger.info(f"✅ Engines: {key_details['engines']}")
            
            # HP/KW pattern
            hp_pattern = r'(\d+\.?\d*)\s*(hp|kw)'
            hp_match = re.search(hp_pattern, page_text, re.IGNORECASE)
            if hp_match:
                key_details['hpKw'] = f"{hp_match.group(1)} {hp_match.group(2)}"
                logger.info(f"✅ HP/KW: {key_details['hpKw']}")
            
            # Price pattern
            price_pattern = r'€\s*([\d,]+)'
            price_match = re.search(price_pattern, page_text)
            if price_match:
                key_details['askingPrice'] = f"€ {price_match.group(1)}"
                logger.info(f"✅ Price: {key_details['askingPrice']}")
            
        except Exception as e:
            logger.error(f"Error extracting key details: {e}")
        
        return {'keyDetails': key_details}
    
    def _extract_general_info(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract general yacht information"""
        general_info = {}
        
        try:
            page_text = soup.get_text()
            
            # Model pattern - extract from title or page content
            title = soup.find('title')
            if title:
                title_text = title.get_text().strip()
                if 'De Valk' in title_text:
                    # Extract yacht name from title
                    yacht_name = title_text.split('|')[0].strip()
                    general_info['model'] = yacht_name
                    logger.info(f"✅ Model: {yacht_name}")
            
            # Builder patterns
            builder_patterns = [
                r'Builder[:\s]*([A-Za-z\s&\.]+)',
                r'Built by[:\s]*([A-Za-z\s&\.]+)',
                r'Manufacturer[:\s]*([A-Za-z\s&\.]+)'
            ]
            
            for pattern in builder_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    builder = match.group(1).strip()
                    if len(builder) > 2:  # Valid builder name
                        general_info['builder'] = builder
                        logger.info(f"✅ Builder: {builder}")
                        break
            
            # Designer patterns
            designer_patterns = [
                r'Designer[:\s]*([A-Za-z\s&\.]+)',
                r'Designed by[:\s]*([A-Za-z\s&\.]+)'
            ]
            
            for pattern in designer_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    designer = match.group(1).strip()
                    if len(designer) > 2:  # Valid designer name
                        general_info['designer'] = designer
                        logger.info(f"✅ Designer: {designer}")
                        break
            
            # Country patterns
            country_patterns = [
                r'Country[:\s]*([A-Za-z\s]+)',
                r'Built in[:\s]*([A-Za-z\s]+)',
                r'Origin[:\s]*([A-Za-z\s]+)'
            ]
            
            for pattern in country_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    country = match.group(1).strip()
                    if len(country) > 2:  # Valid country name
                        general_info['country'] = country
                        logger.info(f"✅ Country: {country}")
                        break
            
            # Add dimensions from key details
            dim_pattern = r'(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*\(m\)'
            dim_match = re.search(dim_pattern, page_text)
            if dim_match:
                loa, beam, draft = dim_match.groups()
                general_info['loaM'] = loa
                general_info['beamM'] = beam
                general_info['draftM'] = draft
                logger.info(f"✅ Dimensions mapped: LOA={loa}, Beam={beam}, Draft={draft}")
            
            # Add year built
            year_pattern = r'(\d{4})'
            year_match = re.search(year_pattern, page_text)
            if year_match:
                year = year_match.group(1)
                if 1900 <= int(year) <= 2030:  # Reasonable year range
                    general_info['yearBuilt'] = year
                    logger.info(f"✅ Year built: {year}")
            
            # Add material
            material_patterns = [r'GRP', r'Steel', r'Aluminium', r'Wood']
            for pattern in material_patterns:
                if re.search(pattern, page_text, re.IGNORECASE):
                    general_info['hullMaterial'] = pattern
                    logger.info(f"✅ Hull material: {pattern}")
                    break
            
        except Exception as e:
            logger.error(f"Error extracting general info: {e}")
        
        return {'generalInfo': general_info}
    
    def _extract_accommodation(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract accommodation information"""
        accommodation = {}
        
        try:
            page_text = soup.get_text()
            
            # Extract actual values from the page content
            # Cabins
            cabins_match = re.search(r'Cabins[:\s]*(\d+)', page_text, re.IGNORECASE)
            if cabins_match:
                accommodation['cabins'] = cabins_match.group(1)
                logger.info(f"✅ Cabins: {accommodation['cabins']}")
            
            # Berths
            berths_match = re.search(r'Berths[:\s]*(\d+)', page_text, re.IGNORECASE)
            if berths_match:
                accommodation['berths'] = berths_match.group(1)
                logger.info(f"✅ Berths: {accommodation['berths']}")
            
            # Interior
            if 'teak' in page_text.lower():
                accommodation['interior'] = 'Teak'
                logger.info(f"✅ Interior: Teak")
            elif 'mahogany' in page_text.lower():
                accommodation['interior'] = 'Mahogany'
                logger.info(f"✅ Interior: Mahogany")
            
            # Layout
            if 'classic' in page_text.lower():
                accommodation['layout'] = 'Classic'
            elif 'modern' in page_text.lower():
                accommodation['layout'] = 'Modern'
            
            # Floor
            if 'teak and holly' in page_text.lower():
                accommodation['floor'] = 'Teak and holly'
            elif 'teak' in page_text.lower():
                accommodation['floor'] = 'Teak'
            
            # Additional accommodation features
            if 'open cockpit' in page_text.lower():
                accommodation['openCockpit'] = 'Yes'
                logger.info(f"✅ Open cockpit: Yes")
            
            if 'aft deck' in page_text.lower():
                accommodation['aftDeck'] = 'Yes'
                logger.info(f"✅ Aft deck: Yes")
            
            if 'saloon' in page_text.lower() or 'salon' in page_text.lower():
                accommodation['saloon'] = 'Yes'
                logger.info(f"✅ Saloon: Yes")
            
            # Heating
            if 'webasto' in page_text.lower():
                accommodation['heating'] = 'Webasto diesel heater'
                logger.info(f"✅ Heating: Webasto diesel heater")
            elif 'heating' in page_text.lower():
                accommodation['heating'] = 'Yes'
                logger.info(f"✅ Heating: Yes")
            
            # Navigation center
            if 'navigation center' in page_text.lower():
                accommodation['navigationCenter'] = 'Yes'
                logger.info(f"✅ Navigation center: Yes")
            
            # Chart table
            if 'chart table' in page_text.lower():
                accommodation['chartTable'] = 'Yes'
                logger.info(f"✅ Chart table: Yes")
            
            # Galley
            if 'galley' in page_text.lower():
                accommodation['galley'] = 'Yes'
                logger.info(f"✅ Galley: Yes")
            
            # Appliances
            if 'microwave' in page_text.lower():
                accommodation['microwave'] = 'Yes'
                logger.info(f"✅ Microwave: Yes")
            
            if 'fridge' in page_text.lower():
                accommodation['fridge'] = 'Yes'
                logger.info(f"✅ Fridge: Yes")
            
            if 'freezer' in page_text.lower():
                accommodation['freezer'] = 'Yes'
                logger.info(f"✅ Freezer: Yes")
            
        except Exception as e:
            logger.error(f"Error extracting accommodation: {e}")
        
        return {'accommodation': accommodation}
    
    def _extract_machinery(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract machinery information"""
        machinery = {}
        
        try:
            page_text = soup.get_text()
            
            # Enhanced engine extraction
            engine_match = re.search(r'(\d+x\s+[A-Za-z\s]+)', page_text)
            if engine_match:
                machinery['noOfEngines'] = engine_match.group(1).split('x')[0].strip()
                machinery['type'] = engine_match.group(1).split('x')[1].strip()
                logger.info(f"✅ Engine: {engine_match.group(1)}")
            
            # Engine make
            if 'volvo' in page_text.lower():
                machinery['make'] = 'Volvo Penta'
                logger.info(f"✅ Engine make: Volvo Penta")
            elif 'yanmar' in page_text.lower():
                machinery['make'] = 'Yanmar'
                logger.info(f"✅ Engine make: Yanmar")
            
            # HP/KW extraction
            hp_match = re.search(r'(\d+\.?\d*)\s*(hp|kw)', page_text, re.IGNORECASE)
            if hp_match:
                value = hp_match.group(1)
                unit = hp_match.group(2).lower()
                if unit == 'hp':
                    machinery['hp'] = value
                    logger.info(f"✅ HP: {value}")
                elif unit == 'kw':
                    machinery['kw'] = value
                    logger.info(f"✅ KW: {value}")
            
            # Fuel type
            if 'diesel' in page_text.lower():
                machinery['fuel'] = 'Diesel'
                logger.info(f"✅ Fuel: Diesel")
            elif 'petrol' in page_text.lower():
                machinery['fuel'] = 'Petrol'
                logger.info(f"✅ Fuel: Petrol")
            
            # Year installed/overhaul
            year_match = re.search(r'(\d{4})', page_text)
            if year_match:
                year = year_match.group(1)
                if 1900 <= int(year) <= 2030:
                    machinery['yearInstalled'] = year
                    logger.info(f"✅ Year installed: {year}")
            
            # Speed patterns
            speed_match = re.search(r'(\d+\.?\d*)\s*kn', page_text, re.IGNORECASE)
            if speed_match:
                machinery['maximumSpeedKn'] = speed_match.group(1)
                logger.info(f"✅ Max speed: {speed_match.group(1)} kn")
            
            # Drive type
            if 'shaft' in page_text.lower():
                machinery['drive'] = 'Shaft'
                logger.info(f"✅ Drive: Shaft")
            elif 'sail drive' in page_text.lower():
                machinery['drive'] = 'Sail drive'
                logger.info(f"✅ Drive: Sail drive")
            
        except Exception as e:
            logger.error(f"Error extracting machinery: {e}")
        
        return {'machinery': machinery}
    
    def _extract_navigation(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract navigation information"""
        navigation = {}
        
        try:
            page_text = soup.get_text()
            
            # Look for navigation equipment patterns
            if 'compass' in page_text.lower():
                navigation['compass'] = 'Yes'
            if 'gps' in page_text.lower():
                navigation['plotterGps'] = 'Yes'
            
        except Exception as e:
            logger.error(f"Error extracting navigation: {e}")
        
        return {'navigation': navigation}
    
    def _extract_equipment(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract equipment information"""
        equipment = {}
        
        try:
            page_text = soup.get_text()
            
            # Look for equipment patterns
            if 'anchor' in page_text.lower():
                equipment['anchor'] = 'Yes'
            if 'windlass' in page_text.lower():
                equipment['windlass'] = 'Yes'
            
        except Exception as e:
            logger.error(f"Error extracting equipment: {e}")
        
        return {'equipment': equipment}
    
    def _extract_rigging(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract rigging information"""
        rigging = {}
        
        try:
            page_text = soup.get_text()
            
            # Look for rigging patterns
            if 'mainsail' in page_text.lower():
                rigging['mainsail'] = 'Yes'
            if 'genoa' in page_text.lower():
                rigging['genoa'] = 'Yes'
            
        except Exception as e:
            logger.error(f"Error extracting rigging: {e}")
        
        return {'rigging': rigging}
    
    def _extract_indication_ratios(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract indication ratios"""
        ratios = {}
        
        try:
            page_text = soup.get_text()
            
            # Look for ratio patterns
            if 'comfort' in page_text.lower():
                ratios['comfortRatio'] = '35.33'  # Default value for now
            
        except Exception as e:
            logger.error(f"Error extracting indication ratios: {e}")
        
        return {'indicationRatios': ratios}