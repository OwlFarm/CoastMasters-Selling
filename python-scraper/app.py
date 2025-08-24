from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper_service import YachtScraperService
from devalk_parser import DeValkParser
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

scraper_service = YachtScraperService()
devalk_parser = DeValkParser()

@app.route('/scrape', methods=['POST'])
def scrape():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        logger.info(f"Received scraping request for URL: {url}")
        
        # Use the appropriate scraper based on URL
        if 'devalk.nl' in url:
            result = scraper_service.scrape_devalk(url)
        else:
            result = scraper_service.scrape_generic(url)
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in scraping: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/scrape-devalk', methods=['POST'])
def scrape_devalk():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        logger.info(f"Received De Valk scraping request for URL: {url}")
        
        # For testing, return mock De Valk data
        mock_data = {
            'keyDetails': {
                'dimensions': '16.72 x 4.85 x 2.28 (m)',
                'material': 'GRP',
                'built': '2003',
                'engines': '1x Yanmar 4JH110',
                'hpKw': '110 hp / 80.96 kw',
                'lying': 'South Spain',
                'salesOffice': 'De Valk',
                'status': 'For Sale',
                'vat': 'Paid',
                'askingPrice': '€ 350,000'
            },
            'generalInfo': {
                'model': 'MOODY 54',
                'type': 'Monohull sailing yacht',
                'loaM': '16.72',
                'lwlM': '14.50',
                'beamM': '4.85',
                'draftM': '2.28',
                'airDraftM': '22.50',
                'headroomM': '2.10',
                'yearBuilt': '2003',
                'builder': 'A. H. Moody & Son Ltd',
                'country': 'United Kingdom',
                'designer': 'Bill Dixon',
                'displacementT': '22',
                'ballastTonnes': '8.5',
                'hullMaterial': 'GRP',
                'hullColour': 'White',
                'hullShape': 'S-bilged',
                'keelType': 'Fin keel',
                'superstructureMaterial': 'GRP',
                'deckMaterial': 'GRP',
                'deckFinish': 'Teak',
                'superstructureDeckFinish': 'Teak',
                'cockpitDeckFinish': 'Teak'
            },
            'accommodation': {
                'cabins': '3',
                'berths': '6',
                'interior': 'Teak',
                'layout': 'Salon layout',
                'floor': 'Teak and holly',
                'openCockpit': 'Yes',
                'aftDeck': 'Yes',
                'saloon': 'Yes',
                'headroomSalonM': '2.00',
                'heating': 'Webasto diesel heater',
                'navigationCenter': 'Yes',
                'chartTable': 'Yes',
                'galley': 'Yes',
                'countertop': 'Wood',
                'sink': 'Stainless steel double',
                'cooker': 'Calor gas 4 burner',
                'oven': 'In cooker',
                'microwave': 'Yes',
                'fridge': 'Dometic',
                'freezer': 'Yes'
            },
            'machinery': {
                'noOfEngines': '1',
                'make': 'Yanmar',
                'type': '4JH110',
                'hp': '110',
                'kw': '80.96',
                'fuel': 'Diesel',
                'yearInstalled': '2021',
                'yearOfOverhaul': '2022',
                'maximumSpeedKn': '9.5',
                'cruisingSpeedKn': '7.5',
                'consumptionLhr': '8',
                'engineCoolingSystem': 'Seawater',
                'drive': 'Shaft',
                'shaftSeal': 'Yes',
                'engineControls': 'Bowden cable',
                'gearbox': 'Mechanical',
                'bowthruster': 'Electric 7 hp',
                'propellerType': 'Fixed 3 blade',
                'manualBilgePump': 'Yes',
                'electricBilgePump': 'Yes',
                'electricalInstallation': '12V/24V/230V',
                'generator': 'Westerbeke 8 kW',
                'batteries': '6 x 105Ah deep cycle',
                'startBattery': '1 x 105Ah',
                'serviceBattery': '5 x 105Ah',
                'batteryMonitor': 'Yes',
                'batteryCharger': 'Victron 60A',
                'solarPanel': '2 x 200W',
                'shorepower': 'Yes',
                'watermaker': 'Yes'
            },
            'navigation': {
                'compass': 'Plastimo',
                'electricCompass': 'Raymarine',
                'depthSounder': 'Raymarine ST60',
                'log': 'Raymarine ST60',
                'windset': 'Raymarine ST60',
                'repeater': '2 x Raymarine i70',
                'vhf': 'Standard Horizon Explorer',
                'vhfHandheld': 'Standard Horizon',
                'autopilot': 'Raymarine EV 400 (p70)',
                'rudderAngleIndicator': 'Raymarine p70',
                'radar': 'Pathfinder RL 80C',
                'plotterGps': 'Raymarine Axiom 9',
                'electronicCharts': 'Navionics',
                'aisTransceiver': 'Raymarine AIS 650',
                'epirb': 'RescueMe Ocean Signal',
                'navigationLights': 'Yes'
            },
            'equipment': {
                'fixedWindscreen': 'Yes',
                'cockpitTable': 'Yes',
                'bathingPlatform': 'Stainless steel and teak',
                'boardingLadder': 'Yes',
                'deckShower': 'Yes',
                'anchor': '40 kg Rocna',
                'anchorChain': '80 m calibrated chain',
                'anchor2': 'Spare 34 kg CQR',
                'windlass': 'Electrical Lofrans 1500W',
                'deckWash': 'Yes',
                'dinghy': 'Avon 2.8m',
                'outboard': 'Mariner F4 4hp 4 stroke',
                'davits': 'Stainless steel',
                'seaRailing': 'Wire',
                'pushpit': 'With teak seats',
                'pulpit': 'Yes',
                'lifebuoy': 'Yes',
                'radarReflector': 'Yes',
                'fenders': 'Yes',
                'mooringLines': 'Yes',
                'radio': 'Sony',
                'cockpitSpeakers': '2x Sony xplod',
                'speakersInSalon': '2x Sony xplod',
                'fireExtinguisher': 'Yes'
            },
            'rigging': {
                'rigging': 'Sloop',
                'standingRigging': 'Wire (2019)',
                'brandMast': 'Seldén',
                'materialMast': 'Aluminium',
                'spreaders': '3 sets',
                'mainsail': 'Dracon Sabre Sails (04.2020)',
                'stowayMast': 'Seldén electric',
                'cutterstay': 'Yes',
                'jib': 'Dracon (03.2022)',
                'genoa': 'Dracon (03.2022)',
                'genoaFurler': 'Selden Furlex 400S',
                'cutterFurler': 'Selden Furlex 400S',
                'gennaker': 'Yes',
                'spinnaker': 'Yes',
                'reefingSystem': 'Main in-mast furling',
                'backstayAdjuster': 'Mechanical',
                'primarySheetWinch': '2 x Lewmar 64 ST 2 SP (electric)',
                'secondarySheetWinch': '2 x Lewmar 40 ST 2 SP',
                'genoaSheetwinches': '2 x Lewmar 64 ST 2 SP (electric)',
                'halyardWinches': 'Lewmar 40 2 SP',
                'multifunctionalWinches': 'Lewmar 48 ST 2 SP',
                'spiPole': 'Aluminium Selden'
            },
            'indicationRatios': {
                'saDispl': '16.59',
                'balDispl': '33.90',
                'dispLen': '201.36',
                'comfortRatio': '35.33',
                'capsizeScreeningFormula': '1.81',
                's': '2.64',
                'hullSpeed': '9.10 kn',
                'poundsInchImmersion': '2,621.21 pounds/inch'
            }
        }
        
        logger.info(f"Returning mock De Valk data for testing")
        return jsonify({
            'success': True,
            'data': mock_data,
            'message': 'Mock De Valk data for testing'
        })
    
    except Exception as e:
        logger.error(f"Error in De Valk scraping: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'python-scraper'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)