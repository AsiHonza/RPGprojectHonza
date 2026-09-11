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
    import world_generator
    import random
    clean_name = req.name.strip()
    clean_email = (req.email or '').strip() or 'hrac@aelthgard.com'
    api_key = f'{clean_email}#{clean_name}'
    res = supabase.table('characters').select('api_key').eq('api_key', api_key).execute()
    if res.data:
        raise HTTPException(status_code=400, detail=f"Postava se jménem '{clean_name}' již existuje. Zvol prosím jiné jméno nebo původní postavu smaž.")
    world_data = None
    if req.game_mode == 'campaign':
        # 100% Deterministický svět pro 1. Akt z Obsidian kánonu (bez volání Gemini)
        math_world = world_generator.generate_world_data()
        world_data = {
            'hex_grid': math_world.get('hex_grid', []),
            'pois': math_world.get('pois', []),
            'main_plot': "V pohraničním údolí Oakhaven se probouzejí temné síly zapomenutého boha Kulla a solariánská inkvizice stupňuje svůj teror.",
            'locations': [
                {"id": 1, "name": "Oakhaven", "description": "Pohraniční město s hrázděnými domy, starým mlýnem a pevnou palisádou.", "ruler": "Strážmistr Aldric"},
                {"id": 2, "name": "Stará křižovatka", "description": "Zpustlé rozcestí starých císařských cest s vyhořelou mýtnicí a doupětem banditů.", "ruler": "Bandité"},
                {"id": 3, "name": "Ruiny kláštera", "description": "Rozvaliny kláštera sv. Judity ukrývající prastaré krypty boha Kulla.", "ruler": "Kultisté"},
                {"id": 4, "name": "Opuštěný důl", "description": "Zavalené štoly na úpatí hor střežené trogly.", "ruler": "Příšery"},
                {"id": 5, "name": "Temný hvozd", "description": "Hluboké lesy plné zmutovaných šelem a prastaré magie Vyldie.", "ruler": "Příroda"}
            ],
            'key_npcs': [
                {"name": "Boris Mlynář", "role": "Mlynář v Oakhaven", "motive": "Najít snubní prsten své zesnulé ženy Anny"},
                {"name": "Strážmistr Aldric", "role": "Velitel městské stráže", "motive": "Udržet pořádek a chránit obyvatele Oakhaven"},
                {"name": "Inkvizitor Kaelen", "role": "Vyslanec Solariana", "motive": "Vymýtit kacířství a kult boha Kulla za každou cenu"}
            ]
        }
    else:
        try:
            math_world = world_generator.generate_world_data()
            client = genai.Client(api_key=req.api_key if req.api_key and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY'))
            world_prompt = f"""
NAVRHUJEŠ WORLD BIBLE PRO HIGH FANTASY KAMPAŇ (AELTHGARD).
ABSOLUTNÍ PRAVIDLA SVĚTA:
1. Tón: Mix Fable a Zaklínače.
2. Magie: Probuzení od bohů.
3. Bohové: Solarian, Vyldia, Kull.
4. Království: 7 království.
Tady je JSON se všemi body zájmu (POI):
{json.dumps(math_world['pois'], ensure_ascii=False)}
Vrať POUZE validní JSON s klíči: main_plot, locations, key_npcs.
"""
            response = client.models.generate_content(model='gemini-3.6-flash', contents=world_prompt, config=types.GenerateContentConfig(response_mime_type='application/json'))
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            ai_world_data = json.loads(clean_text)
            world_data = {'hex_grid': math_world.get('hex_grid', []), 'pois': math_world['pois'], 'main_plot': ai_world_data.get('main_plot'), 'locations': ai_world_data.get('locations'), 'key_npcs': ai_world_data.get('key_npcs')}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Chyba při generování světa: {str(e)}')

    # ===== SPAWN LOCK: Oakhaven (Valerijské Impérium) =====
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

    if req.game_mode == 'campaign':
        # 100% Deterministický startovní prolog 1. Aktu – Kletba údolí Oakhaven (žádné volání Gemini)
        intro_text = (
            f"Ranní mlha se líně převaluje přes dřevěné palisády Oakhavenu. V chladném povětří voní čerstvě pečený chléb a vlhké březové dřevo, avšak poklidnou atmosféru pohraničního městečka protíná zoufalý nářek z nedalekého starého mlýna.\n\n"
            f"Mlynář Boris tam v šeru lomí rukama nad vylomenou komorou, zatímco na dlážděném náměstí u Pařezu Pradubu strážmistr Aldric s kamennou tváří dohlíží na ranní hlídku městské gardy.\n\n"
            f"Tvůj příchod nezůstal bez povšimnutí – jako nový poutník ({req.race} {req.dnd_class}) stojíš na prahu událostí, které brzy rozhodnou o osudu celého údolí."
        )
        popis_okoli = "Oakhaven – Náměstí u Pradubu. Vzduch voní chlebem a březovým dřevem. Ze starého mlýna se ozývá nářek mlynáře Borise."
        nabizene_akce = [
            "Vydat se ke Starému mlýnu a zjistit, proč mlynář Boris pláče",
            "Zastavit se u Strážmistra Aldrica na strážnici a poptat se na situaci",
            "Otevřít přehled města a prozkoumat čtvrti Oakhavenu"
        ]
    else:
        # Sandbox mód s AI vypravěčem
        try:
            client = genai.Client(api_key=req.api_key if req.api_key and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY'))

            start_archetypes = [
                {
                    "theme": "ZÁHADA A NÁLEZ (Průzkum)",
                    "situation": "Postava dorazila do Oakhaven a hned u vstupní brány zahlédla cosi znepokojivého: záhadný zapečetěný dopis položený na kameni s jejím jménem, nebo podivný magický symbol vyrytý do zdi mlýna."
                },
                {
                    "theme": "POUTNÍK A SPOLEČNOST (Sociální interakce a zvěsti)",
                    "situation": "Postava po dlouhé cestě dorazila do Oakhaven a sedí u krbu v hostinci 'U Zlomeného štítu'. Zaslechne šeptající cizince hovořit o ztraceném prstenu mlynáře Borise."
                },
                {
                    "theme": "ŽIVEL A PŘEŽITÍ (Atmosférický příchod)",
                    "situation": "Oblast právě zasáhla náhlá prudká bouře. Postava hledá úkryt v Oakhaven pod střechou hostince 'U Zlomeného štítu', kde se tísní cestovatelé a pár gardistů."
                }
            ]
            chosen_arch = random.choice(start_archetypes)

            raw_backstory = getattr(req, 'backstory', '') or ''
            if isinstance(raw_backstory, dict):
                parts = []
                if raw_backstory.get('appearance'): parts.append(f"Vzhled: {raw_backstory['appearance']}")
                if raw_backstory.get('personality'): parts.append(f"Osobnost: {raw_backstory['personality']}")
                if raw_backstory.get('backstory'): parts.append(f"Příběh: {raw_backstory['backstory']}")
                backstory_info = "\n".join(parts) if parts else "Nový poutník bez zapsané minulosti."
            elif isinstance(raw_backstory, str) and raw_backstory.strip():
                backstory_info = raw_backstory.strip()
            else:
                backstory_info = "Nový poutník bez zapsané minulosti."

            main_plot_line = world_data.get('main_plot', '') if world_data else ''
            world_context = f"""
[SVĚT AELTHGARD – POHRANIČÍ VALERIJSKÉHO IMPÉRIA]:
{f"Zápletka kontinentu: {main_plot_line}" if main_plot_line else ""}
Místo startu: OAKHAVEN – pohraniční obchodní město.
Popis prostředí: {oakhaven_description}
Přítomné postavy: Strážmistr Aldric a mlynář Boris Mlynář.
[POSTAVA HRÁČE]: {req.name}, {req.dnd_class}, {req.race}. Minulost: {backstory_info}
[STARTOVNÍ SCÉNÁŘ – TÉMA: {chosen_arch['theme']}]: {chosen_arch['situation']}
"""
            prompt = f'''
Jsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil postavu:
Jméno: {req.name}, Rasa: {req.race}, Třída: {req.dnd_class}, Staty: {req.stats}
{world_context}
Vrať POUZE json: {{"intro_text": "...", "popis_okoli": "...", "nabizene_akce": ["...", "...", "..."]}}
'''
            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type='application/json')
            )
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            data = json.loads(clean_text)
            intro_text = data.get('intro_text', 'Mlha se rozestupuje a ty se rozhlížíš po okolí...')
            popis_okoli = data.get('popis_okoli', 'Oakhaven – Náměstí.')
            nabizene_akce = data.get('nabizene_akce', ['Rozhlédnout se', 'Zkontrolovat výstroj', 'Promluvit s nejbližším člověkem'])
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

