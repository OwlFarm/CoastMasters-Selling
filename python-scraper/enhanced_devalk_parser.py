import requests
from bs4 import BeautifulSoup
import re
import logging
from typing import Dict, Any, List, Optional
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedDeValkParser:
    """
    Enhanced De Valk parser with multi-pattern strategies for consistent extraction
    across different page structures and text formats.
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Pre-compile common patterns
        self._compile_patterns()
    
    def _compile_patterns(self):
        """Pre-compile regex patterns for better performance"""
        # Dimension patterns
        self.dimension_patterns = [
            r'(\d+\.?\d*)\s*[xX]\s*(\d+\.?\d*)\s*[xX]\s*(\d+\.?\d*)\s*\(m\)',  # 14.96 x 4.42 x 2.20 (m)
            r'LOA[:\s]*(\d+\.?\d*)\s*m',  # LOA: 14.96 m
            r'BEAM[:\s]*(\d+\.?\d*)\s*m',  # BEAM: 4.42 m
            r'DRAFT[:\s]*(\d+\.?\d*)\s*m',  # DRAFT: 2.20 m
        ]
        
        # Year patterns
        self.year_patterns = [
            r'(\d{4})',  # 1990
            r'BUILT[:\s]*(\d{4})',  # BUILT: 1990
            r'YEAR[:\s]*(\d{4})',  # YEAR: 1990
        ]
        
        # Price patterns
        self.price_patterns = [
            r'€\s*([\d,]+\.?\d*)',  # € 275.000
            r'ASKING PRICE[:\s]*€\s*([\d,]+\.?\d*)',  # ASKING PRICE: € 275.000
            r'PRICE[:\s]*€\s*([\d,]+\.?\d*)',  # PRICE: € 275.000
        ]
        
        # Engine patterns
        self.engine_patterns = [
            r'(\d+x\s+[A-Za-z\s]+)',  # 1x Volvo Penta TMD41A
            r'ENGINE[S]?[:\s]*(\d+x\s+[A-Za-z\s]+)',  # ENGINE: 1x Volvo Penta TMD41A
        ]
        
        # Power patterns
        self.power_patterns = [
            r'(\d+\.?\d*)\s*(hp|kw)',  # 143.00 hp, 105.25 kw
            r'HP/KW[:\s]*(\d+\.?\d*)\s*(hp|kw)',  # HP/KW: 143.00 hp
        ]
        
        # Material patterns
        self.material_patterns = [
            r'GRP', r'Steel', r'Aluminium', r'Wood', r'Carbon'
        ]
        
        # Builder patterns
        self.builder_patterns = [
            r'BUILDER[:\s]*([A-Za-z\s]+)',  # BUILDER: Hallberg Rassy
            r'([A-Za-z\s]+)\s*BUILT',  # Hallberg Rassy BUILT
        ]
        
        # Country patterns
        self.country_patterns = [
            r'COUNTRY[:\s]*([A-Za-z\s]+)',  # COUNTRY: Sweden
            r'([A-Za-z\s]+)\s*DESIGNER',  # Sweden DESIGNER
        ]
        
        # Designer patterns
        self.designer_patterns = [
            r'DESIGNER[:\s]*([A-Za-z\s\/]+)',  # DESIGNER: Olle Enderlein / Christoph Rassy
            r'([A-Za-z\s\/]+)\s*DISPLACEMENT',  # Olle Enderlein / Christoph Rassy DISPLACEMENT
        ]
        
        # Cabins patterns
        self.cabins_patterns = [
            r'CABINS[:\s]*(\d+)',  # CABINS: 3
            r'(\d+)\s*cabins?',  # 3 cabins
            r'(\d+)\s*cabins?',  # 3 cabin
        ]
        
        # Berths patterns
        self.berths_patterns = [
            r'BERTHS[:\s]*(\d+)',  # BERTHS: 9
            r'(\d+)\s*berths?',  # 9 berths
            r'(\d+)\s*berths?',  # 9 berth
        ]
        
        # Displacement patterns
        self.displacement_patterns = [
            r'DISPLACEMENT[:\s]*(\d+)\s*T',  # DISPLACEMENT: 18 T
            r'(\d+)\s*tonnes?',  # 18 tonnes
            r'(\d+)\s*ton',  # 18 ton
        ]
        
        # Ballast patterns
        self.ballast_patterns = [
            r'BALLAST[:\s]*(\d+\.?\d*)\s*TONNES?',  # BALLAST: 8.1 TONNES
            r'(\d+\.?\d*)\s*tonnes?',  # 8.1 tonnes
        ]
    
    def parse_yacht_listing(self, url: str) -> Dict[str, Any]:
        """Parse a De Valk yacht listing with enhanced multi-pattern extraction"""
        try:
            logger.info(f"🚀 Starting enhanced parsing of: {url}")
            
            # Fetch page with retry logic
            page_content = self._fetch_page_with_retry(url)
            if not page_content:
                return self._create_error_response("Failed to fetch page content")
            
            soup = BeautifulSoup(page_content, 'html.parser')
            page_text = soup.get_text()
            
            # Extract all sections with enhanced patterns
            result = {
                'source': 'devalk_enhanced',
                'parser_version': '3.0.0',
                'url': url,
                'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S'),
                'data': {}
            }
            
            # Extract each section with fallback strategies
            sections = [
                ('keyDetails', self._extract_key_details_enhanced),
                ('generalInfo', self._extract_general_info_enhanced),
                ('accommodation', self._extract_accommodation_enhanced),
                ('machinery', self._extract_machinery_enhanced),
                ('navigation', self._extract_navigation_enhanced),
                ('equipment', self._extract_equipment_enhanced),
                ('rigging', self._extract_rigging_enhanced),
                ('indicationRatios', self._extract_indication_ratios_enhanced)
            ]
            
            for section_name, extractor_func in sections:
                try:
                    section_data = extractor_func(soup, page_text)
                    result['data'][section_name] = section_data
                    logger.info(f"✅ {section_name}: {len(section_data)} fields extracted")
                except Exception as e:
                    logger.error(f"❌ Error extracting {section_name}: {e}")
                    result['data'][section_name] = {}
            
            # Calculate completion percentage
            total_fields = sum(len(section) for section in result['data'].values())
            logger.info(f"🎯 Total fields extracted: {total_fields}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Fatal error parsing {url}: {e}")
            return self._create_error_response(str(e))
    
    def _fetch_page_with_retry(self, url: str, max_retries: int = 3) -> Optional[str]:
        """Fetch page content with retry logic"""
        for attempt in range(max_retries):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                return response.text
            except requests.RequestException as e:
                logger.warning(f"⚠️ Attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    logger.error(f"❌ All retry attempts failed for {url}")
                    return None
        return None
    
    def _clean_text(self, text: str) -> str:
        """Clean extracted text by removing newlines, extra spaces, and unwanted characters"""
        if not text:
            return ""
        
        # Remove newlines and replace with spaces
        text = text.replace('\n', ' ').replace('\r', ' ')
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove common unwanted patterns
        text = re.sub(r'Country\s+[A-Za-z\s]+', '', text)
        text = re.sub(r'Designer\s+[A-Za-z\s]+', '', text)
        text = re.sub(r'Type\s+[a-z\s]+', '', text)
        text = re.sub(r'LOA\s*$', '', text)
        text = re.sub(r'Status\s*$', '', text)
        text = re.sub(r'VAT\s*$', '', text)
        text = re.sub(r'Asking price\s*$', '', text)
        
        # Clean up hull shape and keel type
        text = re.sub(r'Hull shape\s+[a-z\s\-]+', '', text)
        text = re.sub(r'Keel type\s+[a-z\s]+', '', text)
        text = re.sub(r'Superstructure material\s+[A-Za-z\s]+', '', text)
        text = re.sub(r'Deck material\s+[A-Za-z\s]+', '', text)
        text = re.sub(r'Deck finish\s+[a-z\s]+', '', text)
        text = re.sub(r'Superstructure deck finish\s+[a-z\s]+', '', text)
        text = re.sub(r'Cockpit deck finish\s+[a-z\s]+', '', text)
        text = re.sub(r'Antifouling\s*$', '', text)
        
        # Clean up sales office info
        text = re.sub(r'Sales office\s*De Valk\s+[A-Za-z\s]+', '', text)
        text = re.sub(r'Status\s+For sale\s*$', '', text)
        text = re.sub(r'VAT\s+Paid\s*$', '', text)
        text = re.sub(r'Asking price\s*$', '', text)
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        return text
    
    def _extract_with_patterns(self, patterns: List[str], text: str, context: str = "") -> Optional[str]:
        """Generic pattern extraction with multiple fallbacks and text cleaning"""
        for pattern in patterns:
            try:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    # Handle different group structures
                    if len(match.groups()) == 1:
                        extracted = match.group(1).strip()
                        return self._clean_text(extracted)
                    elif len(match.groups()) > 1:
                        # For multi-group patterns, return the most relevant
                        extracted = match.group(1).strip()
                        return self._clean_text(extracted)
            except Exception as e:
                logger.debug(f"Pattern {pattern} failed: {e}")
                continue
        
        # Fallback: look for context clues
        if context:
            context_lower = context.lower()
            if 'yes' in context_lower or 'present' in context_lower:
                return 'Yes'
            elif 'no' in context_lower or 'not' in context_lower:
                return 'No'
        
        return None
    
    def _extract_key_details_enhanced(self, soup: BeautifulSoup, page_text: str) -> Dict[str, Any]:
        """Enhanced key details extraction with multiple patterns"""
        key_details = {}
        
        try:
            # Dimensions - try multiple patterns
            for pattern in self.dimension_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    if len(match.groups()) == 3:
                        key_details['loaM'] = match.group(1)
                        key_details['beamM'] = match.group(2)
                        key_details['draftM'] = match.group(3)
                        logger.info(f"✅ Dimensions: {match.group(1)} x {match.group(2)} x {match.group(3)}")
                        break
                    elif len(match.groups()) == 1:
                        # Single dimension found
                        if 'LOA' in pattern:
                            key_details['loaM'] = match.group(1)
                        elif 'BEAM' in pattern:
                            key_details['beamM'] = match.group(1)
                        elif 'DRAFT' in pattern:
                            key_details['draftM'] = match.group(1)
            
            # Year built
            year = self._extract_with_patterns(self.year_patterns, page_text)
            if year:
                key_details['yearBuilt'] = year
                logger.info(f"✅ Year built: {year}")
            
            # Material
            for material in self.material_patterns:
                if re.search(material, page_text, re.IGNORECASE):
                    key_details['material'] = material
                    logger.info(f"✅ Material: {material}")
                    break
            
            # Engines
            engine = self._extract_with_patterns(self.engine_patterns, page_text)
            if engine:
                key_details['engines'] = engine
                logger.info(f"✅ Engines: {engine}")
            
            # Power
            for pattern in self.power_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    value = match.group(1)
                    unit = match.group(2).lower()
                    if unit == 'hp':
                        key_details['hp'] = value
                        logger.info(f"✅ HP: {value}")
                    elif unit == 'kw':
                        key_details['kw'] = value
                        logger.info(f"✅ KW: {value}")
            
            # Price
            price = self._extract_with_patterns(self.price_patterns, page_text)
            if price:
                key_details['askingPrice'] = f"€ {price}"
                logger.info(f"✅ Price: € {price}")
            
            # Additional fields with context
            if 'lying' in page_text.lower():
                if 'sales office' in page_text.lower():
                    key_details['lying'] = 'at sales office'
            
            if 'sales office' in page_text.lower():
                office_match = re.search(r'SALES OFFICE[:\s]*([A-Za-z\s]+?)(?=\s*Status|\s*$)', page_text, re.IGNORECASE)
                if office_match:
                    key_details['salesOffice'] = self._clean_text(office_match.group(1))
                    logger.info(f"✅ Sales office: {key_details['salesOffice']}")
            
            if 'status' in page_text.lower():
                if 'for sale' in page_text.lower():
                    key_details['status'] = 'For Sale'
                elif 'sold' in page_text.lower():
                    key_details['status'] = 'Sold'
            
            if 'vat' in page_text.lower():
                if 'paid' in page_text.lower():
                    key_details['vat'] = 'Paid'
                elif 'not paid' in page_text.lower():
                    key_details['vat'] = 'Not Paid'
            
        except Exception as e:
            logger.error(f"Error extracting key details: {e}")
        
        return key_details
    
    def _extract_general_info_enhanced(self, soup: BeautifulSoup, page_text: str) -> Dict[str, Any]:
        """Enhanced general info extraction with multiple patterns"""
        general_info = {}
        
        try:
            # Model - look for multiple patterns with better boundaries
            model_patterns = [
                r'MODEL[:\s]*([A-Za-z\s0-9]+?)(?=\s*Type|\s*$)',  # MODEL: HALLBERG RASSY 49 (stop at Type)
                r'([A-Za-z\s0-9]+?)\s*Type\s*sailing\s*yacht',  # HALLBERG RASSY 49 Type sailing yacht
            ]
            
            model = self._extract_with_patterns(model_patterns, page_text)
            if model:
                general_info['model'] = model
                logger.info(f"✅ Model: {model}")
            
            # Yacht type - look for sailing yacht specifically
            type_patterns = [
                r'Type\s*([a-z\s]+?)(?=\s*LOA|\s*$)',  # Type: monohull sailing yacht (stop at LOA)
                r'sailing\s*yacht(?=\s*LOA|\s*$)',  # sailing yacht (stop at LOA)
            ]
            
            yacht_type = self._extract_with_patterns(type_patterns, page_text)
            if yacht_type:
                general_info['yachtType'] = yacht_type
                logger.info(f"✅ Yacht type: {yacht_type}")
            
            # Builder - extract just the builder name
            builder_patterns = [
                r'BUILDER[:\s]*([A-Za-z\s]+?)(?=\s*Country|\s*$)',  # BUILDER: Hallberg Rassy (stop at Country)
                r'([A-Za-z\s]+?)\s*BUILT',  # Hallberg Rassy BUILT
            ]
            
            builder = self._extract_with_patterns(builder_patterns, page_text)
            if builder:
                general_info['builder'] = builder
                logger.info(f"✅ Builder: {builder}")
            
            # Country - extract just the country name
            country_patterns = [
                r'Country\s*([A-Za-z\s]+?)(?=\s*Designer|\s*$)',  # Country: Sweden (stop at Designer)
                r'([A-Za-z\s]+?)\s*Designer',  # Sweden Designer
            ]
            
            country = self._extract_with_patterns(country_patterns, page_text)
            if country:
                general_info['country'] = country
                logger.info(f"✅ Country: {country}")
            
            # Designer - extract just the designer name
            designer_patterns = [
                r'Designer\s*([A-Za-z\s\/]+?)(?=\s*DISPLACEMENT|\s*$)',  # DESIGNER: Olle Enderlein / Christoph Rassy (stop at DISPLACEMENT)
                r'([A-Za-z\s\/]+?)\s*DISPLACEMENT',  # Olle Enderlein / Christoph Rassy DISPLACEMENT
            ]
            
            designer = self._extract_with_patterns(designer_patterns, page_text)
            if designer:
                general_info['designer'] = designer
                logger.info(f"✅ Designer: {designer}")
            
            # Dimensions from key details if not found
            if 'loaM' not in general_info:
                loa = self._extract_with_patterns([r'LOA[:\s]*(\d+\.?\d*)'], page_text)
                if loa:
                    general_info['loaM'] = loa
            
            if 'beamM' not in general_info:
                beam = self._extract_with_patterns([r'BEAM[:\s]*(\d+\.?\d*)'], page_text)
                if beam:
                    general_info['beamM'] = beam
            
            if 'draftM' not in general_info:
                draft = self._extract_with_patterns([r'DRAFT[:\s]*(\d+\.?\d*)'], page_text)
                if draft:
                    general_info['draftM'] = draft
            
            # Displacement
            displacement = self._extract_with_patterns(self.displacement_patterns, page_text)
            if displacement:
                general_info['displacementT'] = displacement
                logger.info(f"✅ Displacement: {displacement} T")
            
            # Ballast
            ballast = self._extract_with_patterns(self.ballast_patterns, page_text)
            if ballast:
                general_info['ballastTonnes'] = ballast
                logger.info(f"✅ Ballast: {ballast} tonnes")
            
            # Hull material
            for material in self.material_patterns:
                if re.search(material, page_text, re.IGNORECASE):
                    general_info['hullMaterial'] = material
                    logger.info(f"✅ Hull material: {material}")
                    break
            
            # Additional hull details with better boundaries
            if 'hull colour' in page_text.lower():
                color_match = re.search(r'HULL COLOUR[:\s]*([A-Za-z\s]+?)(?=\s*Hull shape|\s*$)', page_text, re.IGNORECASE)
                if color_match:
                    general_info['hullColour'] = self._clean_text(color_match.group(1))
            
            if 'hull shape' in page_text.lower():
                shape_match = re.search(r'HULL SHAPE[:\s]*([A-Za-z\s\-]+?)(?=\s*Keel type|\s*$)', page_text, re.IGNORECASE)
                if shape_match:
                    general_info['hullShape'] = self._clean_text(shape_match.group(1))
            
            if 'keel type' in page_text.lower():
                keel_match = re.search(r'KEEL TYPE[:\s]*([A-Za-z\s]+?)(?=\s*Superstructure|\s*$)', page_text, re.IGNORECASE)
                if keel_match:
                    general_info['keelType'] = self._clean_text(keel_match.group(1))
            
            # Additional fields that might be present
            if 'superstructure material' in page_text.lower():
                super_match = re.search(r'SUPERSTRUCTURE MATERIAL[:\s]*([A-Za-z\s]+?)(?=\s*Deck material|\s*$)', page_text, re.IGNORECASE)
                if super_match:
                    general_info['superstructureMaterial'] = self._clean_text(super_match.group(1))
            
            if 'deck material' in page_text.lower():
                deck_match = re.search(r'DECK MATERIAL[:\s]*([A-Za-z\s]+?)(?=\s*Deck finish|\s*$)', page_text, re.IGNORECASE)
                if deck_match:
                    general_info['deckMaterial'] = self._clean_text(deck_match.group(1))
            
            if 'deck finish' in page_text.lower():
                finish_match = re.search(r'DECK FINISH[:\s]*([A-Za-z\s]+?)(?=\s*Superstructure deck|\s*$)', page_text, re.IGNORECASE)
                if finish_match:
                    general_info['deckFinish'] = self._clean_text(finish_match.group(1))
            
            if 'superstructure deck finish' in page_text.lower():
                super_finish_match = re.search(r'SUPERSTRUCTURE DECK FINISH[:\s]*([A-Za-z\s]+?)(?=\s*Cockpit deck|\s*$)', page_text, re.IGNORECASE)
                if super_finish_match:
                    general_info['superstructureDeckFinish'] = self._clean_text(super_finish_match.group(1))
            
            if 'cockpit deck finish' in page_text.lower():
                cockpit_finish_match = re.search(r'COCKPIT DECK FINISH[:\s]*([A-Za-z\s]+?)(?=\s*Dorades|\s*$)', page_text, re.IGNORECASE)
                if cockpit_finish_match:
                    general_info['cockpitDeckFinish'] = self._clean_text(cockpit_finish_match.group(1))
            
            # Dorades
            if 'dorades' in page_text.lower():
                dorades_match = re.search(r'DORADES[:\s]*([A-Za-z\s0-9x]+?)(?=\s*Window frame|\s*$)', page_text, re.IGNORECASE)
                if dorades_match:
                    general_info['dorades'] = self._clean_text(dorades_match.group(1))
            
            # Window details
            if 'window frame' in page_text.lower():
                window_frame_match = re.search(r'WINDOW FRAME[:\s]*([A-Za-z\s]+?)(?=\s*Window material|\s*$)', page_text, re.IGNORECASE)
                if window_frame_match:
                    general_info['windowFrame'] = self._clean_text(window_frame_match.group(1))
            
            if 'window material' in page_text.lower():
                window_material_match = re.search(r'WINDOW MATERIAL[:\s]*([A-Za-z\s]+?)(?=\s*Deckhatch|\s*$)', page_text, re.IGNORECASE)
                if window_material_match:
                    general_info['windowMaterial'] = self._clean_text(window_material_match.group(1))
            
            # Deckhatch
            if 'deckhatch' in page_text.lower():
                deckhatch_match = re.search(r'DECKHATCH[:\s]*([A-Za-z\s0-9x]+?)(?=\s*Fuel tank|\s*$)', page_text, re.IGNORECASE)
                if deckhatch_match:
                    general_info['deckhatch'] = self._clean_text(deckhatch_match.group(1))
            
            # Tank details
            if 'fuel tank' in page_text.lower():
                fuel_tank_match = re.search(r'FUEL TANK[:\s]*([A-Za-z\s]+?)\s*(\d+)\s*ltr', page_text, re.IGNORECASE)
                if fuel_tank_match:
                    general_info['fuelTankLitre'] = f"{fuel_tank_match.group(1)} {fuel_tank_match.group(2)} ltr"
            
            if 'level indicator' in page_text.lower() and 'fuel' in page_text.lower():
                fuel_indicator_match = re.search(r'LEVEL INDICATOR[:\s]*\(FUEL TANK\)[:\s]*([A-Za-z\s]+?)(?=\s*Freshwater|\s*$)', page_text, re.IGNORECASE)
                if fuel_indicator_match:
                    general_info['levelIndicatorFuelTank'] = self._clean_text(fuel_indicator_match.group(1))
            
            if 'freshwater tank' in page_text.lower():
                fresh_tank_match = re.search(r'FRESHWATER TANK[:\s]*([A-Za-z\s]+?)\s*(\d+)\s*ltr', page_text, re.IGNORECASE)
                if fresh_tank_match:
                    general_info['freshwaterTankLitre'] = f"{fresh_tank_match.group(1)} {fresh_tank_match.group(2)} ltr"
            
            if 'level indicator' in page_text.lower() and 'freshwater' in page_text.lower():
                fresh_indicator_match = re.search(r'LEVEL INDICATOR[:\s]*\(FRESHWATER\)[:\s]*([A-Za-z\s]+?)(?=\s*Wheel|\s*$)', page_text, re.IGNORECASE)
                if fresh_indicator_match:
                    general_info['levelIndicatorFreshwater'] = self._clean_text(fresh_indicator_match.group(1))
            
            # Steering details
            if 'wheel steering' in page_text.lower():
                wheel_match = re.search(r'WHEEL STEERING[:\s]*([A-Za-z\s]+?)(?=\s*Outside|\s*$)', page_text, re.IGNORECASE)
                if wheel_match:
                    general_info['wheelSteering'] = self._clean_text(wheel_match.group(1))
            
            if 'outside helm position' in page_text.lower():
                helm_match = re.search(r'OUTSIDE HELM POSITION[:\s]*([A-Za-z\s]+?)(?=\s*$)', page_text, re.IGNORECASE)
                if helm_match:
                    general_info['outsideHelmPosition'] = self._clean_text(helm_match.group(1))
            
        except Exception as e:
            logger.error(f"Error extracting general info: {e}")
        
        return general_info
    
    def _extract_accommodation_enhanced(self, soup: BeautifulSoup, page_text: str) -> Dict[str, Any]:
        """Enhanced accommodation extraction with multiple patterns"""
        accommodation = {}
        
        try:
            # Cabins with multiple patterns
            cabins = self._extract_with_patterns(self.cabins_patterns, page_text)
            if cabins:
                accommodation['cabins'] = cabins
                logger.info(f"✅ Cabins: {cabins}")
            
            # Berths with multiple patterns
            berths = self._extract_with_patterns(self.berths_patterns, page_text)
            if berths:
                accommodation['berths'] = berths
                logger.info(f"✅ Berths: {berths}")
            
            # Interior with multiple materials
            interior_materials = ['teak', 'mahogany', 'oak', 'cherry', 'maple', 'walnut']
            for material in interior_materials:
                if material in page_text.lower():
                    accommodation['interior'] = material.title()
                    logger.info(f"✅ Interior: {material.title()}")
                    break
            
            # Layout with context
            if 'classic' in page_text.lower():
                accommodation['layout'] = 'Classic'
            elif 'modern' in page_text.lower():
                accommodation['layout'] = 'Modern'
            elif 'warm' in page_text.lower():
                accommodation['layout'] = 'Warm'
            
            # Floor with multiple patterns
            floor_patterns = [
                r'teak and holly',
                r'teak',
                r'mahogany',
                r'oak'
            ]
            
            for floor_type in floor_patterns:
                if floor_type in page_text.lower():
                    accommodation['floor'] = floor_type.title()
                    logger.info(f"✅ Floor: {floor_type.title()}")
                    break
            
            # Features with yes/no detection
            features = [
                'openCockpit', 'aftDeck', 'saloon', 'navigationCenter', 
                'chartTable', 'galley', 'microwave', 'fridge', 'freezer'
            ]
            
            for feature in features:
                feature_text = feature.replace('openCockpit', 'open cockpit').replace('aftDeck', 'aft deck').replace('navigationCenter', 'navigation center').replace('chartTable', 'chart table')
                if feature_text in page_text.lower():
                    accommodation[feature] = 'Yes'
                    logger.info(f"✅ {feature}: Yes")
            
            # Heating with specific types
            heating_patterns = [
                r'webasto[:\s]*([A-Za-z\s0-9]+)',  # webasto: HL32 diesel heater
                r'heating[:\s]*([A-Za-z\s0-9]+)',  # heating: diesel
            ]
            
            heating = self._extract_with_patterns(heating_patterns, page_text)
            if heating:
                accommodation['heating'] = heating
                logger.info(f"✅ Heating: {heating}")
            elif 'heating' in page_text.lower():
                accommodation['heating'] = 'Yes'
            
            # Headroom
            headroom_match = re.search(r'HEADROOM[:\s]*(\d+\.?\d*)\s*m', page_text, re.IGNORECASE)
            if headroom_match:
                accommodation['headroomM'] = headroom_match.group(1)
                logger.info(f"✅ Headroom: {headroom_match.group(1)} m")
            
            # Additional accommodation features
            additional_features = [
                'hotWaterSystem', 'waterPressureSystem', 'ownersCabin', 'bedLength', 'wardrobe',
                'bathroom', 'toilet', 'toiletSystem', 'washBasin', 'shower',
                'guestCabin1', 'bedLength1', 'wardrobe1', 'guestCabin2', 'bedLength2', 'wardrobe2',
                'bathroom2', 'toilet2', 'toiletSystem2', 'washBasin2', 'shower2', 'washingMachine'
            ]
            
            for feature in additional_features:
                feature_text = feature.replace('hotWaterSystem', 'hot water system').replace('waterPressureSystem', 'water pressure system').replace('ownersCabin', 'owners cabin').replace('bedLength', 'bed length').replace('wardrobe', 'wardrobe').replace('bathroom', 'bathroom').replace('toilet', 'toilet').replace('toiletSystem', 'toilet system').replace('washBasin', 'wash basin').replace('shower', 'shower').replace('guestCabin1', 'guest cabin').replace('bedLength1', 'bed length').replace('wardrobe1', 'wardrobe').replace('guestCabin2', 'guest cabin').replace('bedLength2', 'bed length').replace('wardrobe2', 'wardrobe').replace('bathroom2', 'bathroom').replace('toilet2', 'toilet').replace('toiletSystem2', 'toilet system').replace('washBasin2', 'wash basin').replace('shower2', 'shower').replace('washingMachine', 'washing machine')
                if feature_text in page_text.lower():
                    accommodation[feature] = 'Yes'
                    logger.info(f"✅ {feature}: Yes")
            
        except Exception as e:
            logger.error(f"Error extracting accommodation: {e}")
        
        return accommodation
    
    def _extract_machinery_enhanced(self, soup: BeautifulSoup, page_text: str) -> Dict[str, Any]:
        """Enhanced machinery extraction with multiple patterns"""
        machinery = {}
        
        try:
            # Engine count and type
            engine = self._extract_with_patterns(self.engine_patterns, page_text)
            if engine:
                parts = engine.split('x')
                if len(parts) == 2:
                    machinery['noOfEngines'] = parts[0].strip()
                    machinery['type'] = parts[1].strip()
                    logger.info(f"✅ Engine: {engine}")
            
            # Engine make
            make_patterns = [
                r'volvo penta',
                r'yanmar',
                r'perkins',
                r'cummins',
                r'man'
            ]
            
            for make in make_patterns:
                if make in page_text.lower():
                    machinery['make'] = make.title()
                    logger.info(f"✅ Engine make: {make.title()}")
                    break
            
            # Power with multiple patterns
            for pattern in self.power_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    value = match.group(1)
                    unit = match.group(2).lower()
                    if unit == 'hp':
                        machinery['hp'] = value
                        logger.info(f"✅ HP: {value}")
                    elif unit == 'kw':
                        machinery['kw'] = value
                        logger.info(f"✅ KW: {value}")
            
            # Fuel type
            fuel_patterns = ['diesel', 'petrol', 'gasoline', 'electric', 'hybrid']
            for fuel in fuel_patterns:
                if fuel in page_text.lower():
                    machinery['fuel'] = fuel.title()
                    logger.info(f"✅ Fuel: {fuel.title()}")
                    break
            
            # Year patterns
            year = self._extract_with_patterns(self.year_patterns, page_text)
            if year:
                machinery['yearInstalled'] = year
                logger.info(f"✅ Year installed: {year}")
            
            # Speed patterns
            speed_patterns = [
                r'(\d+\.?\d*)\s*kn',  # 9 kn
                r'MAXIMUM SPEED[:\s]*(\d+\.?\d*)\s*kn',  # MAXIMUM SPEED: 9 kn
                r'CRUISING SPEED[:\s]*(\d+\.?\d*)\s*kn',  # CRUISING SPEED: 7.5 kn
            ]
            
            for pattern in speed_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    speed = match.group(1)
                    if 'MAXIMUM' in pattern.upper():
                        machinery['maximumSpeedKn'] = speed
                        logger.info(f"✅ Max speed: {speed} kn")
                    elif 'CRUISING' in pattern.upper():
                        machinery['cruisingSpeedKn'] = speed
                        logger.info(f"✅ Cruising speed: {speed} kn")
                    else:
                        machinery['maximumSpeedKn'] = speed
                        logger.info(f"✅ Speed: {speed} kn")
                    break
            
            # Additional machinery features
            features = [
                'drive', 'shaftSeal', 'engineControls', 'gearbox', 'bowthruster',
                'manualBilgePump', 'electricBilgePump', 'generator', 'batteries',
                'solarPanel', 'shorepower', 'watermaker'
            ]
            
            for feature in features:
                feature_text = feature.replace('shaftSeal', 'shaft seal').replace('engineControls', 'engine controls').replace('bowthruster', 'bowthruster').replace('manualBilgePump', 'manual bilge pump').replace('electricBilgePump', 'electric bilge pump').replace('solarPanel', 'solar panel').replace('shorepower', 'shore power')
                if feature_text in page_text.lower():
                    machinery[feature] = 'Yes'
                    logger.info(f"✅ {feature}: Yes")
            
            # Additional machinery details
            if 'propeller type' in page_text.lower():
                prop_match = re.search(r'PROPELLER TYPE[:\s]*([A-Za-z\s]+?)(?=\s*Manual|\s*$)', page_text, re.IGNORECASE)
                if prop_match:
                    machinery['propellerType'] = self._clean_text(prop_match.group(1))
            
            if 'electrical installation' in page_text.lower():
                elec_match = re.search(r'ELECTRICAL INSTALLATION[:\s]*([A-Za-z\s0-9\-]+?)(?=\s*Generator|\s*$)', page_text, re.IGNORECASE)
                if elec_match:
                    machinery['electricalInstallation'] = self._clean_text(elec_match.group(1))
            
            if 'batteries' in page_text.lower():
                bat_match = re.search(r'BATTERIES[:\s]*([A-Za-z\s0-9x\-\s]+?)(?=\s*Start|\s*$)', page_text, re.IGNORECASE)
                if bat_match:
                    machinery['batteries'] = self._clean_text(bat_match.group(1))
            
            if 'start battery' in page_text.lower():
                start_bat_match = re.search(r'START BATTERY[:\s]*([A-Za-z\s0-9x\-\s]+?)(?=\s*Service|\s*$)', page_text, re.IGNORECASE)
                if start_bat_match:
                    machinery['startBattery'] = self._clean_text(start_bat_match.group(1))
            
            if 'service battery' in page_text.lower():
                service_bat_match = re.search(r'SERVICE BATTERY[:\s]*([A-Za-z\s0-9x\-\s]+?)(?=\s*Battery|\s*$)', page_text, re.IGNORECASE)
                if service_bat_match:
                    machinery['serviceBattery'] = self._clean_text(service_bat_match.group(1))
            
            if 'battery monitor' in page_text.lower():
                monitor_match = re.search(r'BATTERY MONITOR[:\s]*([A-Za-z\s0-9]+?)(?=\s*Battery|\s*$)', page_text, re.IGNORECASE)
                if monitor_match:
                    machinery['batteryMonitor'] = self._clean_text(monitor_match.group(1))
            
            if 'battery charger' in page_text.lower():
                charger_match = re.search(r'BATTERY CHARGER[:\s]*([A-Za-z\s0-9]+?)(?=\s*Solar|\s*$)', page_text, re.IGNORECASE)
                if charger_match:
                    machinery['batteryCharger'] = self._clean_text(charger_match.group(1))
            
            if 'shorepower' in page_text.lower():
                shore_match = re.search(r'SHOREPOWER[:\s]*([A-Za-z\s]+?)(?=\s*Watermaker|\s*$)', page_text, re.IGNORECASE)
                if shore_match:
                    machinery['shorepower'] = self._clean_text(shore_match.group(1))
            
        except Exception as e:
            logger.error(f"Error extracting machinery: {e}")
        
        return machinery
    
    def _extract_navigation_enhanced(self, soup: BeautifulSoup, page_text: str) -> Dict[str, Any]:
        """Enhanced navigation extraction with multiple patterns"""
        navigation = {}
        
        try:
            # Navigation equipment with yes/no detection
            equipment = [
                'compass', 'electricCompass', 'depthSounder', 'log', 'windset',
                'vhf', 'vhfHandheld', 'autopilot', 'radar', 'plotterGps',
                'electronicCharts', 'aisTransceiver', 'epirb', 'navigationLights'
            ]
            
            for item in equipment:
                item_text = item.replace('electricCompass', 'electric compass').replace('depthSounder', 'depth sounder').replace('vhfHandheld', 'vhf handheld').replace('plotterGps', 'plotter gps').replace('electronicCharts', 'electronic charts').replace('aisTransceiver', 'ais transceiver').replace('navigationLights', 'navigation lights')
                if item_text in page_text.lower():
                    navigation[item] = 'Yes'
                    logger.info(f"✅ {item}: Yes")
            
            # Specific brand/model extraction
            if 'b&g' in page_text.lower():
                navigation['brand'] = 'B&G'
                logger.info(f"✅ Navigation brand: B&G")
            
            if 'furuno' in page_text.lower():
                navigation['brand'] = 'Furuno'
                logger.info(f"✅ Navigation brand: Furuno")
            
        except Exception as e:
            logger.error(f"Error extracting navigation: {e}")
        
        return navigation
    
    def _extract_equipment_enhanced(self, soup: BeautifulSoup, page_text: str) -> Dict[str, Any]:
        """Enhanced equipment extraction with multiple patterns"""
        equipment = {}
        
        try:
            # Deck and safety equipment
            items = [
                'fixedWindscreen', 'cockpitTable', 'bathingPlatform', 'boardingLadder',
                'deckShower', 'anchor', 'anchorChain', 'windlass', 'deckWash',
                'dinghy', 'outboard', 'davits', 'seaRailing', 'pushpit', 'pulpit',
                'lifebuoy', 'radarReflector', 'fenders', 'mooringLines', 'radio',
                'fireExtinguisher'
            ]
            
            for item in items:
                item_text = item.replace('fixedWindscreen', 'fixed windscreen').replace('cockpitTable', 'cockpit table').replace('bathingPlatform', 'bathing platform').replace('boardingLadder', 'boarding ladder').replace('deckShower', 'deck shower').replace('anchorChain', 'anchor chain').replace('deckWash', 'deck wash').replace('seaRailing', 'sea railing').replace('mooringLines', 'mooring lines').replace('fireExtinguisher', 'fire extinguisher')
                if item_text in page_text.lower():
                    equipment[item] = 'Yes'
                    logger.info(f"✅ {item}: Yes")
            
            # Specific anchor details
            if 'anchor' in page_text.lower():
                anchor_patterns = [
                    r'(\d+)\s*kg\s*([A-Za-z]+)',  # 40 kg Rocna
                    r'([A-Za-z]+)\s*(\d+)\s*kg',  # Rocna 40 kg
                ]
                
                for pattern in anchor_patterns:
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        equipment['anchorDetails'] = f"{match.group(1)} {match.group(2)} kg"
                        logger.info(f"✅ Anchor details: {equipment['anchorDetails']}")
                        break
            
        except Exception as e:
            logger.error(f"Error extracting equipment: {e}")
        
        return equipment
    
    def _extract_rigging_enhanced(self, soup: BeautifulSoup, page_text: str) -> Dict[str, Any]:
        """Enhanced rigging extraction with multiple patterns"""
        rigging = {}
        
        try:
            # Rigging type
            if 'sloop' in page_text.lower():
                rigging['rigging'] = 'Sloop'
            elif 'cutter' in page_text.lower():
                rigging['rigging'] = 'Cutter'
            elif 'ketch' in page_text.lower():
                rigging['rigging'] = 'Ketch'
            
            # Standing rigging
            if 'standing rigging' in page_text.lower():
                rigging['standingRigging'] = 'Wire'
                logger.info(f"✅ Standing rigging: Wire")
            
            # Mast details
            mast_brands = ['seldén', 'selden', 'hall', 'z-spars']
            for brand in mast_brands:
                if brand in page_text.lower():
                    rigging['brandMast'] = brand.title()
                    logger.info(f"✅ Mast brand: {brand.title()}")
                    break
            
            if 'aluminium' in page_text.lower():
                rigging['materialMast'] = 'Aluminium'
            elif 'carbon' in page_text.lower():
                rigging['materialMast'] = 'Carbon'
            
            # Sails
            sails = ['mainsail', 'jib', 'genoa', 'gennaker', 'spinnaker']
            for sail in sails:
                if sail in page_text.lower():
                    rigging[sail] = 'Yes'
                    logger.info(f"✅ {sail}: Yes")
            
            # Winches with specific patterns
            winch_patterns = [
                r'(\d+x\s+[A-Za-z\s]+)\s*self\s*tailing',  # 2x Lewmar 43 self tailing
                r'([A-Za-z\s]+)\s*(\d+)\s*self\s*tailing',  # Lewmar 43 self tailing
            ]
            
            for pattern in winch_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    if 'primary' in page_text.lower():
                        rigging['primarySheetWinch'] = match.group(0)
                    elif 'secondary' in page_text.lower():
                        rigging['secondarySheetWinch'] = match.group(0)
                    elif 'genoa' in page_text.lower():
                        rigging['genoaSheetwinches'] = match.group(0)
                    elif 'halyard' in page_text.lower():
                        rigging['halyardWinches'] = match.group(0)
                    else:
                        rigging['multifunctionalWinches'] = match.group(0)
                    logger.info(f"✅ Winch: {match.group(0)}")
                    break
            
        except Exception as e:
            logger.error(f"Error extracting rigging: {e}")
        
        return rigging
    
    def _extract_indication_ratios_enhanced(self, soup: BeautifulSoup, page_text: str) -> Dict[str, Any]:
        """Enhanced indication ratios extraction with multiple patterns"""
        ratios = {}
        
        try:
            # More flexible SA/Displ ratio patterns
            sa_displ_patterns = [
                r'S\.A\.\s*/\s*Displ\.\s*:\s*(\d+\.?\d*)',  # S.A. / Displ.: 16.59
                r'SA\s*/\s*Displ\s*:\s*(\d+\.?\d*)',  # SA / Displ: 16.59
                r'(\d+\.?\d*)\s*SA/Displ',  # 16.59 SA/Displ
                r'SA/Displ[:\s]*(\d+\.?\d*)',  # SA/Displ: 16.59
                r'(\d+\.?\d*)\s*SA/Displ',  # 16.59 SA/Displ
            ]
            
            sa_displ = self._extract_with_patterns(sa_displ_patterns, page_text)
            if sa_displ:
                ratios['saDispl'] = sa_displ
                logger.info(f"✅ SA/Displ: {sa_displ}")
            
            # More flexible Bal/Displ ratio patterns
            bal_displ_patterns = [
                r'Bal\.\s*/\s*Displ\.\s*:\s*(\d+\.?\d*)',  # Bal. / Displ.: 33.90
                r'Bal\s*/\s*Displ\s*:\s*(\d+\.?\d*)',  # Bal / Displ: 33.90
                r'(\d+\.?\d*)\s*Bal/Displ',  # 33.90 Bal/Displ
                r'Bal/Displ[:\s]*(\d+\.?\d*)',  # Bal/Displ: 33.90
                r'(\d+\.?\d*)\s*Bal/Displ',  # 33.90 Bal/Displ
            ]
            
            bal_displ = self._extract_with_patterns(bal_displ_patterns, page_text)
            if bal_displ:
                ratios['balDispl'] = bal_displ
                logger.info(f"✅ Bal/Displ: {bal_displ}")
            
            # More flexible Disp/Len ratio patterns
            disp_len_patterns = [
                r'Disp\s*:\s*/\s*Len\s*:\s*(\d+\.?\d*)',  # Disp: / Len: 201.36
                r'Disp\s*/\s*Len\s*:\s*(\d+\.?\d*)',  # Disp / Len: 201.36
                r'(\d+\.?\d*)\s*Disp/Len',  # 201.36 Disp/Len
                r'Disp/Len[:\s]*(\d+\.?\d*)',  # Disp/Len: 201.36
                r'(\d+\.?\d*)\s*Disp/Len',  # 201.36 Disp/Len
            ]
            
            disp_len = self._extract_with_patterns(disp_len_patterns, page_text)
            if disp_len:
                ratios['dispLen'] = disp_len
                logger.info(f"✅ Disp/Len: {disp_len}")
            
            # More flexible Comfort Ratio patterns
            comfort_patterns = [
                r'Comfort\s*Ratio[:\s]*(\d+\.?\d*)',  # Comfort Ratio: 35.33
                r'(\d+\.?\d*)\s*Comfort\s*Ratio',  # 35.33 Comfort Ratio
                r'Comfort[:\s]*(\d+\.?\d*)',  # Comfort: 35.33
                r'(\d+\.?\d*)\s*Comfort',  # 35.33 Comfort
            ]
            
            comfort = self._extract_with_patterns(comfort_patterns, page_text)
            if comfort:
                ratios['comfortRatio'] = comfort
                logger.info(f"✅ Comfort Ratio: {comfort}")
            
            # More flexible Capsize Screening Formula patterns
            capsize_patterns = [
                r'Capsize\s*Screening\s*Formula[:\s]*(\d+\.?\d*)',  # Capsize Screening Formula: 1.81
                r'(\d+\.?\d*)\s*Capsize',  # 1.81 Capsize
                r'Capsize[:\s]*(\d+\.?\d*)',  # Capsize: 1.81
                r'(\d+\.?\d*)\s*Capsize',  # 1.81 Capsize
            ]
            
            capsize = self._extract_with_patterns(capsize_patterns, page_text)
            if capsize:
                ratios['capsizeScreeningFormula'] = capsize
                logger.info(f"✅ Capsize: {capsize}")
            
            # More flexible Hull Speed patterns
            hull_speed_patterns = [
                r'Hull\s*Speed[:\s]*(\d+\.?\d*)\s*kn',  # Hull Speed: 9.10 kn
                r'(\d+\.?\d*)\s*kn\s*Hull\s*Speed',  # 9.10 kn Hull Speed
                r'Hull\s*Speed[:\s]*(\d+\.?\d*)',  # Hull Speed: 9.10
                r'(\d+\.?\d*)\s*Hull\s*Speed',  # 9.10 Hull Speed
            ]
            
            hull_speed = self._extract_with_patterns(hull_speed_patterns, page_text)
            if hull_speed:
                ratios['hullSpeed'] = f"{hull_speed} kn"
                logger.info(f"✅ Hull Speed: {hull_speed} kn")
            
            # Additional ratios that might be present
            # S# (S-number)
            s_number_patterns = [
                r'S#[:\s]*(\d+\.?\d*)',  # S#: 2.64
                r'(\d+\.?\d*)\s*S#',  # 2.64 S#
                r'S-number[:\s]*(\d+\.?\d*)',  # S-number: 2.64
            ]
            
            s_number = self._extract_with_patterns(s_number_patterns, page_text)
            if s_number:
                ratios['sNumber'] = s_number
                logger.info(f"✅ S#: {s_number}")
            
            # Pounds/Inch Immersion
            pounds_patterns = [
                r'Pounds/Inch\s*Immersion[:\s]*([\d,]+\.?\d*)',  # Pounds/Inch Immersion: 2,621.21
                r'([\d,]+\.?\d*)\s*Pounds/Inch',  # 2,621.21 Pounds/Inch
                r'Pounds/inch[:\s]*([\d,]+\.?\d*)',  # Pounds/inch: 2,621.21
            ]
            
            pounds = self._extract_with_patterns(pounds_patterns, page_text)
            if pounds:
                ratios['poundsPerInchImmersion'] = pounds
                logger.info(f"✅ Pounds/Inch: {pounds}")
            
        except Exception as e:
            logger.error(f"Error extracting indication ratios: {e}")
        
        return ratios
    
    def _create_error_response(self, error_message: str) -> Dict[str, Any]:
        """Create a standardized error response"""
        return {
            'source': 'devalk_enhanced',
            'parser_version': '3.0.0',
            'error': error_message,
            'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'data': {}
        }
