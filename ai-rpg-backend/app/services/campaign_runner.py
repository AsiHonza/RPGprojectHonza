"""
Campaign Runner - Offline Story Engine for Aelthgard Act 1.
Provides 100% deterministic, rich narrative branching, NPC dialogues,
race/class specific options, and quest progression without requiring LLM calls.
"""

import uuid
import re
from typing import Optional, Dict, Any, List
from app.data.world_map import get_node, get_all_nodes, get_npc, get_all_npcs, get_quest, get_all_quests
from app.core.config import supabase

def make_item(name: str, item_type: str, slot: str, stats: str, desc: str, icon: str = "Package", rarity: str = "uncommon", sell_price: int = 20) -> dict:
    return {
        "id": f"item_{uuid.uuid4().hex[:8]}",
        "name": name,
        "type": item_type,
        "slot": slot,
        "rarity": rarity,
        "attack_bonus": 0,
        "defense_bonus": 0,
        "healing_amount": 0,
        "stats": stats,
        "sell_price": sell_price,
        "description": desc,
        "icon": icon
    }

def get_class_dialogue_option(dnd_class: str, npc_id: str, quest_id: Optional[str] = None) -> Optional[str]:
    c = (dnd_class or '').lower()
    if 'kouzel' in c or 'mág' in c or 'wiz' in c:
        if npc_id == 'boris_mlynar':
            return '[Kouzelník] "Cítím ve vzduchu kolem mlýnského náhonu jemnou rezonanci prastaré magie. Co se tu doopravdy stalo?"'
        elif npc_id == 'inkvizitor_kaelen':
            return '[Kouzelník] "Mluvíš o kacířství, inkvizitore, ale strach ze starých sil z tebe dělá slepce. Znalosti nejsou zločin."'
        elif npc_id == 'strazmistr_aldric':
            return '[Kouzelník] "Pokud byla karavana napadena magickými bestiemi, obyčejná hlídka nemá šanci. Ukážu ti, co ty stopy znamenají."'
    elif 'bojov' in c or 'figh' in c or 'barbar' in c:
        if npc_id == 'boris_mlynar':
            return '[Bojovník] "Bandité na Staré křižovatce? Můj meč si s nimi poradí. Řekni mi, kolik jich bylo a kudy utekli."'
        elif npc_id == 'inkvizitor_kaelen':
            return '[Bojovník] "Své hrozby si nech pro vystrašené vesničany. V Ruinách kláštera budu jednat podle svého uvážení."'
        elif npc_id == 'strazmistr_aldric':
            return '[Bojovník] "Připrav své muže, strážmistře. Postavím se do čela a tu křižovatku vyčistíme."'
    elif 'tul' in c or 'rogu' in c or 'zlod' in c:
        if npc_id == 'boris_mlynar':
            return '[Tulák] "Lupiči v komoře? Žádný zámek neodolá, pokud víš jak na to. Co přesně z té truhlice zmizelo?"'
        elif npc_id == 'inkvizitor_kaelen':
            return '[Tulák] "Proklouznout do krypty a nezanechat po sobě stopy? Pro mě hračka. Ale moje služby nebývají zadarmo."'
        elif npc_id == 'strazmistr_aldric':
            return '[Tulák] "Karavany málokdy přepadnou náhodou. Někdo musel dát banditům tip přímo zevnitř města."'
    elif 'kler' in c or 'pala' in c:
        if npc_id == 'boris_mlynar':
            return '[Klerik] "Nechť tě provází božská útěcha, mlynáři. Tvůj zármutek je hluboký – dovol mi pomoci nést tvé břímě."'
        elif npc_id == 'inkvizitor_kaelen':
            return '[Klerik] "Plamenný hněv Solariana není jedinou cestou víry, bratře. Spravedlnost bez soucitu je pouhou tyranií."'
        elif npc_id == 'strazmistr_aldric':
            return '[Klerik] "Požehnám zbraně tvých stráží. Ve stínech za hradbami číhá temnota, kterou zažene jen světlo."'
    elif 'druid' in c or 'hran' in c or 'rang' in c:
        if npc_id == 'boris_mlynar':
            return '[Hraničář] "Pozoroval jsem vodu v náhonu. Proud je neklidný a ptáci z okolních lesů prchají. Něco se probouzí."'
        elif npc_id == 'inkvizitor_kaelen':
            return '[Hraničář] "Les si pamatuje to, co lidé zapomněli. Pokud vypálíš klášter, uvolníš síly, které už nezkrotíš."'
        elif npc_id == 'strazmistr_aldric':
            return '[Hraničář] "Na křižovatce cítím pach krystalických vlků. Sleduji jejich stopu už od soutěsky."'
    elif 'bard' in c:
        if npc_id == 'boris_mlynar':
            return '[Bard] "Smutek ve tvých očích by pohnul i kamenným srdcem. Pověz mi celý příběh o tobě a Anně."'
        elif npc_id == 'inkvizitor_kaelen':
            return '[Bard] "Tolik vážnosti pod posvátným pláštěm! Copak Solarian zapomněl stvořit úsměv, urozený pane?"'
        elif npc_id == 'strazmistr_aldric':
            return '[Bard] "Zvěsti o přepadené karavaně se už nesou všemi krčmami v okolí. Pomohu ti utišit paniku."'
    return None

def get_race_dialogue_option(race: str, npc_id: str) -> Optional[str]:
    r = (race or '').lower()
    if 'elf' in r:
        return '[Elf] "Můj lid pamatuje dobu, kdy tyto kameny ještě nestály. Cítím tep země pod tímto údolím."'
    elif 'trpasl' in r or 'dwarf' in r:
        return '[Trpaslík] "Zdivo a staré základy tady v údolí pamatují poctivou práci. Kdo vylomil staré sklepy, rozuměl kameni."'
    elif 'drak' in r:
        return '[Drakorozený] "Zápach zrady a kacířství uráží mou čest. Půjdu rovnou k věci."'
    elif 'tiefl' in r:
        return '[Tiefling] "Lidé jako já vědí vše o předsudcích a podezřívání. Řekni mi pravdu bez vytáček."'
    return None

