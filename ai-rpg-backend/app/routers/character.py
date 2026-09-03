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
        if not state.get('playerLocation') and state.get('world_data'):
            w_data = state.get('world_data')
            cap = next((p for p in w_data.get('pois', []) if p.get('type') == 'Capital'), None)
            if cap:
                state['playerLocation'] = {'q': cap['q'], 'r': cap['r'], 'kingdom_id': cap.get('kingdom_id'), 'biome': cap.get('terrain', 'Plains')}
            elif w_data.get('hex_grid'):
                first_h = w_data['hex_grid'][0]
                state['playerLocation'] = {'q': first_h['q'], 'r': first_h['r'], 'kingdom_id': first_h.get('kingdom_id'), 'biome': first_h.get('terrain', 'Plains')}
            try:
                supabase.table('characters').update({'state': state}).eq('api_key', char_data['api_key']).execute()
            except Exception as se:
                print('Could not auto-save repaired location:', se)
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
    if world_data and world_data.get('pois'):
        import random
        capitals = [p for p in world_data['pois'] if p.get('type') == 'Capital']
        if capitals:
            start_poi = random.choice(capitals)
            initial_location = {'q': start_poi['q'], 'r': start_poi['r'], 'biome': start_poi.get('terrain', 'Plains'), 'kingdom_id': start_poi.get('kingdom_id')}
        else:
            center_hex = world_data.get('hex_grid', [{}])[0]
            initial_location = {'q': center_hex.get('q', 0), 'r': center_hex.get('r', 0), 'biome': center_hex.get('terrain', 'Plains')}
    try:
        client = genai.Client(api_key=req.api_key if req.api_key and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY'))
        world_context = ''
        if world_data:
            import json
            kingdom_names = {1: 'Valerijské Impérium', 2: 'Svatá Říše Solariova', 3: 'Kmeny z Hlubokých hvozdů', 4: 'Svobodná města', 5: 'Karanténní Zóna', 6: 'Železný Práh', 7: 'Tajemné Útočiště'}
            start_kingdom_id = initial_location.get('kingdom_id') if initial_location else 1
            start_kingdom_name = kingdom_names.get(start_kingdom_id, 'Neznámé království')
            world_context = f"\n[HRAJE SE PŘÍBĚHOVÁ KAMPAŇ]: Zamotej postavu rovnou do vygenerované zápletky tohoto světa!\nZápletka: {world_data.get('main_plot')}\nMísto startu: Hráč právě začíná ve frakci/království {start_kingdom_name} (Souřadnice: {initial_location['q']}, {initial_location['r']}).\nKlíčová NPC: {json.dumps(world_data.get('key_npcs'), ensure_ascii=False)}\n\nKRITICKÝ POŽADAVEK NA INTRO:\n1. Nejprve ve 2-3 větách atmosféricky představ dané království a jeho aktuální náladu či napětí.\n2. IHNED potom vhoď postavu do konkrétní dramatické události přímo před jejíma očima (in media res)! Může to být:\n   - Náhlé oslovení od zoufalého měšťana, uprchlíka, strážného nebo zraněného posla.\n   - Nečekaný konflikt, rvačka, útok bestie nebo přepadení.\n   - Nález podezřelého předmětu, tajemného svitku či mrtvoly s klíčem.\n   - Zásah fanatické inkvizice nebo kultistů vyvolávající paniku v davu.\n3. Nech situaci otevřenou a napínavou, aby postava musela okamžitě reagovat!\n4. Vygeneruj přesně 3 smysluplné, konkrétní nabízené akce reagující na tuto situaci.\n"
        prompt = f'\nJsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil novou postavu:\nJméno: {req.name}\nRasa: {req.race}\nTřída: {req.dnd_class}\nStaty: {req.stats}\n{world_context}\n\nVrať POUZE json ve formátu:\n{{\n  "intro_text": "Text vypravěče (atmosférické představení království + okamžitá dramatická událost/konflikt/dialog)...",\n  "popis_okoli": "Stručný popis lokace",\n  "nabizene_akce": ["Konkrétní reakce 1 na událost", "Konkrétní reakce 2 (využití schopnosti či povolání)", "Konkrétní reakce 3 (alternativní přístup)"]\n}}\n'
        response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt, config=types.GenerateContentConfig(response_mime_type='application/json'))
        import json
        try:
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            data = json.loads(clean_text)
            intro_text = data.get('intro_text', 'Mlha se rozestupuje...')
            popis_okoli = data.get('popis_okoli', 'Neznámé místo.')
            nabizene_akce = data.get('nabizene_akce', ['Rozhlédnout se', 'Zkontrolovat vybavení', 'Vydat se vpřed'])
            if not isinstance(nabizene_akce, list) or len(nabizene_akce) == 0:
                nabizene_akce = ['Rozhlédnout se', 'Zkontrolovat vybavení', 'Vydat se vpřed']
        except Exception:
            intro_text = response.text.strip()
            popis_okoli = 'Neznámé místo.'
            nabizene_akce = ['Rozhlédnout se', 'Zkontrolovat vybavení', 'Vydat se vpřed']
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Chyba při generování intro textu: {str(e)}')
    initial_history = [{'role': 'model', 'text': json.dumps({'aktualni_region': start_kingdom_name if world_data else 'Začátek cesty', 'popis_okoli': popis_okoli, 'vypravec': intro_text, 'nabizene_akce': nabizene_akce}, ensure_ascii=False)}]
    cls_data = CLASS_TEMPLATES.get(req.dnd_class, CLASS_TEMPLATES['Bojovník'])
    start_loc_name = start_kingdom_name
    if initial_location and world_data and world_data.get('pois'):
        matching_poi = next((p for p in world_data['pois'] if p.get('q') == initial_location.get('q') and p.get('r') == initial_location.get('r')), None)
        if matching_poi and matching_poi.get('name'):
            start_loc_name = matching_poi.get('name')
    state = {'hp': 100, 'max_hp': 100, 'level': 1, 'xp': 0, 'inventory': cls_data['inventory'], 'gold': 15, 'skills': cls_data['starting_skills'], 'active_quests': [], 'completed_quests': [], 'stats': req.stats, 'equipped': cls_data['equipped'], 'world_data': world_data, 'playerLocation': initial_location, 'currentRegion': start_loc_name, 'current_region': start_loc_name, 'locationType': 'mesto', 'typ_lokace': 'mesto', 'currentLocationDesc': popis_okoli, 'popis_okoli': popis_okoli, 'pointsOfInterest': [], 'vyznamna_mista': [], 'zname_postavy': [], 'rations': 3}
    supabase.table('characters').insert({'api_key': api_key, 'name': req.name, 'dnd_class': req.dnd_class, 'race': req.race, 'state': state, 'history': initial_history}).execute()
    return {'status': 'success', 'api_key': api_key, 'message': 'Úspěšně ses probudil v novém těle.', 'intro_text': intro_text, 'popis_okoli': popis_okoli, 'state': state}

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
        db_key = f'{req.email}#{req.name}'
        supabase.table('characters').update({'state': req.state}).eq('api_key', db_key).execute()
        return {'status': 'success'}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Chyba při ukládání: {str(e)}')