import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

new_logic = """    # Check for POI in already generated lore locations
    poi = next((l for l in locations if l.get("id") == f"{req.target_q}_{req.target_r}" or (l.get("q") == req.target_q and l.get("r") == req.target_r)), None)
    
    # If not in lore locations, check if it's a raw math POI
    raw_poi = None
    if not poi and world_data.get("pois"):
        raw_poi = next((p for p in world_data["pois"] if p["q"] == req.target_q and p["r"] == req.target_r), None)
    
    client = genai.Client(api_key=req.api_key if getattr(req, "api_key", None) and "DUMMY" not in req.api_key else os.environ.get("GEMINI_API_KEY"))
    
    import random
    import json
    encounter = random.random() < 0.25 # 25% chance of random encounter
    
    narrative_text = ""
    
    if poi:
        prompt = f'''Hráč (rasa: {state.get("race")}, třída: {state.get("dnd_class")}) dorazil do již známé lokace:
Název: {poi.get("name", poi.get("nazev", "Neznámé místo"))}
Popis: {poi.get("description", poi.get("popis", ""))}
Napiš atmosférický první odstavec (pohled vypravěče), jak hráč přichází na toto místo. Max 4 věty. Nenuť ho do akce, jen popiš příchod a atmosféru.'''
        resp = client.models.generate_content(model='gemini-4.7-flash', contents=prompt)
        narrative_text = resp.text.strip()
        
    elif raw_poi:
        # Dynamically generate lore for this new POI!
        prompt = f'''Hráč (rasa: {state.get("race")}, třída: {state.get("dnd_class")}) právě objevil na mapě nové místo, které ještě nemá historii.
Typ místa: {raw_poi.get("type")}
Terén: {raw_poi.get("terrain")}
Království ID: {raw_poi.get("kingdom_id")}
Hlavní zápletka světa: {world_data.get("main_plot", "")}

Vrať POUZE validní JSON s následující strukturou (žádný markdown, žádné komentáře):
{{
  "location": {{
    "id": "{req.target_q}_{req.target_r}",
    "q": {req.target_q},
    "r": {req.target_r},
    "name": "Vymysli epický název",
    "description": "Vymysli popis a co se tu děje, navázáno na zápletku nebo typ místa",
    "ruler": "Kdo tam vládne nebo co tam žije"
  }},
  "intro_text": "Napiš atmosférický první odstavec (pohled vypravěče), jak hráč přichází na toto místo. Max 4 věty."
}}'''
        try:
            resp = client.models.generate_content(
                model='gemini-4.7-flash', 
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            clean_text = resp.text.strip().removeprefix('```json').removesuffix('```').strip()
            data = json.loads(clean_text)
            new_loc = data.get("location")
            if new_loc:
                locations.append(new_loc)
                world_data["locations"] = locations
                state["world_data"] = world_data
            narrative_text = data.get("intro_text", f"Dorazil jsi do {new_loc.get('name') if new_loc else 'neznámého místa'}.")
        except Exception as e:
            narrative_text = f"Dorazil jsi na místo: {raw_poi.get('type')}. ({str(e)})"
            
    elif encounter:
        prompt = f'''Hráč (rasa: {state.get("race")}, třída: {state.get("dnd_class")}) cestuje divočinou. Terén: {target_hex["terrain"]}.
Vygeneruj NÁHODNÉ SETKÁNÍ. Může to být útok (goblini, bandité, vlci) nebo neutrální/zajímavá událost (potulný kupec, prastará socha).
Napiš to z pohledu Vypravěče a nech situaci otevřenou, ať hráč může reagovat. Max 4 věty.'''
        resp = client.models.generate_content(model='gemini-4.7-flash', contents=prompt)
        narrative_text = f"[NÁHODNÉ SETKÁNÍ na cestě]\n{resp.text.strip()}"
    else:
        narrative_text = f"Cesta přes {target_hex['terrain']} proběhla klidně. Utábořil ses a odpočinul si."
"""

start_idx = -1
end_idx = -1
for i, l in enumerate(lines):
    if '# Check for POI' in l:
        start_idx = i
    if 'history.append({"role": "user"' in l and start_idx != -1:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    lines[start_idx:end_idx] = [new_logic + "\n    "]

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