def get_perk_dialogue_option(perks: list, npc_id: str) -> Optional[str]:
    if not perks:
        return None
    perk_ids = set()
    for p in perks:
        if isinstance(p, dict):
            perk_ids.add(p.get('id', ''))
        elif isinstance(p, str):
            perk_ids.add(p)
            
    if 'univ_silver_tongue' in perk_ids:
        if npc_id == 'boris_mlynar':
            return '[Karta: Stříbrný jazyk] "Uklidni se, Borisi. Bolest v tvém hlase by obměkčila i kámen. Najdu tvůj prsten a dám věci do pořádku."'
        elif npc_id == 'strazmistr_aldric':
            return '[Karta: Stříbrný jazyk] "Aldrici, oba víme, že Solarianova inkvizice přinese městu jen zkázu. Spojme síly dřív, než bude pozdě."'
        elif npc_id == 'inkvizitor_kaelen':
            return '[Karta: Stříbrný jazyk] "Víra a rozum nemusí být nepřátelé, inkvizitore. Dovol mi vyřešit klášter bez zbytečného krveprolití."'
    if 'univ_sixth_sense' in perk_ids:
        if npc_id == 'boris_mlynar':
            return '[Karta: Šestý smysl] "Ten náhon... necítíš ten chlad ve vzduchu? Zloději nebyli obyčejní tuláci."'
        elif npc_id == 'strazmistr_aldric':
            return '[Karta: Šestý smysl] "Ve městě je špeh. Bandité na křižovatce přesně věděli, kdy hlídka střídá."'
    if 'barbarian_blood_frenzy' in perk_ids:
        if npc_id == 'boris_mlynar':
            return '[Karta: Krvavý zápal] "Pověz mi, kde ti psi táboří. Přísahám, že jejich doupě obrátím v popel."'
        elif npc_id == 'strazmistr_aldric':
            return '[Karta: Krvavý zápal] "Přestaň váhat, strážmistře! Dej mi volnou ruku a na křižovatce nezůstane stát jediný bandita."'
    if 'warlock_soul_harvest' in perk_ids:
        if npc_id == 'inkvizitor_kaelen':
            return '[Karta: Sklizeň duší] "Poznávám pach stínů, inkvizitore. Ale já temnotu ovládám, zatímco tebe děsí k smrti."'
    if 'cleric_solarian_verdict' in perk_ids:
        if npc_id == 'inkvizitor_kaelen':
            return '[Karta: Solarianův soud] "Plamen boha Slunce plane i ve mně, inkvizitore. Poznáš v mých očích stejný posvátný žár?"'
    return None

