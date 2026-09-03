from app.services.llm_service import *
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

router = APIRouter(prefix="", tags=["Game"])

@router.post('/action')
async def play_action(req: PlayerActionRequest):
    try:
        db_key = f'{req.email}#{req.name}'
        db_res = supabase.table('characters').select('history, name, race, dnd_class, state').eq('api_key', db_key).execute()
        if not db_res.data:
            raise HTTPException(status_code=404, detail='Postava nenalezena.')
        char_data = db_res.data[0]
        history = char_data.get('history', [])
        client = genai.Client(api_key=req.api_key if req.api_key and req.api_key != 'DUMMY' else os.environ.get('GEMINI_API_KEY'))
        contents = []
        for msg in history[-6:]:
            if msg['role'] == 'user':
                contents.append(types.Content(role='user', parts=[types.Part.from_text(text=msg['text'])]))
            else:
                try:
                    import json
                    dm_data = json.loads(msg['text'])
                    story_text = dm_data.get('vypravec', '')
                    for npc in dm_data.get('npc_dialogy', []):
                        story_text += f"\n{npc.get('jmeno')}: {npc.get('text')}"
                    contents.append(types.Content(role='model', parts=[types.Part.from_text(text=story_text)]))
                except:
                    contents.append(types.Content(role='model', parts=[types.Part.from_text(text=msg['text'])]))
        state_dict = char_data.get('state', {})
        travel_days_left = state_dict.get('travel_days_left', 0)
        is_traveling = state_dict.get('travel_mode', False) or travel_days_left > 0
        world_data = state_dict.get('world_data')
        world_prompt_str = ''
        if world_data:
            world_prompt_str = f"\n[TOTO JE ŘÍZENÝ SANDBOX! Svět je pevně dán:]\nZápletka: {world_data.get('main_plot', '')}\nLokace: {json.dumps(world_data.get('locations', []), ensure_ascii=False)}\nKlíčová NPC: {json.dumps(world_data.get('key_npcs', []), ensure_ascii=False)}\n\n[KRITICKÉ PRAVIDLO PRO TAJEMSTVÍ]: Všechna 'tajemstvi_nebo_problem' a 'skryty_motiv' jsou před hráčem PŘÍSNĚ SKRYTÁ. Nesmíš je hráči vyžvanit v úvodním popisu lokace! Hráč na ně musí přijít sám pomocí průzkumu, dedukce nebo dialogů s NPC.\n"
        travel_prompt = ''
        if is_traveling:
            roll = random.randint(1, 20)
            if roll <= 5:
                enc = 'Klidná cesta. ŽÁDNÝ BOJ ANI HROZBA. Popiš pouze krásu či ponurost krajiny, počasí a nechej hráče urazit kus cesty.'
            elif roll <= 9:
                enc = 'Objev zajímavé lokace. Hráč narazí na opuštěné či tajuplné místo (ruiny, stará svatyně, podivný strom). Žádný přímý útok, nech ho zkoumat.'
            elif roll <= 13:
                enc = 'Fyzická překážka. Do cesty se postavila nebezpečná překážka (stržený most, bouře, bažina). Hráč musí vymyslet, jak ji překonat.'
            elif roll <= 16:
                enc = 'Sociální setkání. Hráč potká cestovatele (kupec, prchající člověk, poutník). Žádná monstra.'
            elif roll <= 19:
                enc = 'Bojové přepadení! Hráč je napaden monstrem nebo bandity unikátními pro tento region. Vytvoř boj.'
            else:
                enc = 'Epická vzácná událost. Obrovská hrozba nebo magická anomálie. Scéna musí brát dech.'
            travel_prompt = f"\n[SYSTÉMOVÝ HOD NA SETKÁNÍ PRO TENTO TAH: {roll}]\nPŘÍSNÝ PŘÍKAZ: Tvoje vyprávění V TOMTO TAHU se musí točit výhradně kolem tohoto scénáře: {enc}\nPOUŽIJ POLE 'travel_days_left_set' a nastav tam (aktuální hodnota mínus jedna). Pokud klesne na 0, nastav 'travel_mode_set' na false a 'travel_destination_set' na prázdný řetězec. ODEČTI 1 z 'rations'.\n\nPokud text akce začíná na [OOC/MYŠLENKA], ignoruj hod a nic neodečítej!"
        else:
            travel_prompt = "\n[SYSTÉM: CESTOVÁNÍ]: Pokud hráč vyslovil přání odejít daleko do jiné lokace, ZAHÁJÍŠ CESTOVÁNÍ. Vyplň pole 'travel_mode_set' jako true, 'travel_destination_set' jako 'Název cíle' a 'travel_days_left_set' jako (číslo 2 až 5 podle dálky). V tomto tahu pouze popiš, že vyráží. (Pokud používá OOC, ignoruj to)."
        relevant_memories = ''
        p_loc = state_dict.get('playerLocation') or {}
        curr_q = p_loc.get('q')
        curr_r = p_loc.get('r')
        curr_biome = p_loc.get('biome', 'Pláně')
        curr_region = state_dict.get('currentRegion') or state_dict.get('current_region') or 'Neznámá oblast'
        curr_loc_type = state_dict.get('locationType') or state_dict.get('typ_lokace') or 'divocina'
        curr_pois = state_dict.get('pointsOfInterest') or state_dict.get('vyznamna_mista') or []
        all_known_npcs = state_dict.get('zname_postavy', [])
        local_npcs = []
        distant_npcs = []
        for npc in all_known_npcs:
            if npc.get('je_spolecnik', False):
                local_npcs.append(npc)
                continue
            npc_coords = npc.get('souradnice')
            if npc_coords and curr_q is not None and (curr_r is not None) and (npc_coords.get('q') == curr_q) and (npc_coords.get('r') == curr_r):
                local_npcs.append(npc)
            elif npc.get('lokace_nazev') and (npc.get('lokace_nazev').lower() in curr_region.lower() or curr_region.lower() in npc.get('lokace_nazev').lower()):
                local_npcs.append(npc)
            else:
                distant_npcs.append(npc)
        distant_names = [f"{n.get('jmeno', 'Neznámá postava')} (nachází se v: {n.get('lokace_nazev', 'předchozím městě')})" for n in distant_npcs]
        distant_summary = ', '.join(distant_names) if distant_names else 'Žádné (žádné vzdálené postavy nebyly zaznamenány)'
        local_summary = json.dumps(local_npcs, ensure_ascii=False) if local_npcs else 'Žádné dříve známé postavy. Zde jsou pouze noví místní obyvatelé, pocestní nebo tvorové z tohoto kraje.'
        spatial_grounding = f'''\n======================================================================\n[AKTUÁLNÍ FYZICKÁ LOKACE HRÁČE]:\n- Místo/Region: {curr_region} (Souřadnice na mapě: [{curr_q}, {curr_r}])\n- Typ prostředí: {curr_loc_type} (Terén: {curr_biome})\n- Lokální orientační body / významná místa v tomto místě: {json.dumps(curr_pois, ensure_ascii=False)}\n- KDO JE ZDE FYZICKY PŘÍTOMEN:\n  {local_summary}\n- VZDÁLENÉ POSTAVY V JINÝCH MĚSTECH A LOKACÍCH (ZDE SE FYZICKY NENACHÁZÍ!):\n  {distant_summary}\n\n[KRITICKÉ PRAVIDLO PROSTOROVÉHO REALISMU A ZÁKAZ TELEPORTACE]:\n1. Hráč se fyzicky nachází v lokaci "{curr_region}". Všechny vzdálené postavy ({distant_summary}) zůstaly v předchozích městech/lokacích a jsou daleko!\n2. PŘÍSNÝ ZÁKAZ TELEPORTACE POSTAV: V polích 'nabizene_akce', 'vypravec' ani 'npc_dialogy' se NESMÍ objevit ŽÁDNÁ ze vzdálených postav (např. hostinský z opuštěného města), pokud hráč výslovně neodcestoval zpět na jejich souřadnice!\n3. 'nabizene_akce' MUSÍ VŽDY 100% odpovídat pouze bezprostřednímu okolí a situaci v místě "{curr_region}".\n4. Pokud je hráč v novém sídle (vesnice/město), vyplň do 'vyznamna_mista' pouze body z tohoto nového sídla. Pokud je v divočině/pláních/lese, uveď v 'vyznamna_mista' pouze přírodní orientační body (např. Skalní převis, Rozcestí) nebo nech prázdné. NIKDY tam nevracej budovy z předchozího města!\n======================================================================\n'''
        context_action = f"[Dlouhodobá paměť (relevantní fakta z minulosti):]\n{relevant_memories}\n{world_prompt_str}\n\n{spatial_grounding}\n\n[Aktuální stav hry - pouze pro informaci PJ:]\n{json.dumps(char_data.get('state', {}), ensure_ascii=False)}\n\n{travel_prompt}\n\n[Akce hráče:]\n{req.action_text}\n"
        contents.append(types.Content(role='user', parts=[types.Part.from_text(text=context_action)]))
        system_prompt = f"""Jsi Pán jeskyně ve fantasy světě Aethelgard. Hráč je momentálně na {req.level}. úrovni.\n\nPRAVIDLA D&D 5e, OBTÍŽNOST (DC) A SELHÁNÍ:\n- **Nešetři hráče!** Pokud dělá riskantní akci (průzkum, přesvědčování, skok), VŽDY urči adekvátní Obtížnost (DC). \n- Běžně používej **DC 15 (Střední)** pro běžné překážky a **DC 20 (Těžké)** nebo **DC 25 (Velmi těžké)** pro složité úkoly (např. luštění prastarých nápisů v ruinách musí být minimálně DC 18!). Vyhni se dávání triviálních DC 10.\n- **Neboj se nechat hráče selhat!** Hra musí mít napětí a selhání tvoří příběh. Hráč musí nést následky (ztráta HP, spuštění pasti, rozčílení NPC).\n- Vždy na pozadí virtuálně "hoď d20" a přičti příslušný stat. Výsledek porovnej s tvým DC. Do `system_log` vždy uveď hod a výsledek (např. "Hod na Vnímání: d20(8) + WIS(2) = 10 vs DC 15. Selhání.").\n\nTAKTICKÝ BOJ A NEPŘÁTELÉ:\n- Neodepisuj nepřítele hned, boj je na kola. Sleduj jejich HP, ZRAŇUJ HRÁČE. Nepřátelé útočí zpět, využívají prostředí a nejsou hloupí! Hráč nesmí vyhrát každý souboj bez škrábnutí.\n- Nastav `v_boji` na true, pokud probíhá boj. Pečlivě vyplňuj seznam `nepratele` (jméno, hp, max_hp, status), aby to viděl hráč na obrazovce.\n\nRŮZNORODÁ A AUTENTICKÁ NPC:\n- Obyvatelstvo je různorodé (ženy, děti, starci, veteráni, podvodníci). Každé NPC má svou skrytou úroveň a logiku. \n- NPC NESOUHLASÍ s hráčem automaticky. Obyčejný sedlák před hrozbou uteče, ale elitní válečník hráče klidně zabije, pokud ho hráč urazí.\n\nODMĚNY A XP (EXTRÉMNĚ POMALÝ RŮST - DLOUHÁ KAMPAŇ):\n- Uděluj `xp_zmena` POUZE za velmi významné události. Zlaté pravidlo: běžný pohyb a běžný rozhovor = 0 XP, odhalení důležitého tajemství = 10 XP, zabití monstra = 20-40 XP, splnění celého úkolu = 100-200 XP. Nechceme, aby hráč leveloval rychle.\n\nMĚSTA A BEZPEČNÁ MÍSTA (Urban Encounters & Safe Zones):\n- Při spánku v hostinci nebo odpočinku NEGNERUJ pasti ani bojová přepadení (žádné nečekané pavučiny při spánku!). Nech hráče v klidu zotavit.\n- Náhodná setkání VE MĚSTĚ by měla být zajímavá, ale NEBOJOVÁ: např. žebrák s tajnou mapou, kapsář (test obratnosti), hádka dvou kupců, nebo NPC, které nabídne vedlejší quest.\n- Smrtící pasti, monstra a bojová přepadení patří VÝHRADNĚ do divočiny a dungeonů!\n\nVNITŘNÍ MYŠLENKY A KONTROLY (OOC):\n- Pokud text akce hráče začíná na [OOC/MYŠLENKA], znamená to, že si hráč pouze interně rekapituluje stav nebo o něčem přemýšlí. V takovém případě ZASTAV ČAS. Neposouvej děj, nevyvolávej žádné události ani reakce okolí. Zůstaň ve stávající scéně a pouze stručně popiš výsledek jeho úvahy či kontroly.\n\nVYPRÁVĚNÍ, MÍSTA A PUTOVÁNÍ (LOKACE):\n- **Cestování:** Rychlé přesuny na povel hráče ("Jdu do města X") jsou ZAKÁZÁNY! Každé putování mezi městy/lokacemi přepne hru do režimu "divocina". Cesta musí trvat více tahů.\n- **Náhodná setkání:** Během cesty MUSÍŠ generovat překážky: boje (vlci, bandité), logistické potíže (zlomené kolo, bouřka), příběhová setkání (potulný kupec, zraněný).\n- **Typ lokace a Region:** Do `typ_lokace` dej vždy 'mesto', 'vesnice', 'divocina', nebo 'dungeon'. Do `aktualni_region` dej hezký název oblasti, kde hráč zrovna je (např. 'Stříbrný les', 'Hlavní město').\n- **Významná místa (Město a UI):** Pokud je hráč v `mesto` nebo `vesnice`, MUSÍŠ vyplnit pole `vyznamna_mista` objekty (název, ikona, ma_ukol). Nastav `ma_ukol=True`, pokud se tam dá vzít quest (v UI se objeví vykřičník). V lese/pustině uveď pouze přírodní orientační body nebo nech prázdné!\n- **CESTOVÁNÍ A JÍDLO (Survival):** Když se hráč rozhodne cestovat (opustit město a jít jinam), PŘEPNI `typ_lokace` na 'divocina'. Změň `davky_jidla_zmena` na -1 (cesta stojí jídlo). Pokud hráč jídlo nemá, dej mu penalizaci (-10 HP, napiš to do system_log). Cestou VŽDY vygeneruj náhodné setkání (bandité, bouře, obchodník) a nenech ho dorazit hned do cíle!\n\nZÁZNAMY PRO FRONTEND:\n- Do 'image_prompt' detailně popište aktuální scénu (bez textu). VŽDY NA KONEC PŘIDEJTE TENTO STYL: "style of detailed 2D painterly fantasy concept art, bright vibrant colors, majestic epic scale, cozy atmosphere, studio ghibli meets classic D&D illustrations". Do 'popis_okoli' stručně popište situaci.\n- Do 'vypravec' pište (s velkým důrazem na epické, barevné, malířské fantasy popisy majestátních scenérií, detailů architektury a útulné atmosféry) POUZE beletristické vyprávění světa – jak se situace odvíjí, jak reagují NPC, atmosféru. NIKDY sem nepsat technické detaily (čísla hodů, XP, poškození).\n- Do 'system_log' zapiš VŠECHNY technické herní mechaniky odděleně: výsledky hodů kostkou (např. "Hod na Útok: d20=14 + STR 2 = 16 vs. Obrana 12 -> Zásah!"), způsobené/přijaté poškození, získané XP, level-up oznámení. Tento text se hráči NEBUDE číst nahlas.\n- Pro NPC použij VÝHRADNĚ 'npc_dialogy' (pohlavi="muz"/"zena", image_prompt="detailed 2D painterly fantasy portrait, vibrant colors"). PŘÍSNÝ ZÁKAZ: Pokud jakákoliv postava promluví (přímá řeč), NESMÍ to být v textu 'vypravec'. Vypravěč slouží POUZE pro popis děje (např. "Garrick se na tebe podíval."). Samotná věta, kterou Garrick řekne, už MUSÍ být odděleně vložena do 'npc_dialogy'. Pokud mluví více postav, vlož do 'npc_dialogy' více objektů.\n\nSPECIFIKA POSTAVY A NABIZENE AKCE:\n- TRIDA A RASA: Hracova trida a rasa hraji OBROVSKOU roli. Obchodnici by meli nabizet predmety/kouzla pro hracovu tridu, a NPC by na ni meli reagovat.\n- VZDY vygeneruj 3 az 5 "nabizenych akci" (v listu `nabizene_akce`), ktere davaji v dane situaci smysl (neomezuj se jen na 3, muze jich byt az 5).\n- Z techto nabizenych akci generuj alespon jednu tak, aby byla unikatni pro hracovu tridu (napr. Bard muze nekoho okouzlit pisni, Zlodej pacit, Barbar pouzit silu).\n- PROSTOROVÁ INTEGRITA: Všechny 'nabizene_akce', 'vypravec' i 'npc_dialogy' musí striktně respektovat aktuální fyzické místo hráče. Pokud hráč odešel z města/hostince, postavy z minulého města v této scéně NEEXISTUJÍ a nesmí být nabízeny!\n"""
        response = client.models.generate_content(model='gemini-3.6-flash', contents=contents, config=types.GenerateContentConfig(system_instruction=system_prompt, response_mime_type='application/json', response_schema=dm_schema_dict, temperature=0.7))
        dm_json = json.loads(response.text)
        import unicodedata
        import re
        region = dm_json.get('aktualni_region', curr_region)
        slug = unicodedata.normalize('NFKD', region).encode('ascii', 'ignore').decode('ascii')
        slug = re.sub('[^a-z0-9]+', '_', slug.lower()).strip('_')
        if not slug:
            slug = 'lokace_bez_jmena'
        filename = f'{slug}.jpg'
        filepath = os.path.join('images', filename)
        if os.path.exists(filepath):
            dm_json['image_url'] = f'/images/{filename}'
        else:
            img_key = os.environ.get('GEMINI_IMAGE_API_KEY')
            img_prompt = dm_json.get('image_prompt')
            if img_key and img_prompt:
                try:
                    img_client = genai.Client(api_key=img_key)
                    img_res = img_client.models.generate_images(model='imagen-3.0-generate-002', prompt=img_prompt, config=types.GenerateImagesConfig(number_of_images=1, output_mime_type='image/jpeg', aspect_ratio='16:9'))
                    if img_res.generated_images:
                        image_bytes = img_res.generated_images[0].image.image_bytes
                        with open(filepath, 'wb') as img_file:
                            img_file.write(image_bytes)
                        dm_json['image_url'] = f'/images/{filename}'
                except Exception as img_e:
                    err_str = str(img_e).lower()
                    if '429' in err_str or 'exhausted' in err_str or 'quota' in err_str:
                        dm_json['image_error'] = 'Vyčerpán denní limit pro obrázky. Zobrazuji černé pozadí.'
                    else:
                        dm_json['image_error'] = f'Chyba: {str(img_e)}'
        fakta = dm_json.get('dulezita_fakta', [])
        for fakt in fakta:
            await store_memory(db_key, fakt, client)
        if dm_json.get('aktualni_region'):
            state_dict['currentRegion'] = dm_json['aktualni_region']
            state_dict['current_region'] = dm_json['aktualni_region']
        if dm_json.get('typ_lokace'):
            state_dict['locationType'] = dm_json['typ_lokace']
            state_dict['typ_lokace'] = dm_json['typ_lokace']
        if 'vyznamna_mista' in dm_json:
            state_dict['pointsOfInterest'] = dm_json.get('vyznamna_mista', [])
            state_dict['vyznamna_mista'] = dm_json.get('vyznamna_mista', [])
        if dm_json.get('popis_okoli'):
            state_dict['currentLocationDesc'] = dm_json['popis_okoli']
            state_dict['popis_okoli'] = dm_json['popis_okoli']
        if dm_json.get('npc_dialogy'):
            known_npcs = state_dict.setdefault('zname_postavy', [])
            for dialog in dm_json['npc_dialogy']:
                npc_name = dialog.get('jmeno')
                if npc_name and (not any((n.get('jmeno', '').lower() == npc_name.lower() for n in known_npcs))):
                    known_npcs.append({'jmeno': npc_name, 'pohlavi': dialog.get('pohlavi', 'muz'), 'lokace_nazev': curr_region, 'souradnice': {'q': curr_q, 'r': curr_r}, 'je_spolecnik': False})
        updated_history = history + [{'role': 'user', 'text': req.action_text}, {'role': 'model', 'text': response.text}]
        supabase.table('characters').update({'history': updated_history, 'state': state_dict}).eq('api_key', db_key).execute()
        return dm_json
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Chyba při komunikaci: {str(e)}')

