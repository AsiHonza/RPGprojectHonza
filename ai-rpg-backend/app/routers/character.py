from fastapi import APIRouter, HTTPException
from app.models.schemas import *
from app.core.config import supabase
from google import genai
from google.genai import types
import os
import json
import uuid
import random
from app.services.game_service import *

router = APIRouter(prefix="", tags=["Character"])

@router.post('/generate-backstory')
async def generate_backstory(req: BackstoryRequest):
    try:
        client = genai.Client(api_key=req.api_key if req.api_key and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY'))
        prompt = f'Vytvoř D&D pozadí pro postavu. Jméno: {req.name}, Rasa: {req.race}, Povolání: {req.dnd_class}. Klíčová slova od hráče: {req.keywords}.'
        response = client.models.generate_content(model='gemini-3.6-flash', contents=prompt, config=types.GenerateContentConfig(system_instruction='Jsi expert na D&D lore. Vygeneruj přesně 3 věci: appearance (vzhled), personality (chování) a backstory (historie).', response_mime_type='application/json', response_schema=GenerateBackstoryResponse, temperature=0.8))
        import json
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Chyba: {str(e)}')

@router.post('/list-characters')
async def list_characters(req: ListCharactersRequest):
    try:
        clean_email = req.email.strip()
        db_res = supabase.table('characters').select('api_key, name, race, dnd_class, stats, state').ilike('api_key', f'{clean_email}#%').execute()
        return {'status': 'success', 'characters': db_res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/load-game')
async def load_game(req: LoadGameRequest):
    try:
        clean_email = req.email.strip()
        clean_name = req.name.strip()
        api_key = f'{clean_email}#{clean_name}'
        db_res = supabase.table('characters').select('*').ilike('api_key', api_key).execute()
        if not db_res.data:
            db_res = supabase.table('characters').select('*').eq('api_key', api_key).execute()
            if not db_res.data:
                raise HTTPException(status_code=404, detail='Character not found.')
        char_data = db_res.data[0]
        state = char_data.get('state') or {}
        state_modified = False

        if not state.get('playerLocation') and state.get('world_data'):
            w_data = state.get('world_data')
            cap = next((p for p in w_data.get('pois', []) if p.get('type') == 'Capital'), None)
            if cap:
                state['playerLocation'] = {'q': cap['q'], 'r': cap['r'], 'kingdom_id': cap.get('kingdom_id'), 'biome': cap.get('terrain', 'Plains')}
            elif w_data.get('hex_grid'):
                first_h = w_data['hex_grid'][0]
                state['playerLocation'] = {'q': first_h['q'], 'r': first_h['r'], 'kingdom_id': first_h.get('kingdom_id'), 'biome': first_h.get('terrain', 'Plains')}
            state_modified = True

        if state.get('quests') and isinstance(state['quests'], list):
            orig_len = len(state['quests'])
            cleaned = sanitize_and_deduplicate_quests(state['quests'])
            if len(cleaned) != orig_len or cleaned != state['quests']:
                state['quests'] = cleaned
                state_modified = True

        if state.get('inventory') and isinstance(state['inventory'], list):
            new_equipped = auto_equip_items(state['inventory'], state.get('equipped'))
            if new_equipped != state.get('equipped'):
                state['equipped'] = new_equipped
                state_modified = True

        if state_modified:
            try:
                supabase.table('characters').update({'state': state}).eq('api_key', char_data['api_key']).execute()
            except Exception as se:
                print('Could not auto-save repaired state in load_game:', se)
        
        char_data['state'] = state
        return {'status': 'success', 'character': char_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/delete-character')
async def delete_character(req: DeleteCharacterRequest):
    try:
        api_key = f'{req.email}#{req.name}'
        supabase.table('characters').delete().eq('api_key', api_key).execute()
        return {'status': 'success'}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/save-state')
async def save_state(req: SaveStateRequest):
    try:
        api_key = f'{req.email}#{req.name}'
        if req.state:
            if 'quests' in req.state and isinstance(req.state['quests'], list):
                req.state['quests'] = sanitize_and_deduplicate_quests(req.state['quests'])
            if 'inventory' in req.state and isinstance(req.state['inventory'], list):
                req.state['equipped'] = auto_equip_items(req.state['inventory'], req.state.get('equipped'))
        supabase.table('characters').update({'state': req.state}).eq('api_key', api_key).execute()
        return {'status': 'success'}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/create-character')
async def create_character(req: CharacterCreateRequest):
    api_key = f'{req.email}#{req.name}'
    res = supabase.table('characters').select('api_key').eq('api_key', api_key).execute()
    if res.data:
        raise HTTPException(status_code=400, detail='Character already exists.')
    world_data = None
    if req.game_mode == 'campaign':
        try:
            import json
            import world_generator
            math_world = world_generator.generate_world_data()
            client = genai.Client(api_key=req.api_key if req.api_key and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY'))
            world_prompt = f"""\nNAVRHUJEŠ WORLD BIBLE PRO HIGH FANTASY KAMPAŇ (AELTHGARD).\n\nABSOLUTNÍ PRAVIDLA SVĚTA:\n1. Tón: Mix Fable a Zaklínače (Pohádkový vizuál, ale dospělé, krvavé a zkorumpované problémy).\n2. Magie: Nedá se učit. Je to "Probuzení", vzácný dar nebo kletba od bohů. Jsou to "Vyvolení".\n3. Zjevení: Bohové (Solarian - Řád a Krev, Vyldia - Příroda a Chaos, Kull - Stíny a Lži) se začínají zjevovat lidem.\n4. Království: Kontinent je rozdělen na 7 království. \n\nZde jsou základní archetypy 7 království (kingdom_id 1 až 7):\n  1K (Valerijské Impérium): Upadající Impérium (Zkorumpovaná šlechta)\n  2K (Svatá říše Solariova): Teokracie (Náboženští fanatici Řádu)\n  3K (Kmeny z Hlubokých hvozdů): Divoké Kmeny (Přeživší v bažinách/lesích, krevní rituály)\n  4K (Svobodná města): Obchodní Gildy (Žoldáci a peníze, žádný král)\n  5K (Karanténní Zóna): Magická pustina, zamořená monstry\n  6K (Železný Práh): Severní Hradba (Militarizovaná stráž před zlem)\n  7K (Tajemné Útočiště): Izolované útočiště Vyvolených (Mágové)\n\n  DŮLEŽITÉ: Ve výstupech (názvech lokací ani popisech) NIKDY nepoužívej generické názvy jako "Království 6". Místo toho vždy použij název dané frakce/území z tohoto seznamu (např. Železný Práh).\n\nTady je JSON se všemi body zájmu (POI) na vygenerované mapě:\n{json.dumps(math_world['pois'], ensure_ascii=False)}\n\nTvým úkolem je vrátit POUZE validní JSON (žádný markdown, žádné komentáře). Vygeneruj MAXIMÁLNĚ 5 nejzajímavějších lokací a 5 klíčových NPC s následující strukturou:\n{{\n  "main_plot": "Krátký popis hlavní zápletky světa (1 odstavec)",\n  "locations": [\n    {{"id": 1, "name": "Město X", "description": "Popis města a co se tam děje", "ruler": "Kdo tam vládne"}}\n  ],\n  "key_npcs": [\n    {{"name": "Jméno", "role": "Frakce/Role", "motive": "Co chce?"}}\n  ]\n}}\n"""
            response = client.models.generate_content(model='gemini-3.6-flash', contents=world_prompt, config=types.GenerateContentConfig(response_mime_type='application/json'))
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            ai_world_data = json.loads(clean_text)
            world_data = {'hex_grid': math_world.get('hex_grid', []), 'pois': math_world['pois'], 'main_plot': ai_world_data.get('main_plot'), 'locations': ai_world_data.get('locations'), 'key_npcs': ai_world_data.get('key_npcs')}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Chyba při generování světa: {str(e)}')
    initial_location = None
    start_kingdom_name = 'Začátek cesty'
    start_loc_type = 'mesto'
    if world_data and world_data.get('pois'):
        import random
        # Dynamický a pestrý výběr startovní lokace (nejen hlavní město)
        all_candidate_pois = [p for p in world_data['pois'] if p.get('type') in ['Capital', 'Village', 'Shrine', 'Ruin']]
        if not all_candidate_pois:
            all_candidate_pois = world_data['pois']
            
        cls_lower = (req.dnd_class or "").lower()
        if any(c in cls_lower for c in ['druid', 'hranič', 'barbar']):
            preferred = ['Village', 'Shrine', 'Ruin', 'Capital']
        elif any(c in cls_lower for c in ['klerik', 'paladin']):
            preferred = ['Shrine', 'Capital', 'Village']
        elif any(c in cls_lower for c in ['tulák', 'bard']):
            preferred = ['Capital', 'Village']
        elif any(c in cls_lower for c in ['čaroděj', 'kouzelník', 'warlock', 'mág']):
            preferred = ['Shrine', 'Ruin', 'Capital', 'Village']
        else:
            preferred = ['Capital', 'Village', 'Shrine']
            
        matched = [p for p in all_candidate_pois if p.get('type') in preferred]
        start_poi = random.choice(matched if matched else all_candidate_pois)
        initial_location = {
            'q': start_poi['q'], 
            'r': start_poi['r'], 
            'biome': start_poi.get('terrain', 'Plains'), 
            'kingdom_id': start_poi.get('kingdom_id')
        }
        p_type = start_poi.get('type', 'Capital')
        if p_type == 'Capital':
            start_loc_type = 'mesto'
        elif p_type == 'Village':
            start_loc_type = 'vesnice'
        elif p_type == 'Shrine':
            start_loc_type = 'chram'
        elif p_type == 'Ruin':
            start_loc_type = 'ruiny'
        else:
            start_loc_type = 'divocina'
    else:
        initial_location = {'q': 0, 'r': 0, 'biome': 'Plains'}

    try:
        client = genai.Client(api_key=req.api_key if req.api_key and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY'))
        world_context = ''
        if world_data:
            import json, random
            kingdom_names = {
                1: 'Valerijské Impérium', 
                2: 'Svatá říše Solariova', 
                3: 'Kmeny z Hlubokých hvozdů', 
                4: 'Svobodná města', 
                5: 'Karanténní Zóna', 
                6: 'Železný Práh', 
                7: 'Tajemné útočiště'
            }
            start_kingdom_id = initial_location.get('kingdom_id') if initial_location else 1
            start_kingdom_name = kingdom_names.get(start_kingdom_id, 'Neznámé království')
            
            # 5 pestrých startovních archetypů (žádné vnucené rvačky a popravy v 1. tahu)
            start_archetypes = [
                {
                    "theme": "ZÁHADA A NÁLEZ (Průzkum)",
                    "situation": "Postava dorazila na místo nebo se probouzí a objevuje znepokojivou stopu: záhadný zapečetěný dopis/svitek určený pro ni, podivný magický symbol vyrytý na kameni, nebo zjišťuje, že zdejší studna či oltář začaly slabě zářit. Cílem je probudit zvědavost a umožnit vyšetřování."
                },
                {
                    "theme": "POUTNÍK A SPOLEČNOST (Sociální interakce a zvěsti)",
                    "situation": "Postava po dlouhé cestě sedí u krbu v hostinci, na rušném tržišti nebo u táborového ohně. Zaslechne dramatický rozhovor šeptajících cizinců o chystané zradě či pokladu, anebo k ní přistoupí místní kupec/posel s prosbou o pomoc a nabídkou odměny."
                },
                {
                    "theme": "ŽIVEL A PŘEŽITÍ (Atmosférický příchod)",
                    "situation": "Oblast právě zasáhla náhlá prudká bouře, hustá mlha nebo krupobití. Postava nachází narychlo úkryt pod střechou kaple, pod skalním převisem nebo ve staré kovárně, kde se už tísní několik dalších poutníků sdílejících oheň a své příběhy."
                },
                {
                    "theme": "OSOBNÍ STOPA (Napojení na minulost a cíl)",
                    "situation": "Úvod přímo navazuje na povolání nebo původ postavy. Sleduje stopu po svém ztraceném mistrovi, plní posvátné vnuknutí, nebo dorazila vyhledat dávného známého. Právě zahlédla stopu, známou tvář nebo symbol, který hledala."
                },
                {
                    "theme": "MORÁLNÍ DILEMA A NAPĚTÍ (Konflikt beze zbraní)",
                    "situation": "Na místě právě probíhá vyhrocený spor: místní správce či výběrčí nespravedlivě viní chudou bylinkářku nebo mladého tuláka z krádeže. Kolem stojí rozpačitý hlouček. Žádná poprava ani vytasené meče! Hráč má možnost zasáhnout slovem, autoritou, lstí, nebo se nepozorovaně prosmýknout kolem."
                }
            ]
            chosen_arch = random.choice(start_archetypes)
            backstory_info = req.backstory.strip() if getattr(req, 'backstory', None) and req.backstory.strip() else "Neuvedeno (začíná jako nový poutník bez zapsané minulosti)."

            world_context = f"""
[HRAJE SE PŘÍBĚHOVÁ KAMPAŇ]:
Zápletka kontinentu: {world_data.get('main_plot')}
Místo startu: Frakce {start_kingdom_name} (Souřadnice: [{initial_location['q']}, {initial_location['r']}], Typ prostředí: {start_loc_type}).
Klíčová NPC ve světě: {json.dumps(world_data.get('key_npcs', []), ensure_ascii=False)}

[POSTAVA HRÁČE]:
- Jméno: {req.name}
- Povolání: {req.dnd_class} | Rasa: {req.race}
- Příběhové pozadí (Backstory): {backstory_info}

[STARTOVNÍ SCÉNÁŘ - TÉMA: {chosen_arch['theme']}]:
{chosen_arch['situation']}

[PŘÍSNÁ PRAVIDLA PRO INTRO]:
1. PŘÍSNÝ ZÁKAZ AUTOMATICKÉHO BOJE V 1. TAHU! ŽÁDNÁ inkvizice, žádné přepadení se zbraní v ruce, žádný nucený souboj! Hráč se má v klidu rozkoukat, seznámit se světem a zvolit si svůj vlastní styl.
2. Ve 2-3 větách atmosféricky nalaď prostředí lokace (zvuky, počasí, atmosféra typu '{start_loc_type}' v říši '{start_kingdom_name}').
3. Poté představ výše popsanou startovní situaci.
4. 'nabizene_akce' MUSÍ nabídnout 3 ZCELA ODLIŠNÉ PŘÍSTUPY:
   - Možnost 1: Průzkum / Pozorování / Zkoumání detailů okolí.
   - Možnost 2: Sociální interakce / Rozhovor s přítomnou postavou.
   - Možnost 3: Akce specifická pro povolání/rasu ({req.dnd_class}/{req.race}) nebo poklidný odchod jinam.
   NIKDY nenabízej útočné bojové akce v 1. tahu!
"""
        prompt = f'''
Jsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil novou postavu:
Jméno: {req.name}
Rasa: {req.race}
Třída: {req.dnd_class}
Staty: {req.stats}
{world_context}

Vrať POUZE json ve formátu:
{{
  "intro_text": "Text vypravěče (atmosférické představení prostředí + startovní situace/záhada/dialog)...",
  "popis_okoli": "Stručný popis lokace",
  "nabizene_akce": ["Konkrétní volba 1 (průzkum)", "Konkrétní volba 2 (dialog/interakce)", "Konkrétní volba 3 (třída/kouzlo/přístup)"]
}}
'''
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type='application/json')
        )
        import json
        try:
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            data = json.loads(clean_text)
            intro_text = data.get('intro_text', 'Mlha se rozestupuje a ty se rozhlížíš po okolí...')
            popis_okoli = data.get('popis_okoli', 'Neznámé místo.')
            nabizene_akce = data.get('nabizene_akce', ['Rozhlédnout se', 'Zkontrolovat vybavení', 'Promluvit s nejbližším člověkem'])
            if not isinstance(nabizene_akce, list) or len(nabizene_akce) == 0:
                nabizene_akce = ['Rozhlédnout se', 'Zkontrolovat vybavení', 'Promluvit s nejbližším člověkem']
        except Exception:
            intro_text = response.text.strip()
            popis_okoli = 'Neznámé místo.'
            nabizene_akce = ['Rozhlédnout se', 'Zkontrolovat vybavení', 'Promluvit s nejbližším člověkem']
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Chyba při generování intro textu: {str(e)}')
        
    initial_history = [{
        'role': 'model', 
        'text': json.dumps({
            'aktualni_region': start_kingdom_name if world_data else 'Začátek cesty', 
            'popis_okoli': popis_okoli, 
            'vypravec': intro_text, 
            'nabizene_akce': nabizene_akce
        }, ensure_ascii=False)
    }]
    
    cls_data = CLASS_TEMPLATES.get(req.dnd_class, CLASS_TEMPLATES['Bojovník'])
    start_loc_name = start_kingdom_name
    if initial_location and world_data and world_data.get('pois'):
        matching_poi = next((p for p in world_data['pois'] if p.get('q') == initial_location.get('q') and p.get('r') == initial_location.get('r')), None)
        if matching_poi and matching_poi.get('name'):
            start_loc_name = matching_poi.get('name')
            
    initial_equipped = auto_equip_items(cls_data['inventory'], cls_data.get('equipped'))
    state = {
        'hp': 100, 
        'max_hp': 100, 
        'level': 1, 
        'xp': 0, 
        'inventory': cls_data['inventory'], 
        'gold': 15, 
        'skills': cls_data['starting_skills'], 
        'active_quests': [], 
        'completed_quests': [], 
        'stats': req.stats, 
        'equipped': initial_equipped, 
        'world_data': world_data, 
        'playerLocation': initial_location, 
        'currentRegion': start_loc_name, 
        'current_region': start_loc_name, 
        'locationType': start_loc_type, 
        'typ_lokace': start_loc_type, 
        'currentLocationDesc': popis_okoli, 
        'popis_okoli': popis_okoli, 
        'pointsOfInterest': [], 
        'vyznamna_mista': [], 
        'zname_postavy': [], 
        'rations': 3,
        'backstory': getattr(req, 'backstory', '') or ''
    }
    

    supabase.table('characters').insert({'api_key': api_key, 'name': req.name, 'dnd_class': req.dnd_class, 'race': req.race, 'state': state, 'history': initial_history}).execute()
    return {'status': 'success', 'api_key': api_key, 'message': 'Úspěšně ses probudil v novém těle.', 'intro_text': intro_text, 'popis_okoli': popis_okoli, 'state': state}

