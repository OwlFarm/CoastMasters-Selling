import requests
import re
import logging
from bs4 import BeautifulSoup
from typing import Dict, Any, Optional
import math

class SuperEnhancedDeValkParser:
    """
    Super Enhanced De Valk Parser v4.0.0
    Target: 100% completion on 3-URL foundation
    Strategy: Multi-pattern extraction + context-aware parsing
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        # Pre-compile all regex patterns for performance
        self._compile_patterns()
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def _compile_patterns(self):
        """Pre-compile all regex patterns for maximum performance"""
        # Key Details patterns with enhanced dimension extraction
        self.patterns_key_details = {
            'askingPrice': re.compile(r'asking\s*price.*?€\s*([\d,\.]+)', re.IGNORECASE),
            'engines': re.compile(r'engine.*?(\d+x\s*[A-Za-z\s]+)', re.IGNORECASE),
            'kw': re.compile(r'(\d+(?:,\d+)?)\s*kw', re.IGNORECASE),
            'hp': re.compile(r'(\d+(?:,\d+)?)\s*hp', re.IGNORECASE),
            'loaM': re.compile(r'loa.*?(\d+(?:,\d+)?)\s*m', re.IGNORECASE),
            'lying': re.compile(r'lying.*?(at\s+sales\s+office)', re.IGNORECASE),
            'material': re.compile(r'material.*?(GRP|steel|aluminium|wood)', re.IGNORECASE),
            'salesOffice': re.compile(r'sales\s+office.*?(De\s+Valk\s+[A-Za-z\s]+)', re.IGNORECASE),
            'status': re.compile(r'status.*?(For\s+Sale|Sold|Under\s+Offer)', re.IGNORECASE),
            'vat': re.compile(r'vat.*?(Paid|Not\s+Paid|Included)', re.IGNORECASE),
            'yearBuilt': re.compile(r'built.*?(\d{4})', re.IGNORECASE),
            # Keep some fallback patterns
            'loaM_alt': re.compile(r'length.*?(\d+(?:,\d+)?)\s*m', re.IGNORECASE),
            'beamM_alt': re.compile(r'width.*?(\d+(?:,\d+)?)\s*m', re.IGNORECASE),
            'draftM_alt': re.compile(r'draught.*?(\d+(?:,\d+)?)\s*m', re.IGNORECASE),
        }
        
        # General Info patterns with multi-pattern fallbacks
        self.patterns_general_info = {
            'model': re.compile(r'model.*?([A-Z\s]+(?:\d+)?)', re.IGNORECASE),
            'yachtType': re.compile(r'type.*?(monohull\s+sailing\s+yacht|sailing\s+yacht|motor\s+yacht)', re.IGNORECASE),
            'lwlM': re.compile(r'lwl.*?(\d+(?:,\d+)?)\s*m', re.IGNORECASE),
            'airDraftM': re.compile(r'air\s*draft.*?(\d+(?:,\d+)?)\s*m', re.IGNORECASE),
            'headroomM': re.compile(r'headroom.*?(\d+(?:,\d+)?)\s*m', re.IGNORECASE),
            'builder': re.compile(r'builder.*?([A-Za-z\s]+(?:\s+AB)?)', re.IGNORECASE),
            'country': re.compile(r'country.*?([A-Za-z\s]+)', re.IGNORECASE),
            'designer': re.compile(r'designer.*?([A-Za-z\s]+)', re.IGNORECASE),
            'displacementT': re.compile(r'displacement.*?(\d+(?:,\d+)?)\s*t', re.IGNORECASE),
            'ballastTonnes': re.compile(r'ballast.*?(\d+(?:,\d+)?)\s*tonnes?', re.IGNORECASE),
            'hullMaterial': re.compile(r'hull\s*material.*?(GRP|steel|aluminium|wood)', re.IGNORECASE),
            'hullColour': re.compile(r'hull\s*colour.*?([a-z\s]+)', re.IGNORECASE),
            'hullShape': re.compile(r'hull\s*shape.*?([a-z\s\-]+)', re.IGNORECASE),
            'keelType': re.compile(r'keel\s*type.*?([a-z\s]+)', re.IGNORECASE),
            'superstructureMaterial': re.compile(r'superstructure\s*material.*?(GRP|steel|aluminium)', re.IGNORECASE),
            'deckMaterial': re.compile(r'deck\s*material.*?(GRP|teak|steel)', re.IGNORECASE),
            'deckFinish': re.compile(r'deck\s*finish.*?(teak|antifouling|paint)', re.IGNORECASE),
            'superstructureDeckFinish': re.compile(r'superstructure\s*deck\s*finish.*?(teak|antifouling)', re.IGNORECASE),
            'cockpitDeckFinish': re.compile(r'cockpit\s*deck\s*finish.*?(teak|antifouling)', re.IGNORECASE),
            'dorades': re.compile(r'dorades.*?(\d+x\s*[A-Za-z]+)', re.IGNORECASE),
            'windowFrame': re.compile(r'window\s*frame.*?([a-z\s]+)', re.IGNORECASE),
            'windowMaterial': re.compile(r'window\s*material.*?([a-z\s]+)', re.IGNORECASE),
            'deckhatch': re.compile(r'deckhatch.*?(\d+x\s*[A-Za-z]+)', re.IGNORECASE),
            'fuelTankLitre': re.compile(r'fuel\s*tank.*?(\d+)\s*ltr?', re.IGNORECASE),
            'levelIndicatorFuelTank': re.compile(r'level\s*indicator.*?fuel\s*tank.*?([A-Za-z\s]+)', re.IGNORECASE),
            'freshwaterTankLitre': re.compile(r'freshwater\s*tank.*?(\d+)\s*ltr?', re.IGNORECASE),
            'levelIndicatorFreshwater': re.compile(r'level\s*indicator.*?freshwater.*?([a-z\s]+)', re.IGNORECASE),
            'wheelSteering': re.compile(r'wheel\s*steering.*?([a-z\s]+)', re.IGNORECASE),
            'outsideHelmPosition': re.compile(r'outside\s*helm\s*position.*?([a-z\s]+)', re.IGNORECASE),
            # MOVED: Dimension patterns to generalInfo where they actually appear
            'loaM_specs': re.compile(r'<li><strong>LOA\s*\(m\)</strong>\s*([\d,\.]+)</li>', re.IGNORECASE),
            'beamM_specs': re.compile(r'<li><strong>Beam\s*\(m\)</strong>\s*([\d,\.]+)</li>', re.IGNORECASE),
            'draftM_specs': re.compile(r'<li><strong>Draft\s*\(m\)</strong>\s*([\d,\.]+)</li>', re.IGNORECASE),
        }
        
        # Accommodation patterns for specific values
        self.patterns_accommodation = {
            'cabins': re.compile(r'cabins.*?(\d+)', re.IGNORECASE),
            'berths': re.compile(r'berths.*?(\d+)', re.IGNORECASE),
            'interior': re.compile(r'interior.*?(teak|mahogany|oak|white)', re.IGNORECASE),
            'layout': re.compile(r'layout.*?(classic|warm|modern|traditional)', re.IGNORECASE),
            'floor': re.compile(r'floor.*?(teak\s+and\s+holly|teak|wood)', re.IGNORECASE),
            'openCockpit': re.compile(r'open\s*cockpit.*?(yes|no)', re.IGNORECASE),
            'aftDeck': re.compile(r'aft\s*deck.*?(yes|no)', re.IGNORECASE),
            'saloon': re.compile(r'saloon.*?(yes|no)', re.IGNORECASE),
            'headroomSalonM': re.compile(r'headroom\s*salon.*?(\d+(?:,\d+)?)\s*m', re.IGNORECASE),
            'heating': re.compile(r'heating.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'navigationCenter': re.compile(r'navigation\s*center.*?(yes|no)', re.IGNORECASE),
            'chartTable': re.compile(r'chart\s*table.*?(yes|no)', re.IGNORECASE),
            'galley': re.compile(r'galley.*?(yes|no)', re.IGNORECASE),
            'countertop': re.compile(r'countertop.*?([a-z\s]+)', re.IGNORECASE),
            'sink': re.compile(r'sink.*?([a-z\s]+)', re.IGNORECASE),
            'cooker': re.compile(r'cooker.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'oven': re.compile(r'oven.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'microwave': re.compile(r'microwave.*?([A-Za-z\s]+)', re.IGNORECASE),
            'fridge': re.compile(r'fridge.*?([A-Za-z\s]+)', re.IGNORECASE),
            'freezer': re.compile(r'freezer.*?([A-Za-z\s]+)', re.IGNORECASE),
            'hotWaterSystem': re.compile(r'hot\s*water\s*system.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'waterPressureSystem': re.compile(r'water\s*pressure\s*system.*?([a-z\s]+)', re.IGNORECASE),
            'ownersCabin': re.compile(r'owners\s*cabin.*?([a-z\s]+)', re.IGNORECASE),
            'bedLength': re.compile(r'bed\s*length.*?(\d+(?:,\d+)?x\d+(?:,\d+)?)', re.IGNORECASE),
            'wardrobe': re.compile(r'wardrobe.*?([a-z\s]+)', re.IGNORECASE),
            'bathroom': re.compile(r'bathroom.*?([a-z\s]+)', re.IGNORECASE),
            'toilet': re.compile(r'toilet.*?([a-z\s]+)', re.IGNORECASE),
            'toiletSystem': re.compile(r'toilet\s*system.*?([A-Za-z\s]+)', re.IGNORECASE),
            'washBasin': re.compile(r'wash\s*basin.*?([a-z\s]+)', re.IGNORECASE),
            'shower': re.compile(r'shower.*?([a-z\s]+)', re.IGNORECASE),
            'guestCabin1': re.compile(r'guest\s*cabin\s*1.*?([a-z\s]+)', re.IGNORECASE),
            'bedLength1': re.compile(r'bed\s*length.*?1.*?(\d+(?:,\d+)?x\d+(?:,\d+)?)', re.IGNORECASE),
            'wardrobe1': re.compile(r'wardrobe.*?1.*?([a-z\s]+)', re.IGNORECASE),
            'guestCabin2': re.compile(r'guest\s*cabin\s*2.*?([a-z\s]+)', re.IGNORECASE),
            'bedLength2': re.compile(r'bed\s*length.*?2.*?(\d+(?:,\d+)?x\d+(?:,\d+)?)', re.IGNORECASE),
            'wardrobe2': re.compile(r'wardrobe.*?2.*?([a-z\s]+)', re.IGNORECASE),
            'bathroom2': re.compile(r'bathroom.*?2.*?([a-z\s]+)', re.IGNORECASE),
            'toilet2': re.compile(r'toilet.*?2.*?([a-z\s]+)', re.IGNORECASE),
            'toiletSystem2': re.compile(r'toilet\s*system.*?2.*?([A-Za-z\s]+)', re.IGNORECASE),
            'washBasin2': re.compile(r'wash\s*basin.*?2.*?([a-z\s]+)', re.IGNORECASE),
            'shower2': re.compile(r'shower.*?2.*?([a-z\s]+)', re.IGNORECASE),
            'washingMachine': re.compile(r'washing\s*machine.*?([A-Za-z\s]+)', re.IGNORECASE),
        }
        
        # Machinery patterns for specific values
        self.patterns_machinery = {
            'noOfEngines': re.compile(r'no\s*of\s*engines.*?(\d+)', re.IGNORECASE),
            'make': re.compile(r'make.*?([A-Za-z\s]+)', re.IGNORECASE),
            'type': re.compile(r'type.*?([A-Za-z\s]+)', re.IGNORECASE),
            'hp': re.compile(r'hp.*?(\d+(?:,\d+)?)', re.IGNORECASE),
            'kw': re.compile(r'kw.*?(\d+(?:,\d+)?)', re.IGNORECASE),
            'fuel': re.compile(r'fuel.*?(diesel|petrol|electric)', re.IGNORECASE),
            'yearInstalled': re.compile(r'year\s*installed.*?(\d{4})', re.IGNORECASE),
            'yearOfOverhaul': re.compile(r'year\s*of\s*overhaul.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'maximumSpeedKn': re.compile(r'maximum\s*speed.*?(\d+(?:,\d+)?)\s*kn', re.IGNORECASE),
            'cruisingSpeedKn': re.compile(r'cruising\s*speed.*?(\d+(?:,\d+)?)\s*kn', re.IGNORECASE),
            'consumptionLhr': re.compile(r'consumption.*?(\d+(?:,\d+)?)\s*l/hr', re.IGNORECASE),
            'engineCoolingSystem': re.compile(r'engine\s*cooling\s*system.*?([a-z\s]+)', re.IGNORECASE),
            'drive': re.compile(r'drive.*?([a-z\s]+)', re.IGNORECASE),
            'shaftSeal': re.compile(r'shaft\s*seal.*?(yes|no)', re.IGNORECASE),
            'engineControls': re.compile(r'engine\s*controls.*?([a-z\s]+)', re.IGNORECASE),
            'gearbox': re.compile(r'gearbox.*?([a-z\s]+)', re.IGNORECASE),
            'bowthruster': re.compile(r'bowthruster.*?([a-z\s]+)', re.IGNORECASE),
            'propellerType': re.compile(r'propeller\s*type.*?([a-z\s]+)', re.IGNORECASE),
            'manualBilgePump': re.compile(r'manual\s*bilge\s*pump.*?(yes|no)', re.IGNORECASE),
            'electricBilgePump': re.compile(r'electric\s*bilge\s*pump.*?(yes|no)', re.IGNORECASE),
            'electricalInstallation': re.compile(r'electrical\s*installation.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'generator': re.compile(r'generator.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'batteries': re.compile(r'batteries.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'startBattery': re.compile(r'start\s*battery.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'serviceBattery': re.compile(r'service\s*battery.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'batteryMonitor': re.compile(r'battery\s*monitor.*?([A-Za-z\s]+)', re.IGNORECASE),
            'batteryCharger': re.compile(r'battery\s*charger.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'solarPanel': re.compile(r'solar\s*panel.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'shorepower': re.compile(r'shorepower.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'watermaker': re.compile(r'watermaker.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'extraInfo': re.compile(r'extra\s*info.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
        }
        
        # Indication Ratios patterns - these are critical for 100% completion
        self.patterns_indication_ratios = {
            'saDispl': re.compile(r's\.?a\.?\s*/\s*displ\.?\s*:?\s*(\d+(?:,\d+)?)', re.IGNORECASE),
            'balDispl': re.compile(r'bal\.?\s*/\s*displ\.?\s*:?\s*(\d+(?:,\d+)?)', re.IGNORECASE),
            'dispLen': re.compile(r'disp\s*:\s*/\s*len\s*:?\s*(\d+(?:,\d+)?)', re.IGNORECASE),
            'comfortRatio': re.compile(r'comfort\s*ratio\s*:?\s*(\d+(?:,\d+)?)', re.IGNORECASE),
            'capsizeScreeningFormula': re.compile(r'capsize\s*screening\s*formula\s*:?\s*(\d+(?:,\d+)?)', re.IGNORECASE),
            'sNumber': re.compile(r's\s*#\s*:?\s*(\d+(?:,\d+)?)', re.IGNORECASE),
            'hullSpeed': re.compile(r'hull\s*speed\s*:?\s*(\d+(?:,\d+)?)\s*kn', re.IGNORECASE),
            'poundsPerInchImmersion': re.compile(r'pounds\s*/\s*inch\s*immersion\s*:?\s*([\d,\.]+)', re.IGNORECASE),
            # Enhanced patterns for better capture
            'saDisplAlt': re.compile(r'sail\s*area.*?displacement.*?(\d+(?:,\d+)?)', re.IGNORECASE),
            'balDisplAlt': re.compile(r'ballast.*?displacement.*?(\d+(?:,\d+)?)', re.IGNORECASE),
            'dispLenAlt': re.compile(r'displacement.*?length.*?(\d+(?:,\d+)?)', re.IGNORECASE),
        }
        
        # Navigation patterns for specific values
        self.patterns_navigation = {
            'compass': re.compile(r'compass.*?(yes|no)', re.IGNORECASE),
            'electricCompass': re.compile(r'electric\s*compass.*?(yes|no)', re.IGNORECASE),
            'depthSounder': re.compile(r'depth\s*sounder.*?([A-Za-z\s]+)', re.IGNORECASE),
            'log': re.compile(r'log.*?([A-Za-z\s]+)', re.IGNORECASE),
            'windset': re.compile(r'windset.*?([A-Za-z\s]+)', re.IGNORECASE),
            'vhf': re.compile(r'vhf.*?([A-Za-z\s]+)', re.IGNORECASE),
            'autopilot': re.compile(r'autopilot.*?([A-Za-z\s]+)', re.IGNORECASE),
            'radar': re.compile(r'radar.*?([A-Za-z\s]+)', re.IGNORECASE),
            'gps': re.compile(r'gps.*?([A-Za-z\s]+)', re.IGNORECASE),
            'plotter': re.compile(r'plotter.*?([A-Za-z\s]+)', re.IGNORECASE),
            'navtex': re.compile(r'navtex.*?([A-Za-z\s]+)', re.IGNORECASE),
            'aisTransceiver': re.compile(r'ais\s*transceiver.*?(yes|no)', re.IGNORECASE),
            'navigationLights': re.compile(r'navigation\s*lights.*?(yes|no)', re.IGNORECASE),
            'epirb': re.compile(r'epirb.*?(yes|no)', re.IGNORECASE),
            'extraInfo': re.compile(r'extra\s*info.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
        }
        
        # Equipment patterns for specific values
        self.patterns_equipment = {
            'fixedWindscreen': re.compile(r'fixed\s*windscreen.*?(yes|no)', re.IGNORECASE),
            'cockpitTable': re.compile(r'cockpit\s*table.*?(yes|no)', re.IGNORECASE),
            'bathingPlatform': re.compile(r'bathing\s*platform.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'boardingLadder': re.compile(r'boarding\s*ladder.*?(yes|no)', re.IGNORECASE),
            'deckShower': re.compile(r'deck\s*shower.*?(yes|no)', re.IGNORECASE),
            'anchor': re.compile(r'anchor.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'anchorChain': re.compile(r'anchor\s*chain.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'anchor2': re.compile(r'anchor\s*2.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'windlass': re.compile(r'windlass.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'deckWash': re.compile(r'deck\s*wash.*?(yes|no)', re.IGNORECASE),
            'dinghy': re.compile(r'dinghy.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'outboard': re.compile(r'outboard.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'davits': re.compile(r'davits.*?(yes|no)', re.IGNORECASE),
            'seaRailing': re.compile(r'sea\s*railing.*?([a-z\s]+)', re.IGNORECASE),
            'pushpit': re.compile(r'pushpit.*?(yes|no)', re.IGNORECASE),
            'pulpit': re.compile(r'pulpit.*?(yes|no)', re.IGNORECASE),
            'lifebuoy': re.compile(r'lifebuoy.*?(yes|no)', re.IGNORECASE),
            'radarReflector': re.compile(r'radar\s*reflector.*?(yes|no)', re.IGNORECASE),
            'fenders': re.compile(r'fenders.*?(yes|no)', re.IGNORECASE),
            'mooringLines': re.compile(r'mooring\s*lines.*?(yes|no)', re.IGNORECASE),
            'radio': re.compile(r'radio.*?([A-Za-z\s]+)', re.IGNORECASE),
            'cockpitSpeakers': re.compile(r'cockpit\s*speakers.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'speakersInSalon': re.compile(r'speakers\s*in\s*salon.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'fireExtinguisher': re.compile(r'fire\s*extinguisher.*?(yes|no)', re.IGNORECASE),
        }
        
        # Rigging patterns for specific values
        self.patterns_rigging = {
            'rigging': re.compile(r'rigging.*?([A-Za-z\s]+)', re.IGNORECASE),
            'standingRigging': re.compile(r'standing\s*rigging.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'brandMast': re.compile(r'brand\s*mast.*?([A-Za-z\s]+)', re.IGNORECASE),
            'materialMast': re.compile(r'material\s*mast.*?([a-z\s]+)', re.IGNORECASE),
            'spreaders': re.compile(r'spreaders.*?(\d+\s*sets?)', re.IGNORECASE),
            'mainsail': re.compile(r'mainsail.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'stowayMast': re.compile(r'stoway\s*mast.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'cutterstay': re.compile(r'cutterstay.*?(yes|no)', re.IGNORECASE),
            'jib': re.compile(r'jib.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'genoa': re.compile(r'genoa.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'genoaFurler': re.compile(r'genoa\s*furler.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'cutterFurler': re.compile(r'cutter\s*furler.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'gennaker': re.compile(r'gennaker.*?(yes|no)', re.IGNORECASE),
            'spinnaker': re.compile(r'spinnaker.*?(yes|no)', re.IGNORECASE),
            'reefingSystem': re.compile(r'reefing\s*system.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'backstayAdjuster': re.compile(r'backstay\s*adjuster.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'primarySheetWinch': re.compile(r'primary\s*sheet\s*winch.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'secondarySheetWinch': re.compile(r'secondary\s*sheet\s*winch.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'genoaSheetwinches': re.compile(r'genoa\s*sheetwinches.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'halyardWinches': re.compile(r'halyard\s*winches.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'multifunctionalWinches': re.compile(r'multifunctional\s*winches.*?([^.]*?)(?=\n|\.|$)', re.IGNORECASE),
            'spiPole': re.compile(r'spi-pole.*?([a-z\s]+)', re.IGNORECASE),
        }
    
    def _clean_text(self, text: str) -> str:
        """Balanced text cleaning - preserve fields while maintaining quality"""
        if not text:
            return ""
        
        # Remove newlines and extra spaces
        text = text.replace('\n', ' ').replace('\r', ' ')
        text = re.sub(r'\s+', ' ', text)
        
        # LESS AGGRESSIVE pattern removal - only remove obvious duplicates
        # Don't remove fields that might contain valid information
        obvious_duplicates = [
            r'Country\s+[A-Za-z\s]+(?=\s+Designer)',  # Only if followed by Designer
            r'Designer\s+[A-Za-z\s]+(?=\s+Type)',      # Only if followed by Type
            r'Type\s+[a-z\s]+(?=\s+LOA)',              # Only if followed by LOA
        ]
        
        for pattern in obvious_duplicates:
            text = re.sub(pattern, '', text)
        
        return text.strip()
    
    def _extract_with_patterns(self, text: str, patterns: Dict[str, re.Pattern]) -> Dict[str, str]:
        """Extract data using multiple patterns with balanced precision boundaries"""
        results = {}
        
        for field_name, pattern in patterns.items():
            match = pattern.search(text)
            if match:
                value = match.group(1).strip()
                # Apply balanced precision cleaning
                cleaned_value = self._clean_text_precision(value, field_name)
                # Be less strict about value length - allow longer values for complex fields
                if cleaned_value and len(cleaned_value) < 200:  # Increased from 100 to 200
                    results[field_name] = cleaned_value
        
        return results
    
    def _clean_text_precision(self, text: str, field_name: str) -> str:
        """Balanced precision text cleaning - maintain quality without losing fields"""
        if not text:
            return ""
        
        # Remove newlines and normalize spaces
        text = text.replace('\n', ' ').replace('\r', ' ')
        text = re.sub(r'\s+', ' ', text)
        
        # LESS AGGRESSIVE cleaning - only remove obvious concatenation
        if field_name in ['bathroom', 'toilet', 'ownersCabin']:
            # Only stop at obvious field boundaries, not every period
            if 'Country' in text or 'Designer' in text:
                text = re.split(r'\s+(?:Country|Designer)', text)[0].strip()
        
        if field_name in ['make', 'type']:
            # Only stop at obvious field boundaries
            if 'Year' in text or 'Fuel' in text:
                text = re.split(r'\s+(?:Year|Fuel)', text)[0].strip()
        
        # Critical field cleaning - but less aggressive
        if field_name == 'builder':
            # Only stop at obvious boundaries
            if 'Country' in text:
                text = re.split(r'\s+Country\s+', text)[0].strip()
        
        if field_name == 'country':
            # Only stop at obvious boundaries
            if 'Designer' in text:
                text = re.split(r'\s+Designer\s+', text)[0].strip()
        
        # REMOVE ONLY the most obvious concatenation patterns
        # Don't remove everything that looks like it might be concatenated
        obvious_concat_patterns = [
            r'Toilet\s+[A-Za-z\s]+(?=\s+Country|\s+Designer)',  # Only if followed by field boundary
            r'Wash\s+basin\s+[A-Za-z\s]+(?=\s+Country|\s+Designer)',
            r'Shower\s+[A-Za-z\s]+(?=\s+Country|\s+Designer)',
        ]
        
        for pattern in obvious_concat_patterns:
            text = re.sub(pattern, '', text)
        
        return text.strip()
    
    def _detect_page_layout(self, soup: BeautifulSoup) -> str:
        """Detect if page uses traditional layout or Bootstrap accordion layout"""
        # Look for Bootstrap accordion structure
        accordion_elements = soup.find_all('div', class_='accordion-item')
        if accordion_elements:
            self.logger.info("🎯 Detected Bootstrap accordion layout")
            return 'accordion'
        
        # Look for traditional section headers
        section_headers = soup.find_all(['h2', 'h3'], string=re.compile(r'(Accommodation|Machinery|Navigation|Equipment|Rigging)', re.IGNORECASE))
        if section_headers:
            self.logger.info("🎯 Detected traditional layout")
            return 'traditional'
        
        # Default to traditional if unsure
        self.logger.info("🎯 Defaulting to traditional layout")
        return 'traditional'

    def _extract_section_text_dual_layout(self, soup: BeautifulSoup, section_name: str, layout_type: str) -> str:
        """Extract text from a specific section using dual-layout strategy"""
        if layout_type == 'accordion':
            return self._extract_section_text_accordion(soup, section_name)
        else:
            return self._extract_section_text_traditional(soup, section_name)

    def _extract_section_text_accordion(self, soup: BeautifulSoup, section_name: str) -> str:
        """Extract text from Bootstrap accordion layout"""
        section_text = ""
        
        # Find accordion items
        accordion_items = soup.find_all('div', class_='accordion-item')
        
        for item in accordion_items:
            # Look for section button
            button = item.find('button', class_='accordion-button')
            if button and section_name.lower() in button.get_text().lower():
                # Find the accordion body
                accordion_body = item.find('div', class_='accordion-body')
                if accordion_body:
                    # Extract all text from the accordion body
                    section_text = accordion_body.get_text()
                    self.logger.info(f"✅ Extracted {section_name} from accordion: {len(section_text)} chars")
                    break
        
        return section_text

    def _extract_section_text_traditional(self, soup: BeautifulSoup, section_name: str) -> str:
        """Extract text from traditional layout (existing method)"""
        section_text = ""
        
        # Strategy 1: Look for section headers
        section_headers = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b'])
        for header in section_headers:
            if section_name.lower() in header.get_text().lower():
                # Get all text until next header or end
                current = header
                while current and current.name not in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                    section_text += current.get_text() + " "
                    current = current.next_sibling
                break
        
        # Strategy 2: Look for specific text patterns
        if not section_text:
            text_content = soup.get_text()
            # Find section boundaries
            section_pattern = re.compile(f'{section_name}.*?(?=\n[A-Z]|$)', re.IGNORECASE | re.DOTALL)
            match = section_pattern.search(text_content)
            if match:
                section_text = match.group(0)
        
        return section_text

    def parse_yacht_listing(self, url: str) -> Dict[str, Any]:
        """Parse a De Valk yacht listing with UNIFIED structure for 100% completion"""
        try:
            self.logger.info(f"🚀 Starting ULTIMATE De Valk parser for: {url}")
            
            # Fetch the page with retry logic
            response = self._fetch_page_with_retry(url)
            if not response:
                return {'error': 'Failed to fetch page after multiple attempts'}
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Use the UNIFIED parsing approach for 100% completion
            all_data = self._extract_all_sections_unified(soup)
            
            # Calculate total fields for completion tracking
            total_fields = sum(len(section) for section in all_data.values())
            
            result = {
                'data': all_data,
                'parser_version': '5.0.0 - ULTIMATE UNIFIED',
                'scraped_at': response.headers.get('date', ''),
                'source': 'devalk_ultimate_unified_100_percent',
                'url': url,
                'completion_stats': {
                    'total_fields': total_fields,
                    'tableBox_fields': len(all_data['tableBox']),
                    'modeBox_fields': len(all_data['modeBox']),
                    'accommodation_fields': len(all_data['accommodation']),
                    'machinery_fields': len(all_data['machinery']),
                    'navigation_fields': len(all_data['navigation']),
                    'equipment_fields': len(all_data['equipment']),
                    'rigging_fields': len(all_data['rigging']),
                    'indicationRatios_fields': len(all_data['indicationRatios'])
                }
            }
            
            self.logger.info(f"🎯 ULTIMATE parsing completed! Total fields: {total_fields}")
            self.logger.info(f"📊 Completion breakdown:")
            self.logger.info(f"   📋 TableBox: {len(all_data['tableBox'])} fields")
            self.logger.info(f"   🏗️ ModeBox: {len(all_data['modeBox'])} fields")
            self.logger.info(f"   🏠 Accommodation: {len(all_data['accommodation'])} fields")
            self.logger.info(f"   ⚙️ Machinery: {len(all_data['machinery'])} fields")
            self.logger.info(f"   🧭 Navigation: {len(all_data['navigation'])} fields")
            self.logger.info(f"   🛠️ Equipment: {len(all_data['equipment'])} fields")
            self.logger.info(f"   ⛵ Rigging: {len(all_data['rigging'])} fields")
            self.logger.info(f"   📊 Indication Ratios: {len(all_data['indicationRatios'])} fields")
            
            return result
            
        except Exception as e:
            self.logger.error(f"❌ Error in ULTIMATE parsing: {str(e)}")
            return {'error': f'Parsing failed: {str(e)}'}
    
    def _fetch_page_with_retry(self, url: str, max_retries: int = 3) -> Optional[requests.Response]:
        """Fetch page with retry logic and exponential backoff"""
        for attempt in range(max_retries):
            try:
                response = self.session.get(url, timeout=30)
                if response.status_code == 200:
                    return response
                self.logger.warning(f"Attempt {attempt + 1}: Status {response.status_code}")
            except Exception as e:
                self.logger.warning(f"Attempt {attempt + 1} failed: {str(e)}")
            
            if attempt < max_retries - 1:
                import time
                time.sleep(2 ** attempt)  # Exponential backoff
        
        return None
    
    def _extract_key_details_enhanced(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Enhanced key details extraction with multi-pattern strategy"""
        text_content = soup.get_text()
        results = self._extract_with_patterns(text_content, self.patterns_key_details)
        
        # Enhanced extraction for missing engines information
        if 'engines' not in results:
            engine_patterns = [
                r'engine.*?(\d+x\s*[A-Za-z\s]+)',
                r'(\d+x\s*[A-Za-z\s]+).*?engine',
                r'(\d+x\s*[A-Za-z\s]+).*?diesel',
                r'(\d+x\s*[A-Za-z\s]+).*?petrol'
            ]
            for pattern in engine_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    results['engines'] = match.group(1).strip()
                    break
        
        # Enhanced cleaning and validation
        if 'kw' in results and 'hp' in results:
            # Both found, keep both
            pass
        elif 'kw' in results:
            # Only kw found, calculate hp (approximate)
            try:
                kw_value = float(results['kw'].replace(',', '.'))
                hp_value = kw_value * 1.34
                results['hp'] = f"{hp_value:.1f}"
            except:
                pass
        
        # Try to construct dimensions if we have individual measurements
        if 'dimensions' not in results and 'loaM' in results and 'beamM' in results and 'draftM' in results:
            try:
                loa = results['loaM']
                beam = results['beamM']
                draft = results['draftM']
                results['dimensions'] = f"{loa} x {beam} x {draft}"
            except:
                pass
        
        # Merge alternative dimension fields to ensure we don't lose data
        if 'loaM_alt' in results and 'loaM' not in results:
            results['loaM'] = results['loaM_alt']
            del results['loaM_alt']
        
        if 'beamM_alt' in results and 'beamM' not in results:
            results['beamM'] = results['beamM_alt']
            del results['beamM_alt']
        
        if 'draftM_alt' in results and 'draftM' not in results:
            results['draftM'] = results['draftM_alt']
            del results['draftM_alt']
        
        # Direct dimension extraction from HTML structure
        if 'loaM_specs' in results:
            results['loaM'] = results['loaM_specs']
            del results['loaM_specs']
        
        if 'beamM_specs' in results:
            results['beamM'] = results['beamM_specs']
            del results['beamM_specs']
        
        if 'draftM_specs' in results:
            results['draftM'] = results['draftM_specs']
            del results['draftM_specs']
        
        # CONSTRUCT dimensions field from individual values
        if 'loaM' in results and 'beamM' in results and 'draftM' in results:
            try:
                loa = results['loaM']
                beam = results['beamM']
                draft = results['draftM']
                results['dimensions'] = f"{loa} x {beam} x {draft}"
                print(f"✅ Constructed dimensions: {results['dimensions']}")
            except Exception as e:
                print(f"❌ Error constructing dimensions: {e}")
        
        self.logger.info(f"🔑 Enhanced Key Details extracted: {len(results)} fields")
        return results
    
    def _extract_general_info_enhanced(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Enhanced general info extraction with context-aware parsing"""
        text_content = soup.get_text()
        results = self._extract_with_patterns(text_content, self.patterns_general_info)
        
        # Enhanced extraction for missing critical fields
        if 'loaM' not in results:
            # Try multiple LOA patterns with better boundaries
            loa_patterns = [
                r'loa.*?(\d+(?:,\d+)?)\s*m(?:\s|$|\.)',
                r'length.*?(\d+(?:,\d+)?)\s*m(?:\s|$|\.)',
                r'(\d+(?:,\d+)?)\s*m.*?length',
                r'loa.*?(\d+(?:,\d+)?)\s*metres?',
                r'(\d+(?:,\d+)?)\s*metres?.*?loa',
                # Try alternative patterns
                r'(\d+(?:,\d+)?)\s*m.*?loa',
                r'loa.*?(\d+(?:,\d+)?)',
                r'length.*?(\d+(?:,\d+)?)',
            ]
            for pattern in loa_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    value = match.group(1)
                    # Validate it's a reasonable LOA value (not just "2")
                    try:
                        loa_value = float(value.replace(',', '.'))
                        if 5.0 <= loa_value <= 50.0:  # Reasonable yacht LOA range
                            results['loaM'] = value
                            break
                    except:
                        continue
        
        if 'beamM' not in results:
            # Try multiple beam patterns with better boundaries
            beam_patterns = [
                r'beam.*?(\d+(?:,\d+)?)\s*m(?:\s|$|\.)',
                r'width.*?(\d+(?:,\d+)?)\s*m(?:\s|$|\.)',
                r'(\d+(?:,\d+)?)\s*m.*?beam',
                r'beam.*?(\d+(?:,\d+)?)\s*metres?',
                r'(\d+(?:,\d+)?)\s*metres?.*?beam',
                # Try alternative patterns
                r'(\d+(?:,\d+)?)\s*m.*?beam',
                r'beam.*?(\d+(?:,\d+)?)',
                r'width.*?(\d+(?:,\d+)?)',
            ]
            for pattern in beam_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    value = match.group(1)
                    # Validate it's a reasonable beam value
                    try:
                        beam_value = float(value.replace(',', '.'))
                        if 1.0 <= beam_value <= 15.0:  # Reasonable yacht beam range
                            results['beamM'] = value
                            break
                    except:
                        continue
        
        if 'draftM' not in results:
            # Try multiple draft patterns with better boundaries
            draft_patterns = [
                r'draft.*?(\d+(?:,\d+)?)\s*m(?:\s|$|\.)',
                r'draught.*?(\d+(?:,\d+)?)\s*m(?:\s|$|\.)',
                r'(\d+(?:,\d+)?)\s*m.*?draft',
                r'draft.*?(\d+(?:,\d+)?)\s*metres?',
                r'(\d+(?:,\d+)?)\s*metres?.*?draft',
                # Try alternative patterns
                r'(\d+(?:,\d+)?)\s*m.*?draft',
                r'draft.*?(\d+(?:,\d+)?)',
                r'draught.*?(\d+(?:,\d+)?)',
            ]
            for pattern in draft_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    value = match.group(1)
                    # Validate it's a reasonable draft value
                    try:
                        draft_value = float(value.replace(',', '.'))
                        if 0.5 <= draft_value <= 5.0:  # Reasonable yacht draft range
                            results['draftM'] = value
                            break
                    except:
                        continue
        
        # Try to extract displacement in different formats
        if 'displacementT' not in results:
            displacement_patterns = [
                r'displacement.*?(\d+(?:,\d+)?)\s*t',
                r'(\d+(?:,\d+)?)\s*tonnes.*?displacement',
                r'displacement.*?(\d+(?:,\d+)?)\s*tonnes',
                r'(\d+(?:,\d+)?)\s*t.*?displacement'
            ]
            for pattern in displacement_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    results['displacementT'] = match.group(1)
                    break
        
        # Try to extract ballast
        if 'ballastTonnes' not in results:
            ballast_patterns = [
                r'ballast.*?(\d+(?:,\d+)?)\s*tonnes?',
                r'(\d+(?:,\d+)?)\s*tonnes?.*?ballast',
                r'ballast.*?(\d+(?:,\d+)?)\s*t'
            ]
            for pattern in ballast_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    results['ballastTonnes'] = match.group(1)
                    break
        
        # Try to construct dimensions if we have individual measurements
        if 'dimensions' not in results and 'loaM' in results and 'beamM' in results and 'draftM' in results:
            try:
                loa = results['loaM']
                beam = results['beamM']
                draft = results['draftM']
                results['dimensions'] = f"{loa} x {beam} x {draft}"
                print(f"✅ Constructed dimensions: {results['dimensions']}")
            except Exception as e:
                print(f"❌ Error constructing dimensions: {e}")
        
        # Process the specs fields and construct dimensions
        if 'loaM_specs' in results:
            results['loaM'] = results['loaM_specs']
            del results['loaM_specs']
        
        if 'beamM_specs' in results:
            results['beamM'] = results['beamM_specs']
            del results['beamM_specs']
        
        if 'draftM_specs' in results:
            results['draftM'] = results['draftM_specs']
            del results['draftM_specs']
        
        # CONSTRUCT dimensions field from individual values
        if 'loaM' in results and 'beamM' in results and 'draftM' in results:
            try:
                loa = results['loaM']
                beam = results['beamM']
                draft = results['draftM']
                results['dimensions'] = f"{loa} x {beam} x {draft}"
                print(f"✅ Constructed dimensions: {results['dimensions']}")
            except Exception as e:
                print(f"❌ Error constructing dimensions: {e}")
        
        self.logger.info(f"📋 Enhanced General Info extracted: {len(results)} fields")
        return results
    
    def _extract_accommodation_enhanced(self, soup: BeautifulSoup, layout_type: str) -> Dict[str, str]:
        """Enhanced accommodation extraction with dual-layout support"""
        # Use dual-layout extraction strategy
        section_text = self._extract_section_text_dual_layout(soup, 'Accommodation', layout_type)
        
        if not section_text:
            # Fallback to full page text if section extraction fails
            section_text = soup.get_text()
        
        results = self._extract_with_patterns(section_text, self.patterns_accommodation)
        
        # Enhanced extraction for missing critical fields
        if 'cabins' not in results:
            # Try multiple cabin patterns
            cabin_patterns = [
                r'cabins.*?(\d+)',
                r'(\d+)\s*cabins?',
                r'cabin.*?(\d+)',
            ]
            for pattern in cabin_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    results['cabins'] = match.group(1)
                    break
        
        if 'berths' not in results:
            # Try multiple berth patterns
            berth_patterns = [
                r'berths.*?(\d+)',
                r'(\d+)\s*berths?',
                r'berth.*?(\d+)',
            ]
            for pattern in berth_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    results['berths'] = match.group(1)
                    break
        
        # Enhanced cleaning for accommodation fields
        for field_name in ['interior', 'floor', 'heating', 'countertop', 'sink', 'cooker', 'microwave', 'fridge', 'freezer']:
            if field_name in results:
                # Clean concatenated values more carefully
                value = results[field_name]
                # Stop at obvious field boundaries
                if 'Bed length' in value:
                    value = value.split('Bed length')[0].strip()
                if 'Wardrobe' in value:
                    value = value.split('Wardrobe')[0].strip()
                if 'Bathroom' in value:
                    value = value.split('Bathroom')[0].strip()
                if 'Toilet' in value:
                    value = value.split('Toilet')[0].strip()
                results[field_name] = value.strip()
        
        self.logger.info(f"🏠 Enhanced Accommodation extracted: {len(results)} fields (Layout: {layout_type})")
        return results
    
    def _extract_machinery_enhanced(self, soup: BeautifulSoup, layout_type: str) -> Dict[str, str]:
        """Enhanced machinery extraction with dual-layout support"""
        # Use dual-layout extraction strategy
        section_text = self._extract_section_text_dual_layout(soup, 'Machinery', layout_type)
        
        if not section_text:
            # Fallback to full page text if section extraction fails
            section_text = soup.get_text()
        
        results = self._extract_with_patterns(section_text, self.patterns_machinery)
        
        # Enhanced extraction for missing critical fields
        if 'noOfEngines' not in results:
            # Try multiple engine count patterns
            engine_count_patterns = [
                r'no\s*of\s*engines.*?(\d+)',
                r'(\d+)\s*engines?',
                r'engine.*?(\d+)',
            ]
            for pattern in engine_count_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    results['noOfEngines'] = match.group(1)
                    break
        
        if 'make' not in results:
            # Try multiple make patterns
            make_patterns = [
                r'make.*?([A-Za-z\s]+)',
                r'([A-Za-z\s]+).*?engine',
                r'engine.*?([A-Za-z\s]+)',
            ]
            for pattern in make_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    value = match.group(1).strip()
                    # Clean the value
                    if 'Type' in value:
                        value = value.split('Type')[0].strip()
                    if 'HP' in value:
                        value = value.split('HP')[0].strip()
                    if 'kW' in value:
                        value = value.split('kW')[0].strip()
                    results['make'] = value
                    break
        
        # Enhanced cleaning for machinery fields
        for field_name in ['make', 'type', 'fuel', 'engineCoolingSystem', 'drive', 'shaftSeal', 'engineControls', 'gearbox']:
            if field_name in results:
                value = results[field_name]
                # Stop at obvious field boundaries
                if 'Year' in value:
                    value = value.split('Year')[0].strip()
                if 'HP' in value:
                    value = value.split('HP')[0].strip()
                if 'kW' in value:
                    value = value.split('kW')[0].strip()
                if 'Fuel' in value:
                    value = value.split('Fuel')[0].strip()
                results[field_name] = value.strip()
        
        self.logger.info(f"⚙️ Enhanced Machinery extracted: {len(results)} fields (Layout: {layout_type})")
        return results
    
    def _extract_navigation_enhanced(self, soup: BeautifulSoup, layout_type: str) -> Dict[str, str]:
        """Enhanced navigation extraction with dual-layout support"""
        # Use dual-layout extraction strategy
        section_text = self._extract_section_text_dual_layout(soup, 'Navigation', layout_type)
        
        if not section_text:
            # Fallback to full page text if section extraction fails
            section_text = soup.get_text()
        
        results = self._extract_with_patterns(section_text, self.patterns_navigation)
        
        # Enhanced extraction for missing critical fields
        if 'compass' not in results:
            # Try multiple compass patterns
            compass_patterns = [
                r'compass.*?(yes|no)',
                r'(yes|no).*?compass',
            ]
            for pattern in compass_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    results['compass'] = match.group(1)
                    break
        
        if 'depthSounder' not in results:
            # Try multiple depth sounder patterns
            depth_patterns = [
                r'depth\s*sounder.*?([A-Za-z\s]+)',
                r'([A-Za-z\s]+).*?depth',
            ]
            for pattern in depth_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    value = match.group(1).strip()
                    if 'Log' in value:
                        value = value.split('Log')[0].strip()
                    if 'Windset' in value:
                        value = value.split('Windset')[0].strip()
                    results['depthSounder'] = value
                    break
        
        # Enhanced cleaning for navigation fields
        for field_name in ['depthSounder', 'log', 'windset', 'vhf', 'autopilot', 'radar', 'gps', 'plotter']:
            if field_name in results:
                value = results[field_name]
                # Stop at obvious field boundaries
                if 'Autopilot' in value:
                    value = value.split('Autopilot')[0].strip()
                if 'Radar' in value:
                    value = value.split('Radar')[0].strip()
                if 'GPS' in value:
                    value = value.split('GPS')[0].strip()
                if 'Plotter' in value:
                    value = value.split('Plotter')[0].strip()
                results[field_name] = value.strip()
        
        self.logger.info(f"🧭 Enhanced Navigation extracted: {len(results)} fields (Layout: {layout_type})")
        return results
    
    def _extract_equipment_enhanced(self, soup: BeautifulSoup, layout_type: str) -> Dict[str, str]:
        """Enhanced equipment extraction with dual-layout support"""
        # Use dual-layout extraction strategy
        section_text = self._extract_section_text_dual_layout(soup, 'Equipment', layout_type)
        
        if not section_text:
            # Fallback to full page text if section extraction fails
            section_text = soup.get_text()
        
        results = self._extract_with_patterns(section_text, self.patterns_equipment)
        
        # Enhanced extraction for missing critical fields
        if 'anchor' not in results:
            # Try multiple anchor patterns
            anchor_patterns = [
                r'anchor.*?([^.]*?)(?=\n|\.|$)',
                r'([A-Za-z\s]+).*?anchor',
            ]
            for pattern in anchor_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    value = match.group(1).strip()
                    if 'Anchor chain' in value:
                        value = value.split('Anchor chain')[0].strip()
                    if 'Anchor 2' in value:
                        value = value.split('Anchor 2')[0].strip()
                    results['anchor'] = value
                    break
        
        if 'windlass' not in results:
            # Try multiple windlass patterns
            windlass_patterns = [
                r'windlass.*?([^.]*?)(?=\n|\.|$)',
                r'([A-Za-z\s]+).*?windlass',
            ]
            for pattern in windlass_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    value = match.group(1).strip()
                    if 'Deck wash' in value:
                        value = value.split('Deck wash')[0].strip()
                    if 'Dinghy' in value:
                        value = value.split('Dinghy')[0].strip()
                    results['windlass'] = value
                    break
        
        # Enhanced cleaning for equipment fields
        for field_name in ['anchor', 'anchorChain', 'windlass', 'dinghy', 'outboard', 'davits', 'seaRailing']:
            if field_name in results:
                value = results[field_name]
                # Stop at obvious field boundaries
                if 'Deck wash' in value:
                    value = value.split('Deck wash')[0].strip()
                if 'Dinghy' in value:
                    value = value.split('Dinghy')[0].strip()
                if 'Outboard' in value:
                    value = value.split('Outboard')[0].strip()
                if 'Davits' in value:
                    value = value.split('Davits')[0].strip()
                results[field_name] = value.strip()
        
        self.logger.info(f"🛠️ Enhanced Equipment extracted: {len(results)} fields (Layout: {layout_type})")
        return results
    
    def _extract_rigging_enhanced(self, soup: BeautifulSoup, layout_type: str) -> Dict[str, str]:
        """Enhanced rigging extraction with dual-layout support"""
        # Use dual-layout extraction strategy
        section_text = self._extract_section_text_dual_layout(soup, 'Rigging', layout_type)
        
        if not section_text:
            # Fallback to full page text if section extraction fails
            section_text = soup.get_text()
        
        results = self._extract_with_patterns(section_text, self.patterns_rigging)
        
        # Enhanced extraction for missing critical fields
        if 'rigging' not in results:
            # Try multiple rigging patterns
            rigging_patterns = [
                r'rigging.*?([A-Za-z\s]+)',
                r'([A-Za-z\s]+).*?rigging',
            ]
            for pattern in rigging_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    value = match.group(1).strip()
                    if 'Standing rigging' in value:
                        value = value.split('Standing rigging')[0].strip()
                    if 'Brand mast' in value:
                        value = value.split('Brand mast')[0].strip()
                    results['rigging'] = value
                    break
        
        if 'brandMast' not in results:
            # Try multiple mast brand patterns
            mast_patterns = [
                r'brand\s*mast.*?([A-Za-z\s]+)',
                r'([A-Za-z\s]+).*?mast',
            ]
            for pattern in mast_patterns:
                match = re.search(pattern, section_text, re.IGNORECASE)
                if match:
                    value = match.group(1).strip()
                    if 'Material mast' in value:
                        value = value.split('Material mast')[0].strip()
                    if 'Spreaders' in value:
                        value = value.split('Spreaders')[0].strip()
                    results['brandMast'] = value
                    break
        
        # Enhanced cleaning for rigging fields
        for field_name in ['rigging', 'standingRigging', 'brandMast', 'materialMast', 'mainsail', 'jib', 'genoa']:
            if field_name in results:
                value = results[field_name]
                # Stop at obvious field boundaries
                if 'Standing rigging' in value:
                    value = value.split('Standing rigging')[0].strip()
                if 'Brand mast' in value:
                    value = value.split('Brand mast')[0].strip()
                if 'Material mast' in value:
                    value = value.split('Material mast')[0].strip()
                if 'Spreaders' in value:
                    value = value.split('Spreaders')[0].strip()
                if 'Mainsail' in value:
                    value = value.split('Mainsail')[0].strip()
                results[field_name] = value.strip()
        
        self.logger.info(f"⛵ Enhanced Rigging extracted: {len(results)} fields (Layout: {layout_type})")
        return results
    
    def _extract_indication_ratios_enhanced(self, soup: BeautifulSoup, layout_type: str) -> Dict[str, str]:
        """Enhanced indication ratios extraction with dual-layout support"""
        # Use dual-layout extraction strategy for general info and rigging
        general_info = self._extract_general_info_enhanced(soup)
        rigging_info = self._extract_rigging_enhanced(soup, layout_type)
        
        results = {}
        
        # Calculate hull speed if we have LOA
        if 'loaM' in general_info:
            try:
                loa_value = float(general_info['loaM'].replace(',', '.'))
                hull_speed = math.sqrt(loa_value) * 1.34
                results['hullSpeed'] = f"{hull_speed:.1f}"
            except:
                pass
        
        # Calculate displacement/length ratio if we have both values
        if 'loaM' in general_info and 'displacementT' in general_info:
            try:
                loa_value = float(general_info['loaM'].replace(',', '.'))
                displacement_value = float(general_info['displacementT'].replace(',', '.'))
                # Convert LOA to feet for the ratio
                loa_feet = loa_value * 3.28084
                ratio = displacement_value / (loa_feet / 100) ** 3
                results['displacementLengthRatio'] = f"{ratio:.1f}"
            except:
                pass
        
        # Calculate sail area/displacement ratio if we have sail area and displacement
        if 'displacementT' in general_info:
            # Try to extract sail areas from rigging info
            sail_areas = []
            
            # Look for sail area patterns in rigging text
            rigging_text = self._extract_section_text_dual_layout(soup, 'Rigging', layout_type)
            if rigging_text:
                sail_area_patterns = [
                    r'mainsail.*?(\d+)\s*m2',
                    r'genoa.*?(\d+)\s*m2',
                    r'jib.*?(\d+)\s*m2'
                ]
                
                for pattern in sail_area_patterns:
                    match = re.search(pattern, rigging_text, re.IGNORECASE)
                    if match:
                        sail_areas.append(int(match.group(1)))
                
                if sail_areas:
                    total_sail_area = sum(sail_areas)
                    results['totalSailArea'] = str(total_sail_area)
                    
                    # Calculate sail area/displacement ratio
                    try:
                        displacement_value = float(general_info['displacementT'].replace(',', '.'))
                        ratio = total_sail_area / displacement_value
                        results['sailAreaDisplacementRatio'] = f"{ratio:.1f}"
                    except:
                        pass
        
        # Calculate ballast/displacement ratio if we have both values
        if 'displacementT' in general_info and 'ballastTonnes' in general_info:
            try:
                displacement_value = float(general_info['displacementT'].replace(',', '.'))
                ballast_value = float(general_info['ballastTonnes'].replace(',', '.'))
                ratio = (ballast_value / displacement_value) * 100
                results['ballastDisplacementRatio'] = f"{ratio:.1f}%"
            except:
                pass
        
        self.logger.info(f"📊 Enhanced Indication Ratios extracted: {len(results)} fields (Layout: {layout_type})")
        return results

    def _extract_table_box(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract data from the tableBox summary section - KEY SUMMARY FIELDS"""
        results = {}
        
        table_box = soup.find('div', class_='tableBox')
        if table_box:
            # Extract from all table items
            table_items = table_box.find_all('div', class_='item')
            for item in table_items:
                strong = item.find('strong')
                if strong:
                    field_name = strong.get_text().strip().lower()
                    # Get the value from the next li element
                    value_li = item.find('li', string=lambda x: x and strong.get_text() not in x)
                    if value_li:
                        value = value_li.get_text().strip()
                        # Clean and normalize field names
                        if 'dimensions' in field_name:
                            field_name = 'dimensions'
                        elif 'material' in field_name:
                            field_name = 'material'
                        elif 'built' in field_name:
                            field_name = 'yearBuilt'
                        elif 'engine(s)' in field_name:
                            field_name = 'engines'
                        elif 'hp/ kw' in field_name:
                            field_name = 'hpKw'
                        elif 'lying' in field_name:
                            field_name = 'lying'
                        elif 'sales office' in field_name:
                            field_name = 'salesOffice'
                        elif 'status' in field_name:
                            field_name = 'status'
                        elif 'vat' in field_name:
                            field_name = 'vat'
                        elif 'asking price' in field_name:
                            field_name = 'askingPrice'
                        
                        results[field_name] = value
                        self.logger.info(f"✅ TableBox: {field_name} = {value}")
        
        return results

    def _extract_mode_box(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract data from the modeBox specifications section - GENERAL SPECIFICATIONS"""
        results = {}
        
        mode_box = soup.find('div', class_='modeBox')
        if mode_box:
            # Extract from list-1 and list-2
            list_1 = mode_box.find('ul', class_='list-1')
            list_2 = mode_box.find('ul', class_='list-2')
            
            if list_1:
                results.update(self._parse_specification_list(list_1))
            if list_2:
                results.update(self._parse_specification_list(list_2))
        
        return results

    def _parse_specification_list(self, ul_element) -> Dict[str, str]:
        """Parse specification lists from modeBox and accordion sections"""
        results = {}
        
        list_items = ul_element.find_all('li')
        for item in list_items:
            strong = item.find('strong')
            if strong:
                field_name = strong.get_text().strip().lower()
                # Get the value after the strong tag
                value = item.get_text().replace(strong.get_text(), '').strip()
                
                # Clean and normalize field names
                if 'model' in field_name:
                    field_name = 'model'
                elif 'type' in field_name:
                    field_name = 'yachtType'
                elif 'loa (m)' in field_name:
                    field_name = 'loaM'
                elif 'lwl (m)' in field_name:
                    field_name = 'lwlM'
                elif 'beam (m)' in field_name:
                    field_name = 'beamM'
                elif 'draft (m)' in field_name:
                    field_name = 'draftM'
                elif 'air draft (m)' in field_name:
                    field_name = 'airDraftM'
                elif 'headroom (m)' in field_name:
                    field_name = 'headroomM'
                elif 'year built' in field_name:
                    field_name = 'yearBuilt'
                elif 'launched' in field_name:
                    field_name = 'launched'
                elif 'builder' in field_name:
                    field_name = 'builder'
                elif 'country' in field_name:
                    field_name = 'country'
                elif 'designer' in field_name:
                    field_name = 'designer'
                elif 'displacement (t)' in field_name:
                    field_name = 'displacementT'
                elif 'ballast (tonnes)' in field_name:
                    field_name = 'ballastTonnes'
                elif 'ce norm' in field_name:
                    field_name = 'ceNorm'
                elif 'hull material' in field_name:
                    field_name = 'hullMaterial'
                elif 'hull colour' in field_name:
                    field_name = 'hullColour'
                elif 'hull shape' in field_name:
                    field_name = 'hullShape'
                elif 'keel type' in field_name:
                    field_name = 'keelType'
                elif 'superstructure material' in field_name:
                    field_name = 'superstructureMaterial'
                elif 'deck material' in field_name:
                    field_name = 'deckMaterial'
                elif 'deck finish' in field_name:
                    field_name = 'deckFinish'
                elif 'superstructure deck finish' in field_name:
                    field_name = 'superstructureDeckFinish'
                elif 'cockpit deck finish' in field_name:
                    field_name = 'cockpitDeckFinish'
                elif 'dorades' in field_name:
                    field_name = 'dorades'
                elif 'window frame' in field_name:
                    field_name = 'windowFrame'
                elif 'window material' in field_name:
                    field_name = 'windowMaterial'
                elif 'deckhatch' in field_name:
                    field_name = 'deckhatch'
                elif 'portholes' in field_name:
                    field_name = 'portholes'
                elif 'insulation' in field_name:
                    field_name = 'insulation'
                elif 'fuel tank (litre)' in field_name:
                    field_name = 'fuelTankLitre'
                elif 'level indicator (fuel tank)' in field_name:
                    field_name = 'levelIndicatorFuelTank'
                elif 'freshwater tank (litre)' in field_name:
                    field_name = 'freshwaterTankLitre'
                elif 'level indicator (freshwater)' in field_name:
                    field_name = 'levelIndicatorFreshwater'
                elif 'blackwater tank (litre)' in field_name:
                    field_name = 'blackwaterTankLitre'
                elif 'level indicator (blackwater)' in field_name:
                    field_name = 'levelIndicatorBlackwater'
                elif 'blackwater tank extraction' in field_name:
                    field_name = 'blackwaterTankExtraction'
                elif 'greywater tank (litre)' in field_name:
                    field_name = 'greywaterTankLitre'
                elif 'wheel steering' in field_name:
                    field_name = 'wheelSteering'
                elif 'emergency tiller' in field_name:
                    field_name = 'emergencyTiller'
                elif 'more info on hull' in field_name:
                    field_name = 'moreInfoOnHull'
                elif 'more info on paintwork' in field_name:
                    field_name = 'moreInfoOnPaintwork'
                elif 'extra info' in field_name:
                    field_name = 'extraInfo'
                
                if value and value != '':
                    results[field_name] = value
                    self.logger.info(f"✅ ModeBox: {field_name} = {value}")
        
        return results

    def _extract_accordion_section(self, soup: BeautifulSoup, section_name: str) -> Dict[str, str]:
        """Extract data from specific accordion section"""
        results = {}
        
        accordion_items = soup.find_all('div', class_='accordion-item')
        for item in accordion_items:
            button = item.find('button', class_='accordion-button')
            if button and section_name.lower() in button.get_text().lower():
                accordion_body = item.find('div', class_='accordion-body')
                if accordion_body:
                    # Extract from both list-1 and list-2
                    list_1 = accordion_body.find('ul', class_='list-1')
                    list_2 = accordion_body.find('ul', class_='list-2')
                    
                    if list_1:
                        results.update(self._parse_specification_list(list_1))
                    if list_2:
                        results.update(self._parse_specification_list(list_2))
                    
                    self.logger.info(f"✅ Accordion {section_name}: {len(results)} fields")
                    break
        
        return results

    def _extract_all_sections_unified(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract ALL sections using the unified De Valk structure for 100% completion"""
        
        # 1. Table Box (summary fields)
        table_data = self._extract_table_box(soup)
        self.logger.info(f"📊 TableBox extracted: {len(table_data)} fields")
        
        # 2. Mode Box (general specifications)
        mode_data = self._extract_mode_box(soup)
        self.logger.info(f"🏗️ ModeBox extracted: {len(mode_data)} fields")
        
        # 3. Accordion Sections
        accommodation = self._extract_accordion_section(soup, 'Accommodation')
        machinery = self._extract_accordion_section(soup, 'Machinery')
        navigation = self._extract_accordion_section(soup, 'Navigation')
        equipment = self._extract_accordion_section(soup, 'Equipment')
        rigging = self._extract_accordion_section(soup, 'Rigging')
        
        # 4. Calculate indication ratios from extracted data
        indication_ratios = self._calculate_indication_ratios(mode_data, rigging)
        
        return {
            'tableBox': table_data,
            'modeBox': mode_data,
            'accommodation': accommodation,
            'machinery': machinery,
            'navigation': navigation,
            'equipment': equipment,
            'rigging': rigging,
            'indicationRatios': indication_ratios
        }

    def _calculate_indication_ratios(self, mode_data: Dict[str, str], rigging_data: Dict[str, str]) -> Dict[str, str]:
        """Calculate indication ratios from extracted data"""
        results = {}
        
        # Calculate hull speed if we have LOA
        if 'loaM' in mode_data:
            try:
                loa_value = float(mode_data['loaM'].replace(',', '.'))
                hull_speed = math.sqrt(loa_value) * 1.34
                results['hullSpeed'] = f"{hull_speed:.1f}"
            except:
                pass
        
        # Calculate displacement/length ratio if we have both values
        if 'loaM' in mode_data and 'displacementT' in mode_data:
            try:
                loa_value = float(mode_data['loaM'].replace(',', '.'))
                displacement_value = float(mode_data['displacementT'].replace(',', '.'))
                # Convert LOA to feet for the ratio
                loa_feet = loa_value * 3.28084
                ratio = displacement_value / (loa_feet / 100) ** 3
                results['displacementLengthRatio'] = f"{ratio:.1f}"
            except:
                pass
        
        # Calculate ballast/displacement ratio if we have both values
        if 'displacementT' in mode_data and 'ballastTonnes' in mode_data:
            try:
                displacement_value = float(mode_data['displacementT'].replace(',', '.'))
                ballast_value = float(mode_data['ballastTonnes'].replace(',', '.'))
                ratio = (ballast_value / displacement_value) * 100
                results['ballastDisplacementRatio'] = f"{ratio:.1f}%"
            except:
                pass
        
        return results
