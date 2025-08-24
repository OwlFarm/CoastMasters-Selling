import os
import json
import logging
from typing import Dict, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class AIYachtExtractor:
    """AI-powered yacht data extraction using OpenAI GPT-4"""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.model = "gpt-4"
        
        if not os.getenv('OPENAI_API_KEY'):
            logger.warning("OPENAI_API_KEY not found in environment variables")
    
    def extract_yacht_data(self, html_content: str, url: str) -> Dict[str, Any]:
        """
        Extract yacht data from HTML using GPT-4
        
        Args:
            html_content: Raw HTML content from yacht listing
            url: Source URL for context
            
        Returns:
            Dictionary with extracted yacht data
        """
        try:
            if not os.getenv('OPENAI_API_KEY'):
                logger.error("OpenAI API key not available")
                return {}
            
            # Create extraction prompt
            prompt = self._create_extraction_prompt(html_content, url)
            
            # Call OpenAI GPT-4
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert yacht data extraction specialist. Extract yacht information from HTML listings and return only valid JSON data."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,  # Low temperature for consistent extraction
                max_tokens=2000
            )
            
            # Parse response
            extracted_data = self._parse_gpt_response(response)
            logger.info(f"✅ AI extraction completed for {url}")
            
            return extracted_data
            
        except Exception as e:
            logger.error(f"❌ AI extraction failed: {e}")
            return {}
    
    def _create_extraction_prompt(self, html_content: str, url: str) -> str:
        """Create the extraction prompt for GPT-4"""
        
        # Truncate HTML if too long (GPT-4 has token limits)
        max_html_length = 8000
        if len(html_content) > max_html_length:
            html_content = html_content[:max_html_length] + "... [truncated]"
        
        prompt = f"""
        Extract yacht data from this HTML listing and return ONLY valid JSON.
        
        Source URL: {url}
        
        Required fields (return null if not found):
        - title: Yacht title/name
        - make: Manufacturer/brand
        - model: Model name/number
        - year: Build year
        - price: Asking price (numeric only)
        - currency: Currency code (EUR, USD, GBP)
        - length: Length in meters
        - beam: Beam in meters
        - draft: Draft in meters
        - engine: Engine description
        - hp: Horsepower (numeric only)
        - kw: Kilowatts (numeric only)
        - material: Hull material
        - condition: Overall condition
        - description: Full description text
        
        HTML Content:
        {html_content}
        
        Return ONLY valid JSON with the above fields. No explanations or additional text.
        """
        
        return prompt
    
    def _parse_gpt_response(self, response) -> Dict[str, Any]:
        """Parse GPT-4 response and extract JSON data"""
        try:
            # Get the response content
            content = response.choices[0].message.content.strip()
            
            # Try to find JSON in the response
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = content[json_start:json_end]
                extracted_data = json.loads(json_str)
                
                # Clean and validate the data
                cleaned_data = self._clean_extracted_data(extracted_data)
                return cleaned_data
            else:
                logger.error("No JSON found in GPT response")
                return {}
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse GPT response as JSON: {e}")
            logger.error(f"Response content: {response.choices[0].message.content}")
            return {}
        except Exception as e:
            logger.error(f"Error parsing GPT response: {e}")
            return {}
    
    def _clean_extracted_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Clean and validate extracted data"""
        cleaned = {}
        
        # Clean price field
        if data.get('price'):
            try:
                # Remove non-numeric characters and convert to int
                price_str = str(data['price'])
                price_clean = ''.join(filter(str.isdigit, price_str))
                if price_clean:
                    cleaned['price'] = int(price_clean)
            except:
                cleaned['price'] = None
        
        # Clean numeric fields
        numeric_fields = ['year', 'length', 'beam', 'draft', 'hp', 'kw']
        for field in numeric_fields:
            if data.get(field):
                try:
                    cleaned[field] = float(data[field])
                except:
                    cleaned[field] = None
        
        # Clean text fields
        text_fields = ['title', 'make', 'model', 'engine', 'material', 'condition', 'description']
        for field in text_fields:
            if data.get(field):
                cleaned[field] = str(data[field]).strip()
        
        # Clean currency
        if data.get('currency'):
            currency = str(data['currency']).upper()
            if currency in ['EUR', 'USD', 'GBP']:
                cleaned['currency'] = currency
        
        return cleaned
    
    def extract_specific_field(self, html_content: str, field_name: str) -> Optional[str]:
        """
        Extract a specific field using focused AI prompt
        
        Args:
            html_content: HTML content to analyze
            field_name: Specific field to extract
            
        Returns:
            Extracted field value or None
        """
        try:
            if not os.getenv('OPENAI_API_KEY'):
                return None
            
            prompt = f"""
            Extract ONLY the {field_name} from this yacht listing HTML.
            Return only the value, no quotes or additional text.
            
            HTML: {html_content[:4000]}
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": f"You extract {field_name} values from yacht listings. Return only the value."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,
                max_tokens=100
            )
            
            result = response.choices[0].message.content.strip()
            return result if result else None
            
        except Exception as e:
            logger.error(f"Failed to extract {field_name}: {e}")
            return None
