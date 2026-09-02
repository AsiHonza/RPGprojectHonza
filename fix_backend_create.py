import codecs

lines = codecs.open('ai-rpg-backend/main.py', 'r', 'utf-8').readlines()

# I will write a custom python script to rewrite create_character block properly.
# The best way is to manually extract it, fix it, and put it back.

start = -1
end = -1
for i, l in enumerate(lines):
    if 'async def create_character(req: CharacterCreateRequest):' in l:
        start = i
        break
for i in range(start, len(lines)):
    if 'return {"status": "success"' in lines[i]:
        end = i
        break

fixed_func = """async def create_character(req: CharacterCreateRequest):
    api_key = f"{req.email}#{req.name}"
    res = supabase.table("characters").select("api_key").eq("api_key", api_key).execute()
    if res.data:
        raise HTTPException(status_code=400, detail="Character already exists.")
    
    # 1. Vygenerujeme svet
    world_data = None
    if req.game_mode == "campaign":
        try:
            import json
            import world_generator
            
            math_world = world_generator.generate_world_data()
            
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            world_prompt = f\"\"\"
NAVRHUJEŠ WORLD BIBLE PRO HIGH FANTASY KAMPAŇ (AELTHGARD).

ABSOLUTNÍ PRAVIDLA SVĚTA:
1. Tón: Mix Fable a Zaklínače (Pohádkový vizuál, ale dospělé, krvavé a zkorumpované problémy).
2. Magie: Nedá se učit. Je to "Probuzení", vzácný dar nebo kletba od bohů. Jsou to "Vyvolení".
3. Zjevení: Bohové (Solarian - Řád a Krev, Vyldia - Příroda a Chaos, Kull - Stíny a Lži) se začínají zjevovat lidem.
4. Království: Kontinent je rozdělen na 7 království. 

Zde jsou základní archetypy 7 království (kingdom_id 1 až 7):
1K: Upadající Impérium (Zkorumpovaná šlechta)
2K: Teokracie (Náboženští fanatici Řádu)
3K: Divoké Kmeny (Přeživší v bažinách/lesích, krevní rituály)
4K: Obchodní Gildy (Žoldáci a peníze, žádný král)
5K: Karanténní Zóna (Magická pustina, monstra)
6K: Severní Hradba (Militarizovaná stráž před zlem)
7K: Útočiště Vyvolených (Tajemní mágové a izolace)

Tady je JSON se všemi body zájmu (POI) na vygenerované mapě:
{json.dumps(math_world['pois'], ensure_ascii=False)}

Tvým úkolem je vrátit POUZE validní JSON s následující strukturou:
{{
  "main_plot": "Krátký popis hlavní zápletky světa (1 odstavec)",
  "locations": [
    {{"id": 1, "name": "Město X", "description": "Popis města a co se tam děje", "ruler": "Kdo tam vládne"}}
  ],
  "key_npcs": [
    {{"name": "Jméno", "role": "Frakce/Role", "motive": "Co chce?"}}
  ]
}}
\"\"\"
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=world_prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            ai_world_data = json.loads(clean_text)
            
            # Merge math world and AI lore
            world_data = {
                "hexes": math_world["hexes"],
                "pois": math_world["pois"],
                "main_plot": ai_world_data.get("main_plot"),
                "locations": ai_world_data.get("locations"),
                "key_npcs": ai_world_data.get("key_npcs")
            }
        except Exception as e:
            world_data = None
            print(f"World gen failed: {e}")

    # 2. Vygenerujeme Intro pomoci sveta
    try:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        world_context = ""
        if world_data:
            import json
            world_context = f"\\n\\n[HRAJE SE PŘÍBĚHOVÁ KAMPAŇ]: Zamotej postavu rovnou do vygenerované zápletky tohoto světa!\\nZápletka: {world_data.get('main_plot')}\\nMísto startu: Napiš intro odehrávající se v jedné z těchto lokací: {json.dumps(world_data.get('locations'), ensure_ascii=False)}\\nZmiň v intru letmo klíčové NPC: {json.dumps(world_data.get('key_npcs'), ensure_ascii=False)}"
        
        prompt = f'''
Jsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil novou postavu:
Jméno: {req.name}
Rasa: {req.race}
Třída: {req.dnd_class}
Staty: {req.stats}
{world_context}

Napiš poutavý první odstavec (intro), který postavu rovnou vrhne do děje (a do kampaně, pokud je zadaná). Zohledni její rasu a třídu. Nezačínej v obyčejné hospodě, začni na zajímavém místě spjatém se zápletkou světa (pokud existuje).
Vrať POUZE json ve formátu:
{{
  "intro_text": "Text vypravěče (min 3 věty)...",
  "popis_okoli": "Stručný popis lokace"
}}
'''
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        import json
        
        try:
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            data = json.loads(clean_text)
            intro_text = data.get("intro_text", "Mlha se rozestupuje...")
            popis_okoli = data.get("popis_okoli", "Neznámé místo.")
        except Exception:
            intro_text = response.text.strip()
            popis_okoli = "Neznámé místo."
            
    except Exception as e:
        intro_text = "Vítej ve světě Aelthgard. Mlha se pomalu rozestupuje a tvé dobrodružství právě začíná..."
        popis_okoli = "Zamlžený hvozd."
        
    initial_history = [
        {"role": "model", "text": f'''{{"aktualni_region": "Začátek cesty", "popis_okoli": "{popis_okoli}", "vypravec": "{intro_text}", "nabizene_akce": ["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]}}'''}
    ]

    # Nacteni tridnich dat
    cls_data = CLASS_TEMPLATES.get(req.dnd_class, CLASS_TEMPLATES["Bojovník"]) # fallback

    initial_location = None
    if world_data and world_data.get("hexes"):
        # Put player somewhere near the center (0,0) or a starting village
        # Find hex (0,0) or closest
        center_hex = next((h for h in world_data["hexes"] if h["q"] == 0 and h["r"] == 0), world_data["hexes"][0])
        initial_location = {"q": center_hex["q"], "r": center_hex["r"], "biome": center_hex["biome"]}

    state = {
        "hp": 100,
        "max_hp": 100,
        "level": 1,
        "xp": 0,
        "inventory": cls_data["starting_equipment"],
        "gold": 15,
        "skills": cls_data["skills"],
        "active_quests": [],
        "completed_quests": [],
        "stats": req.stats,
        "equipped": {
            "hlavní ruka": cls_data["starting_equipment"][0]["id"] if cls_data["starting_equipment"] else None,
            "zbroj": cls_data["starting_equipment"][1]["id"] if len(cls_data["starting_equipment"]) > 1 else None
        },
        "world_data": world_data,
        "player_location": initial_location,
        "rations": 3
    }
    
    supabase.table("characters").insert({
        "api_key": api_key,
        "name": req.name,
        "dnd_class": req.dnd_class,
        "race": req.race,
        "state": state,
        "history": initial_history
    }).execute()
    
    return {"status": "success", "api_key": api_key, "message": "Úspěšně ses probudil v novém těle.", "intro_text": intro_text, "popis_okoli": popis_okoli, "state": state}
"""

lines = lines[:start] + [fixed_func + "\n"] + lines[end+1:]

with codecs.open('ai-rpg-backend/main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
