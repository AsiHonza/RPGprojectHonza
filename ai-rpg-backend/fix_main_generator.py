import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

start = content.find("    # Pokud hrac zvolil kampan, vygenerujeme svet")
end = content.find("    state = {", start)

new_block = """    # Pokud hrac zvolil kampan, vygenerujeme svet
    world_data = None
    if req.game_mode == "campaign":
        try:
            import json
            import world_generator
            
            math_world = world_generator.generate_world_data()
            
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            world_prompt = f\"\"\"
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
\"\"\"
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=world_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=CampaignWorld,
                    temperature=0.9
                )
            )
            ai_data = json.loads(response.text)
            
            world_data = {
                "hex_grid": math_world["grid"],
                "hex_radius": math_world["hex_radius"],
                "locations": ai_data["locations"],
                "main_plot": ai_data.get("main_plot", ""),
                "key_npcs": ai_data.get("key_npcs", [])
            }
        except Exception as e:
            print("World gen error:", e)
            world_data = None

"""

if start != -1 and end != -1:
    content = content[:start] + new_block + content[end:]
    with codecs.open("main.py", "w", "utf-8") as f:
        f.write(content)
    print("Main fixed")
else:
    print("Not found")
