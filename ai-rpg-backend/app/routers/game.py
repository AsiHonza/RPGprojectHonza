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
from app.utils.loot_generator import generate_loot
from app.utils.intent_router import get_action_intent

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
        world_data = state_dict.get('world_data') or {}
        world_prompt_str = ''
        if world_data:
            current_region = state_dict.get('currentRegion') or state_dict.get('aktualni_region')
            local_locations = [loc for loc in (world_data.get('locations') or []) if isinstance(loc, dict) and loc.get('nazev') == current_region]
            world_prompt_str = f"\n[TOTO JE ŘÍZENÝ SANDBOX! Svět je pevně dán:]\nZápletka: {world_data.get('main_plot', '')}\nAktuální lokace info: {json.dumps(local_locations, ensure_ascii=False)}\n\n[KRITICKÉ PRAVIDLO PRO TAJEMSTVÍ]: Všechna 'tajemstvi_nebo_problem' a 'skryty_motiv' jsou před hráčem PŘÍSNĚ SKRYTÁ. Nesmíš je hráči vyžvanit v úvodním popisu lokace! Hráč na ně musí přijít sám pomocí průzkumu, dedukce nebo dialogů s NPC.\n"
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
        relevant_memories = format_prompt_memory(state_dict)
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

        inv_list = state_dict.get('inventory', [])
        equipped_map = auto_equip_items(inv_list, state_dict.get('equipped'))
        state_dict['equipped'] = equipped_map
        base_stats = state_dict.get('stats', {'str': 10, 'dex': 10, 'con': 10, 'intel': 10, 'wis': 10, 'cha': 10})
        equipped_items = [item for item in inv_list if item.get('id') in equipped_map.values()]
        weapon_item = next((i for i in equipped_items if i.get('slot') == 'hlavní ruka' or i.get('type') == 'zbraň'), None)
        armor_item = next((i for i in equipped_items if i.get('slot') == 'hruď' or i.get('type') == 'zbroj'), None)
        shield_item = next((i for i in equipped_items if i.get('slot') == 'druhá ruka' and i.get('type') == 'zbroj'), None)
        
        races_info = {
            "Člověk": "Zdolnost (+1 Akční bod na začátku boje)",
            "Elf": "Bystré smysly (+1 k Obraně (AC))",
            "Trpaslík": "Trpasličí houževnatost (Sníží každé fyzické zranění o 1. +5 k max HP)",
            "Půlčík": "Štístko (Při hodu 1 na útok automaticky hází znovu)",
            "Drakorozený": "Dračí dech (Plošné zranění ohněm všem nepřátelům)",
            "Tiefling": "Pekelná odplata (Když utrží zranění nablízko, vrátí útočníkovi 2 body poškození)",
            "Půlork": "Nezdolná vytrvalost (Jednou za boj ho fatální rána nezabije, ale zanechá ho na 1 HP)",
            "Gnóm": "Technomagický štít (25% šance zcela ignorovat zranění vyšší než 5)"
        }
        player_race = state_dict.get('race', 'Člověk')
        race_trait = races_info.get(player_race, '')

        req_level = req.level or 1
        action_str = req.action_text or req.action or ""
        
        # AI INTENT ROUTER - Fáze 2
        intent = get_action_intent(action_str, req.api_key if req.api_key and req.api_key != 'DUMMY' else os.environ.get('GEMINI_API_KEY'))
        if intent == 'UI_AKCE':
            print("Router: Detekována UI akce, vracím prázdný stav.")
            return {
                "status": "success",
                "vypravec": f"Podíval jsi se na {action_str.lower()}.",
                "zmeny_stavu": {}
            }
        print("Router: Detekována běžná příběhová akce.")

        atk_bonus = sum(int(i.get('attack_bonus', 0)) for i in equipped_items)
        def_bonus = sum(int(i.get('defense_bonus', 0)) for i in equipped_items)
        str_val = int(base_stats.get('str', 10))
        dex_val = int(base_stats.get('dex', 10))
        str_mod = (str_val - 10) // 2
        dex_mod = (dex_val - 10) // 2
        total_attack = max(0, str_mod) + atk_bonus
        total_ac = 10 + max(0, dex_mod) + def_bonus

        combat_stats_summary = f"""
[AKTUÁLNÍ BOJOVÉ VYBAVENÍ A EFEKTIVNÍ STATY HRÁČE]:
- Rasa a trait: {player_race} ({race_trait}. Respektuj tuto vlastnost v narativu a reakcích NPC!)
- Úroveň: {req_level} | Životy: {state_dict.get('hp', 100)} / {state_dict.get('max_hp', 100)}
- Vybavená zbraň: {weapon_item.get('name') if weapon_item else 'Holé ruce'} (Bonus k útoku ze zbraně: +{atk_bonus})
- Vybavená zbroj a štít: {', '.join([i.get('name') for i in [armor_item, shield_item] if i]) or 'Běžný oděv'} (Bonus k obraně ze zbroje: +{def_bonus})
- Celkový Útok hráče: +{total_attack} (Při útoku hráče virtuálně hoď d20 + {total_attack} proti AC nepřítele)
- Celková Třída Zbroje (AC / Obrana hráče): {total_ac} (Útok nepřítele musí hodit d20 + bonus >= {total_ac}, aby hráče zasáhl!)
ZÁVAZNÉ PRAVIDLO: V každém souboji striktně použij tyto hodnoty v `system_log` a popiš zásah či odražení rány s ohledem na toto vybavení!
"""

        skills_summary_list = []
        if req.skills and isinstance(req.skills, list):
            for s in req.skills:
                if isinstance(s, dict):
                    s_name = s.get('name', s.get('id', 'Neznámá schopnost'))
                    s_rank = s.get('rank', 1)
                    s_type = 'Aktivní kouzlo' if s.get('type') == 'active' else 'Pasivní schopnost'
                    skills_summary_list.append(f"- {s_name} (Rank {s_rank}) [{s_type}]")
                elif isinstance(s, str):
                    skills_summary_list.append(f"- {s}")
        skills_summary = "\n".join(skills_summary_list) if skills_summary_list else "Zatím žádné odemknuté schopnosti (hráč spoléhá na základní výbavu a instinkty)."

        context_action = f"[Dlouhodobá paměť (relevantní fakta z minulosti):]\n{relevant_memories}\n{world_prompt_str}\n\n{spatial_grounding}\n\n{combat_stats_summary}\n\n{travel_prompt}\n\n[Akce hráče:]\n{action_str}\n"
        contents.append(types.Content(role='user', parts=[types.Part.from_text(text=context_action)]))
        system_prompt = f"""Jsi Pán jeskyně ve fantasy světě Aethelgard. Hráč je momentálně na {req_level}. úrovni.


ODEMKNUTÉ SCHOPNOSTI, KOUZLA A DOVEDNOSTI HRÁČE:
{skills_summary}

POKYNY PRO NABÍZENÉ AKCE A DIALOGY SE SCHOPNOSTMI:
- Mezi 3 až 5 'nabizene_akce' VŽDY zahrň 1 až 2 akce označené štítkem schopnosti, např. "[Schopnost: {{název schopnosti}}] Popis specifického taktického nebo příběhového použití", které využívají hráčovy reálně odemknuté dovednosti.
- Respektuj Rank schopnosti při popisu účinku (Rank III představuje legendární mistrovství).

PRAVIDLA D&D 5e, OBTÍŽNOST (DC) A SELHÁNÍ:
- **Nešetři hráče!** Pokud dělá riskantní akci (průzkum, přesvědčování, skok), VŽDY urči adekvátní Obtížnost (DC). 
- Běžně používej **DC 15 (Střední)** pro běžné překážky a **DC 20 (Těžké)** nebo **DC 25 (Velmi těžké)** pro složité úkoly. Vyhni se dávání triviálních DC 10.
- **Neboj se nechat hráče selhat!** Hra musí mít napětí a selhání tvoří příběh. Hráč musí nést následky (ztráta HP, spuštění pasti, rozčílení NPC).
- Vždy na pozadí virtuálně "hoď d20" a přičti příslušný stat. Výsledek porovnej s tvým DC. Do `system_log` vždy uveď hod a výsledek (např. "Hod na Vnímání: d20(8) + WIS(2) = 10 vs DC 15. Selhání.").

TAKTICKÝ BOJ (HYBRIDNÍ SYSTÉM):
- Boj se nyní vyhodnocuje PLNĚ LOKÁLNĚ na straně klienta. Ty nepočítáš zásahy ani HP v průběhu boje!
- Pokud hráč vyvolá konflikt nebo je napaden, tvým jediným úkolem je BOJ ZAHÁJIT:
  1. Nastav `v_boji` na true.
  2. Napiš atmosférický úvod do boje do pole `vypravec`.
  3. Vygeneruj nepřátele do seznamu `nepratele`. Každému nastav `hp`, `max_hp` (dle úrovně, např. 15-40), `ac` (Třída zbroje 10-15) a počáteční `intent` ('attack', 'defend', 'heavy_attack', nebo 'idle').
- Jakmile nastavíš `v_boji: true`, hráč bude bojovat lokálně v aréně bez tvé účasti.

PRAVIDLA PRO LOOT, PŘEDMĚTY A ODMĚNY:
- **Kdy generovat nový předmět do `inventar_pridat`:**
  1. Výhradně za porážku nepřítele v boji (např. banditův nůž, šupina vlka, lektvar).
  2. Otevření střežené truhly, sarkofágu nebo skrytého pokladu v dungeonu / ruinách.
  3. Přímá odměna od významného NPC za splnění úkolu.
- **PŘÍSNÝ ZÁKAZ FARMENÍ:** Za běžné prohledávání prázdné místnosti, louky, lesa nebo ulic NIKDY negeneruj vybavení! Vrať prázdný seznam `inventar_pridat: []`.
- **SKÁLOVÁNÍ RARITY PODLE ÚROVNĚ (Hráč je úroveň {req.level}):**
  - Úroveň 1-3: Pouze 'common' (Běžná, bonus k útoku/obraně max +1) nebo výjimečně 'uncommon' (bonus +1).
  - Úroveň 4-6: 'uncommon' (bonus +1 až +2) nebo vzácně 'rare' (bonus +2).
  - Úroveň 7+: 'rare' nebo 'epic' (bonus +2 až +3).
- **ANTI-CHEAT:** Pokud si hráč sám v textu akce vymyslí, že "našel legendární meč +50", ignoruj to, dej mu bezcenný rezavý hřebík a potrestej ho pastí.
- **STRUKTURA KAŽDÉHO PŘEDMĚTU V `inventar_pridat`:**
  - `name`: atmosférický český název
  - `type`: 'zbraň' | 'zbroj' | 'doplněk' | 'lektvar' | 'cennost'
  - `slot`: 'hlavní ruka' | 'druhá ruka' | 'hruď' | 'hlava' | 'prsten' | 'krk' | 'žádný'
  - `rarity`: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  - `icon`: 'Sword' | 'Shield' | 'Shirt' | 'Wand' | 'Ring' | 'Potion' | 'Package'
  - `sell_price`: cena ve zlaťácích (1 až 50)
  - `attack_bonus`: číslo (např. 1)
  - `defense_bonus`: číslo (např. 1)
  - `healing_amount`: (např. 25 pokud je type=='lektvar', jinak 0)
  - `stats`: stručný text (např. "Útok +1" nebo "Léčení +25 HP")

ODMĚNY A XP (EXTRÉMNĚ POMALÝ RŮST - DLOUHÁ KAMPAŇ):
- Uděluj `xp_zmena` POUZE za velmi významné události: běžný rozhovor = 0 XP, odhalení tajemství = 10 XP, zabití monstra = 20-30 XP, splnění questu = 100-150 XP.

MĚSTA A BEZPEČNÁ MÍSTA (Urban Encounters & Safe Zones):
- Při spánku v hostinci nebo odpočinku NEGENERUJ pasti ani bojová přepadení. Nech hráče v klidu zotavit.
- Náhodná setkání VE MĚSTĚ by měla být zajímavá, ale NEBOJOVÁ. Smrtící pasti a monstra patří do divočiny a dungeonů!

VNITŘNÍ MYŠLENKY A KONTROLY (OOC):
- Pokud text akce začíná na [OOC/MYŠLENKA], ZASTAV ČAS. Pouze popiš výsledek úvahy.

VYPRÁVĚNÍ, MÍSTA A PUTOVÁNÍ (LOKACE):
- **Cestování:** Rychlé přesuny na povel hráče jsou ZAKÁZÁNY! Každé putování mezi lokacemi přepne hru do režimu "divocina" a trvá více tahů.
- **Typ lokace a Region:** Do `typ_lokace` dej vždy 'mesto', 'vesnice', 'divocina', nebo 'dungeon'. Do `aktualni_region` dej hezký název oblasti.
- **CESTOVÁNÍ A JÍDLO:** Když hráč cestuje, přepni do 'divocina' a odečti 1 jídlo (`davky_jidla_zmena`: -1).

PSYCHOLOGIE A ŽIVOT NPC POSTAV (SOUL & SUBTEXT ENGINE):
- ŽÁDNÁ PLOCHÁ ENCYKLOPEDIE: Každá významnější postava má svůj vlastní život, strachy, manýry a skrytou vnitřní motivaci (proč jedná tak, jak jedná).
- PŘÍSNÝ ZÁKAZ PROVALENÍ TAJEMSTVÍ: NPC NIKDY nevysloví své tajemství ani svou vnitřní motivaci hned v prvním uvítacím dialogu!
- SUBTEXT (PODTEXT) A ŘEČ TĚLA: Skrytá motivace a strach se projevují nepřímo – v tom, jak postava formuluje nabídky, čemu se vyhýbá, jak těká pohledem, jak si mne ruce, nebo jaké podmínky si klade výměnou za pomoc.
- VHLED A DŮVĚRA (INSIGHT & TRUST): Pokud hráč použije empatii, vhled (Insight) nebo si získá důvěru postavy (pomocí, laskavostí, charismatem), popiš vnitřní napětí a v `zmeny_stavu.zname_postavy_zmena` aktualizuj:
  - `jmeno`: jméno postavy
  - `lokace`: název aktuálního místa
  - `popis`: stručný popis role a vzhledu
  - `povaha`: stručné vystupování a manýry (např. "Opatrný kovář, mluví úsečně, neustále čistí meč a vyhýbá se zmínkám o válce")
  - `motivace`: vnitřní cíl postavy (např. "Potřebuje splatit dluh 40 zlaťáků městské gardě, než mu zabaví dílnu")
  - `odhalene_tajemstvi`: vyplň POUZE tehdy, pokud ho hráč v tomto tahu skutečně odhalil (jinak nechej null/prázdné!)
  - `duvera`: číslo -10 až +10 (výchozí 0, roste při pomoci a klesá při vyhrožování či urážkách)
  - `vztah`: 'Neutrální', 'Přátelský', 'Spojenec', 'Obezřetný', nebo 'Nepřátelský'
- Mezi 'nabizene_akce' při setkání s NPC zahrň alespoň jednu možnost sociální interakce: např. "[Vhled] Odhadnout jeho skutečné úmysly z řeči těla" nebo "[Přesvědčování] Zkusit si získat jeho důvěru".

ZÁZNAMY PRO FRONTEND A EFEKTIVITA TOKENŮ:
- **DELTA REŽIM:** Pokud hráč pokračuje v dialogu nebo běžné činnosti na stejném místě, nastav `nova_scena: false`. Pole `vyznamna_mista`, `popis_okoli` a `image_prompt` vyplňuj VÝHRADNĚ tehdy, pokud je `nova_scena: true` (nová lokace/budova). Při `nova_scena: false` je nechej prázdné nebo null!
- **TRVALÁ FAKTA A PAMĚŤ:** Do `dulezita_fakta` zapiš stručná klíčová zjištění, sliby NPC nebo milníky, které si má svět pamatovat navždy (např. "Hráč zachránil syna kováře Borise").
- **REPUTACE FRAKCÍ:** Pokud čin hráče ovlivnil některé ze 7 království nebo 3 bohy, uveď změnu v `reputace_zmena` (např. {"valerium": -5, "solarian": 10}).
- **MUTACE LOKACÍ NA MAPĚ:** Pokud hráč trvale změnil stav této lokace (vyčištěn dungeon, zničen tábor banditů, posvěcena svatyně), vyplň `hex_mutace` (např. {"stav": "vycisteno", "popis": "Doupě goblinů bylo vyčištěno a je bezpečné"}).
- Do 'image_prompt' detailně popište aktuální scénu (bez textu, pouze pokud je nova_scena: true). VŽDY NA KONEC PŘIDEJTE: "style of detailed 2D painterly fantasy concept art, bright vibrant colors, majestic epic scale, cozy atmosphere, studio ghibli meets classic D&D illustrations".
- Do 'vypravec' pište POUZE beletristické vyprávění světa. NIKDY sem nepsat technické detaily (čísla hodů, XP, poškození).
- Do 'system_log' zapiš VŠECHNY technické herní mechaniky odděleně: výsledky hodů d20, způsobené/přijaté poškození, získané XP, nalezený loot.
- Pro NPC použij VÝHRADNĚ 'npc_dialogy' (pohlavi="muz"/"zena"). Přímá řeč NESMÍ být ve vypravěči!
- VŽDY vygeneruj 3 až 5 logických 'nabizene_akce'.
"""
        response = client.models.generate_content(model='gemini-3.6-flash', contents=contents, config=types.GenerateContentConfig(system_instruction=system_prompt, response_mime_type='application/json', response_schema=dm_schema_dict, temperature=0.7))
        dm_json = json.loads(response.text)

        # Loot Sanitizer & Level Cap Enforcement
        if dm_json.get('zmeny_stavu') and dm_json['zmeny_stavu'].get('inventar_pridat'):
            max_stat_cap = 1 if req.level <= 3 else (2 if req.level <= 6 else 4)
            cleaned_loot = []
            for item in dm_json['zmeny_stavu']['inventar_pridat']:
                if not isinstance(item, dict):
                    continue
                item_id = item.get('id') or str(uuid.uuid4())
                item['id'] = item_id
                item['attack_bonus'] = min(max_stat_cap, max(0, int(item.get('attack_bonus', 0))))
                item['defense_bonus'] = min(max_stat_cap, max(0, int(item.get('defense_bonus', 0))))
                if item.get('type') == 'lektvar' and not item.get('healing_amount'):
                    item['healing_amount'] = 25
                if not item.get('icon'):
                    item['icon'] = 'Sword' if item.get('type') == 'zbraň' else ('Shield' if item.get('slot') == 'druhá ruka' else ('Potion' if item.get('type') == 'lektvar' else 'Package'))
                if not item.get('rarity'):
                    item['rarity'] = 'common'
                cleaned_loot.append(item)
            dm_json['zmeny_stavu']['inventar_pridat'] = cleaned_loot

        # Quest Sanitizer & Deduplication
        if dm_json.get('zmeny_stavu') and dm_json['zmeny_stavu'].get('ukoly'):
            dm_json['zmeny_stavu']['ukoly'] = sanitize_and_deduplicate_quests(dm_json['zmeny_stavu']['ukoly'])
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
        # 1. Update factual memory (L3)
        fakta = dm_json.get('dulezita_fakta', [])
        if fakta:
            store_factual_memory(state_dict, fakta)

        # 2. Update faction and god reputation
        rep_changes = dm_json.get('reputace_zmena')
        if rep_changes and isinstance(rep_changes, dict):
            rep_map = state_dict.setdefault('reputace', {})
            for faction, change in rep_changes.items():
                if isinstance(change, (int, float)):
                    rep_map[faction] = rep_map.get(faction, 0) + int(change)

        # 3. Update persistent hex mutation
        hex_mut = dm_json.get('hex_mutace')
        if hex_mut and isinstance(hex_mut, dict) and curr_q is not None and curr_r is not None:
            loc_key = f"{curr_q}_{curr_r}"
            visited = state_dict.setdefault('visited_locations', {})
            loc_entry = visited.setdefault(loc_key, {})
            if hex_mut.get('stav'):
                loc_entry['stav'] = hex_mut['stav']
            if hex_mut.get('popis'):
                loc_entry['poznamka'] = hex_mut['popis']

        # 4. Delta scene / location updates
        if dm_json.get('aktualni_region'):
            state_dict['currentRegion'] = dm_json['aktualni_region']
            state_dict['current_region'] = dm_json['aktualni_region']
        if dm_json.get('typ_lokace'):
            state_dict['locationType'] = dm_json['typ_lokace']
            state_dict['typ_lokace'] = dm_json['typ_lokace']
        if dm_json.get('vyznamna_mista'):
            state_dict['pointsOfInterest'] = dm_json['vyznamna_mista']
            state_dict['vyznamna_mista'] = dm_json['vyznamna_mista']
        if dm_json.get('popis_okoli'):
            state_dict['currentLocationDesc'] = dm_json['popis_okoli']
            state_dict['popis_okoli'] = dm_json['popis_okoli']
        known_npcs = state_dict.setdefault('zname_postavy', [])
        # Process NPC updates from state changes (Soul & Subtext Engine)
        npc_changes = (dm_json.get('zmeny_stavu') or {}).get('zname_postavy_zmena') or []
        for npc_rec in npc_changes:
            if not isinstance(npc_rec, dict):
                continue
            rec_name = npc_rec.get('jmeno')
            if not rec_name:
                continue
            existing = next((n for n in known_npcs if n.get('jmeno', '').lower() == rec_name.lower()), None)
            if existing:
                if npc_rec.get('vztah'): existing['vztah'] = npc_rec['vztah']
                if npc_rec.get('povaha'): existing['povaha'] = npc_rec['povaha']
                if npc_rec.get('motivace'): existing['motivace'] = npc_rec['motivace']
                if npc_rec.get('odhalene_tajemstvi'): existing['odhalene_tajemstvi'] = npc_rec['odhalene_tajemstvi']
                if 'duvera' in npc_rec and npc_rec['duvera'] is not None: existing['duvera'] = npc_rec['duvera']
                if npc_rec.get('popis'): existing['popis'] = npc_rec['popis']
            else:
                known_npcs.append({
                    'jmeno': rec_name,
                    'lokace': npc_rec.get('lokace') or curr_region,
                    'lokace_nazev': curr_region,
                    'souradnice': {'q': curr_q, 'r': curr_r},
                    'popis': npc_rec.get('popis', ''),
                    'vztah': npc_rec.get('vztah', 'Neutrální'),
                    'povaha': npc_rec.get('povaha'),
                    'motivace': npc_rec.get('motivace'),
                    'odhalene_tajemstvi': npc_rec.get('odhalene_tajemstvi'),
                    'duvera': npc_rec.get('duvera', 0),
                    'je_spolecnik': False
                })

        if dm_json.get('npc_dialogy'):
            for dialog in dm_json['npc_dialogy']:
                npc_name = dialog.get('jmeno')
                if npc_name and (not any((n.get('jmeno', '').lower() == npc_name.lower() for n in known_npcs))):
                    known_npcs.append({
                        'jmeno': npc_name,
                        'pohlavi': dialog.get('pohlavi', 'muz'),
                        'lokace': curr_region,
                        'lokace_nazev': curr_region,
                        'souradnice': {'q': curr_q, 'r': curr_r},
                        'popis': f"Obyvatel kraje {curr_region}.",
                        'vztah': 'Neutrální',
                        'duvera': 0,
                        'je_spolecnik': False
                    })

        # 5. Clean narrative history storage (eliminates DB bloat)
        story_text = dm_json.get('vypravec', '')
        for npc in dm_json.get('npc_dialogy', []):
            story_text += f"\n{npc.get('jmeno')}: {npc.get('text')}"
        updated_history = history + [{'role': 'user', 'text': action_str}, {'role': 'model', 'text': story_text}]

        # 6. Periodic rolling chronicle compression (L2 memory)
        turns_count = state_dict.get('turns_since_compression', 0) + 1
        state_dict['turns_since_compression'] = turns_count
        if turns_count >= 5 and len(updated_history) >= 6:
            try:
                recent_slice = updated_history[-6:]
                summary = await compress_history_to_chronicle(recent_slice, client)
                if summary:
                    kronika = state_dict.setdefault('kronika', [])
                    kronika.append(summary)
                    if len(kronika) > 15:
                        state_dict['kronika'] = kronika[-15:]
                    state_dict['turns_since_compression'] = 0
            except Exception as ce:
                print("Chronicle compression non-fatal error:", ce)

        # Attach active reputation & chronicle to dm_json response for frontend UI
        dm_json['aktivni_reputace'] = state_dict.get('reputace', {})
        dm_json['kronika'] = state_dict.get('kronika', [])
        dm_json['svetova_fakta'] = state_dict.get('svetova_fakta', [])
        dm_json['zname_postavy'] = known_npcs

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
        state = char_data.get('state') or {}
        history = char_data.get('history') or []
        world_data = state.get('world_data') or {}
        
        # Self-healing: if world_data or hex_grid is missing, generate mathematical world on the fly
        if not world_data or not world_data.get('hex_grid'):
            import world_generator
            math_world = world_generator.generate_world_data()
            world_data = {
                'hex_grid': math_world.get('hex_grid', []),
                'pois': math_world.get('pois', []),
                'main_plot': 'Cesta po zemích a královstvích Aelthgardu.',
                'locations': [],
                'key_npcs': []
            }
            state['world_data'] = world_data

        locations = world_data.get('locations') or []
        hex_grid = world_data.get('hex_grid') or []
        pois = world_data.get('pois') or []
        current_loc = state.get('playerLocation')

        # Fallback for current player location
        if not current_loc or not isinstance(current_loc, dict) or 'q' not in current_loc or 'r' not in current_loc:
            cap = next((p for p in pois if isinstance(p, dict) and p.get('type') == 'Capital' and p.get('kingdom_id') != 5), None)
            if not cap:
                cap = next((p for p in pois if isinstance(p, dict) and p.get('type') == 'Capital'), None)
            if cap:
                current_loc = {'q': cap['q'], 'r': cap['r'], 'kingdom_id': cap.get('kingdom_id'), 'biome': cap.get('terrain', 'Plains')}
            elif hex_grid:
                first_h = next((h for h in hex_grid if isinstance(h, dict) and h.get('kingdom_id') != 5), hex_grid[0])
                current_loc = {'q': first_h['q'], 'r': first_h['r'], 'kingdom_id': first_h.get('kingdom_id'), 'biome': first_h.get('terrain', 'Plains')}
            else:
                current_loc = {'q': int(req.target_q), 'r': int(req.target_r), 'kingdom_id': 1, 'biome': 'Plains'}
            state['playerLocation'] = current_loc

        try:
            cur_q = int(current_loc['q'])
            cur_r = int(current_loc['r'])
            tgt_q = int(req.target_q)
            tgt_r = int(req.target_r)
        except Exception:
            raise HTTPException(status_code=400, detail='Neplatný formát souřadnic pro cestování.')

        dist = hex_distance(cur_q, cur_r, tgt_q, tgt_r)
        if dist > 1:
            raise HTTPException(status_code=400, detail='Můžeš cestovat jen o 1 hex!')

        target_hex = next((h for h in hex_grid if isinstance(h, dict) and int(h.get('q', 999)) == tgt_q and int(h.get('r', 999)) == tgt_r), None)
        if not target_hex:
            target_hex = {'q': tgt_q, 'r': tgt_r, 'terrain': 'Plains', 'kingdom_id': current_loc.get('kingdom_id', 1)}

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
        state['playerLocation'] = {'q': tgt_q, 'r': tgt_r, 'kingdom_id': target_hex.get('kingdom_id'), 'biome': target_hex.get('terrain', 'Plains')}

        poi = next((l for l in locations if isinstance(l, dict) and (l.get('id') == f'{tgt_q}_{tgt_r}' or (int(l.get('q', 999)) == tgt_q and int(l.get('r', 999)) == tgt_r))), None)
        raw_poi = next((p for p in pois if isinstance(p, dict) and int(p.get('q', 999)) == tgt_q and int(p.get('r', 999)) == tgt_r), None)

        kingdom_names = {
            1: 'Valerijské Impérium',
            2: 'Svatá říše Solariova',
            3: 'Kmeny z Hlubokých hvozdů',
            4: 'Svobodná města',
            5: 'Karanténní Zóna',
            6: 'Železný Práh',
            7: 'Tajemné Útočiště'
        }
        poi_names_map = {
            'Capital': 'Hlavní město',
            'Village': 'Vesnice',
            'Dungeon': 'Podzemní kobka',
            'Shrine': 'Posvátná svatyně',
            'Ruin': 'Prastaré ruiny'
        }

        dest_name = None
        if poi and isinstance(poi, dict):
            dest_name = poi.get('name') or poi.get('nazev')
        if not dest_name and raw_poi and isinstance(raw_poi, dict):
            p_type = raw_poi.get('type')
            p_kid = raw_poi.get('kingdom_id')
            k_name = kingdom_names.get(p_kid, 'Aelthgard')
            if p_type == 'Capital':
                dest_name = f"Hlavní město ({k_name})"
            elif p_type:
                dest_name = f"{poi_names_map.get(p_type, p_type)} ({k_name})"
        if not dest_name:
            terrain_cz = {
                'Ocean': 'Oceánské pobřeží',
                'Mountains': 'Horské štíty',
                'Forest': 'Hluboký hvozd',
                'Swamp': 'Mlžné bažiny',
                'Wasteland': 'Pustina',
                'Plains': 'Travnaté pláně'
            }
            terr = target_hex.get('terrain', 'Plains')
            dest_name = f"{terrain_cz.get(terr, terr)} ({tgt_q}, {tgt_r})"

        poi_type = ''
        if poi and isinstance(poi, dict):
            poi_type = (poi.get('type') or poi.get('typ') or '').lower()
        if not poi_type and raw_poi and isinstance(raw_poi, dict):
            poi_type = str(raw_poi.get('type', '')).lower()
        if not poi_type:
            poi_type = str(target_hex.get('terrain', '')).lower()

        if any(k in poi_type for k in ['capital', 'city', 'mesto']):
            dest_type = 'mesto'
        elif any(k in poi_type for k in ['town', 'village', 'vesnice', 'osada']):
            dest_type = 'vesnice'
        elif any(k in poi_type for k in ['dungeon', 'ruin', 'cave', 'tower', 'zajimavost', 'shrine']):
            dest_type = 'dungeon'
        else:
            dest_type = 'divocina'

        loc_key = f"{tgt_q}_{tgt_r}"
        visited_locations = state.get('visited_locations')
        if not isinstance(visited_locations, dict):
            visited_locations = {}

        if loc_key in visited_locations and isinstance(visited_locations[loc_key], dict):
            print(f"CACHE HIT: Lokace {loc_key} nactena z DB")
            ai_data = visited_locations[loc_key]
        else:
            print(f"CACHE MISS: Lokace {loc_key} se musi vygenerovat")
            client = genai.Client(api_key=req.api_key if getattr(req, 'api_key', None) and 'DUMMY' not in req.api_key else os.environ.get('GEMINI_API_KEY'))
            prompt = f"""Hráč v D&D RPG (rasa: {state.get('race', 'Člověk')}, povolání: {state.get('dnd_class', 'Bojovník')}) právě dorazil na nové místo na mapě:
Cílová lokace: {dest_name} (Typ: {dest_type}, Terén: {target_hex.get('terrain')})
Známý bod zájmu (POI): {(json.dumps(poi or raw_poi, ensure_ascii=False) if poi or raw_poi else 'Běžná divočina/krajina')}
Hlavní zápletka světa: {world_data.get('main_plot', '')}

KRITICKÉ PROSTOROVÉ PRAVIDLO:
Hráč opustil předchozí místo a dorazil sem. ŽÁDNÉ postavy z minulého místa (hostinští, strážní, NPC z předchozího místa) ZDE NEJSOU!
Všechny nabízené akce a lokální orientační body se musí týkat VÝHRADNĚ této nové lokace ({dest_name}).

Vrať POUZE validní JSON:
{{
  "vypravec": "Atmosférické vylíčení cesty a příchodu na místo z pohledu vypravěče (3-4 věty). Popiš, co hráč vidí v {dest_name}, jaké je počasí a jaká nová situace či tajemství se otevírá.",
  "popis_okoli": "Stručný popis nové oblasti (1-2 věty).",
  "vyznamna_mista": [
    {{"nazev": "Konkrétní budova či orientační bod 1 v {dest_name}", "ikona": "Compass"}},
    {{"nazev": "Konkrétní budova či orientační bod 2 v {dest_name}", "ikona": "Home"}},
    {{"nazev": "Konkrétní budova či orientační bod 3 v {dest_name}", "ikona": "Shield"}}
  ],
  "nabizene_akce": ["První logická akce přímo v {dest_name}", "Druhá akce přímo v {dest_name}", "Třetí odvážná akce přímo v {dest_name}"],
  "image_prompt": "vibrant fantasy landscape concept art of {dest_name} in {target_hex.get('terrain')}, detailed 2D painterly style, high quality"
}}"""
            try:
                resp = client.models.generate_content(model='gemini-3.6-flash', contents=prompt, config=types.GenerateContentConfig(response_mime_type='application/json'))
                clean_text = resp.text.strip().removeprefix('```json').removesuffix('```').strip()
                ai_data = json.loads(clean_text)
                if isinstance(ai_data, dict):
                    visited_locations[loc_key] = ai_data
                    state['visited_locations'] = visited_locations
                else:
                    ai_data = {}
            except Exception as ge:
                print('Gemini travel generate error:', ge)
                ai_data = {}

        if not isinstance(ai_data, dict):
            ai_data = {}

        default_pois = []
        if dest_type in ['mesto', 'vesnice']:
            default_pois = [{'nazev': f'Náves a tržiště v {dest_name}', 'ikona': 'Store'}, {'nazev': f'Místní hostinec a noclehárna', 'ikona': 'Home'}, {'nazev': f'Strážnice a sýpka', 'ikona': 'Shield'}]
        else:
            default_pois = [{'nazev': 'Vyvýšený vyhlídkový pahorek', 'ikona': 'Compass'}, {'nazev': 'Chráněný skalní převis k táboření', 'ikona': 'Tent'}, {'nazev': 'Staré rozcestí u milníku', 'ikona': 'MapPin'}]

        narrative_text = ai_data.get('vypravec') or f'Po celodenní cestě jsi dorazil do oblasti {dest_name}. Krajina kolem tebe je tichá, vítr šelestí v trávě a na obzoru se otevírá nový obzor.'
        popis_okoli = ai_data.get('popis_okoli') or f"Krajina: {dest_name} ({target_hex.get('terrain', 'Pláně')})."
        new_pois = ai_data.get('vyznamna_mista') or default_pois
        nabizene_akce = ai_data.get('nabizene_akce') or [f'Důkladně prozkoumat okolí místa {dest_name}', 'Rozdělat tábor a odpočinout si', 'Připravit se k další cestě']
        image_prompt = ai_data.get('image_prompt', '') or f"fantasy landscape {dest_name}"
        system_log_text = ' | '.join(system_logs)

        history.append({'role': 'user', 'content': f'[CESTOVÁNÍ] Cesta do: {dest_name} ({tgt_q}, {tgt_r})'})
        history.append({'role': 'model', 'content': narrative_text})

        state['currentRegion'] = dest_name
        state['current_region'] = dest_name
        state['locationType'] = dest_type
        state['typ_lokace'] = dest_type
        state['pointsOfInterest'] = new_pois
        state['vyznamna_mista'] = new_pois
        state['currentLocationDesc'] = popis_okoli

        supabase.table('characters').update({'state': state, 'history': history}).eq('api_key', db_key).execute()
        return {
            'status': 'success',
            'state': state,
            'narrative': narrative_text,
            'popis_okoli': popis_okoli,
            'aktualni_region': dest_name,
            'typ_lokace': dest_type,
            'vyznamna_mista': new_pois,
            'nabizene_akce': nabizene_akce,
            'image_prompt': image_prompt,
            'system_log': system_log_text,
            'destination_name': dest_name,
            'terrain_name': target_hex.get('terrain'),
            'kronika': state.get('kronika', []),
            'aktivni_reputace': state.get('reputace', {}),
            'svetova_fakta': state.get('svetova_fakta', []),
            'zname_postavy': state.get('zname_postavy', [])
        }
    except HTTPException:
        raise
    except Exception as e:
        print('Travel error:', e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/resolve-combat')
async def resolve_combat(req: CombatResolutionRequest):
    try:
        db_key = f'{req.email}#{req.name}'
        db_res = supabase.table('characters').select('state, history').eq('api_key', db_key).execute()
        if not db_res.data:
            raise HTTPException(status_code=404, detail='Postava nenalezena.')
        
        char_data = db_res.data[0]
        state = char_data.get('state', {})
        history = char_data.get('history', [])
        
        # Determine defeated enemies
        enemy_names = [e.name for e in req.enemies]
        enemies_str = ", ".join(enemy_names)
        
        # Prepare LLM prompt
        prompt = f"""
        Hráč (Level {req.level}) právě vyhrál taktický souboj!
        Poražení nepřátelé: {enemies_str}
        
        Záznam boje (Combat Log) od klienta zní:
        {chr(10).join(req.combat_log[-10:])}
        
        Tvůj úkol:
        1. Vrať JSON s klíčem 'vypravec', kde napíšeš brutální, epické nebo velmi atmosférické zakončení tohoto boje (tzv. Fatality / Aftermath) - max 2-3 věty, které shrnou hráčovo drtivé vítězství, jak zabil posledního protivníka a svalil se (hráč má nyní {req.player_hp} HP).
        2. Vygeneruj pouze zlaté mince a zkušenosti.
        3. Vygeneruj odpovídající 'xp_zmena' (cca 15-30 za každého nepřítele) a 'zlato_zmena'.
        4. Odrážej to ve strukturách 'StateChanges' ze schématu DMResponse. Nemaž žádné další stavy.
        5. 'v_boji' vrať False.
        """
        
        client = genai.Client(api_key=req.api_key if req.api_key and req.api_key != 'DUMMY' else os.environ.get('GEMINI_API_KEY'))
        
        # Create a simplified response schema for resolution
        resolution_schema = {
            "type": "OBJECT",
            "properties": {
                "vypravec": {"type": "STRING"},
                "zmeny_stavu": {
                    "type": "OBJECT",
                    "properties": {
                        "xp_zmena": {"type": "INTEGER"},
                        "zlato_zmena": {"type": "INTEGER"},
                        
                    }
                }
            },
            "required": ["vypravec", "zmeny_stavu"]
        }
        
        resp = client.models.generate_content(
            model='gemini-3.6-flash', 
            contents=prompt, 
            config=types.GenerateContentConfig(response_mime_type='application/json', response_schema=resolution_schema)
        )
        
        clean_text = resp.text.strip().removeprefix('```json').removesuffix('```').strip()
        dm_json = json.loads(clean_text)
        
        # Apply changes to state
        narrative = dm_json.get('vypravec', 'Boj skončil. Nepřátelé leží v prachu a ty jsi přežil, byť možná s nějakým tím šrámem.')
        state['hp'] = req.player_hp
        state['inCombat'] = False
        state['enemies'] = []
        state['combatLog'] = []
        state['combatAp'] = 3
        state['combatRound'] = 1
        
        zmeny = dm_json.get('zmeny_stavu', {})
        
        # OCHRANA PŘED AI HALUCINACÍ - AI občas maže zbraně, když je hráč vytáhne!
        if zmeny and zmeny.get('inventar_odebrat_id'):
            # Povolíme odebrat jen lektvary nebo jídlo, zbraně/zbroje nikdy z inventáře nemažeme (leda by je hráč explicitně prodal, což v boji nejde)
            safe_removals = []
            for item_id in zmeny['inventar_odebrat_id']:
                item_obj = next((i for i in inv_list if i.get('id') == item_id), None)
                if item_obj and item_obj.get('type') not in ['zbraň', 'zbroj', 'zbran', 'zbroj']:
                    safe_removals.append(item_id)
            zmeny['inventar_odebrat_id'] = safe_removals

        if zmeny:
            dnd_class = getattr(req, 'dnd_class', None) or state.get('dndClass') or state.get('dnd_class') or 'Bojovník'
            zmeny['inventar_pridat'] = generate_loot(enemy_names, req.level, dnd_class)

        if zmeny:
            state['xp'] = state.get('xp', 0) + zmeny.get('xp_zmena', 0)
            state['gold'] = state.get('gold', 0) + zmeny.get('zlato_zmena', 0)
            
            # Simple level-up check for robust backend handling (frontend does this too, but sync is better)
            xp_needed = state.get('level', 1) * 500
            if state['xp'] >= xp_needed:
                next_lvl = state.get('level', 1) + 1
                state['level'] = next_lvl
                state['max_hp'] = state.get('max_hp', 100) + 10
                state['hp'] = state['max_hp']
                state['xp'] -= xp_needed
                points_earned = 2 if next_lvl % 2 == 0 else 1
                state['skillPoints'] = state.get('skillPoints', 0) + points_earned
            
            if zmeny.get('inventar_pridat'):
                new_items = []
                for item in zmeny['inventar_pridat']:
                    if not item.get('id'):
                        item['id'] = str(uuid.uuid4())
                    new_items.append(item)
                state['inventory'] = state.get('inventory', []) + new_items
                
        # Append combat resolution to history
        history.append({'role': 'user', 'content': f'[BOJ] Poraženi nepřátelé: {enemies_str}'})
        history.append({'role': 'model', 'content': narrative})
        
        supabase.table('characters').update({'state': state, 'history': history}).eq('api_key', db_key).execute()
        
        return {
            "status": "success",
            "vypravec": narrative,
            "zmeny_stavu": zmeny
        }

    except Exception as e:
        print('Resolve combat error:', e)
        raise HTTPException(status_code=500, detail=str(e))