@router.post('/travel')
async def travel_action(req: TravelRequest):
    try:
        db_key = f'{req.email}#{req.name}'
        db_res = supabase.table('characters').select('state, history').eq('api_key', db_key).execute()
        if not db_res.data:
            raise HTTPException(status_code=404, detail='Postava nenalezena.')
        char_data = db_res.data[0]
        state = char_data.get('state', {})
        history = char_data.get('history', [])
        world_data = state.get('world_data', {})
        locations = world_data.get('locations', [])
        hex_grid = world_data.get('hex_grid', [])
        current_loc = state.get('playerLocation')
        if not current_loc and world_data:
            cap = next((p for p in world_data.get('pois', []) if p.get('type') == 'Capital'), None)
            if cap:
                current_loc = {'q': cap['q'], 'r': cap['r'], 'kingdom_id': cap.get('kingdom_id'), 'biome': cap.get('terrain', 'Plains')}
            elif hex_grid:
                first_h = hex_grid[0]
                current_loc = {'q': first_h['q'], 'r': first_h['r'], 'kingdom_id': first_h.get('kingdom_id'), 'biome': first_h.get('terrain', 'Plains')}
            state['playerLocation'] = current_loc
        if not current_loc:
            raise HTTPException(status_code=400, detail='Neznámá pozice hráče na mapě.')
        dist = hex_distance(current_loc['q'], current_loc['r'], req.target_q, req.target_r)
        if dist > 1:
            raise HTTPException(status_code=400, detail='Můžeš cestovat jen o 1 hex!')
        target_hex = next((h for h in hex_grid if h['q'] == req.target_q and h['r'] == req.target_r), None)
        if not target_hex:
            raise HTTPException(status_code=400, detail='Cíl leží mimo známou mapu.')
        if target_hex.get('terrain') in ['Ocean']:
            raise HTTPException(status_code=400, detail='Oceán je neprostupný.')
        if target_hex.get('terrain') in ['Swamp', 'Wasteland', 'Desert', 'Mountains'] and state.get('rations', 0) < 2:
            raise HTTPException(status_code=400, detail='Do nehostinného terénu potřebuješ alespoň 2 dávky zásob jídla.')
        system_logs = []
        if state.get('rations', 0) < 1:
            penalty = 10
            state['hp'] = max(1, state.get('hp', 100) - penalty)
            system_logs.append(f'Hladovění při cestě: -{penalty} HP (žádné zásoby jídla!).')
        else:
            state['rations'] = max(0, state.get('rations', 1) - 1)
            system_logs.append('Spotřebována 1 dávka jídla na den cesty.')
        state['day'] = state.get('day', 1) + 1
        system_logs.append(f"Uplynul 1 den cesty (Den {state['day']}).")
        state['playerLocation'] = {'q': req.target_q, 'r': req.target_r, 'kingdom_id': target_hex.get('kingdom_id'), 'biome': target_hex.get('terrain', 'Plains')}
        poi = next((l for l in locations if l.get('id') == f'{req.target_q}_{req.target_r}' or (l.get('q') == req.target_q and l.get('r') == req.target_r)), None)
        raw_poi = None
        if not poi and world_data.get('pois'):
            raw_poi = next((p for p in world_data['pois'] if p['q'] == req.target_q and p['r'] == req.target_r), None)
        dest_name = poi.get('name') or poi.get('nazev') if poi else raw_poi.get('name') if raw_poi else f"{target_hex.get('terrain', 'Divočina')}"
        poi_type = (poi.get('type') or poi.get('typ') or (raw_poi.get('type') if raw_poi else '') or target_hex.get('terrain', '')).lower()
        if any((k in poi_type for k in ['capital', 'city', 'mesto'])):
            dest_type = 'mesto'
        elif any((k in poi_type for k in ['town', 'village', 'vesnice', 'osada'])):
            dest_type = 'vesnice'
        elif any((k in poi_type for k in ['dungeon', 'ruin', 'cave', 'tower', 'zajimavost'])):
            dest_type = 'dungeon'
        else:
            dest_type = 'divocina'
        client = genai.Client(api_key=req.api_key if getattr(req, 'api_key', None) and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY'))
        prompt = f"""Hráč v D&D RPG (rasa: {state.get('race', 'Člověk')}, povolání: {state.get('dnd_class', 'Bojovník')}) právě dorazil na nové místo na mapě:\nCílová lokace: {dest_name} (Typ: {dest_type}, Terén: {target_hex.get('terrain')})\nZnámý bod zájmu (POI): {(json.dumps(poi or raw_poi, ensure_ascii=False) if poi or raw_poi else 'Běžná divočina/krajina')}\nHlavní zápletka světa: {world_data.get('main_plot', '')}\n\nKRITICKÉ PROSTOROVÉ PRAVIDLO:\nHráč opustil předchozí město a dorazil sem. ŽÁDNÉ postavy z minulého města (hostinští, strážní, NPC z předchozího města) ZDE NEJSOU!\nVšechny nabízené akce a lokální orientační body se musí týkat VÝHRADNĚ této nové lokace ({dest_name}).\n\nVrať POUZE validní JSON:\n{{\n  "vypravec": "Atmosférické vylíčení cesty a příchodu na místo z pohledu vypravěče (3-4 věty). Popiš, co hráč vidí v {dest_name}, jaké je počasí a jaká nová situace či tajemství se otevírá.",\n  "popis_okoli": "Stručný popis nové oblasti (1-2 věty).",\n  "vyznamna_mista": [\n    {{"nazev": "Konkrétní budova či orientační bod 1 v {dest_name}", "ikona": "Compass"}},\n    {{"nazev": "Konkrétní budova či orientační bod 2 v {dest_name}", "ikona": "Home"}},\n    {{"nazev": "Konkrétní budova či orientační bod 3 v {dest_name}", "ikona": "Shield"}}\n  ],\n  "nabizene_akce": ["První logická akce přímo v {dest_name}", "Druhá akce přímo v {dest_name}", "Třetí odvážná akce přímo v {dest_name}"],\n  "image_prompt": "vibrant fantasy landscape concept art of {dest_name} in {target_hex.get('terrain')}, detailed 2D painterly style, high quality"\n}}"""
        try:
            resp = client.models.generate_content(model='gemini-3.6-flash', contents=prompt, config=types.GenerateContentConfig(response_mime_type='application/json'))
            clean_text = resp.text.strip().removeprefix('```json').removesuffix('```').strip()
            ai_data = json.loads(clean_text)
        except Exception as ge:
            print('Gemini travel generate error:', ge)
            ai_data = {'vypravec': f'Po celodenní cestě jsi dorazil do oblasti {dest_name}. Krajina kolem tebe je tichá, vítr šelestí v trávě a na obzoru se stahují mračna.', 'popis_okoli': f"Krajina: {target_hex.get('terrain', 'Pláně')}.", 'vyznamna_mista': [], 'nabizene_akce': [f'Důkladně prozkoumat okolí místa {dest_name}', 'Rozdělat tábor a odpočinout si', 'Připravit si zbraň a postupovat obezřetně'], 'image_prompt': f"fantasy landscape {dest_name} in {target_hex.get('terrain')}"}
        default_pois = []
        if dest_type in ['mesto', 'vesnice']:
            default_pois = [{'nazev': f'Náves a tržiště v {dest_name}', 'ikona': 'Store'}, {'nazev': f'Místní hostinec a noclehárna', 'ikona': 'Home'}, {'nazev': f'Strážnice a sýpka', 'ikona': 'Shield'}]
        else:
            default_pois = [{'nazev': 'Vyvýšený vyhlídkový pahorek', 'ikona': 'Compass'}, {'nazev': 'Chráněný skalní převis k táboření', 'ikona': 'Tent'}, {'nazev': 'Staré rozcestí u milníku', 'ikona': 'MapPin'}]
        narrative_text = ai_data.get('vypravec', '')
        popis_okoli = ai_data.get('popis_okoli', f"Oblast: {dest_name} ({target_hex.get('terrain')})")
        new_pois = ai_data.get('vyznamna_mista') or default_pois
        nabizene_akce = ai_data.get('nabizene_akce') or [f'Prozkoumat {dest_name}', 'Rozdělat tábor', 'Jít dál']
        image_prompt = ai_data.get('image_prompt', '')
        system_log_text = ' | '.join(system_logs)
        history.append({'role': 'user', 'content': f'[CESTOVÁNÍ] Cesta do: {dest_name} ({req.target_q}, {req.target_r})'})
        history.append({'role': 'model', 'content': narrative_text})
        state['currentRegion'] = dest_name
        state['current_region'] = dest_name
        state['locationType'] = dest_type
        state['typ_lokace'] = dest_type
        state['pointsOfInterest'] = new_pois
        state['vyznamna_mista'] = new_pois
        state['currentLocationDesc'] = popis_okoli
        state['popis_okoli'] = popis_okoli
        supabase.table('characters').update({'state': state, 'history': history}).eq('api_key', db_key).execute()
        return {'status': 'success', 'state': state, 'narrative': narrative_text, 'popis_okoli': popis_okoli, 'aktualni_region': dest_name, 'typ_lokace': dest_type, 'vyznamna_mista': new_pois, 'nabizene_akce': nabizene_akce, 'image_prompt': image_prompt, 'system_log': system_log_text, 'destination_name': dest_name, 'terrain_name': target_hex.get('terrain')}
    except HTTPException:
        raise
    except Exception as e:
        print('Travel error:', e)
        raise HTTPException(status_code=500, detail=str(e))
