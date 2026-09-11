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
        api_key = req.api_key if req.api_key and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="Chybí platný GEMINI_API_KEY v konfiguraci serveru.")
        client = genai.Client(api_key=api_key)
        prompt = f"""Jsi mistr D&D 5e a hlavní vypravěč temného fantasy světa Aelthgard.
Vytvoř atmosférický a unikátní původ postavy:
- Jméno: {req.name}
- Rasa: {req.race or "Člověk"}
- Povolání: {req.dnd_class or "Bojovník"}
- Klíčová slova od hráče: {req.keywords}

Vrať POUZE validní JSON objekt ve formátu:
{{
  "appearance": "Atmosférický popis vzhledu, tváře, jizev a oděvu v češtině (2-3 věty).",
  "personality": "Povaha, manýry, morální kompas a osobní motivace v češtině (2-3 věty).",
  "backstory": "Historie postavy, její původ z království Aelthgardu a událost, která ji donutila vydat se na cestu (3-4 věty)."
}}"""
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction='Jsi expert na D&D lore a svět Aelthgard. Vrať čistý JSON s klíči: appearance, personality, backstory.',
                response_mime_type='application/json',
                temperature=0.8
            )
        )
        import json
        clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
        data = json.loads(clean_text)
        return {
            "appearance": data.get("appearance", "Zkušený dobrodruh opředený tajemstvím."),
            "personality": data.get("personality", "Odhodlaný a obezřetný vůči cizincům."),
            "backstory": data.get("backstory", f"{req.name} se vydává na cestu napříč královstvími Aelthgardu.")
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Backstory generation error:", e)
        # Resilient procedural fallback so character creation never fails
        race_str = req.race or "Člověk"
        class_str = req.dnd_class or "Bojovník"
        name_str = req.name or "Bezejmenný"
        kw_str = req.keywords or "tajemný původ"
        return {
            "appearance": f"{name_str} má ošlehanou tvář typickou pro rod {race_str}, bystré oči a nese známky těžkého života v divočině Aelthgardu.",
            "personality": f"Je to přemýšlivý {class_str.lower()}, jehož charakter byl zformován událostmi: '{kw_str}'. Vůči cizincům je obezřetný, ale věrný svým přísahám.",
            "backstory": f"Pochází ze zapadlých koutů Aelthgardu. Události spojené s '{kw_str}' donutily hrdinu opustit rodný kraj a vydat se vstříc tajemstvím sedmi království."
        }

@router.post('/list-characters')
async def list_characters(req: ListCharactersRequest):
    try:
        clean_email = req.email.strip()
        db_res = supabase.table('characters').select('api_key, name, race, dnd_class, stats, state').ilike('api_key', f'{clean_email}#%').execute()
        return {'status': 'success', 'characters': db_res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/load-game')
@router.post('/load')
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

        # Self-healing history sanitizer: ensures both 'text' and 'content' keys exist
        history = char_data.get('history') or []
        history_modified = False
        normalized_history = []
        for msg in history:
            if not isinstance(msg, dict):
                continue
            role = msg.get('role') or ('user' if msg.get('type') == 'player' else 'model')
            text = msg.get('text') or msg.get('content') or ''
            if msg.get('text') != text or msg.get('content') != text or msg.get('role') != role:
                history_modified = True
            normalized_history.append({
                'role': role,
                'text': text,
                'content': text
            })
        if history_modified:
            char_data['history'] = normalized_history
            try:
                supabase.table('characters').update({'history': normalized_history}).eq('api_key', char_data['api_key']).execute()
            except Exception as he:
                print('Could not auto-save normalized history in load_game:', he)

        if not state.get('playerLocation') and state.get('world_data'):
            w_data = state.get('world_data')
            cap = next((p for p in w_data.get('pois', []) if p.get('type') == 'Capital' and p.get('kingdom_id') != 5), None)
            if not cap:
                cap = next((p for p in w_data.get('pois', []) if p.get('type') == 'Capital'), None)
            if cap:
                state['playerLocation'] = {'q': cap['q'], 'r': cap['r'], 'kingdom_id': cap.get('kingdom_id'), 'biome': cap.get('terrain', 'Plains')}
            elif w_data.get('hex_grid'):
                first_h = next((h for h in w_data['hex_grid'] if h.get('kingdom_id') != 5), w_data['hex_grid'][0])
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

        if 'rations' not in state:
            state['rations'] = 3
            state_modified = True
        if 'activeBuffs' not in state or not isinstance(state.get('activeBuffs'), list):
            state['activeBuffs'] = []
            state_modified = True
        if 'activeMount' not in state:
            state['activeMount'] = None
            state_modified = True
        if 'reputation' not in state or not isinstance(state.get('reputation'), dict):
            state['reputation'] = {str(i): 0 for i in range(1, 8)}
            state_modified = True
        if 'day' not in state:
            state['day'] = 1
            state_modified = True
        if 'chronicle' not in state:
            state['chronicle'] = []
            state_modified = True

        if state_modified:
            try:
                supabase.table('characters').update({'state': state}).eq('api_key', char_data['api_key']).execute()
            except Exception as se:
                print('Could not auto-save repaired state in load_game:', se)
        
        char_data['state'] = state
        return {'status': 'success', 'character': char_data, 'state': state}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/delete-character')
async def delete_character(req: DeleteCharacterRequest):
    try:
        clean_name = req.name.strip()
        clean_email = (req.email or '').strip()
        if clean_email:
            api_key = f'{clean_email}#{clean_name}'
            supabase.table('characters').delete().eq('api_key', api_key).execute()
        else:
            supabase.table('characters').delete().ilike('api_key', f'%#{clean_name}').execute()
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
    clean_name = req.name.strip()
    clean_email = (req.email or '').strip() or 'hrac@aelthgard.com'
    api_key = f'{clean_email}#{clean_name}'
    res = supabase.table('characters').select('api_key').eq('api_key', api_key).execute()
    if res.data:
        raise HTTPException(status_code=400, detail=f"Postava se jménem '{clean_name}' již existuje. Zvol prosím jiné jméno nebo původní postavu smaž.")
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
    # ===== SPAWN LOCK: Oakhaven (Valerijské Impérium) =====
    # Hráč vždy začíná v Oakhaven – výchozím uzlu světa.
    # Mapa (current_node_id) i uvítací intro musí odrážet tuto lokaci.
    initial_location = {'q': 0, 'r': 0, 'biome': 'Plains', 'kingdom_id': 1}
    start_kingdom_name = 'Valerijské Impérium'
    start_loc_type = 'mesto'
    start_loc_name = 'Oakhaven'

    # Načteme popis Oakhaven z naší Obsidian knowledge base
    try:
        from app.data.world_map import get_node as _get_node
        _oakhaven = _get_node('oakhaven')
        oakhaven_description = _oakhaven.get('description', 'Pohraničním městečkem Oakhaven projíždějí kupci z celého kontinentu. Kamenné domy lemují dlážděné náměstí a v povětří voní čerstvý chléb smíšený s pachem stájí.') if _oakhaven else 'Pohraničním městečkem Oakhaven projíždějí kupci z celého kontinentu.'
    except Exception:
        oakhaven_description = 'Pohraničním městečkem Oakhaven projíždějí kupci z celého kontinentu.'

    try:
        client = genai.Client(api_key=req.api_key if req.api_key and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY'))
        import json, random

        # 5 pestrých startovních archetypů zakotvených v Oakhaven
        start_archetypes = [
            {
                "theme": "ZÁHADA A NÁLEZ (Průzkum)",
                "situation": "Postava dorazila do Oakhaven a hned u vstupní brány zahlédla cosi znepokojivého: záhadný zapečetěný dopis položený na kameni s jejím jménem, nebo podivný magický symbol vyrytý do zdi mlýna. Cílem je probudit zvědavost a umožnit vyšetřování."
            },
            {
                "theme": "POUTNÍK A SPOLEČNOST (Sociální interakce a zvěsti)",
                "situation": "Postava po dlouhé cestě dorazila do Oakhaven a sedí u krbu v hostinci 'U Zlomeného štítu'. Zaslechne šeptající cizince hovořit o ztraceném prstenu mlynáře Borise, nebo k ní přistoupí unavený posel s prosbou o pomoc."
            },
            {
                "theme": "ŽIVEL A PŘEŽITÍ (Atmosférický příchod)",
                "situation": "Oblast právě zasáhla náhlá prudká bouře. Postava hledá úkryt v Oakhaven pod střechou hostince 'U Zlomeného štítu', kde se tísní cestovatelé, mlynář Boris a pár ustarané gardy strážmistra Aldrice."
            },
            {
                "theme": "OSOBNÍ STOPA (Napojení na minulost a cíl)",
                "situation": "Postava dorazila do Oakhaven sledujíc stopu svého minulého života. Právě zahlédla symbol nebo tvář, která ji sem přivedla. V náměstí stojí strážmistr Aldric a sleduje ji přísným pohledem."
            },
            {
                "theme": "MORÁLNÍ DILEMA A NAPĚTÍ (Konflikt beze zbraní)",
                "situation": "Na Oakhavenském náměstí probíhá vyhrocený spor: výběrčí daní od valerijského Impéria nespravedlivě viní mlynáře Borise ze zadržení dávky mouky. Kolem stojí hlouček. Žádné vytasené meče – jen slova, autorita a lest."
            }
        ]
        chosen_arch = random.choice(start_archetypes)

        raw_backstory = getattr(req, 'backstory', '') or ''
        if isinstance(raw_backstory, dict):
            parts = []
            if raw_backstory.get('appearance'): parts.append(f"Vzhled: {raw_backstory['appearance']}")
            if raw_backstory.get('personality'): parts.append(f"Osobnost: {raw_backstory['personality']}")
            if raw_backstory.get('backstory'): parts.append(f"Příběh: {raw_backstory['backstory']}")
            backstory_info = "\n".join(parts) if parts else "Neuvedeno (začíná jako nový poutník bez zapsané minulosti)."
        elif isinstance(raw_backstory, str) and raw_backstory.strip():
            backstory_info = raw_backstory.strip()
        else:
            backstory_info = "Neuvedeno (začíná jako nový poutník bez zapsané minulosti)."

        main_plot_line = world_data.get('main_plot', '') if world_data else ''
        world_context = f"""
[SVĚT AELTHGARD – POHRANIČÍ VALERIJSKÉHO IMPÉRIA]:
{f"Zápletka kontinentu: {main_plot_line}" if main_plot_line else ""}
Místo startu: OAKHAVEN – pohraničním obchodním město v říši Valerijského Impéria.
Popis prostředí: {oakhaven_description}
Přítomné postavy: Strážmistr Aldric (cynický veterán gardy, přísný ale spravedlivý) a mlynář Boris Mlynář (unavený muž v padesátce, smutné oči, zlatý prsten mu nedávno ukradli).

[POSTAVA HRÁČE]:
- Jméno: {req.name}
- Povolání: {req.dnd_class} | Rasa: {req.race}
- Příběhové pozadí (Backstory): {backstory_info}

[STARTOVNÍ SCÉNÁŘ – TÉMA: {chosen_arch['theme']}]:
{chosen_arch['situation']}

[PŘÍSNÁ PRAVIDLA PRO INTRO]:
1. PŘÍSNÝ ZÁKAZ AUTOMATICKÉHO BOJE V 1. TAHU! ŽÁDNÁ inkvizice, žádné přepadení, žádný souboj. Hráč se má rozkoukat a zvolit svůj styl.
2. Hráč začíná VÝHRADNĚ V OAKHAVEN. Nezačínej jinde!
3. Ve 2-3 větách atmosféricky nalaď prostředí Oakhavenu (zvuky, počasí, vůně, atmosféra pohraničního města).
4. Poté představ výše popsanou startovní situaci.
5. 'nabizene_akce' MUSÍ nabídnout 3 ZCELA ODLIŠNÉ PŘÍSTUPY:
   - Možnost 1: Průzkum / Pozorování / Zkoumání detailů okolí Oakhavenu.
   - Možnost 2: Sociální interakce / Rozhovor s Borisem nebo Aldricem.
   - Možnost 3: Akce specifická pro povolání/rasu ({req.dnd_class}/{req.race}).
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
        
    initial_history = [{'role': 'model', 'text': json.dumps({
        'aktualni_region': 'Oakhaven',
        'popis_okoli': popis_okoli,
        'vypravec': intro_text,
        'nabizene_akce': nabizene_akce
    }, ensure_ascii=False)}]

    cls_data = CLASS_TEMPLATES.get(req.dnd_class, CLASS_TEMPLATES['Bojovník'])
    start_loc_name = 'Oakhaven'  # pevně nastaveno výše, nikdy nepřepisovat
    
    initial_equipped = auto_equip_items(cls_data['inventory'], cls_data.get('equipped'))
    state = {
        'hp': 100, 
        'max_hp': 100, 
        'level': 1, 
        'xp': 0, 
        'inventory': cls_data['inventory'], 
        'gold': 15, 
        'skills': cls_data['starting_skills'], 
        'preparedSkills': [s['id'] for s in cls_data.get('starting_skills', []) if s.get('id')],
        'game_mode': getattr(req, 'game_mode', 'campaign') or 'campaign',
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
        'current_node_id': 'oakhaven',
        'rations': 3,
        'backstory': getattr(req, 'backstory', '') or '',
        'version': '2.1.0',
        'activeBuffs': [],
        'activeMount': None,
        'reputation': {str(i): 0 for i in range(1, 8)},
        'currentSpellSlots': 2 if any(c in (req.dnd_class or '').lower() for c in ['čaroděj', 'kouzelník', 'klerik', 'druid', 'bard', 'černokněžník']) else 0,
        'maxSpellSlots': 2 if any(c in (req.dnd_class or '').lower() for c in ['čaroděj', 'kouzelník', 'klerik', 'druid', 'bard', 'černokněžník']) else 0,
        'day': 1,
        'chronicle': []
    }
    

    supabase.table('characters').insert({'api_key': api_key, 'name': req.name, 'dnd_class': req.dnd_class, 'race': req.race, 'state': state, 'history': initial_history}).execute()
    return {'status': 'success', 'api_key': api_key, 'message': 'Úspěšně ses probudil v novém těle.', 'intro_text': intro_text, 'popis_okoli': popis_okoli, 'state': state}