def try_run_campaign_action(action_text: str, char_data: dict, db_key: str) -> Optional[dict]:
    """
    Evaluates action in the context of Act 1 campaign.
    Returns DM JSON response if handled, or None to fall back to Gemini.
    """
    state_dict = char_data.get('state', {})
    history = char_data.get('history', [])
    dnd_class = char_data.get('dnd_class', 'Bojovník')
    race = char_data.get('race', 'Člověk')
    char_name = char_data.get('name', 'Poutník')
    
    current_node_id = state_dict.get('current_node_id', 'oakhaven')
    flags = set(state_dict.get('worldFlags', []) + state_dict.get('decision_flags', []))
    quests = state_dict.get('quests', [])
    inventory = state_dict.get('inventory', [])
    gold = state_dict.get('gold', 15)
    xp = state_dict.get('xp', 0)
    level = state_dict.get('level', 1)
    reputation = state_dict.get('reputation', {})
    perks = state_dict.get('perks', [])
    
    act_lower = action_text.lower().strip()
    
    # -------------------------------------------------------------
    # 1. DIALOGUE: BORIS MLYNÁŘ (Starý mlýn / Oakhaven)
    # -------------------------------------------------------------
    is_boris = any(k in act_lower for k in ['boris', 'mlynář', 'mlynar', 'starý mlýn', 'stary mlyn', 'annin prsten', 'annině prsten', 'ztracený prsten', 'ztraceny prsten', 'q001']) or (
        current_node_id == 'oakhaven' and any(k in act_lower for k in ['volba a', 'volba b', 'volba c', 'milosrdnou lež', 'pravdu o anně', 'prsten si nechat'])
    )
    if is_boris:
        # Determine Quest Q001 State
        q001 = next((q for q in quests if q.get('id') == 'Q001' or q.get('quest_id') == 'Q001'), None)
        has_ring = any('prsten' in i.get('name', '').lower() for i in inventory)
        
        # Branch Choice Submissions
        if 'volba a' in act_lower or 'milosrdnou lež' in act_lower or 'vrátit prsten a zachovat' in act_lower:
            flags.add('Q001_completed_A')
            flags.add('boris_grateful')
            if q001:
                q001['stav'] = 'splněno'
                q001['popis'] = 'Prsten jsi vrátil Borisovi a uchoval milosrdné tajemství o Annině původu.'
            
            # Remove ring, add bread, reward gold & xp
            inventory = [i for i in inventory if 'prsten' not in i.get('name', '').lower()]
            inventory.append(make_item("Čerstvý bochník chleba", "jídlo", "žádný", "Obnoví 15 HP", "Křupavý voňavý chléb upečený ze staré zásoby mouky.", "Drumstick", "common", 5))
            gold += 25
            xp += 50
            
            dm_json = {
                "vypravec": "Podáváš Borisovi zlatý kroužek. Starý mlynář se rozpláče vděčností a tiskne klenot oběma roztřesenýma rukama k hrudi.\n'Můj bože... to je on! Vracíš mi mou duši. Oakhaven ti nikdy nezapomene tuto laskavost, příteli. Vezmi si těchto 25 zlaťáků a ještě teplý bochník chleba.'\nNeříkáš nic o runě Kulla ani o stínech. Boris znovu nachází pevnou půdu pod nohama, ačkoliv tajemství zůstává pohřbeno pod hladinou řeky.",
                "popis_okoli": "Oakhaven – Starý mlýn. Vodní kolo vesele klape a z komína stoupá voňavý dým.",
                "typ_lokace": "mesto",
                "npc_dialogy": [{
                    "jmeno": "Boris Mlynář",
                    "pohlavi": "muz",
                    "text": "Pokaždé, když ten prsten sevřu v dlani, cítím, jako by Anna stála vedle mě. Děkuji ti z celého srdce!"
                }],
                "nabizene_akce": [
                    "Vydat se do Hostince U Zlomeného štítu",
                    "Zastavit se u Strážmistra Aldrica na strážnici",
                    "Prozkoumat náměstí Oakhaven"
                ],
                "system_log": "Úkol Q001 dokončen! Získáno: 25 zlata, 50 XP, Čerstvý bochník chleba. Nastaven fakt: Q001_completed_A.",
                "zmeny_stavu": {
                    "gold": gold,
                    "xp": xp,
                    "inventory": inventory,
                    "quests": quests,
                    "worldFlags": list(flags)
                }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)
            
        elif 'volba b' in act_lower or 'pravdu o anně' in act_lower or 'říct borisovi pravdu' in act_lower:
            flags.add('Q001_completed_B')
            flags.add('knows_anna_secret')
            if q001:
                q001['stav'] = 'splněno'
                q001['popis'] = 'Borisovi jsi řekl pravdu o Annině kacířské runě Kulla a získal klíč k její truhle.'
                
            inventory = [i for i in inventory if 'prsten' not in i.get('name', '').lower()]
            inventory.append(make_item("Klíč k Annině truhle", "cennost", "žádný", "Odemkne skrytou truhlu pod podlahou mlýna", "Mosazný klíč se stylizovaným symbolem stínové slzy.", "Gem", "rare", 30))
            gold += 10
            xp += 75
            
            dm_json = {
                "vypravec": "Ukazuješ Borisovi vrytou runu boha Kulla a vysvětluješ mu, kým jeho žena doopravdy byla – Probuzená čarodějka ukrytá v pohraničí.\nBoris zbledne jako čerstvě namletá mouka. Opře se o zábradlí a v očích se mu zračí hluboká propast.\n'Anna... kacířka? Celá ta léta jsem žil vedle někoho, koho jsem vlastně neznal?... Přesto ti děkuji za pravdu. Vezmi si tento starý klíč. Patřil jí. Odemkne truhlu pod podlahou, kterou jsem nikdy nedokázal otevřít. A nech mě teď chvíli o samotě.'",
                "popis_okoli": "Oakhaven – Starý mlýn. Mlýnské kolo se točí v tichém, tíživém rytmu.",
                "typ_lokace": "mesto",
                "npc_dialogy": [{
                    "jmeno": "Boris Mlynář",
                    "pohlavi": "muz",
                    "text": "Kdo se mnou ty roky spal v jedné posteli? Cizinec? Monstrum? Nebo anděl, kterého jsem nepochopil?... Jdi, prosím."
                }],
                "nabizene_akce": [
                    "Odemknout truhlu pod podlahou mlýna Anniným klíčem",
                    "Vydat se do Hostince U Zlomeného štítu",
                    "Zajít za Strážmistrem Aldricem"
                ],
                "system_log": "Úkol Q001 dokončen! Získáno: 10 zlata, 75 XP, Klíč k Annině truhle. Nastaven fakt: Q001_completed_B.",
                "zmeny_stavu": {
                    "gold": gold,
                    "xp": xp,
                    "inventory": inventory,
                    "quests": quests,
                    "worldFlags": list(flags)
                }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

        elif 'volba c' in act_lower or 'nechat prsten' in act_lower or 'prsten si nechat' in act_lower:
            flags.add('Q001_completed_C')
            flags.add('has_kull_ring')
            flags.add('player_is_cynical')
            if q001:
                q001['stav'] = 'splněno'
                q001['popis'] = 'Borisovi jsi zalhal, že prsten byl ztracen, a ponechal sis jej pro jeho magickou sílu.'
            
            # Upgrade ring to usable magic item
            inventory = [i for i in inventory if 'prsten' not in i.get('name', '').lower()]
            inventory.append(make_item("Prsten boha Kulla", "doplněk", "prsten", "+1 slot kouzel, aura stínu", "Prastarý stříbrný kroužek vyzařující mrazivý chlad. Zvyšuje kapacitu kouzelnických slotů o 1.", "Gem", "rare", 50))
            xp += 40
            
            dm_json = {
                "vypravec": "Hledíš Borisovi chladně do očí a tvrdíš, že lupiči už prsten odvezli neznámo kam. Boris se sesune na pytel obilí a v bezmoci svěsí hlavu.\n'Takže je pryč... Poslední vzpomínka je pryč.'\nV kapse tě zatím hřeje prsten se stínovou runou. Jakmile se jeho rytiny dotkneš, prsty ti projede elektrické zachvění. Cítíš, jak v tvé duši rezonuje dřímající síla Probuzených.",
                "popis_okoli": "Oakhaven – Starý mlýn. Šero padá na moučné pytle a Boris sedí sám ve svém smutku.",
                "typ_lokace": "mesto",
                "npc_dialogy": [{
                    "jmeno": "Boris Mlynář",
                    "pohlavi": "muz",
                    "text": "Prosím... nech mě o samotě s mým žalem."
                }],
                "nabizene_akce": [
                    "Odejít z mlýna do Hostince U Zlomeného štítu",
                    "Prozkoumat zákoutí Oakhaven"
                ],
                "system_log": "Úkol Q001 dokončen! Získáno: Prsten boha Kulla (+1 slot kouzel), 40 XP. Nastaven fakt: Q001_completed_C.",
                "zmeny_stavu": {
                    "gold": gold,
                    "xp": xp,
                    "inventory": inventory,
                    "quests": quests,
                    "worldFlags": list(flags)
                }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

        # Q001 Step 3: Player has the ring and is returning to Boris!
        if has_ring and ('Q001_step2_done' in flags or (q001 and q001.get('stav') == 'aktivni')):
            flags.add('Q001_step3_ready')
            dm_json = {
                "vypravec": "Stojíš znovu před Borisem Mlynářem v šeru starého mlýna. Mlynář na tebe hledí plný naděje a napětí. V kapse cítíš chladný kov Annina snubního prstenu se záhadnou stínovou runou boha Kulla.\nTeď je chvíle se rozhodnout, co mu řekneš.",
                "popis_okoli": "Oakhaven – Starý mlýn. Pod podlahou tiše duní mlýnský náhon a Boris čeká na tvá slova.",
                "typ_lokace": "mesto",
                "npc_dialogy": [{
                    "jmeno": "Boris Mlynář",
                    "pohlavi": "muz",
                    "text": "Vidím ti to na očích... Našels ho? Našels Annin prsten?!"
                }],
                "nabizene_akce": [
                    "Volba A: [Čestný] Vrátit prsten a zachovat milosrdnou lež",
                    "Volba B: [Hledač pravdy] Říct Borisovi pravdu o Anně a runě Kulla",
                    "Volba C: [Ziskuchtivý] Prsten si nechat pro jeho skrytou magickou moc"
                ],
                "system_log": "Rozhodující volba úkolu Q001! Vyber jednu ze tří větví.",
                "zmeny_stavu": { "worldFlags": list(flags) }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

        # Q001 Acceptance
        if 'přijmout úkol' in act_lower or 'pomohu ti' in act_lower or 'najdu tvůj prsten' in act_lower:
            flags.add('Q001_started')
            if not q001:
                quests.append({
                    "id": "Q001",
                    "nazev": "Q001: Ztracený prsten",
                    "zadavatel": "Boris Mlynář",
                    "stav": "aktivni",
                    "popis": "Borisovi ze Starého mlýna ukradli bandité zlatý prsten po zesnulé ženě Anně. Stopa vede na Starou křižovatku."
                })
            
            dm_json = {
                "vypravec": "Boris vděčně sevře tvou ruku mozolnatou dlaní. V očích se mu zaleskne jiskra naděje.\n'Díky, poutníku! Bandité utekli na východ po staré císařské cestě směrem ke Staré křižovatce. Byli to hrdlořezi v oškubaných kožených kabátcích. Buď opatrný – les kolem křižovatky je poslední dobou plný podivných stínů.'",
                "popis_okoli": "Oakhaven – Starý mlýn. Na stole leží hrubá mapa okolí s vyznačenou Starou křižovatkou.",
                "typ_lokace": "mesto",
                "npc_dialogy": [{
                    "jmeno": "Boris Mlynář",
                    "pohlavi": "muz",
                    "text": "Přines mi ho prosím zpět. Zaplatím ti vším, co mi ještě zbylo!"
                }],
                "nabizene_akce": [
                    "Cestuji do lokace: crossroads",
                    "Vyptat se na podrobnosti o banditech",
                    "Vrátit se na náměstí Oakhaven"
                ],
                "system_log": "Přijat úkol Q001: Ztracený prsten. Cíl: Stará křižovatka.",
                "zmeny_stavu": { "quests": quests, "worldFlags": list(flags) }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

        # Initial Encounter / Greeting
        greeting_text = "Vítej, poutníku... Promiň ten nepořádek. Od té doby, co odešla Anna, mlýn jen tiše chátrá. Hledáš mouku, nebo jen přístřeší před deštěm?"
        if 'Q001_completed_A' in flags:
            greeting_text = "Á, příteli! Pokaždé, když ten prsten sevřu v dlani, cítím, jako by Anna stála vedle mě. Děkuji ti z celého srdce."
        elif 'Q001_completed_B' in flags:
            greeting_text = "Vítej... Pořád přemýšlím o tom, co jsi mi řekl o Anně. O té runě... Celá léta jsem žil vedle někoho, koho jsem vlastně neznal. Přesto ti děkuji za pravdu."
        elif 'Q001_completed_C' in flags:
            greeting_text = "Ty... Prsten jsi nenašel, viď? Cítím v kostech, že mi něco tajíš. Prosím, nech mě o samotě s mým žalem."

        # Perk Dialogue Handling
        if '[karta:' in act_lower:
            if 'stříbrný jazyk' in act_lower or 'stribrny jazyk' in act_lower:
                dm_json = {
                    "vypravec": "Tvůj hlas je klidný a nese v sobě vzácné pochopení, které Borise zasáhne přímo do srdce. Starý muž si otře slzu a poprvé po dlouhé době se zhluboka nadechne.\n'Máš pravdu, příteli. Hněv a pláč Annu nevrátí. Věřím ti. Vezmi si tento starý klíč od člunu u řeky a 15 zlaťáků na cestu. Ať tě ochraňují bohové.'",
                    "popis_okoli": "Oakhaven – Starý mlýn. Napětí opadlo a v Borisových očích svitla naděje.",
                    "typ_lokace": "mesto",
                    "npc_dialogy": [{
                        "jmeno": "Boris Mlynář",
                        "pohlavi": "muz",
                        "text": "Tvá slova mají dar hojit rány. Kéž by takových jako ty bylo v Aelthgardu víc."
                    }],
                    "nabizene_akce": [
                        "Přijmout úkol: Najít Annin prsten na Staré křižovatce",
                        "Vydat se na náměstí Oakhaven",
                        "Odejít z mlýna"
                    ],
                    "system_log": "Úspěšná zkouška vyjednávání skrze Znamení: Stříbrný jazyk! Získáno +15 zlaťáků a důvěra Borise.",
                    "zmeny_stavu": { "zlato_zmena": 15 }
                }
                return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

        actions = []
        if 'Q001_started' not in flags and not any(k in flags for k in ['Q001_completed_A', 'Q001_completed_B', 'Q001_completed_C']):
            actions.append("Přijmout úkol: Najít Annin prsten na Staré křižovatce")
        
        perk_opt = get_perk_dialogue_option(perks, 'boris_mlynar')
        if perk_opt: actions.append(perk_opt)
        class_opt = get_class_dialogue_option(dnd_class, 'boris_mlynar')
        if class_opt: actions.append(class_opt)
        race_opt = get_race_dialogue_option(race, 'boris_mlynar')
        if race_opt: actions.append(race_opt)
        actions.append("Zeptat se na Annu a historii mlýna")
        actions.append("Odejít z mlýna")

        dm_json = {
            "vypravec": "Vstoupil jsi do chladného stínu Starého mlýna. Ve vzduchu visí vůně moučného prachu a starého tlejícího dřeva. Za těžkým stolem sedí shrbený Boris Mlynář a nepřítomně hledí do prázdné hliněné misky.",
            "popis_okoli": "Oakhaven – Starý mlýn. Mohutné převodové soukolí tiše skřípe v rytmu tekoucí vody.",
            "typ_lokace": "mesto",
            "npc_dialogy": [{
                "jmeno": "Boris Mlynář",
                "pohlavi": "muz",
                "text": greeting_text
            }],
            "nabizene_akce": actions,
            "system_log": "Rozhovor s Borisem Mlynářem.",
            "zmeny_stavu": {}
        }
        return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

    # -------------------------------------------------------------
    # 2. EXPLORING STARÁ KŘIŽOVATKA (Q001 Step 2 / Q003)
    # -------------------------------------------------------------
    if current_node_id == 'crossroads' and any(k in act_lower for k in ['prozkoumat', 'tábor', 'tabor', 'stopy', 'hledat prsten', 'okolí']):
        q001 = next((q for q in quests if q.get('id') == 'Q001' or q.get('quest_id') == 'Q001'), None)
        if q001 and q001.get('stav') == 'aktivni' and 'Q001_step2_done' not in flags:
            flags.add('Q001_step2_done')
            inventory.append(make_item("Annin runový prsten", "doplněk", "prsten", "Vyzařuje chladnou auru Kulla", "Zlatý kroužek s jemně rytou kacířskou runou na vnitřní straně.", "Ring", "uncommon", 25))
            
            dm_json = {
                "vypravec": "Mezi trním a ostružiním u starého rozcestníku nacházíš stopy po chvatném táboření. Popel v ohništi je ještě vlažný.\nKdyž odhrneš zetlelé listí, narazíš na roztržený kožený váček. V blátě se třpytí zlatý prsten. Jakmile ho vezmeš do dlaně, prsty ti projede ostré mrazivé bodnutí. Na vnitřní straně obroučky je dokonale vyrytá runa boha Kulla.\nAnna nebyla obyčejná vesnická žena. Tento prsten je posvátným ochranným poutem.",
                "popis_okoli": "Stará křižovatka. Mech pokrývá kamenné desky a z lesa vane mrazivý vánek.",
                "typ_lokace": "divocina",
                "npc_dialogy": [],
                "nabizene_akce": [
                    "Cestuji do lokace: oakhaven",
                    "Zkoumat runu na prstenu podrobněji",
                    "Prozkoumat okolní houštiny"
                ],
                "system_log": "Nalezen předmět: Annin runový prsten! Pokrok úkolu Q001: Vrať se k Borisovi do Oakhaven.",
                "zmeny_stavu": {
                    "inventory": inventory,
                    "worldFlags": list(flags)
                }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

    # -------------------------------------------------------------
    # 3. DIALOGUE: INKVIZITOR KAELEN (Hostinec / Oakhaven)
    # -------------------------------------------------------------
    if any(k in act_lower for k in ['kaelen', 'inkvizitor', 'inkvizice', 'šepot krypty', 'sepot krypty', 'q002']):
        # Greet according to previous decisions
        kaelen_greeting = "Klidně si sedni, poutníku. Ale ne příliš blízko. Vzduch v tomhle zapadákově páchne potem a zatajovaným hříchem. Nevypadáš jako zdejší oráč... Což znamená, že buď před něčím utíkáš, nebo hledáš, komu prodat svůj meč."
        if 'Q001_completed_A' in flags:
            kaelen_greeting = "Viděl jsem starého mlynáře. Slzí štěstím a svírá zlatý kroužek. Hlupák... Netuší, že ten kov studí mrazem hrobu. Ty jsi mu ten prsten vrátil, že ano? Zvláštní, jak ochotně lidé pomáhají zakrývat stopy nečistých."
        elif 'Q001_completed_B' in flags:
            kaelen_greeting = "Ten ubohý mlynář Boris se třese v koutě svého mlýna. Říká se, žes mu otevřel oči ohledně jeho milované Anny. Znalec pravdy... nebo krysa, co čmuchá v cizích tajemstvích? To se brzy ukáže."
        elif 'Q001_completed_C' in flags:
            kaelen_greeting = "Stůj na místě. Necítíš to? Ten mrazivý pach spáleného stříbra a vlhké hlíny... Neseš na sobě pečeť Kulla, cizinče. Pokud ji nesmyješ ohněm, brzy tě pohltí."

        # Q002 Offer / Progression
        q002 = next((q for q in quests if q.get('id') == 'Q002' or q.get('quest_id') == 'Q002'), None)
        
        if 'přijmout vyšetřování' in act_lower or 'půjdu do ruin' in act_lower or 'prozkoumám klášter' in act_lower:
            flags.add('Q002_started')
            if not q002:
                quests.append({
                    "id": "Q002",
                    "nazev": "Q002: Šepot krypty",
                    "zadavatel": "Inkvizitor Kaelen",
                    "stav": "aktivni",
                    "popis": "Inkvizitor Kaelen tě posílá do Ruin kláštera sv. Judity, abys v podzemní kryptě zajistil Anniny zápisky a stínový pečetní kámen."
                })
            dm_json = {
                "vypravec": "Kaelen pomalu pokývne a odloží stříbrnou kadidelnici na dřevěný stůl.\n'Moudré rozhodnutí, poutníku. Ruiny kláštera svaté Judity leží jihovýchodně za Starou křižovatkou. Pronikni do podzemních krypt, pobij kultisty a přines mi Annin deník a cokoliv, co najdeš na oltáři. Pokud uspěješ, Solarianova církev tě štědře odmění. Pokud selžeš... plameny očistí tebe i celé toto údolí.'",
                "popis_okoli": "Hostinec U Zlomeného štítu. Kaelenovi ozbrojenci hlídají dveře a štamgasti mlčí.",
                "typ_lokace": "mesto",
                "npc_dialogy": [{
                    "jmeno": "Inkvizitor Kaelen",
                    "pohlavi": "muz",
                    "text": "Jdi ke Staré křižovatce a odtud zamiř k Ruinám kláštera. Neotálej."
                }],
                "nabizene_akce": [
                    "Cestuji do lokace: crossroads",
                    "Zeptat se na povahu kletby v kryptě",
                    "Odejít z hostince"
                ],
                "system_log": "Přijat úkol Q002: Šepot krypty. Cíl: Ruiny kláštera.",
                "zmeny_stavu": { "quests": quests, "worldFlags": list(flags) }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

        actions = []
        if 'Q002_started' not in flags and 'Q002_completed_A' not in flags and 'Q002_completed_B' not in flags:
            actions.append("Přijmout vyšetřování v Ruinách kláštera (Q002)")
        
        class_opt = get_class_dialogue_option(dnd_class, 'inkvizitor_kaelen')
        if class_opt: actions.append(class_opt)
        race_opt = get_race_dialogue_option(race, 'inkvizitor_kaelen')
        if race_opt: actions.append(race_opt)
        actions.append("Proč se inkvizice zajímá právě o Oakhaven?")
        actions.append("Odejít od inkvizitorova stolu")

        dm_json = {
            "vypravec": "Přistoupil jsi ke stolu v rohu hostince. Kaelen sedí v plné zbroji, na prsou se mu leskne planoucí slunce Solariana. Z jeho stříbrné kadidelnice stoupá štiplavý kouř z pelyňku a sušeného myrhového dřeva. Jeho pronikavé jantarové oči tě změří od hlavy k patě.",
            "popis_okoli": "Hostinec U Zlomeného štítu. V krbu praská dřevo a vzduch je napjatý.",
            "typ_lokace": "mesto",
            "npc_dialogy": [{
                "jmeno": "Inkvizitor Kaelen",
                "pohlavi": "muz",
                "text": kaelen_greeting
            }],
            "nabizene_akce": actions,
            "system_log": "Rozhovor s Inkvizitorem Kaelenem.",
            "zmeny_stavu": {}
        }
        return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

    # -------------------------------------------------------------
    # 4. RUINY KLÁŠTERA & KRYPTA (Q002 Steps 3-5 Climax)
    # -------------------------------------------------------------
    if current_node_id == 'monastery_ruins':
        q002 = next((q for q in quests if q.get('id') == 'Q002' or q.get('quest_id') == 'Q002'), None)
        
        # Q002 Branch Choices in Crypt
        if 'sluneční ortel' in act_lower or 'odevzdat relikvii' in act_lower or 'volba a' in act_lower:
            flags.add('Q002_completed_A')
            flags.add('kaelen_purged_ruins')
            flags.add('boris_imprisoned')
            flags.add('oakhaven_inquisition_lockdown')
            if q002: q002['stav'] = 'splněno'
            gold += 50
            xp += 120
            inventory.append(make_item("Solarianův posvěcený amulet", "doplněk", "krk", "+10% odolnost proti ohni", "Těžký stříbrný medailon požehnaný inkvizitorem.", "Gem", "rare", 40))
            inventory.append(make_item("Kaelenova propustka", "cennost", "žádný", "Umožňuje průchod inkvizičními hlídkami", "Zapečetěný pergamen s pečetí Plamenného meče.", "Scroll", "uncommon", 15))
            
            dm_json = {
                "vypravec": "Ustoupíš stranou a podáváš Kaelenovi Annin deník i mrazivý Stínový kámen. Kaelenovy oči zahoří fanatickým uspokojením.\n'Solarian očistí tuto zemi!' vykřikne a polije oltář posvátným olejem. Bílý plamen zachvátí kámen, který v agónii kvílí a puká. Strop krypty se začíná hroutit a vy sotva unikáte ven.\nKaelen však v deníku nachází Annino jméno i zmínku o mlýnu v Oakhaven.\n'Spravedlnost nezná slitování,' prohlásí chladně. V Oakhaven nechává okamžitě zatknout Borise Mlynáře za ukrývání kacířky. Na náměstí vyrostl pranýř a město je sevřeno stanným právem inkvizice!",
                "popis_okoli": "Ruiny kláštera svaté Judity. K zemi padají spálené trámy a v dálce zvoní umíráček v Oakhaven.",
                "typ_lokace": "dungeon",
                "npc_dialogy": [{
                    "jmeno": "Inkvizitor Kaelen",
                    "pohlavi": "muz",
                    "text": "Oakhaven bude očištěno ohněm. Zpět do města, poutníku!"
                }],
                "nabizene_akce": [
                    "Cestuji do lokace: oakhaven",
                    "Postavit se Kaelenovi před branami města",
                    "Vyhledat Strážmistra Aldrica"
                ],
                "system_log": "Úkol Q002 dokončen (Větev A)! Oakhaven je pod stanným právem inkvizice! Boris je uvězněn.",
                "zmeny_stavu": {
                    "gold": gold,
                    "xp": xp,
                    "inventory": inventory,
                    "quests": quests,
                    "worldFlags": list(flags)
                }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

        elif 'zmlklé svědectví' in act_lower or 'zapečetiti kámen' in act_lower or 'volba b' in act_lower:
            flags.add('Q002_completed_B')
            flags.add('anna_secrets_kept')
            flags.add('sealed_shadow_stone')
            flags.add('contact_tajemne_utociste')
            if q002: q002['stav'] = 'splněno'
            gold += 35
            xp += 150
            inventory.append(make_item("Annin stříbrný medailon", "doplněk", "krk", "+10% odolnost vůči kletbám", "Ochranný medailon Tajemného Útočiště.", "Gem", "rare", 40))
            inventory.append(make_item("Zapečetěná schrána Útočiště", "cennost", "žádný", "Tajná korespondence Probuzených", "Dřevěná skříňka zapečetěná stínovým voskem.", "Package", "rare", 50))
            
            dm_json = {
                "vypravec": "Rychle odříkáš Anninu formuli a zapečetíš Stínový kámen vlastní krví. Kámen zmatní a temný šepot utichne. Schováš deník i relikvii do brašny.\nKdyž Kaelen sestoupí do krypty, lžeš mu s kamennou tváří: 'Kultisté rituál zpackali dřív, než jsem dorazil. Není tu nic než ohořelé kosti.'\nKaelen podezřívavě obhlíží oltář, ale magické záření vyprchalo. Znechuceně odplivne, hodí ti měšec se stříbrem a opouští ruiny.\nVečer za tebou přistoupí zahalená postava se znakem Útočiště: 'Anna by byla hrdá. Útočiště nezapomíná.'",
                "popis_okoli": "Ruiny kláštera. Šedivá mlha zahaluje rozpadlé náhrobky, ale město Oakhaven je pro tuto chvíli zachráněno.",
                "typ_lokace": "dungeon",
                "npc_dialogy": [],
                "nabizene_akce": [
                    "Cestuji do lokace: oakhaven",
                    "Prozkoumat tajnou schránu Útočiště",
                    "Navštívit Borise Mlynáře"
                ],
                "system_log": "Úkol Q002 dokončen (Větev B)! Kaelen byl obelstěn. Tajemné Útočiště navázalo kontakt!",
                "zmeny_stavu": {
                    "gold": gold,
                    "xp": xp,
                    "inventory": inventory,
                    "quests": quests,
                    "worldFlags": list(flags)
                }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

        elif 'pakt se stíny' in act_lower or 'vyrvat kámen' in act_lower or 'volba c' in act_lower:
            flags.add('Q002_completed_C')
            flags.add('player_has_kull_relic')
            flags.add('kaelen_trapped_in_ruins')
            if q002: q002['stav'] = 'splněno'
            xp += 220
            inventory.append(make_item("Střípek Srdce Kulla", "cennost", "žádný", "Unikátní klíčová relikvie Kulla", "Mrazivý černý krystal pulzující temným tepem Probuzení.", "Gem", "epic", 100))
            
            dm_json = {
                "vypravec": "Dýkou vypáčíš Stínový kámen přímo z oltáře. Celá krypta se otřese v základech. Když Kaelen vtrhne po schodech dolů a tasí meč, přesekneš lano starého kamenného lustru!\nTěžký kruh se zřítí a zatarasí schodiště lavinou balvanů. Kaelen zůstává uvězněn za závalem a ty unikáš starou pašeráckou šachtou do bezpečí.\nV tlumoku ti tepe mocná relikvie, která navždy změní tvůj osud.",
                "popis_okoli": "Ruiny kláštera. Z hlubin podzemí se ozývá tlumené bušení a Kaelenův zuřivý křik.",
                "typ_lokace": "dungeon",
                "npc_dialogy": [],
                "nabizene_akce": [
                    "Cestuji do lokace: oakhaven",
                    "Prozkoumat sílu Střípku Srdce Kulla"
                ],
                "system_log": "Úkol Q002 dokončen (Větev C)! Získána relikvie Střípek Srdce Kulla! Kaelen je uvězněn v kryptě.",
                "zmeny_stavu": {
                    "xp": xp,
                    "inventory": inventory,
                    "quests": quests,
                    "worldFlags": list(flags)
                }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

        # Entering Crypt / Malakar encounter
        if any(k in act_lower for k in ['prozkoumat', 'krypta', 'malakar', 'oltář', 'oltar']):
            dm_json = {
                "vypravec": "Sestoupil jsi do mrazivých krypt svaté Judity. U znesvěceného oltáře boha Kulla leží padlý Kultista Malakar a nad oltářem pulzuje Stínový pečetní kámen vedle Annina zapečetěného deníku.\nZe schodiště se už ozývají těžké kroky okovaných bot – Inkvizitor Kaelen sestupuje s pochodní a taseným mečem dolů. Teď se rozhodne o osudu celého údolí!",
                "popis_okoli": "Krypta svaté Judity. Chlad proniká až do morku kostí a temný šepot sílí.",
                "typ_lokace": "dungeon",
                "npc_dialogy": [],
                "nabizene_akce": [
                    "Volba A: [Sluneční ortel] Odevzdat relikvii i deník Kaelenovi k očistnému plameni",
                    "Volba B: [Zmlklé svědectví] Zapečetit kámen Anniným rituálem a obelstít Kaelena",
                    "Volba C: [Pakt se Stíny] Vyrvat Stínový kámen z oltáře a uvěznit Kaelena v kryptě"
                ],
                "system_log": "Klimaktická volba úkolu Q002! Zvol osud Stínového kamene a Inkvizitora.",
                "zmeny_stavu": {}
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

    # -------------------------------------------------------------
    # 5. GRAND FINALE OF ACT 1: OAKHAVEN SQUARE CLIMAX
    # -------------------------------------------------------------
    if current_node_id == 'oakhaven' and 'oakhaven_inquisition_lockdown' in flags:
        if any(k in act_lower for k in ['konfrontovat', 'pranýř', 'pranyr', 'kaelen', 'osvobodit', 'náměstí', 'namesti']):
            # Grand finale climax scene
            dm_json = {
                "vypravec": "Předstoupil jsi před shromážděný dav na náměstí Oakhaven. Kaelen stojí u hranice s pochodní v ruce a Boris Mlynář klečí v řetězech pod pranýřem.\n'Lidé z Oakhaven!' zvoláš a tvůj hlas rozrazí hrobové ticho.\nStrážmistr Aldric a jeho městská garda tasí meče a staví se po tvém boku proti inkvizičním fanatikům. Ukazuješ důkazy o tom, že Annina oběť držela město v bezpečí, a odhaluješ Kaelenovo slepé běsnění!\nKaelen v zuřivosti zasyčí, ale tváří v tvář celému městu a tvé odhodlané zbrani pochopí, že tentokrát prohrál. Zhasne pochodeň a s kletbou na rtech ustupuje k bráně.\nBoris je volný, lidé jásají a údolí Oakhaven je zachráněno. První akt tvé legendy se uzavírá!",
                "popis_okoli": "Oakhaven – Náměstí svobody. Lidé slaví a slunce konečně proráží ranní mlhu.",
                "typ_lokace": "mesto",
                "npc_dialogy": [
                    {
                        "jmeno": "Strážmistr Aldric",
                        "pohlavi": "muz",
                        "text": "Stáli jsme při sobě, příteli. Tohle město ti vděčí za své přežití!"
                    },
                    {
                        "jmeno": "Boris Mlynář",
                        "pohlavi": "muz",
                        "text": "Zachránil jsi mě i památku mé ženy. Aelthgard má nového hrdinu!"
                    }
                ],
                "nabizene_akce": [
                    "Oslavit vítězství v Hostinci U Zlomeného štítu",
                    "Připravit se na cestu do dalších království Aelthgardu",
                    "Prozkoumat okolní divočinu a zakázky"
                ],
                "system_log": "VELKÉ FINÁLE 1. AKTU DOKONČENO! Oakhaven osvobozeno, Kaelen zahnán na ústup! Získáno: 100 zlata, 300 XP!",
                "zmeny_stavu": {
                    "gold": gold + 100,
                    "xp": xp + 300,
                    "worldFlags": list(flags | {"act1_completed", "kaelen_repelled"})
                }
            }
            return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

    # -------------------------------------------------------------
    # 6. DIALOGUE: STRÁŽMISTR ALDRIC (Strážnice / Náměstí Oakhaven)
    # -------------------------------------------------------------
    if any(k in act_lower for k in ['aldric', 'strážmistr', 'strazmistr', 'strážnice', 'straznice', 'hlídka', 'hlidka', 'gard']):
        aldric_greeting = "Mám dvanáct chlapů na celé město a dvě stě sáhů hradeb. Císařský dvůr posílá jen výběrčí daní, ale když žádám o posily, dělají, že neslyší. Každý den navíc bez krveprolití je pro mě vyhraná bitva. Co potřebuješ, poutníku?"
        if 'Q001_completed_A' in flags or 'Q001_completed_B' in flags:
            aldric_greeting = "Slyšel jsem, že jsi pomohl Borisovi s tím prstenem. Dobrá práce. V tomhle městě je málo lidí, co udělají něco pro druhého bez taseného měšce. Ale dej si pozor na Kaelena v hostinci... ten inkvizitor nehledá spravedlnost, ale krev."

        actions = []
        if 'Q001_started' not in flags and not any(k in flags for k in ['Q001_completed_A', 'Q001_completed_B', 'Q001_completed_C']):
            actions.append("Vydat se ke Starému mlýnu za mlynářem Borisem")
        else:
            actions.append("Cestuji do lokace: crossroads")
        
        class_opt = get_class_dialogue_option(dnd_class, 'strazmistr_aldric')
        if class_opt: actions.append(class_opt)
        race_opt = get_race_dialogue_option(race, 'strazmistr_aldric')
        if race_opt: actions.append(race_opt)
        actions.append("Poptat se na situaci na Staré křižovatce a v okolních lesích")
        actions.append("Otevřít přehled města a prozkoumat čtvrti Oakhavenu")

        dm_json = {
            "vypravec": "Zastavil ses u bytelné trámové strážnice na náměstí. Strážmistr Aldric, prošedivělý veterán s hlubokou jizvou na lící a vycíděnou valerijskou šavlí po boku, si tě přeměří přísným, zkušeným pohledem vojáka.",
            "popis_okoli": "Oakhaven – Městská strážnice. Na stěně visí zatykače na bandity z křižovatky a dva mladí gardisté brousí halapartny.",
            "typ_lokace": "mesto",
            "npc_dialogy": [{
                "jmeno": "Strážmistr Aldric",
                "pohlavi": "muz",
                "text": aldric_greeting
            }],
            "nabizene_akce": actions,
            "system_log": "Rozhovor se Strážmistrem Aldricem.",
            "zmeny_stavu": {}
        }
        return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

    # -------------------------------------------------------------
    # 7. TOWN OVERVIEW & DISTRICT EXPLORATION
    # -------------------------------------------------------------
    if any(k in act_lower for k in ['přehled města', 'prehled mesta', 'čtvrti', 'ctvrti', 'prozkoumat město', 'prozkoumat mesto', 'náměstí', 'namesti']):
        dm_json = {
            "vypravec": "Stojíš v srdci Oakhavenu u vyhlazeného Pařezu Pradubu. Zdejší život pulzuje v křivolakých uličkách: na západě hučí vodní kolo Starého mlýna mlynáře Borise, ze severu doléhá dunění kovadliny kováře Torvina a z Hostince U Zlomeného štítu stoupá lákavá vůně pečené zvěřiny a piva.\n\n(Tip: Pro přehled budov a rychlé služby můžeš kdykoliv použít tlačítko 'Město' v horní liště!)",
            "popis_okoli": "Oakhaven – Náměstí u Pradubu. Centrum pohraničního obchodu a řemesel.",
            "typ_lokace": "mesto",
            "npc_dialogy": [],
            "nabizene_akce": [
                "Vydat se ke Starému mlýnu za mlynářem Borisem",
                "Zastavit se u Strážmistra Aldrica na strážnici",
                "Navštívit Hostinec U Zlomeného štítu (Inkvizitor Kaelen)",
                "Cestuji do lokace: crossroads"
            ],
            "system_log": "Prohlídka města Oakhaven. Zpřístupněny hlavní městské uzly.",
            "zmeny_stavu": {}
        }
        return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

    # Not handled by offline scripted triggers
    return None

def campaign_fallback_action(action_text: str, char_data: dict, db_key: str) -> dict:
    """
    100% Deterministic Fallback for Autorská kampaň.
    Never calls Gemini. Keeps narrative grounded in canonical Act 1 lore
    and guides the player to relevant quest objectives.
    """
    state_dict = char_data.get('state', {})
    current_node_id = state_dict.get('current_node_id', 'oakhaven')
    quests = state_dict.get('quests', [])
    flags = set(state_dict.get('worldFlags', []) + state_dict.get('decision_flags', []))
    q001 = next((q for q in quests if q.get('id') == 'Q001' or q.get('quest_id') == 'Q001'), None)
    q002 = next((q for q in quests if q.get('id') == 'Q002' or q.get('quest_id') == 'Q002'), None)

    if current_node_id == 'oakhaven':
        if 'oakhaven_inquisition_lockdown' in flags:
            narration = f"Rozhlížíš se po náměstí Oakhavenu. Ve vzduchu je cítit štiplavý dým a strach. Inkvizitor Kaelen drží město pod zámkem a Boris Mlynář čeká spoutaný u pranýře. Celé údolí hledí na tebe, zda se postavíš tyranovi!"
            actions = [
                "Konfrontovat Kaelena na náměstí a osvobodit Borise",
                "Vyhledat Strážmistra Aldrica a požádat gardu o podporu"
            ]
        elif q001 and q001.get('stav') == 'aktivni':
            has_ring = any('prsten' in i.get('name', '').lower() for i in state_dict.get('inventory', []))
            if has_ring:
                narration = f"Tvá akce '{action_text}' tě přivedla zpět k úvahám o prstenu. V kapse tě chladí Annin kacířský šperk. Starý Boris čeká u svého mlýna, zatímco v hostinci sedí neúprosný Inkvizitor Kaelen. Komu z nich prsten předložíš?"
                actions = [
                    "Vrátit se za Borisem k mlýnu",
                    "Zajít za Inkvizitorem Kaelenem do Hostince U Zlomeného štítu",
                    "Otevřít přehled města a čtvrtí"
                ]
            else:
                narration = f"Tvá akce '{action_text}' rozvíří prach uliček Oakhavenu. Boris Mlynář netrpělivě čeká u mlýna – stopa banditů, kteří ukradli Annin prsten, vede na Starou křižovatku."
                actions = [
                    "Cestuji do lokace: crossroads",
                    "Zajít k mlynáři Borisovi pro další podrobnosti",
                    "Promluvit se Strážmistrem Aldricem"
                ]
        elif q002 and q002.get('stav') == 'aktivni':
            narration = f"Vnímáš napětí, které v Oakhavenu roste. Inkvizitor Kaelen tě pověřil vyšetřením Ruin kláštera svaté Judity za křižovatkou. Z krypt se šíří mrazivý dech starých sil."
            actions = [
                "Cestuji do lokace: crossroads",
                "Promluvit s Inkvizitorem Kaelenem v hostinci",
                "Zastavit se u Strážmistra Aldrica"
            ]
        else:
            narration = f"Reaguješ na okolí ('{action_text}'). Ranní slunce pomalu prohřívá dláždění u Pařezu Pradubu. Z mlýna u řeky doléhá zoufalý hlas mlynáře Borise a strážmistr Aldric na dohled kontroluje své muže."
            actions = [
                "Vydat se ke Starému mlýnu a zjistit, proč mlynář Boris pláče",
                "Zastavit se u Strážmistra Aldrica na strážnici a poptat se na situaci",
                "Otevřít přehled města a prozkoumat čtvrti Oakhavenu"
            ]
        popis = "Oakhaven – Náměstí u Pradubu. Pohraniční život plyne pod stálým dohledem palisád."
        typ_loc = "mesto"

    elif current_node_id == 'crossroads':
        narration = f"Zkoumáš okolí Staré křižovatky ('{action_text}'). Mezi ostružiním u vyhořelé mýtnice leží rozbité sudy a stopy po rychlém úprku banditů. Cesty odtud vedou zpět do Oakhaven, nebo dál k Ruinám kláštera a do Temného hvozdu."
        actions = [
            "Prozkoumat okolí a hledat stopy banditů",
            "Cestuji do lokace: oakhaven",
            "Cestuji do lokace: monastery_ruins"
        ]
        popis = "Stará křižovatka. Zpustlé rozcestí starých císařských cest v ranním chladu."
        typ_loc = "divocina"

    elif current_node_id == 'monastery_ruins':
        narration = f"Stojíš mezi zřícenými zdmi kláštera svaté Judity. Černý kámen vyzařuje mrazivou energii a po kamenných schodech dolů se táhne pach kadidla a vlhké hlíny z krypt."
        actions = [
            "Sestoupit do podzemní krypty k oltáři",
            "Cestuji do lokace: crossroads"
        ]
        popis = "Ruiny kláštera sv. Judity. Mlčenlivé rozvaliny ukrývající podzemní krypty."
        typ_loc = "dungeon"

    else:
        narration = f"Rozhlížíš se po okolí ({action_text}). Zdejší krajina je tichá, avšak neklidná."
        actions = [
            "Cestuji do lokace: oakhaven",
            "Prozkoumat okolí"
        ]
        popis = "Pohraničí Aelthgardu."
        typ_loc = "divocina"

    dm_json = {
        "vypravec": narration,
        "popis_okoli": popis,
        "typ_lokace": typ_loc,
        "npc_dialogy": [],
        "nabizene_akce": actions,
        "system_log": "Autorská kampaň: Zpracováno offline vypravěčem.",
        "zmeny_stavu": {}
    }
    return _save_and_return(dm_json, action_text, state_dict, char_data, db_key)

def _save_and_return(dm_json: dict, action_text: str, state_dict: dict, char_data: dict, db_key: str) -> dict:
    """Helper to update state, history, and DB atomically."""
    # Apply changes to state_dict
    zmeny = dm_json.get("zmeny_stavu", {})
    for k, v in zmeny.items():
        state_dict[k] = v
        
    history = char_data.get('history', [])
    history.append({'role': 'user', 'text': action_text, 'content': action_text})
    
    import json
    history.append({'role': 'model', 'text': json.dumps(dm_json, ensure_ascii=False), 'content': json.dumps(dm_json, ensure_ascii=False)})
    
    if supabase:
        try:
            supabase.table('characters').update({'state': state_dict, 'history': history}).eq('api_key', db_key).execute()
        except Exception as e:
            print(f"Error persisting state to DB in campaign runner: {e}")
        
    return dm_json
