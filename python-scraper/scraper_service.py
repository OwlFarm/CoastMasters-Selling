import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from fake_useragent import UserAgent
import re
import time
import logging
from typing import Dict, Any, Optional, List
import json
from ai_extractor import AIYachtExtractor
from datetime import datetime

logger = logging.getLogger(__name__)

class YachtScraperService:
    """Comprehensive yacht listing scraper service"""
    
    def __init__(self):
        self.ua = UserAgent()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
    def get_chrome_driver(self):
        """Get Chrome driver with optimized options for scraping"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument(f'--user-agent={self.ua.random}')
        
        try:
            driver = webdriver.Chrome(
                service=webdriver.chrome.service.Service(ChromeDriverManager().install()),
                options=chrome_options
            )
            return driver
        except Exception as e:
            logger.error(f"Failed to initialize Chrome driver: {e}")
            return None
    
    def detect_listing_type(self, url: str) -> str:
        """Detect the type of yacht listing based on URL patterns"""
        url_lower = url.lower()
        
        if 'devalk' in url_lower or 'de-valk' in url_lower:
            return 'devalk'
        elif 'yachtworld' in url_lower:
            return 'yachtworld'
        elif 'boats' in url_lower or 'boats.com' in url_lower:
            return 'boats'
        elif 'yachtall' in url_lower:
            return 'yachtall'
        elif 'apolloduck' in url_lower:
            return 'apolloduck'
        else:
            return 'generic'
    
    def scrape_devalk(self, url):
        """Scrape yacht data from De Valk website using their exact field structure"""
        try:
            logger.info(f"🚀 Starting De Valk scraping with exact field mapping: {url}")
            
            # Use Selenium for dynamic content
            driver = self._get_selenium_driver()
            driver.get(url)
            time.sleep(3)  # Allow page to load
            
            # Get the page source after JavaScript execution
                page_source = driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')
            
            # Extract data using De Valk's exact field structure
            data = self._extract_devalk_data(soup, driver)
            
            # Add metadata
            data['source_url'] = url
            data['scraped_at'] = datetime.now().isoformat()
            data['source'] = 'devalk'
            
            # Calculate completeness based on De Valk fields
            data['data_completeness'] = self._calculate_devalk_completeness(data)
            
            logger.info(f"✅ De Valk scraping completed. Completeness: {data['data_completeness']}%")
            logger.info(f"📊 De Valk data structure: {list(data.keys())}")
            
            driver.quit()
            return data
            
        except Exception as e:
            logger.error(f"❌ Error in De Valk scraping: {e}")
            if 'driver' in locals():
                driver.quit()
            return None
    
    def scrape_yachtworld(self, url: str) -> Dict[str, Any]:
        """Scrape YachtWorld listings"""
        try:
            driver = self.get_chrome_driver()
            if not driver:
                return self._fallback_scraping(url)
            
            driver.get(url)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "boat-details"))
            )
            
            data = {}
            
            # Title
            try:
                title_elem = driver.find_element(By.CSS_SELECTOR, "h1.boat-title")
                data['title'] = title_elem.text.strip()
            except:
                pass
            
            # Extract images
            try:
                image_elements = driver.find_elements(By.CSS_SELECTOR, ".boat-gallery img, .photo-gallery img, .main-image img")
                images = []
                for img in image_elements[:10]:  # Limit to first 10 images
                    src = img.get_attribute('src')
                    if src and not src.endswith('placeholder'):
                        images.append(src)
                data['images'] = images
                data['heroImage'] = images[0] if images else None
            except:
                pass
            
            # Price
            try:
                price_elem = driver.find_element(By.CSS_SELECTOR, ".price")
                price_text = price_elem.text.strip()
                data['price'] = re.sub(r'[^\d]', '', price_text)
            except:
                pass
            
            # Specifications
            try:
                spec_elems = driver.find_elements(By.CSS_SELECTOR, ".specification")
                for spec in spec_elems:
                    label = spec.find_element(By.CSS_SELECTOR, ".label").text.strip().lower()
                    value = spec.find_element(By.CSS_SELECTOR, ".value").text.strip()
                    
                    if 'length' in label:
                        data['length'] = value
                    elif 'year' in label:
                        data['year'] = value
                    elif 'make' in label:
                        data['brand'] = value
                    elif 'model' in label:
                        data['model'] = value
            except:
                pass
            
            driver.quit()
            return data
            
        except Exception as e:
            logger.error(f"Error scraping YachtWorld: {e}")
            if driver:
                driver.quit()
            return self._fallback_scraping(url)
    
    def _fallback_scraping(self, url: str) -> Dict[str, Any]:
        """Fallback to basic requests + BeautifulSoup scraping"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            data = {}
            
            # Try to extract basic information from meta tags first
            title = soup.find('title')
            if title:
                data['title'] = title.text.strip()
            
            # Extract rich data from meta description (most reliable source)
            meta_desc = soup.find('meta', {'name': 'description'})
            if meta_desc and meta_desc.get('content'):
                desc_content = meta_desc.get('content')
                logger.info(f"Found meta description: {desc_content}")
                
                # Extract brand from "Built by: Hallberg Rassy" and map to your schema
                brand_match = re.search(r'Built by:\s*([^|]+)', desc_content)
                if brand_match:
                    brand = brand_match.group(1).strip()
                    # Clean up the brand name
                    if brand and brand.lower() not in ['brokers', 'yacht', 'sailing']:
                        # Map to your schema fields
                        data['make'] = brand  # Primary brand field
                        data['brand'] = brand  # Keep for backward compatibility
                        
                        # Extract model from title if available
                        if data.get('title'):
                            title_parts = data['title'].split()
                            if brand in title_parts:
                                # Look for model number after brand
                                brand_index = title_parts.index(brand)
                                if brand_index + 1 < len(title_parts):
                                    potential_model = title_parts[brand_index + 1]
                                    if potential_model.isdigit():
                                        data['model'] = potential_model
                                        logger.info(f"Extracted model: {data['model']}")
                        
                        # Also try to extract model from meta description
                        model_match = re.search(r'Model[:\s]*([^|]+)', desc_content)
                        if model_match:
                            model = model_match.group(1).strip()
                            if model and model != brand:  # Don't overwrite with brand name
                                data['model'] = model
                                logger.info(f"Extracted model from meta: {data['model']}")
                        
                        logger.info(f"Extracted brand: {brand}")
                
                # Extract year from "Built: 1990"
                year_match = re.search(r'Built:\s*(\d{4})', desc_content)
                if year_match:
                    data['year'] = year_match.group(1)
                    logger.info(f"Extracted year: {data['year']}")
                
                # Extract dimensions from "14.96x4.42x2.20m" and map to your schema
                dim_match = re.search(r'Dimensions:\s*(\d+\.?\d*)x(\d+\.?\d*)x(\d+\.?\d*)m', desc_content)
                if dim_match:
                    # Map to your schema fields
                    data['loaM'] = float(dim_match.group(1))  # Overall Length
                    data['beamM'] = float(dim_match.group(2))  # Beam
                    data['draftM'] = float(dim_match.group(3))  # Draft
                    
                    # Keep legacy fields for backward compatibility
                    data['length'] = dim_match.group(1)
                    data['beam'] = dim_match.group(2)
                    data['draft'] = dim_match.group(3)
                    
                    logger.info(f"Extracted dimensions: {data['loaM']}m x {data['beamM']}m x {data['draftM']}m")
                    
                    # Calculate additional dimensions if possible
                    if data['loaM'] and data['beamM']:
                        # Estimate LWL (waterline length) as ~85% of LOA
                        data['lwlM'] = round(data['loaM'] * 0.85, 2)
                        logger.info(f"Estimated LWL: {data['lwlM']}m")
                
                # Extract material from "Material: GRP"
                material_match = re.search(r'Material:\s*([^|]+)', desc_content)
                if material_match:
                    material = material_match.group(1).strip()
                    # Convert GRP to fiberglass
                    if material.upper() == 'GRP':
                        data['hullMaterial'] = 'Fiberglass'
                    else:
                        data['hullMaterial'] = material
                
                # Enhanced engine extraction for your machinery schema
                engine_patterns = [
                    r'(\d+)x\s+([^|]+?)\s+(diesel|engine|motor)',
                    r'(\d+)x\s+([^|]+?)\s+(Volvo|Penta)',
                    r'(\d+)x\s+([^|]+?)\s+(TMD\d+[A-Z])'
                ]
                
                engine_found = False
                for pattern in engine_patterns:
                    engine_match = re.search(pattern, desc_content)
                    if engine_match:
                        engine_count = engine_match.group(1)
                        engine_details = engine_match.group(2).strip()
                        engine_type = engine_match.group(3)
                        
                        # Map to your machinery schema
                        data['machinery'] = {
                            'numberOfEngines': int(engine_count),
                            'make': engine_details,
                            'fuel': engine_type
                        }
                        
                        # Extract specific engine model if available (e.g., "Volvo Penta TMD41A")
                        engine_model_match = re.search(r'(\w+)\s+(\w+)\s+(\w+)', engine_details)
                        if engine_model_match:
                            data['machinery']['make'] = f"{engine_model_match.group(1)} {engine_model_match.group(2)}"
                            data['machinery']['type'] = engine_model_match.group(3)
                        
                        # Keep legacy field for backward compatibility
                        data['engineMake'] = f"{engine_count}x {engine_details} {engine_type}"
                        
                        logger.info(f"Extracted machinery: {data['machinery']}")
                        engine_found = True
                        break
                
                if not engine_found:
                    # Fallback: look for any engine-like text
                    engine_fallback = re.search(r'(\d+x\s+[^|]+?(?:diesel|engine|motor|Volvo|Penta))', desc_content)
                    if engine_fallback:
                        engine = engine_fallback.group(1).strip()
                        if engine and len(engine) > 5:
                            data['engineMake'] = engine
                            logger.info(f"Extracted engine (fallback): {engine}")
                
                # Extract additional specifications for your schema
                # Look for displacement/ballast
                displacement_match = re.search(r'Displacement[:\s]*(\d+(?:\.\d+)?)\s*(?:t|tonnes?)', desc_content, re.IGNORECASE)
                if displacement_match:
                    data['displacementT'] = float(displacement_match.group(1))
                    logger.info(f"Extracted displacement: {data['displacementT']} tonnes")
                
                # Look for designer
                designer_match = re.search(r'Designer[:\s]*([^|]+)', desc_content)
                if designer_match:
                    data['designer'] = designer_match.group(1).strip()
                    logger.info(f"Extracted designer: {data['designer']}")
                
                # Look for country
                country_match = re.search(r'Country[:\s]*([^|]+)', desc_content)
                if country_match:
                    data['country'] = country_match.group(1).strip()
                    logger.info(f"Extracted country: {data['country']}")
                
                # Look for boat type with more patterns
                boat_type_patterns = [
                    r'(sailing yacht|sailboat|motor yacht|catamaran|trimaran)',
                    r'(cruiser|racer|cruiser-racer|motorsailer)',
                    r'(monohull|multihull|power boat|trawler)'
                ]
                
                for pattern in boat_type_patterns:
                    boat_type_match = re.search(pattern, desc_content, re.IGNORECASE)
                    if boat_type_match:
                        data['boatType'] = boat_type_match.group(1).title()
                        logger.info(f"Extracted boat type: {data['boatType']}")
                        break
                
                # Extract additional metadata from description
                # Look for construction year vs design year
                design_year_match = re.search(r'Design[ed]?[:\s]*(\d{4})', desc_content)
                if design_year_match:
                    data['designYear'] = design_year_match.group(1)
                    logger.info(f"Extracted design year: {data['designYear']}")
                
                # Look for refit/renovation information
                refit_match = re.search(r'(?:Refit|Renovated|Refurbished)[:\s]*(\d{4})', desc_content, re.IGNORECASE)
                if refit_match:
                    data['lastRefit'] = refit_match.group(1)
                    logger.info(f"Extracted last refit: {data['lastRefit']}")
                
                # Look for classification/certification
                class_match = re.search(r'(CE|MCA|LR|ABS|GL|DNV)[:\s]*([A-Z0-9\-]+)', desc_content)
                if class_match:
                    data['classification'] = f"{class_match.group(1)} {class_match.group(2)}"
                    logger.info(f"Extracted classification: {data['classification']}")
                
                # Look for location/marina information
                location_patterns = [
                    r'Location[:\s]*([^|]+)',
                    r'Marina[:\s]*([^|]+)',
                    r'Port[:\s]*([^|]+)',
                    r'Berth[:\s]*([^|]+)'
                ]
                
                for pattern in location_patterns:
                    location_match = re.search(pattern, desc_content)
                    if location_match:
                        data['location'] = location_match.group(1).strip()
                        logger.info(f"Extracted location: {data['location']}")
                        break
                
                # Extract additional specifications from page content
                # Look for displacement/ballast in page text
                if not data.get('displacementT'):
                    displacement_patterns = [
                        r'Displacement[:\s]*(\d+(?:\.\d+)?)\s*(?:t|tonnes?)',
                        r'Weight[:\s]*(\d+(?:\.\d+)?)\s*(?:t|tonnes?)',
                        r'(\d+(?:\.\d+)?)\s*(?:t|tonnes?)\s*displacement'
                    ]
                    
                    for pattern in displacement_patterns:
                        match = re.search(pattern, response.text, re.IGNORECASE)
                        if match:
                            data['displacementT'] = float(match.group(1))
                            logger.info(f"Extracted displacement from content: {data['displacementT']} tonnes")
                            break
                
                # Look for ballast information
                ballast_patterns = [
                    r'Ballast[:\s]*(\d+(?:\.\d+)?)\s*(?:t|tonnes?)',
                    r'Keel[:\s]*(\d+(?:\.\d+)?)\s*(?:t|tonnes?)',
                    r'(\d+(?:\.\d+)?)\s*(?:t|tonnes?)\s*ballast'
                ]
                
                for pattern in ballast_patterns:
                    match = re.search(pattern, response.text, re.IGNORECASE)
                    if match:
                        data['ballastTonnes'] = float(match.group(1))
                        logger.info(f"Extracted ballast: {data['ballastTonnes']} tonnes")
                        break
                
                # Look for yacht description in page content
                if not data.get('description'):
                    # Try to find description in HTML content
                    desc_selectors = [
                        '.description', '.yacht-description', '.boat-description',
                        '.listing-description', '.details', '.specifications'
                    ]
                    
                    for selector in desc_selectors:
                        desc_elem = soup.select_one(selector)
                        if desc_elem and desc_elem.get_text(strip=True):
                            desc_text = desc_elem.get_text(strip=True)
                            if len(desc_text) > 50:  # Only if substantial content
                                data['description'] = desc_text[:500]  # Limit length
                                logger.info(f"Extracted description: {len(desc_text)} characters")
                                break
                
                # Extract model from title if not already found
                if not data.get('model') and data.get('title'):
                    title_parts = data['title'].split()
                    if len(title_parts) >= 3:
                        # Look for model number (usually the last part)
                        potential_model = title_parts[-1]
                        if potential_model.isdigit():
                            data['model'] = potential_model
                            logger.info(f"Extracted model from title: {data['model']}")
                
                # Set default country if not found
                if not data.get('country'):
                    data['country'] = 'Netherlands'  # De Valk is Dutch
                    logger.info(f"Set default country: {data['country']}")
                
                # Set default location if not found
                if not data.get('location'):
                    data['location'] = 'De Valk Yacht Brokers'
                    logger.info(f"Set default location: {data['location']}")
            
            # Try to extract price from multiple sources
            price_found = False
            
            # 1. Try Open Graph description
            og_desc = soup.find('meta', {'property': 'og:description'})
            if og_desc and og_desc.get('content'):
                og_content = og_desc.get('content')
                price_match = re.search(r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:€|EUR|USD|GBP)', og_content)
                if price_match:
                    data['price'] = price_match.group(1).replace(',', '')
                    if '€' in og_content:
                        data['currency'] = 'EUR'
                    elif '$' in og_content:
                        data['currency'] = 'USD'
                    elif '£' in og_content:
                        data['currency'] = 'GBP'
                    price_found = True
                    logger.info(f"Extracted price from OG: {data['price']} {data.get('currency', '')}")
            
            # 2. Try main meta description
            if not price_found and meta_desc and meta_desc.get('content'):
                desc_content = meta_desc.get('content')
                price_match = re.search(r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:€|EUR|USD|GBP)', desc_content)
                if price_match:
                    data['price'] = price_match.group(1).replace(',', '')
                    if '€' in desc_content:
                        data['currency'] = 'EUR'
                    elif '$' in desc_content:
                        data['currency'] = 'USD'
                    elif '£' in desc_content:
                        data['currency'] = 'GBP'
                    price_found = True
                    logger.info(f"Extracted price from meta: {data['price']} {data.get('currency', '')}")
            
            # 3. Try page content for price patterns
            if not price_found:
                price_patterns = [
                    r'Price[:\s]*([\d,]+(?:\.\d{2})?)',
                    r'Asking Price[:\s]*([\d,]+(?:\.\d{2})?)',
                    r'Sale Price[:\s]*([\d,]+(?:\.\d{2})?)',
                    r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:€|EUR|USD|GBP)'
                ]
                
                for pattern in price_patterns:
                    matches = re.findall(pattern, response.text)
                    if matches:
                        data['price'] = matches[0].replace(',', '')
                        # Try to determine currency from context
                        if '€' in response.text or 'EUR' in response.text:
                            data['currency'] = 'EUR'
                        elif '$' in response.text or 'USD' in response.text:
                            data['currency'] = 'GBP'
                        elif '£' in response.text or 'GBP' in response.text:
                            data['currency'] = 'GBP'
                        price_found = True
                        logger.info(f"Extracted price from content: {data['price']} {data.get('currency', '')}")
                        break
            
            # 4. Set default price/currency if nothing found (for demo purposes)
            if not price_found:
                # Don't set a default price - let it be undefined if not found
                logger.info("No price found - leaving price field undefined")
            
            # Year already extracted from meta tags above - skip regex patterns
            # to avoid overwriting good data with false positives
            
            # Dimensions already extracted from meta tags above - skip regex patterns
            # to avoid overwriting good data with false positives
            
            # Brand already extracted from meta tags above - skip regex patterns
            # to avoid overwriting good data with false positives
            
            # Price already extracted from meta tags above - skip regex patterns
            # to avoid overwriting good data with false positives
            
            # Extract images from HTML
            try:
                image_elements = soup.find_all('img')
                images = []
                for img in image_elements[:10]:  # Limit to first 10 images
                    src = img.get('src')
                    if src and not src.endswith('placeholder') and not src.startswith('data:'):
                        # Convert relative URLs to absolute
                        if src.startswith('/'):
                            src = f"{url.rstrip('/')}{src}"
                        elif not src.startswith('http'):
                            src = f"{url.rstrip('/')}/{src.lstrip('/')}"
                        images.append(src)
                data['images'] = images
                data['heroImage'] = images[0] if images else None
            except:
                pass
            
            # Try to extract additional yacht-specific data from meta tags and page content
            try:
                # Look for cabins/berths in meta description
                if meta_desc and meta_desc.get('content'):
                    desc_content = meta_desc.get('content')
                    
                    # Look for cabin information
                    cabin_match = re.search(r'(\d+)\s*cabin', desc_content, re.IGNORECASE)
                    if cabin_match:
                        data['accommodation'] = {
                            'numberOfCabins': int(cabin_match.group(1))
                        }
                        logger.info(f"Extracted cabins: {data['accommodation']['numberOfCabins']}")
                    
                    # Look for berth information
                    berth_match = re.search(r'(\d+)\s*berth', desc_content, re.IGNORECASE)
                    if berth_match:
                        if not data.get('accommodation'):
                            data['accommodation'] = {}
                        data['accommodation']['numberOfBerths'] = int(berth_match.group(1))
                        logger.info(f"Extracted berths: {data['accommodation']['numberOfBerths']}")
                    
                    # Look for additional specifications
                    spec_match = re.search(r'(\d+\.?\d*)\s*(?:HP|hp|horsepower)', desc_content)
                    if spec_match:
                        if not data.get('machinery'):
                            data['machinery'] = {}
                        data['machinery']['hp'] = int(spec_match.group(1))
                        logger.info(f"Extracted engine HP: {data['machinery']['hp']}")
                
                # Scrape additional data from page content (HTML structure)
                # Look for tables with specifications
                spec_tables = soup.find_all('table')
                for table in spec_tables:
                    rows = table.find_all('tr')
                    for row in rows:
                        cells = row.find_all(['td', 'th'])
                        if len(cells) >= 2:
                            label = cells[0].get_text(strip=True).lower()
                            value = cells[1].get_text(strip=True)
                            
                            # Map common table fields to your schema
                            if 'cabin' in label and value.isdigit():
                                if not data.get('accommodation'):
                                    data['accommodation'] = {}
                                data['accommodation']['numberOfCabins'] = int(value)
                                logger.info(f"Extracted cabins from table: {value}")
                            
                            elif 'berth' in label and value.isdigit():
                                if not data.get('accommodation'):
                                    data['accommodation'] = {}
                                data['accommodation']['numberOfBerths'] = int(value)
                                logger.info(f"Extracted berths from table: {value}")
                            
                            elif 'hp' in label and value.isdigit():
                                if not data.get('machinery'):
                                    data['machinery'] = {}
                                data['machinery']['hp'] = int(value)
                                logger.info(f"Extracted HP from table: {value}")
                            
                            elif 'speed' in label and 'knot' in value.lower():
                                speed_match = re.search(r'(\d+(?:\.\d+)?)', value)
                                if speed_match:
                                    if not data.get('machinery'):
                                        data['machinery'] = {}
                                    if 'max' in label:
                                        data['machinery']['maxSpeedKnots'] = float(speed_match.group(1))
                                        logger.info(f"Extracted max speed: {data['machinery']['maxSpeedKnots']} knots")
                                    elif 'cruising' in label:
                                        data['machinery']['cruisingSpeedKnots'] = float(speed_match.group(1))
                                        logger.info(f"Extracted cruising speed: {data['machinery']['cruisingSpeedKnots']} knots")
                
                # Comprehensive equipment detection for your marketplace schema
                equipment_categories = {
                    # Deck Equipment & Safety
                    'deck_safety': [
                        'anchor', 'windlass', 'davits', 'bathing platform', 'swimming ladder',
                        'life raft', 'life jackets', 'epirb', 'fire extinguisher', 'bilge pump',
                        'fenders', 'dock lines', 'boat hook', 'emergency steering', 'horn'
                    ],
                    
                    # Tender & Water Sports
                    'tender': [
                        'dinghy', 'tender', 'outboard', 'inflatable', 'rigid hull',
                        'water toys', 'jet ski', 'diving equipment', 'snorkel gear'
                    ],
                    
                    # Comfort & Lifestyle
                    'comfort': [
                        'bimini', 'sprayhood', 'cockpit cushions', 'sun awning', 'cockpit table',
                        'deck shower', 'barbecue', 'grill', 'ice maker', 'wine cooler'
                    ],
                    
                    # Galley Equipment
                    'galley': [
                        'refrigerator', 'freezer', 'microwave', 'stove', 'oven', 'sink',
                        'dishwasher', 'garbage disposal', 'water maker', 'coffee machine'
                    ],
                    
                    # Systems & Utilities
                    'systems': [
                        'air conditioning', 'heating', 'generator', 'inverter', 'battery charger',
                        'shore power', 'solar panels', 'wind generator', 'water pump', 'fuel pump',
                        'waste pump', 'holding tank', 'water tank', 'fuel tank'
                    ],
                    
                    # Accommodation
                    'accommodation': [
                        'toilet', 'shower', 'hot water', 'fresh water', 'pressure water',
                        'electric toilet', 'manual toilet', 'separate shower', 'bathtub'
                    ]
                }
                
                # Rigging & Sailing Equipment (for sailing yachts)
                rigging_keywords = [
                    'mast', 'boom', 'main sail', 'mainsail', 'genoa', 'jib', 'spinnaker',
                    'furling', 'roller furling', 'winch', 'electric winch', 'winches',
                    'block', 'halyard', 'sheet', 'lazy jacks', 'sail cover', 'boom vang'
                ]
                
                # Navigation & Electronics
                navigation_keywords = [
                    'gps', 'chartplotter', 'radar', 'autopilot', 'compass', 'depth sounder',
                    'speed log', 'wind instrument', 'ais', 'vhf radio', 'stereo', 'tv',
                    'satellite tv', 'internet', 'wifi', 'navigation lights'
                ]
                
                # Detect equipment by category
                equipment_found = 0
                page_text = response.text.lower()
                
                for category, keywords in equipment_categories.items():
                    for keyword in keywords:
                        if keyword in page_text:
                            if not data.get('equipment'):
                                data['equipment'] = {}
                            data['equipment'][keyword.replace(' ', '').replace('-', '')] = 'Yes'
                            equipment_found += 1
                            logger.info(f"Found {category} equipment: {keyword}")
                
                # Detect rigging equipment (indicates sailing yacht)
                rigging_found = 0
                for keyword in rigging_keywords:
                    if keyword in page_text:
                        if not data.get('rigging'):
                            data['rigging'] = {}
                        data['rigging'][keyword.replace(' ', '').replace('-', '')] = 'Yes'
                        rigging_found += 1
                        if rigging_found == 1:  # Log once
                            logger.info(f"Found sailing rigging: {keyword}")
                
                # Detect navigation equipment
                nav_found = 0
                for keyword in navigation_keywords:
                    if keyword in page_text:
                        if not data.get('navigation'):
                            data['navigation'] = {}
                        data['navigation'][keyword.replace(' ', '').replace('-', '')] = 'Yes'
                        nav_found += 1
                        if nav_found == 1:  # Log once
                            logger.info(f"Found navigation equipment: {keyword}")
                
                logger.info(f"Equipment detection summary: {equipment_found} equipment items, {rigging_found} rigging items, {nav_found} navigation items")
                        
            except Exception as e:
                logger.warning(f"Error extracting additional data: {e}")
                pass
            
            # ENHANCED: COMPREHENSIVE SECTION SCANNING FOR ALL SECTIONS
            try:
                logger.info("🔍 Starting comprehensive section scanning in fallback method")
                
                # Scan for all sections using full page text
                enhanced_data = self._scan_all_yacht_sections(response.text, data)
                
                # Update data with enhanced sections
                for section, section_data in enhanced_data.items():
                    if section_data and section not in data:
                        data[section] = section_data
                        logger.info(f"✅ Enhanced section added: {section} with {len(section_data)} fields")
                    elif section_data and section in data:
                        # Merge existing data with enhanced data
                        if isinstance(data[section], dict) and isinstance(section_data, dict):
                            data[section].update(section_data)
                            logger.info(f"✅ Enhanced section merged: {section} now has {len(data[section])} fields")
                
                logger.info(f"🎯 Comprehensive section scanning complete in fallback: {len(data)} total sections")
                
            except Exception as e:
                logger.error(f"Error in comprehensive section scanning (fallback): {e}")
                # Continue with existing data if scanning fails
            
            return data
            
        except Exception as e:
            logger.error(f"Fallback scraping failed: {e}")
            return {}
    
    def _extract_accommodation_section(self, driver, soup) -> Dict[str, Any]:
        """Extract comprehensive accommodation data from yacht listings"""
        accommodation_data = {}
        
        try:
            logger.info("🔍 Starting comprehensive accommodation extraction")
            
            # Method 1: Look for accommodation accordion/section
            accommodation_selectors = [
                "div[data-section='accommodation']",
                ".accommodation-section",
                ".accommodation-details",
                "[id*='accommodation']",
                "[class*='accommodation']"
            ]
            
            accommodation_section = None
            for selector in accommodation_selectors:
                try:
                    accommodation_section = driver.find_element(By.CSS_SELECTOR, selector)
                    if accommodation_section:
                        logger.info(f"✅ Found accommodation section with selector: {selector}")
                        break
                except:
                    continue
            
            if accommodation_section:
                # Extract from accommodation section
                accommodation_data.update(self._extract_from_accommodation_section(accommodation_section))
            
            # Method 2: Look for accommodation data in tables
            accommodation_data.update(self._extract_accommodation_from_tables(soup))
            
            # Method 3: Look for accommodation data in text content
            accommodation_data.update(self._extract_accommodation_from_text(soup))
            
            # Method 4: Look for accommodation data in meta tags
            accommodation_data.update(self._extract_accommodation_from_meta(soup))
            
            logger.info(f"🏠 Accommodation extraction complete: {len(accommodation_data)} fields found")
            return accommodation_data
            
        except Exception as e:
            logger.error(f"Error in accommodation extraction: {e}")
            return accommodation_data
    
    def _extract_from_accommodation_section(self, section_element) -> Dict[str, Any]:
        """Extract accommodation data from a dedicated accommodation section"""
        data = {}
        
        try:
            # Look for common accommodation fields
            field_patterns = {
                'numberOfCabins': [
                    r'(\d+)\s*cabin',
                    r'(\d+)\s*stateroom',
                    r'(\d+)\s*bedroom'
                ],
                'numberOfBerths': [
                    r'(\d+)\s*berth',
                    r'(\d+)\s*sleep',
                    r'(\d+)\s*person'
                ],
                'numberOfHeads': [
                    r'(\d+)\s*head',
                    r'(\d+)\s*bathroom',
                    r'(\d+)\s*toilet'
                ],
                'numberOfShowers': [
                    r'(\d+)\s*shower',
                    r'(\d+)\s*bath'
                ]
            }
            
            section_text = section_element.text.lower()
            
            for field, patterns in field_patterns.items():
                for pattern in patterns:
                    match = re.search(pattern, section_text, re.IGNORECASE)
                    if match:
                        data[field] = int(match.group(1))
                        logger.info(f"✅ Extracted {field}: {data[field]}")
                        break
            
            # Look for specific accommodation features
            features = [
                'masterCabin', 'vipCabin', 'crewCabin', 'galley', 'salon', 'cockpit',
                'swimmingPlatform', 'bathingPlatform', 'tenderGarage', 'flybridge'
            ]
            
            for feature in features:
                feature_text = feature.replace('Cabin', ' cabin').replace('Platform', ' platform')
                if feature_text.lower() in section_text:
                    data[feature] = True
                    logger.info(f"✅ Found accommodation feature: {feature}")
            
        except Exception as e:
            logger.error(f"Error extracting from accommodation section: {e}")
        
        return data
    
    def _extract_accommodation_from_tables(self, soup) -> Dict[str, Any]:
        """Extract accommodation data from specification tables"""
        data = {}
        
        try:
            tables = soup.find_all('table')
            for table in tables:
                rows = table.find_all('tr')
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) >= 2:
                        label = cells[0].get_text(strip=True).lower()
                        value = cells[1].get_text(strip=True)
                        
                        # Map accommodation fields
                        if 'cabin' in label and value.isdigit():
                            data['numberOfCabins'] = int(value)
                        elif 'berth' in label and value.isdigit():
                            data['numberOfBerths'] = int(value)
                        elif 'head' in label and value.isdigit():
                            data['numberOfHeads'] = int(value)
                        elif 'shower' in label and value.isdigit():
                            data['numberOfShowers'] = int(value)
                        elif 'crew' in label and value.isdigit():
                            data['crewCapacity'] = int(value)
                        
        except Exception as e:
            logger.error(f"Error extracting accommodation from tables: {e}")
        
        return data
    
    def _extract_accommodation_from_text(self, soup) -> Dict[str, Any]:
        """Extract accommodation data from page text content"""
        data = {}
        
        try:
            # Look in meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc and meta_desc.get('content'):
                desc_content = meta_desc.get('content').lower()
                
                # Extract accommodation numbers
                cabin_match = re.search(r'(\d+)\s*cabin', desc_content, re.IGNORECASE)
                if cabin_match:
                    data['numberOfCabins'] = int(cabin_match.group(1))
                
                berth_match = re.search(r'(\d+)\s*berth', desc_content, re.IGNORECASE)
                if berth_match:
                    data['numberOfBerths'] = int(berth_match.group(1))
                
                head_match = re.search(r'(\d+)\s*head', desc_content, re.IGNORECASE)
                if head_match:
                    data['numberOfHeads'] = int(head_match.group(1))
            
            # Look in page content
            page_text = soup.get_text().lower()
            
            # Additional accommodation patterns
            patterns = {
                'numberOfCabins': r'(\d+)\s*cabin',
                'numberOfBerths': r'(\d+)\s*berth',
                'numberOfHeads': r'(\d+)\s*head',
                'crewCapacity': r'(\d+)\s*crew'
            }
            
            for field, pattern in patterns.items():
                if field not in data:  # Don't overwrite existing data
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        data[field] = int(match.group(1))
                        
        except Exception as e:
            logger.error(f"Error extracting accommodation from text: {e}")
        
        return data
    
    def _extract_accommodation_from_meta(self, soup) -> Dict[str, Any]:
        """Extract accommodation data from meta tags and structured data"""
        data = {}
        
        try:
            # Look for structured data (JSON-LD)
            scripts = soup.find_all('script', type='application/ld+json')
            for script in scripts:
                try:
                    json_data = json.loads(script.string)
                    if isinstance(json_data, dict):
                        # Extract accommodation from structured data
                        if 'accommodation' in json_data:
                            acc_data = json_data['accommodation']
                            if isinstance(acc_data, dict):
                                for key, value in acc_data.items():
                                    if isinstance(value, (int, float)):
                                        data[key] = value
                except:
                    continue
            
            # Look for Open Graph tags
            og_tags = soup.find_all('meta', property=lambda x: x and 'accommodation' in x.lower())
            for tag in og_tags:
                content = tag.get('content', '')
                if content.isdigit():
                    data['accommodationValue'] = int(content)
                    
        except Exception as e:
            logger.error(f"Error extracting accommodation from meta: {e}")
        
        return data
    
    def _ai_text_scan_extraction(self, page_source: str, url: str) -> Dict[str, Any]:
        """AI-powered text scanning extraction - works regardless of HTML structure"""
        try:
            logger.info("🤖 Starting AI text scanning extraction")
            
            # Extract all visible text from the page
            soup = BeautifulSoup(page_source, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            
            # Get clean text content
            full_text = soup.get_text()
            
            # Clean up whitespace and formatting
            lines = (line.strip() for line in full_text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            clean_text = ' '.join(chunk for chunk in chunks if chunk)
            
            logger.info(f"📄 Extracted {len(clean_text)} characters of clean text")
            
            # Use AI to extract yacht data from the full text
            ai_extractor = AIYachtExtractor()
            yacht_data = ai_extractor.extract_yacht_data(clean_text, url)
            
            if yacht_data:
                logger.info(f"✅ AI text scanning successful: {len(yacht_data)} fields extracted")
                
                # Post-process AI results for better accuracy
                processed_data = self._post_process_ai_results(yacht_data, clean_text)
                
                # ENHANCED: Scan for all yacht sections in the full text
                enhanced_data = self._scan_all_yacht_sections(clean_text, processed_data)
                
                return enhanced_data
            else:
                logger.warning("⚠️ AI text scanning returned no data")
                return {}
                
        except Exception as e:
            logger.error(f"Error in AI text scanning extraction: {e}")
            return {}
    
    def _scan_all_yacht_sections(self, page_text: str, base_data: Dict[str, Any]) -> Dict[str, Any]:
        """Scan full page text for all yacht sections and data"""
        enhanced_data = base_data.copy()
        
        try:
            logger.info("🔍 Scanning full page text for all yacht sections")
            
            # 1. ACCOMMODATION SECTION SCANNING
            accommodation_data = self._scan_accommodation_section(page_text)
            if accommodation_data:
                enhanced_data['accommodation'] = accommodation_data
                logger.info(f"🏠 Accommodation section found: {len(accommodation_data)} fields")
            
            # 2. EQUIPMENT SECTION SCANNING
            equipment_data = self._scan_equipment_section(page_text)
            if equipment_data:
                enhanced_data['equipment'] = equipment_data
                logger.info(f"🛠️ Equipment section found: {len(equipment_data)} items")
            
            # 3. NAVIGATION SECTION SCANNING
            navigation_data = self._scan_navigation_section(page_text)
            if navigation_data:
                enhanced_data['navigation'] = navigation_data
                logger.info(f"🧭 Navigation section found: {len(navigation_data)} items")
            
            # 4. RIGGING SECTION SCANNING
            rigging_data = self._scan_rigging_section(page_text)
            if rigging_data:
                enhanced_data['rigging'] = rigging_data
                logger.info(f"⛵ Rigging section found: {len(rigging_data)} items")
            
            # 5. MACHINERY SECTION SCANNING (Enhanced)
            machinery_data = self._scan_machinery_section(page_text)
            if machinery_data:
                if 'machinery' not in enhanced_data:
                    enhanced_data['machinery'] = {}
                enhanced_data['machinery'].update(machinery_data)
                logger.info(f"🔧 Machinery section found: {len(machinery_data)} fields")
            
            # 6. GENERAL SPECIFICATIONS SCANNING
            specs_data = self._scan_general_specifications(page_text)
            if specs_data:
                enhanced_data.update(specs_data)
                logger.info(f"📋 General specifications found: {len(specs_data)} fields")
            
            logger.info(f"✅ Section scanning complete: {len(enhanced_data)} total fields")
            return enhanced_data
            
        except Exception as e:
            logger.error(f"Error in section scanning: {e}")
            return base_data
    
    def _scan_accommodation_section(self, page_text: str) -> Dict[str, Any]:
        """Scan for accommodation data in full page text"""
        accommodation_data = {}
        
        try:
            # Look for accommodation-related text patterns
            accommodation_patterns = {
                'numberOfCabins': [
                    r'(\d+)\s*cabin',
                    r'(\d+)\s*stateroom',
                    r'(\d+)\s*bedroom',
                    r'cabins.*?(\d+)',
                    r'staterooms.*?(\d+)'
                ],
                'numberOfBerths': [
                    r'(\d+)\s*berth',
                    r'(\d+)\s*sleep',
                    r'(\d+)\s*person',
                    r'berths.*?(\d+)',
                    r'sleeping.*?(\d+)'
                ],
                'numberOfHeads': [
                    r'(\d+)\s*head',
                    r'(\d+)\s*bathroom',
                    r'(\d+)\s*toilet',
                    r'heads.*?(\d+)',
                    r'bathrooms.*?(\d+)'
                ],
                'numberOfShowers': [
                    r'(\d+)\s*shower',
                    r'showers.*?(\d+)'
                ]
            }
            
            for field, patterns in accommodation_patterns.items():
                for pattern in patterns:
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        accommodation_data[field] = int(match.group(1))
                        logger.info(f"✅ Accommodation: {field} = {accommodation_data[field]}")
                        break
            
            # Look for specific accommodation features
            accommodation_features = [
                'masterCabin', 'vipCabin', 'crewCabin', 'galley', 'salon', 'cockpit',
                'swimmingPlatform', 'bathingPlatform', 'tenderGarage', 'flybridge'
            ]
            
            for feature in accommodation_features:
                feature_text = feature.replace('Cabin', ' cabin').replace('Platform', ' platform')
                if feature_text.lower() in page_text.lower():
                    accommodation_data[feature] = True
                    logger.info(f"✅ Accommodation feature: {feature}")
            
        except Exception as e:
            logger.error(f"Error scanning accommodation section: {e}")
        
        return accommodation_data
    
    def _scan_equipment_section(self, page_text):
        """Extract detailed equipment information from full page text"""
        equipment_data = {}
        
        # Enhanced anchor extraction
        anchor_patterns = [
            r'anchor[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+\s*[A-Za-z]+\s+anchor[^,\n]*)',
            r'([A-Za-z]+\s+\d+\s*kg\s*anchor[^,\n]*)',
            r'(plow\s+anchor[^,\n]*)',
            r'(danforth\s+anchor[^,\n]*)',
            r'(bruce\s+anchor[^,\n]*)'
        ]
        
        for pattern in anchor_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                equipment_data['anchor'] = match.group(1).strip()
                break
        
        # Enhanced life raft extraction
        life_raft_patterns = [
            r'life\s+raft[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+\s*person\s+life\s+raft[^,\n]*)',
            r'([A-Za-z]+\s+life\s+raft[^,\n]*)',
            r'(liferaft[:\s]*[^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])'
        ]
        
        for pattern in life_raft_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                equipment_data['lifeRaft'] = match.group(1).strip()
                break
        
        # Enhanced EPIRB extraction
        epirb_patterns = [
            r'epirb[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+epirb[^,\n]*)',
            r'(emergency\s+position\s+indicating\s+radio\s+beacon[^,\n]*)'
        ]
        
        for pattern in epirb_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                equipment_data['epirb'] = match.group(1).strip()
                break
        
        # Enhanced fire extinguisher extraction
        fire_ext_patterns = [
            r'fire\s+extinguisher[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+\s*fire\s+extinguisher[^,\n]*)',
            r'([A-Za-z]+\s+fire\s+extinguisher[^,\n]*)'
        ]
        
        for pattern in fire_ext_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                equipment_data['fireExtinguisher'] = match.group(1).strip()
                break
        
        # Enhanced bilge pump extraction
        bilge_pump_patterns = [
            r'bilge\s+pump[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+\s*bilge\s+pump[^,\n]*)',
            r'([A-Za-z]+\s+bilge\s+pump[^,\n]*)',
            r'(automatic\s+bilge\s+pump[^,\n]*)'
        ]
        
        for pattern in bilge_pump_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                equipment_data['bilgePump'] = match.group(1).strip()
                break
        
        # Enhanced davits extraction
        davits_patterns = [
            r'davits?[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+\s*davits?[^,\n]*)',
            r'([A-Za-z]+\s+davits?[^,\n]*)',
            r'(electric\s+davits?[^,\n]*)',
            r'(manual\s+davits?[^,\n]*)'
        ]
        
        for pattern in davits_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                equipment_data['davits'] = match.group(1).strip()
                break
        
        # Enhanced windlass extraction
        windlass_patterns = [
            r'windlass[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+windlass[^,\n]*)',
            r'(electric\s+windlass[^,\n]*)',
            r'(manual\s+windlass[^,\n]*)',
            r'(hydraulic\s+windlass[^,\n]*)'
        ]
        
        for pattern in windlass_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                equipment_data['windlass'] = match.group(1).strip()
                break
        
        # Enhanced tender extraction
        tender_patterns = [
            r'dinghy[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'inflatable[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'outboard[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+(?:\.\d+)?\s*(?:m|ft|feet|meter)[^,\n]*dinghy[^,\n]*)',
            r'([A-Za-z]+\s+\d+\s*hp\s*outboard[^,\n]*)'
        ]
        
        tender_types = ['dinghy', 'inflatable', 'outboard']
        for tender_type in tender_types:
            for pattern in tender_patterns:
                if tender_type in pattern:
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        equipment_data[tender_type] = match.group(1).strip()
                        break
        
        return equipment_data
    
    def _scan_navigation_section(self, page_text):
        """Extract detailed navigation information from full page text"""
        navigation_data = {}
        
        # Enhanced AIS extraction
        ais_patterns = [
            r'ais[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+ais[^,\n]*)',
            r'(automatic\s+identification\s+system[^,\n]*)',
            r'(class\s+[AB]\s+ais[^,\n]*)'
        ]
        
        for pattern in ais_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['ais'] = match.group(1).strip()
                break
        
        # Enhanced autopilot extraction
        autopilot_patterns = [
            r'autopilot[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+autopilot[^,\n]*)',
            r'(electric\s+autopilot[^,\n]*)',
            r'(hydraulic\s+autopilot[^,\n]*)'
        ]
        
        for pattern in autopilot_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['autopilot'] = match.group(1).strip()
                break
        
        # Enhanced compass extraction
        compass_patterns = [
            r'compass[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+compass[^,\n]*)',
            r'(fluxgate\s+compass[^,\n]*)',
            r'(magnetic\s+compass[^,\n]*)'
        ]
        
        for pattern in compass_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['compass'] = match.group(1).strip()
                break
        
        # Enhanced depth sounder extraction
        depth_patterns = [
            r'depth\s+sounder[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+depth\s+sounder[^,\n]*)',
            r'(depth\s+transducer[^,\n]*)',
            r'(echo\s+sounder[^,\n]*)'
        ]
        
        for pattern in depth_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['depthSounder'] = match.group(1).strip()
                break
        
        # Enhanced GPS extraction
        gps_patterns = [
            r'gps[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+gps[^,\n]*)',
            r'(global\s+positioning\s+system[^,\n]*)',
            r'(chart\s+plotter[^,\n]*)'
        ]
        
        for pattern in gps_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['gps'] = match.group(1).strip()
                break
        
        # Enhanced radar extraction
        radar_patterns = [
            r'radar[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+radar[^,\n]*)',
            r'(\d+\s*(?:nm|nautical\s+mile)[^,\n]*radar[^,\n]*)',
            r'(open\s+array\s+radar[^,\n]*)',
            r'(dome\s+radar[^,\n]*)'
        ]
        
        for pattern in radar_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['radar'] = match.group(1).strip()
                break
        
        # Enhanced VHF extraction
        vhf_patterns = [
            r'vhf[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+vhf[^,\n]*)',
            r'(very\s+high\s+frequency[^,\n]*)',
            r'(dsc\s+vhf[^,\n]*)'
        ]
        
        for pattern in vhf_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['vhf'] = match.group(1).strip()
                break
        
        # Enhanced plotter extraction
        plotter_patterns = [
            r'plotter[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+plotter[^,\n]*)',
            r'(chart\s+plotter[^,\n]*)',
            r'(gps\s+plotter[^,\n]*)'
        ]
        
        for pattern in plotter_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['plotter'] = match.group(1).strip()
                break
        
        # Enhanced EPIRB extraction
        epirb_patterns = [
            r'epirb[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+epirb[^,\n]*)',
            r'(emergency\s+position\s+indicating\s+radio\s+beacon[^,\n]*)'
        ]
        
        for pattern in epirb_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['epirb'] = match.group(1).strip()
                break
        
        # Enhanced log extraction
        log_patterns = [
            r'log[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+log[^,\n]*)',
            r'(speed\s+log[^,\n]*)',
            r'(distance\s+log[^,\n]*)'
        ]
        
        for pattern in log_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['log'] = match.group(1).strip()
                break
        
        # Enhanced windset extraction
        windset_patterns = [
            r'windset[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+windset[^,\n]*)',
            r'(wind\s+indicator[^,\n]*)',
            r'(anemometer[^,\n]*)'
        ]
        
        for pattern in windset_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['windset'] = match.group(1).strip()
                break
        
        # Enhanced satellite extraction
        satellite_patterns = [
            r'satellite[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+satellite[^,\n]*)',
            r'(satellite\s+phone[^,\n]*)',
            r'(satellite\s+tv[^,\n]*)'
        ]
        
        for pattern in satellite_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['satellite'] = match.group(1).strip()
                break
        
        # Enhanced rudder angle indicator extraction
        rudder_patterns = [
            r'rudder\s+angle\s+indicator[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'([A-Za-z]+\s+rudder\s+angle\s+indicator[^,\n]*)',
            r'(rudder\s+indicator[^,\n]*)'
        ]
        
        for pattern in rudder_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                navigation_data['rudderAngleIndicator'] = match.group(1).strip()
                break
        
        return navigation_data
    
    def _scan_rigging_section(self, page_text):
        """Extract detailed rigging information from full page text"""
        rigging_data = {}
        
        # Enhanced winch extraction with detailed specifications
        winch_patterns = [
            r'primary\s+sheet\s+winch[:\s]*([^,\n]+)',
            r'secondary\s+sheet\s+winch[:\s]*([^,\n]+)',
            r'genoa\s+sheetwinch[:\s]*([^,\n]+)',
            r'halyard\s+winch[:\s]*([^,\n]+)',
            r'multifunctional\s+winch[:\s]*([^,\n]+)',
            r'winch[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+x?\s*[A-Za-z]+\s+\d+\s+[^,\n]+winch[^,\n]*)',
            r'([A-Za-z]+\s+\d+\s+[^,\n]*winch[^,\n]*)'
        ]
        
        # Extract detailed winch information
        winch_details = []
        for pattern in winch_patterns:
            matches = re.findall(pattern, page_text, re.IGNORECASE)
            for match in matches:
                if match and len(match.strip()) > 3:
                    winch_details.append(match.strip())
        
        # Map winch details to specific form fields
        if winch_details:
            # Primary Sheet Winch (usually the largest/main winch)
            primary_winches = [w for w in winch_details if 'primary' in w.lower() or 'main' in w.lower() or 'sheet' in w.lower()]
            if primary_winches:
                rigging_data['primarySheetWinch'] = primary_winches[0]
            
            # Secondary Sheet Winch
            secondary_winches = [w for w in winch_details if 'secondary' in w.lower() or 'second' in w.lower()]
            if secondary_winches:
                rigging_data['secondarySheetWinch'] = secondary_winches[0]
            
            # Genoa Sheetwinches
            genoa_winches = [w for w in winch_details if 'genoa' in w.lower()]
            if genoa_winches:
                rigging_data['genoaSheetwinches'] = genoa_winches[0]
            
            # Halyard Winches
            halyard_winches = [w for w in winch_details if 'halyard' in w.lower()]
            if halyard_winches:
                rigging_data['halyardWinches'] = halyard_winches[0]
            
            # Multifunctional Winches
            multi_winches = [w for w in winch_details if 'multi' in w.lower() or 'hoist' in w.lower()]
            if multi_winches:
                rigging_data['multifunctionalWinches'] = multi_winches[0]
            
            # Fallback: distribute remaining winches intelligently
            remaining_winches = [w for w in winch_details if w not in [rigging_data.get('primarySheetWinch'), rigging_data.get('secondarySheetWinch'), rigging_data.get('genoaSheetwinches'), rigging_data.get('halyardWinches'), rigging_data.get('multifunctionalWinches')]]
            
            if remaining_winches:
                if not rigging_data.get('primarySheetWinch'):
                    rigging_data['primarySheetWinch'] = remaining_winches[0]
                if not rigging_data.get('secondarySheetWinch') and len(remaining_winches) > 1:
                    rigging_data['secondarySheetWinch'] = remaining_winches[1]
                if not rigging_data.get('genoaSheetwinches') and len(remaining_winches) > 2:
                    rigging_data['genoaSheetwinches'] = remaining_winches[2]
        
        # Enhanced mast extraction
        mast_patterns = [
            r'mast[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+(?:\.\d+)?\s*(?:m|ft|feet|meter)[^,\n]*mast[^,\n]*)',
            r'([A-Za-z]+\s+mast[^,\n]*)',
            r'(aluminum\s+mast[^,\n]*)',
            r'(carbon\s+mast[^,\n]*)'
        ]
        
        for pattern in mast_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                rigging_data['mast'] = match.group(1).strip()
                break
        
        # Enhanced boom extraction
        boom_patterns = [
            r'boom[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+(?:\.\d+)?\s*(?:m|ft|feet|meter)[^,\n]*boom[^,\n]*)',
            r'([A-Za-z]+\s+boom[^,\n]*)'
        ]
        
        for pattern in boom_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                rigging_data['boom'] = match.group(1).strip()
                break
        
        # Enhanced sail extraction
        sail_patterns = [
            r'mainsail[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'genoa[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'jib[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'spinnaker[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])'
        ]
        
        sail_types = ['mainsail', 'genoa', 'jib', 'spinnaker']
        for i, sail_type in enumerate(sail_types):
            for pattern in sail_patterns:
                if sail_type in pattern:
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        rigging_data[sail_type] = match.group(1).strip()
                        break
        
        # Enhanced spreaders extraction
        spreader_patterns = [
            r'spreaders?[:\s]*([^,\n]+?)(?=\s*[A-Z]|\s*$|\s*[,\n])',
            r'(\d+\s*spreaders?[^,\n]*)',
            r'([A-Za-z]+\s+spreaders?[^,\n]*)'
        ]
        
        for pattern in spreader_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                rigging_data['spreaders'] = match.group(1).strip()
                break
        
        return rigging_data
    
    def _scan_machinery_section(self, page_text: str) -> Dict[str, Any]:
        """Scan for machinery data in full page text"""
        machinery_data = {}
        
        try:
            # Engine patterns
            engine_patterns = [
                r'(\d+)x\s+([A-Za-z\s]+?)\s+(\w+)\s*(\w*)',  # "1x Yanmar 4JH110 diesel"
                r'engine.*?(\d+)\s*(?:HP|hp)',  # "Engine 110 HP"
                r'(\d+)\s*(?:HP|hp).*?engine',  # "110 HP engine"
            ]
            
            for pattern in engine_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    if len(match.groups()) >= 3:  # De Valk pattern
                        machinery_data['numberOfEngines'] = int(match.group(1))
                        machinery_data['make'] = match.group(2).strip()
                        machinery_data['type'] = match.group(3).strip()
                        if len(match.groups()) >= 4:
                            machinery_data['fuel'] = match.group(4).strip()
                        logger.info(f"✅ Machinery: {machinery_data['numberOfEngines']}x {machinery_data['make']} {machinery_data['type']}")
                        break
                    elif len(match.groups()) >= 1:
                        if 'HP' in pattern or 'hp' in pattern:
                            machinery_data['hp'] = int(match.group(1))
                            logger.info(f"✅ Machinery HP: {machinery_data['hp']}")
                        break
            
            # Fuel tank patterns
            fuel_match = re.search(r'fuel tank.*?(\d+)\s*litre', page_text, re.IGNORECASE)
            if fuel_match:
                machinery_data['fuelTankLitre'] = int(fuel_match.group(1))
                logger.info(f"✅ Machinery: Fuel tank {machinery_data['fuelTankLitre']}L")
            
            # Water tank patterns
            water_match = re.search(r'water tank.*?(\d+)\s*litre', page_text, re.IGNORECASE)
            if water_match:
                machinery_data['waterTankLitre'] = int(water_match.group(1))
                logger.info(f"✅ Machinery: Water tank {machinery_data['waterTankLitre']}L")
            
        except Exception as e:
            logger.error(f"Error scanning machinery section: {e}")
        
        return machinery_data
    
    def _scan_general_specifications(self, page_text: str) -> Dict[str, Any]:
        """Scan for general specifications in full page text"""
        specs_data = {}
        
        try:
            # Material patterns
            material_patterns = [
                r'material.*?(\w+)',  # "Material: GRP"
                r'hull.*?(\w+)',      # "Hull: GRP"
                r'(\w+)\s*material'   # "GRP material"
            ]
            
            for pattern in material_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    material = match.group(1).strip()
                    if material.lower() in ['grp', 'fiberglass', 'steel', 'aluminum', 'wood']:
                        specs_data['hullMaterial'] = material
                        logger.info(f"✅ General specs: Hull material = {material}")
                        break
            
            # Condition patterns
            condition_match = re.search(r'condition.*?(\w+(?:\s+\w+)*)', page_text, re.IGNORECASE)
            if condition_match:
                specs_data['condition'] = condition_match.group(1).strip()
                logger.info(f"✅ General specs: Condition = {specs_data['condition']}")
            
            # Location patterns
            location_match = re.search(r'location.*?([A-Za-z\s]+?)(?:\n|\.|$)', page_text, re.IGNORECASE)
            if location_match:
                specs_data['location'] = location_match.group(1).strip()
                logger.info(f"✅ General specs: Location = {specs_data['location']}")
            
        except Exception as e:
            logger.error(f"Error scanning general specifications: {e}")
        
        return specs_data
    
    def _post_process_ai_results(self, ai_data: Dict[str, Any], page_text: str) -> Dict[str, Any]:
        """Post-process AI results with additional pattern matching for accuracy"""
        processed = ai_data.copy()
        
        try:
            # Enhanced HP/KW extraction from full text
            if not processed.get('hp') and not processed.get('kw'):
                logger.info("🔍 Post-processing: Looking for HP/KW patterns in full text")
                
                # Multiple HP/KW patterns
                hp_patterns = [
                    r'(\d+\.?\d*)\s*(?:HP|hp|horsepower)',
                    r'(?:HP|hp|horsepower)\s*(\d+\.?\d*)',
                    r'(\d+\.?\d*)\s*\(hp\)',
                    r'(\d+)x\s+[A-Za-z]+\s+\w*(\d+)\s*[A-Za-z]*'  # De Valk pattern
                ]
                
                kw_patterns = [
                    r'(\d+\.?\d*)\s*(?:KW|kw|kilowatt)',
                    r'(?:KW|kw|kilowatt)\s*(\d+\.?\d*)',
                    r'(\d+\.?\d*)\s*\(kw\)'
                ]
                
                # Try HP patterns
                for pattern in hp_patterns:
                    hp_match = re.search(pattern, page_text, re.IGNORECASE)
                    if hp_match:
                        if len(hp_match.groups()) == 2:  # De Valk pattern
                            hp = int(hp_match.group(2))
                        else:
                            hp = int(float(hp_match.group(1)))
                        processed['hp'] = hp
                        logger.info(f"✅ Post-processing found HP: {hp}")
                        break
                
                # Try KW patterns
                for pattern in kw_patterns:
                    kw_match = re.search(pattern, page_text, re.IGNORECASE)
                    if kw_match:
                        kw = float(kw_match.group(1))
                        processed['kw'] = kw
                        logger.info(f"✅ Post-processing found KW: {kw}")
                        break
                
                # Calculate missing values
                if processed.get('hp') and not processed.get('kw'):
                    processed['kw'] = round(processed['hp'] * 0.7457, 2)
                    logger.info(f"🔧 Calculated KW from HP: {processed['hp']} HP = {processed['kw']} KW")
                elif processed.get('kw') and not processed.get('hp'):
                    processed['hp'] = round(processed['kw'] / 0.7457, 2)
                    logger.info(f"🔧 Calculated HP from KW: {processed['kw']} KW = {processed['hp']} HP")
            
            # Enhanced accommodation extraction
            if not processed.get('accommodation'):
                logger.info("🔍 Post-processing: Looking for accommodation patterns")
                accommodation_data = {}
                
                # Cabin patterns
                cabin_patterns = [
                    r'(\d+)\s*cabin',
                    r'(\d+)\s*stateroom',
                    r'(\d+)\s*bedroom'
                ]
                
                for pattern in cabin_patterns:
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        accommodation_data['numberOfCabins'] = int(match.group(1))
                        logger.info(f"✅ Post-processing found cabins: {accommodation_data['numberOfCabins']}")
                        break
                
                # Berth patterns
                berth_patterns = [
                    r'(\d+)\s*berth',
                    r'(\d+)\s*sleep',
                    r'(\d+)\s*person'
                ]
                
                for pattern in berth_patterns:
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        accommodation_data['numberOfBerths'] = int(match.group(1))
                        logger.info(f"✅ Post-processing found berths: {accommodation_data['numberOfBerths']}")
                        break
                
                if accommodation_data:
                    processed['accommodation'] = accommodation_data
            
            # Enhanced price extraction
            if not processed.get('price'):
                logger.info("🔍 Post-processing: Looking for price patterns")
                price_patterns = [
                    r'[\€\$£]?\s*([\d,]+(?:\.\d{3})?)',
                    r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*[\€\$£]',
                    r'asking price.*?[\€\$£]?\s*([\d,]+(?:\.\d{3})?)'
                ]
                
                for pattern in price_patterns:
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        price_str = match.group(1).replace('.', '').replace(',', '')
                        processed['price'] = price_str
                        logger.info(f"✅ Post-processing found price: {price_str}")
                        break
            
            logger.info(f"✅ Post-processing complete: {len(processed)} fields")
            return processed
            
        except Exception as e:
            logger.error(f"Error in post-processing AI results: {e}")
            return ai_data
    
    def scrape_yacht_listing(self, url: str) -> Dict[str, Any]:
        """Main scraping method that detects listing type and applies appropriate scraper"""
        logger.info(f"Starting to scrape yacht listing: {url}")
        
        listing_type = self.detect_listing_type(url)
        logger.info(f"Detected listing type: {listing_type}")
        
        # PRIORITY 1: AI Text Scanning (HTML-structure independent)
        logger.info("🤖 PRIORITY 1: Starting AI text scanning extraction")
        try:
            # Get page source with Selenium for JavaScript rendering
            driver = self.get_chrome_driver()
            if driver:
                driver.get(url)
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                page_source = driver.page_source
                driver.quit()
                
                # Extract data using AI text scanning
                ai_text_data = self._ai_text_scan_extraction(page_source, url)
                if ai_text_data:
                    logger.info(f"✅ AI text scanning successful: {len(ai_text_data)} fields")
                    
                    # Calculate completeness and return
                    ai_text_data['dataCompleteness'] = self._calculate_completeness(ai_text_data)
                    ai_text_data['sourceUrl'] = url
                    ai_text_data['scrapedAt'] = time.time()
                    
                    logger.info(f"🎯 AI text scanning complete: {len(ai_text_data)} fields, {ai_text_data['dataCompleteness']}% completeness")
                    return ai_text_data
                else:
                    logger.warning("⚠️ AI text scanning failed, falling back to traditional methods")
            else:
                logger.warning("⚠️ Chrome driver failed, falling back to traditional methods")
        except Exception as e:
            logger.warning(f"AI text scanning failed: {e}, falling back to traditional methods")
        
        # PRIORITY 2: Traditional Selenium + Fallback (existing logic)
        logger.info("🔄 PRIORITY 2: Using traditional Selenium + fallback methods")
        
        # Get data from both Selenium and fallback methods
        selenium_data = {}
        fallback_data = {}
        
        if listing_type == 'devalk':
            try:
                selenium_data = self.scrape_devalk(url)
                logger.info(f"Selenium extracted {len(selenium_data)} fields")
            except Exception as e:
                logger.warning(f"Selenium failed, using fallback: {e}")
                selenium_data = {}
        elif listing_type == 'yachtworld':
            try:
                selenium_data = self.scrape_yachtworld(url)
                logger.info(f"Selenium extracted {len(selenium_data)} fields")
            except Exception as e:
                logger.warning(f"Selenium failed, using fallback: {e}")
                selenium_data = {}
        
        # Always get fallback data as backup
        try:
            fallback_data = self._fallback_scraping(url)
            logger.info(f"Fallback extracted {len(fallback_data)} fields")
        except Exception as e:
            logger.warning(f"Fallback failed: {e}")
            fallback_data = {}
        
        # Smart merge: prefer Selenium data, but keep fallback for missing fields
        merged_data = {}
        
        # Start with fallback data (more reliable for basic fields)
        merged_data.update(fallback_data)
        
        # Override with Selenium data (better for complex elements)
        for key, value in selenium_data.items():
            if value and value != "" and value != "None":
                merged_data[key] = value
                logger.info(f"Using Selenium data for {key}: {value}")
        
        # Calculate data completeness
        merged_data['dataCompleteness'] = self._calculate_completeness(merged_data)
        merged_data['sourceUrl'] = url
        merged_data['scrapedAt'] = time.time()
        
        logger.info(f"Final merged data: {len(merged_data)} fields, {merged_data['dataCompleteness']}% completeness")
        return merged_data
    
    def _calculate_completeness(self, data: Dict[str, Any]) -> float:
        """Calculate the completeness percentage of scraped data"""
        # Comprehensive list of all yacht fields we can extract (mapped to your schema)
        yacht_fields = [
            # Basic Information
            'title', 'make', 'model', 'year', 'description', 'heroImage', 'galleryImages',
            
            # Dimensions (your schema fields)
            'loaM', 'lwlM', 'beamM', 'draftM', 'airDraftM', 'headroomM',
            
            # General Information
            'country', 'designer', 'displacementT', 'ballastTonnes', 'hullColor', 'hullMaterial', 'boatType',
            'designYear', 'lastRefit', 'classification', 'location',
            
            # Price
            'price', 'currency',
            
            # Machinery (nested object)
            'machinery',
            
            # Accommodation (nested object)
            'accommodation',
            
            # Equipment (nested object) - comprehensive categories
            'equipment',
            
            # Rigging (nested object) - sailing-specific
            'rigging',
            
            # Navigation (nested object) - electronics & instruments
            'navigation',
            
            # Legacy fields for backward compatibility
            'length', 'beam', 'draft', 'brand', 'engineMake'
        ]
        
        # Count filled fields with detailed breakdown
        filled_fields = 0
        detailed_breakdown = {}
        
        for field in yacht_fields:
            value = data.get(field)
            if value and value != "" and value != "None":
                if isinstance(value, list) and len(value) > 0:
                    filled_fields += 1
                    detailed_breakdown[field] = f"list({len(value)} items)"
                    logger.debug(f"Field {field}: list with {len(value)} items")
                elif isinstance(value, dict) and len(value) > 0:
                    # Count individual items in nested objects for better completeness
                    dict_items = len(value)
                    filled_fields += 1
                    detailed_breakdown[field] = f"dict({dict_items} items)"
                    logger.debug(f"Field {field}: dict with {dict_items} keys")
                elif not isinstance(value, (list, dict)):
                    filled_fields += 1
                    detailed_breakdown[field] = str(value)
                    logger.debug(f"Field {field}: {value}")
        
        # Calculate enhanced completeness including nested object items
        total_possible_items = len(yacht_fields)
        
        # Count individual items in nested objects for true completeness
        total_individual_items = filled_fields
        if data.get('equipment') and isinstance(data['equipment'], dict):
            total_individual_items += len(data['equipment'])
        if data.get('rigging') and isinstance(data['rigging'], dict):
            total_individual_items += len(data['rigging'])
        if data.get('navigation') and isinstance(data['navigation'], dict):
            total_individual_items += len(data['navigation'])
        if data.get('machinery') and isinstance(data['machinery'], dict):
            total_individual_items += len(data['machinery'])
        if data.get('accommodation') and isinstance(data['accommodation'], dict):
            total_individual_items += len(data['accommodation'])
        
        # Calculate both field-based and item-based completeness
        field_completeness = round((filled_fields / total_possible_items) * 100, 1)
        item_completeness = round((total_individual_items / (total_possible_items + 50)) * 100, 1)  # +50 for expected items
        
        logger.info(f"Field-based completeness: {filled_fields}/{total_possible_items} fields = {field_completeness}%")
        logger.info(f"Item-based completeness: {total_individual_items} individual items = {item_completeness}%")
        logger.info(f"Detailed breakdown: {detailed_breakdown}")
        
        # Log equipment summary for debugging
        if data.get('equipment') and isinstance(data['equipment'], dict):
            logger.info(f"Equipment items: {len(data['equipment'])}")
        if data.get('rigging') and isinstance(data['rigging'], dict):
            logger.info(f"Rigging items: {len(data['rigging'])}")
        if data.get('navigation') and isinstance(data['navigation'], dict):
            logger.info(f"Navigation items: {len(data['navigation'])}")
        
        # Return item-based completeness for more accurate representation
        return item_completeness
    
    def _extract_devalk_data(self, soup, driver):
        """Extract data using De Valk's exact field structure"""
        data = {}
        
        logger.info("🔍 Starting De Valk field extraction...")
        
        # KEY DETAILS SECTION
        data['key_details'] = {}
        logger.info("🔑 Extracting Key Details section...")
        
        # Try to find the Key Details section
        key_details_section = soup.find('h2', string=re.compile('Key Details', re.IGNORECASE))
        if key_details_section:
            logger.info("✅ Found Key Details section")
            # Look for the table or list structure
            key_details_container = key_details_section.find_next_sibling()
            if key_details_container:
                logger.info(f"📋 Key Details container type: {key_details_container.name}")
                # Extract key details fields
                data['key_details']['dimensions'] = self._extract_text(soup, 'DIMENSIONS')
                data['key_details']['material'] = self._extract_text(soup, 'MATERIAL')
                data['key_details']['built'] = self._extract_text(soup, 'BUILT')
                data['key_details']['engines'] = self._extract_text(soup, 'ENGINE\\(S\\)')
                data['key_details']['hp_kw'] = self._extract_text(soup, 'HP/\\s*KW')
                data['key_details']['lying'] = self._extract_text(soup, 'LYING')
                data['key_details']['sales_office'] = self._extract_text(soup, 'SALES OFFICE')
                data['key_details']['status'] = self._extract_text(soup, 'STATUS')
                data['key_details']['vat'] = self._extract_text(soup, 'VAT')
                data['key_details']['asking_price'] = self._extract_text(soup, 'ASKING PRICE')
        else:
            logger.warning("⚠️ Key Details section not found")
        
        # GENERAL INFORMATION SECTION - IMPROVED PARSING
        data['general'] = {}
        logger.info("📋 Extracting General Information section...")
        
        # Method 1: Look for the General Information section header
        general_section = soup.find('h2', string=re.compile('General Information', re.IGNORECASE))
        if general_section:
            logger.info("✅ Found General Information section header")
            
            # Look for the content after the header
            content = general_section.find_next_sibling()
            if content:
                logger.info(f"📋 General Information content type: {content.name}")
                
                # Extract all the fields from the content
                self._extract_general_fields_from_content(content, data['general'])
        else:
            logger.warning("⚠️ General Information section header not found")
            
            # Method 2: Look for the content by searching for field names
            logger.info("🔍 Searching for General Information fields by content...")
            self._extract_general_fields_from_content(soup, data['general'])
        
        # For now, let's add the other sections as empty to test the structure
        data['accommodation'] = {}
        data['machinery'] = {}
        data['navigation'] = {}
        data['equipment'] = {}
        data['rigging'] = {}
        data['indication_ratios'] = {}
        
        # FALLBACK: If we didn't find De Valk structure, try to extract basic info
        if not any(data['key_details'].values()) and not any(data['general'].values()):
            logger.warning("⚠️ De Valk structure not found, using fallback extraction")
            
            # Try to extract basic information from the page
            title_elem = soup.find('h1') or soup.find('title')
            if title_elem:
                data['general']['model'] = title_elem.get_text(strip=True)
                logger.info(f"📋 Fallback: extracted model from title: {data['general']['model']}")
            
            # Look for any text that might contain dimensions
            page_text = soup.get_text()
            dim_match = re.search(r'(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*x\s*(\d+\.?\d*)', page_text)
            if dim_match:
                data['general']['loa_m'] = dim_match.group(1)
                data['general']['beam_m'] = dim_match.group(2)
                data['general']['draft_m'] = dim_match.group(3)
                logger.info(f"📋 Fallback: extracted dimensions: {dim_match.group(1)}x{dim_match.group(2)}x{dim_match.group(3)}")
            
            # Look for year
            year_match = re.search(r'(\d{4})', page_text)
            if year_match:
                data['general']['year_built'] = year_match.group(1)
                logger.info(f"📋 Fallback: extracted year: {data['general']['year_built']}")
        
        logger.info(f"📊 De Valk extraction completed. Data keys: {list(data.keys())}")
        logger.info(f"🔑 Key Details fields: {list(data['key_details'].keys())}")
        logger.info(f"📋 General fields: {list(data['general'].keys())}")
        
        return data
    
    def _extract_text(self, soup, field_name):
        """Extract text value for a specific De Valk field name"""
        try:
            logger.debug(f"🔍 Looking for field: {field_name}")
            
            # Method 1: Look for table structure (most common in De Valk)
            tables = soup.find_all('table')
            for table in tables:
                rows = table.find_all('tr')
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) >= 2:
                        # Check if first cell contains the field name
                        first_cell_text = cells[0].get_text(strip=True).upper()
                        if field_name.upper() in first_cell_text:
                            value = cells[1].get_text(strip=True)
                            if value and value != field_name:
                                logger.debug(f"✅ Found {field_name} in table: {value}")
                                return value
            
            # Method 2: Look for list structure
            lists = soup.find_all(['ul', 'ol'])
            for list_elem in lists:
                items = list_elem.find_all('li')
                for item in items:
                    item_text = item.get_text(strip=True)
                    if field_name.upper() in item_text.upper():
                        # Extract value after the field name
                        match = re.search(f"{re.escape(field_name)}\\s*[:\\-=]\\s*(.+)", item_text, re.IGNORECASE)
                        if match:
                            value = match.group(1).strip()
                            logger.debug(f"✅ Found {field_name} in list: {value}")
                            return value
            
            # Method 3: Look for div/span with field name
            elements = soup.find_all(['div', 'span', 'p'], string=re.compile(re.escape(field_name), re.IGNORECASE))
            for element in elements:
                # Look for value in parent or sibling
                parent = element.parent
                if parent:
                    # Check if parent contains both field name and value
                    parent_text = parent.get_text(strip=True)
                    match = re.search(f"{re.escape(field_name)}\\s*[:\\-=]\\s*(.+)", parent_text, re.IGNORECASE)
                    if match:
                        value = match.group(1).strip()
                        logger.debug(f"✅ Found {field_name} in element: {value}")
                        return value
                    
                    # Check next sibling for value
                    next_sibling = element.find_next_sibling()
                    if next_sibling:
                        value = next_sibling.get_text(strip=True)
                        if value and value != field_name:
                            logger.debug(f"✅ Found {field_name} in sibling: {value}")
                            return value
            
            # Method 4: Look for field name in text and extract nearby value
            text_elements = soup.find_all(text=re.compile(re.escape(field_name), re.IGNORECASE))
            for text_elem in text_elements:
                if text_elem.parent:
                    parent_text = text_elem.parent.get_text(strip=True)
                    match = re.search(f"{re.escape(field_name)}\\s*[:\\-=]\\s*(.+)", parent_text, re.IGNORECASE)
                    if match:
                        value = match.group(1).strip()
                        if value and value != field_name and len(value) > 1:
                            logger.debug(f"✅ Found {field_name} in text: {value}")
                            return value
            
            logger.debug(f"❌ Field {field_name} not found")
            return None
            
        except Exception as e:
            logger.error(f"Error extracting {field_name}: {e}")
            return None
    
    def _calculate_devalk_completeness(self, data):
        """Calculate data completeness based on De Valk's field structure"""
        try:
            total_fields = 0
            populated_fields = 0
            
            # Count fields in each section
            sections = ['key_details', 'general', 'accommodation', 'machinery', 'navigation', 'equipment', 'rigging', 'indication_ratios']
            
            for section in sections:
                if section in data and isinstance(data[section], dict):
                    section_data = data[section]
                    for field_name, field_value in section_data.items():
                        total_fields += 1
                        if field_value and str(field_value).strip() and str(field_value).lower() not in ['none', 'n/a', '']:
                            populated_fields += 1
            
            if total_fields == 0:
                return 0
                
            completeness = round((populated_fields / total_fields) * 100, 1)
            logger.info(f"📊 De Valk completeness: {populated_fields}/{total_fields} fields = {completeness}%")
            
            return completeness
            
        except Exception as e:
            logger.error(f"Error calculating De Valk completeness: {e}")
            return 0
