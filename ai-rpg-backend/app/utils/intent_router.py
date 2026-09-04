import json
import os
from google import genai
from google.genai import types

def get_action_intent(action_str: str, api_key: str) -> str:
    if not action_str or action_str.strip() == "":
        return 'BEZNA_HRA'
        
    # Lokální rychlý bypass pro zjevné a čisté UI klíčová slova (šetříme API i u micro-modelu)
    clean_action = action_str.lower().strip()
    ui_keywords = ["inventar", "inventář", "batoh", "denik", "deník", "ukoly", "úkoly", "staty", "statistiky"]
    if any(clean_action == kw for kw in ui_keywords) or clean_action.startswith("ukaž inventář") or clean_action.startswith("ukaz inventar"):
        # Pojistka: pokud to obsahuje "a ", "pak", "zabij", "jdi", nejedná se o čistou UI akci
        if not any(word in clean_action for word in [" a ", "pak", "potom", "zabij", "jdi", "otevři dveře"]):
            return 'UI_AKCE'
            
    client = genai.Client(api_key=api_key)
    
    prompt = f"""Zanalyzuj nasledujici text hrace v RPG hre a urci jeho zamer.
Text hrace: "{action_str}"

Pravidla:
1. Pokud text obsahuje JAKOUKOLIV pribehovou akci, utok, prozkoumavani, mluveni s postavami nebo pohyb, vrat VZDY "BEZNA_HRA".
2. Pokud se hrac POUZE diva do inventare, statistik, deniku ukolu, nebo otevyra herni menu bez zasahu do sveta (napr. "ukaz inventar", "co mam v batohu?", "denik", "stats"), vrat "UI_AKCE".
3. V pripade kombinace (napr. "kouknu do baglu a pak zabiju krale") vrat VZDY "BEZNA_HRA".
"""
    
    routing_schema = {
        "type": "OBJECT",
        "properties": {
            "intent": {
                "type": "STRING", 
                "enum": ["BEZNA_HRA", "UI_AKCE"],
            }
        },
        "required": ["intent"]
    }
    
    try:
        resp = client.models.generate_content(
            model='gemini-1.5-flash-8b', 
            contents=prompt, 
            config=types.GenerateContentConfig(
                response_mime_type='application/json', 
                response_schema=routing_schema,
                temperature=0.0
            )
        )
        
        clean_text = resp.text.strip().removeprefix('```json').removesuffix('```').strip()
        data = json.loads(clean_text)
        return data.get('intent', 'BEZNA_HRA')
    except Exception as e:
        print("Router error:", e)
        return 'BEZNA_HRA'
