import os
from dotenv import load_dotenv
load_dotenv()
from google import genai
from google.genai import types
import json
import world_generator
import sys
sys.path.append(".")
from main import CampaignWorld

req = type('Req', (object,), {"name": "Test", "race": "Elf", "dnd_class": "Mage"})()
math_world = world_generator.generate_world_data()

client = genai.Client(api_key=os.environ.get("GEMINI_IMAGE_API_KEY"))
world_prompt = f"""
Vytvoř epický fantasy svět pro kampaň. Hráč: {req.name}, Rasa: {req.race}, Třída: {req.dnd_class}.
Zde je generátorem vytvořená matematická struktura bodů zájmu (POI):
{json.dumps(math_world['pois'], ensure_ascii=False)}

Vymysli hlavní epickou zápletku.
K POI (bodům zájmu) ze zadání doplň:
- typ lokace
- jméno lokace
- popis
- hrozbu nebo tajemství
DŮLEŽITÉ: Musíš přesně zachovat souřadnice 'q' a 'r', které mají body zájmu v zadání!
Dále vymysli 3 klíčové NPC, které jsou s těmito lokacemi nebo se zápletkou spojené.
"""

try:
    response = client.models.generate_content(
        model='gemini-3.5-flash',
        contents=world_prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=CampaignWorld,
            temperature=0.9
        )
    )
    print("Success")
    print(response.text)
except Exception as e:
    print(f"Failed: {e}")
