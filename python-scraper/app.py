from flask import Flask, request, jsonify
from super_enhanced_devalk_parser import SuperEnhancedDeValkParser
import logging
import json
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize the ULTIMATE UNIFIED PARSER v5.0.0
devalk_parser = SuperEnhancedDeValkParser()

@app.route('/scrape-devalk', methods=['POST'])
def scrape_devalk():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        logger.info(f"🚀 Starting ULTIMATE UNIFIED PARSER v5.0.0 for: {url}")
        
        # Parse the yacht listing with ULTIMATE parser
        result = devalk_parser.parse_yacht_listing(url)
        
        if 'error' in result:
            logger.error(f"❌ Parsing failed: {result['error']}")
            return jsonify(result), 500
        
        # Store result in local JSON file for database integration
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"scraped_data_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        logger.info(f"✅ ULTIMATE parsing completed successfully. Data saved to {filename}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/scrape-batch', methods=['POST'])
def scrape_batch():
    """Scrape multiple De Valk URLs in batch for 300 URL migration"""
    try:
        data = request.get_json()
        urls = data.get('urls', [])
        
        if not urls:
            return jsonify({'error': 'URLs array is required'}), 400
        
        logger.info(f"🚀 Starting batch scraping for {len(urls)} URLs")
        
        results = []
        for i, url in enumerate(urls, 1):
            try:
                logger.info(f"📊 Processing {i}/{len(urls)}: {url}")
                result = devalk_parser.parse_yacht_listing(url)
                
                if 'error' not in result:
                    # Store individual result
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename = f"batch_scraped_{i}_{timestamp}.json"
                    
                    with open(filename, 'w', encoding='utf-8') as f:
                        json.dump(result, f, indent=2, ensure_ascii=False)
                    
                    results.append({
                        'url': url,
                        'status': 'success',
                        'fields_extracted': result.get('completion_stats', {}).get('total_fields', 0),
                        'filename': filename
                    })
                else:
                    results.append({
                        'url': url,
                        'status': 'failed',
                        'error': result['error']
                    })
                    
            except Exception as e:
                logger.error(f"❌ Error processing {url}: {e}")
                results.append({
                    'url': url,
                    'status': 'failed',
                    'error': str(e)
                })
        
        # Store batch summary
        batch_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        batch_filename = f"batch_summary_{batch_timestamp}.json"
        
        batch_summary = {
            'total_urls': len(urls),
            'successful': len([r for r in results if r['status'] == 'success']),
            'failed': len([r for r in results if r['status'] == 'failed']),
            'timestamp': batch_timestamp,
            'results': results
        }
        
        with open(batch_filename, 'w', encoding='utf-8') as f:
            json.dump(batch_summary, f, indent=2, ensure_ascii=False)
        
        logger.info(f"✅ Batch scraping completed. Summary saved to {batch_filename}")
        return jsonify(batch_summary)
        
    except Exception as e:
        logger.error(f"❌ Batch scraping error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy', 
        'parser': 'ULTIMATE UNIFIED PARSER v5.0.0',
        'features': [
            'TableBox parsing',
            'ModeBox parsing', 
            'Accordion parsing',
            'Batch processing',
            'Data storage'
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)