import re
import unicodedata
import hashlib
from typing import List, Dict, Any, Tuple, Optional

STOP_WORDS = {
    "tento", "tato", "toto", "tyto", "jeho", "jeji", "jejich", "tvoje", "svuj", "svou",
    "pomoz", "ziskej", "najdi", "dones", "doruc", "vrat", "zpatky", "zpet", "jsem",
    "jsi", "byl", "byla", "bylo", "bude", "budou", "koupit", "prodat", "jit", "dojit",
    "pro", "od", "do", "ve", "na", "se", "si", "po", "ze", "za", "pred", "nad", "pod",
    "nebo", "ale", "kdyz", "protoze", "aby", "jako", "ktery", "ktera", "ktere", "ukol"
}

def normalize_token(word: str) -> str:
    """Odstraní diakritiku, převede na malá písmena a ponechá jen alfanumerické znaky."""
    if not word:
        return ""
    norm = unicodedata.normalize('NFKD', str(word)).encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'[^a-z0-9]', '', norm).strip()

def extract_quest_tokens(text: str) -> set:
    """Extrahuje významová klíčová slova z textu úkolu bez stop-slov."""
    if not text:
        return set()
    raw_words = re.findall(r'\b[a-zA-Zá-žÁ-Ž0-9]{3,}\b', str(text))
    tokens = set()
    for w in raw_words:
        token = normalize_token(w)
        if len(token) >= 3 and token not in STOP_WORDS:
            tokens.add(token)
    return tokens

def generate_deterministic_quest_id(nazev: str, zadavatel: Optional[str] = None) -> str:
    """Vytvoří stabilní ID z názvu a zadavatele."""
    norm_nazev = normalize_token(nazev)
    norm_zad = normalize_token(zadavatel or "")
    
    tokens = sorted(list(extract_quest_tokens(nazev)))
    if tokens:
        slug = "_".join(tokens[:3])
        if norm_zad and norm_zad not in slug:
            slug = f"{norm_zad[:8]}_{slug}"
        return f"quest_{slug}"
    
    hash_id = hashlib.md5(f"{norm_nazev}_{norm_zad}".encode('utf-8')).hexdigest()[:8]
    return f"quest_{hash_id}"

def is_same_quest_fuzzy(q1: dict, q2: dict) -> bool:
    """Deterministicky zjistí, zda dva úkoly reprezentují tutéž záležitost."""
    if not q1 or not q2:
        return False
        
    id1 = q1.get('id')
    id2 = q2.get('id')
    if id1 and id2 and id1 == id2:
        return True

    nazev1 = q1.get('nazev') or q1.get('title') or ""
    nazev2 = q2.get('nazev') or q2.get('title') or ""
    
    # 1. Přesná shoda normalizovaného názvu
    norm1 = normalize_token(nazev1)
    norm2 = normalize_token(nazev2)
    if norm1 and norm2 and norm1 == norm2:
        return True

    # 2. Shoda zadavatele
    zad1 = normalize_token(q1.get('zadavatel') or "")
    zad2 = normalize_token(q2.get('zadavatel') or "")
    same_zad = bool(zad1 and zad2 and (zad1 in zad2 or zad2 in zad1))

    # 3. Token Jaccard overlap na názvu a popisu
    tokens1 = extract_quest_tokens(nazev1) | extract_quest_tokens(q1.get('popis', ''))
    tokens2 = extract_quest_tokens(nazev2) | extract_quest_tokens(q2.get('popis', ''))
    
    if not tokens1 or not tokens2:
        return False

    intersection = tokens1 & tokens2
    union = tokens1 | tokens2
    jaccard = len(intersection) / len(union) if union else 0.0

    # Pokud je shoda v zadavateli a sdílí aspoň 1 klíčové slovo (např. 'amulet')
    if same_zad and len(intersection) >= 1:
        return True

    # Pokud sdílí 2 a více silných klíčových slov (např. 'amulet' + 'jeremias')
    if len(intersection) >= 2 and jaccard >= 0.25:
        return True

    # Vysoká podobnost slovní zásoby
    if jaccard >= 0.45:
        return True

    return False

def merge_quest_update(existing: dict, incoming: dict) -> dict:
    """Sloučí novou zprávu o úkolu do existujícího úkolu bez ztráty historie a bez duplikací."""
    merged = dict(existing)
    
    # Zachováme původní stabilní ID a kanonický název
    merged['id'] = existing.get('id') or incoming.get('id')
    merged['nazev'] = existing.get('nazev') or incoming.get('nazev')
    merged['kategorie'] = incoming.get('kategorie') or existing.get('kategorie', 'vedlejsi')
    merged['zadavatel'] = incoming.get('zadavatel') or existing.get('zadavatel')
    merged['lokace'] = incoming.get('lokace') or existing.get('lokace')
    merged['odmena_text'] = incoming.get('odmena_text') or existing.get('odmena_text')
    
    # Aktualizace stavu
    incoming_stav = str(incoming.get('stav', '')).lower()
    existing_stav = str(existing.get('stav', '')).lower()
    if 'spln' in incoming_stav or 'spln' in existing_stav:
        merged['stav'] = 'splněno'
    elif 'selh' in incoming_stav or 'selh' in existing_stav:
        merged['stav'] = 'selhání'
    else:
        merged['stav'] = 'aktivni'

    # Popis obohatíme pouze pokud nový popis dává více detailů a neopakuje se
    new_desc = incoming.get('popis', '').strip()
    if new_desc and new_desc != existing.get('popis'):
        if len(new_desc) > len(existing.get('popis', '')):
            merged['popis'] = new_desc

    # Sloučení kroků (Objectives)
    existing_kroky = existing.get('kroky', []) or []
    incoming_kroky = incoming.get('kroky', []) or []
    
    if not existing_kroky and incoming_kroky:
        merged['kroky'] = incoming_kroky
    elif incoming_kroky:
        merged_kroky = list(existing_kroky)
        for inc_step in incoming_kroky:
            inc_text = inc_step.get('text', '').strip() if isinstance(inc_step, dict) else str(inc_step)
            inc_done = inc_step.get('splneno', False) if isinstance(inc_step, dict) else False
            
            # Najdeme odpovídající krok
            found = False
            for ex_step in merged_kroky:
                ex_text = ex_step.get('text', '') if isinstance(ex_step, dict) else str(ex_step)
                if normalize_token(inc_text) == normalize_token(ex_text) or len(extract_quest_tokens(inc_text) & extract_quest_tokens(ex_text)) >= 2:
                    if isinstance(ex_step, dict):
                        ex_step['splneno'] = ex_step.get('splneno', False) or inc_done
                    found = True
                    break
            if not found and inc_text:
                merged_kroky.append({'text': inc_text, 'splneno': inc_done})
        merged['kroky'] = merged_kroky

    return merged

def process_quests_lifecycle(
    incoming_quests: List[dict],
    current_quests: List[dict],
    player_action: str,
    inventory: List[dict]
) -> Tuple[List[dict], List[str]]:
    """
    Centrální Gatekeeper a Reconciler pro zpracování úkolů.
    Zajistí, že nevzniknou duplikáty, spamové úkoly a automaticky odškrtává kroky.
    """
    logs: List[str] = []
    quests_by_id: Dict[str, dict] = {}

    # 1. Indexujeme současné úkoly hráče
    for q in current_quests:
        if not isinstance(q, dict):
            continue
        q_id = q.get('id') or generate_deterministic_quest_id(q.get('nazev', ''))
        q['id'] = q_id
        quests_by_id[q_id] = dict(q)

    # 2. Gatekeeper pro příchozí úkoly od LLM
    active_count = sum(1 for q in quests_by_id.values() if q.get('stav') == 'aktivni')
    action_norm = normalize_token(player_action)

    accept_intent_tokens = {"pomohu", "pomoc", "udelam", "postaram", "souhlasim", "prijimam", "platim", "hledej", "najdu", "ukol"}
    has_accept_intent = any(t in action_norm for t in accept_intent_tokens) or "[ukol]" in player_action.lower() or "[quest]" in player_action.lower()

    for inc in incoming_quests:
        if not isinstance(inc, dict):
            continue
        inc_nazev = str(inc.get('nazev', '')).strip()
        if not inc_nazev:
            continue

        # Zjistíme, zda už tento úkol máme (Fuzzy Match)
        matched_id = None
        for existing_id, existing_q in quests_by_id.items():
            if is_same_quest_fuzzy(existing_q, inc):
                matched_id = existing_id
                break

        if matched_id:
            # Je to existující úkol -> SLOUČIT a AKTUALIZOVAT
            merged = merge_quest_update(quests_by_id[matched_id], inc)
            old_stav = quests_by_id[matched_id].get('stav')
            quests_by_id[matched_id] = merged
            
            if old_stav != 'splněno' and merged.get('stav') == 'splněno':
                logs.append(f"🏆 Úkol dokončen: {merged.get('nazev')}")
            else:
                logs.append(f"📜 Úkol aktualizován: {merged.get('nazev')}")
        else:
            # Je to nový úkol
            # Gatekeeper:
            # a) Nesmí přesáhnout limit 5 aktivních úkolů
            if active_count >= 5:
                continue

            new_id = inc.get('id') or generate_deterministic_quest_id(inc_nazev, inc.get('zadavatel'))
            inc['id'] = new_id
            inc['stav'] = inc.get('stav', 'aktivni')
            inc['kategorie'] = inc.get('kategorie', 'vedlejsi')
            if not inc.get('kroky'):
                inc['kroky'] = [{'text': inc.get('popis') or inc_nazev, 'splneno': False}]
            
            quests_by_id[new_id] = inc
            active_count += 1
            logs.append(f"✨ Nový úkol: {inc_nazev}")

    # 3. Deterministický Reconciler podle inventáře hráče
    inv_item_tokens = set()
    for item in inventory:
        if isinstance(item, dict):
            inv_item_tokens |= extract_quest_tokens(item.get('name', ''))

    for q_id, q in quests_by_id.items():
        if q.get('stav') != 'aktivni':
            continue
            
        q_tokens = extract_quest_tokens(q.get('nazev', '')) | extract_quest_tokens(q.get('popis', ''))
        matched_tokens = inv_item_tokens & q_tokens
        if matched_tokens:
            kroky = q.get('kroky', [])
            for k in kroky:
                if isinstance(k, dict) and not k.get('splneno'):
                    k_tokens = extract_quest_tokens(k.get('text', ''))
                    if (matched_tokens & k_tokens) or matched_tokens:
                        k['splneno'] = True
                        logs.append(f"⚔️ Cíl úkolu splněn: Získán předmět pro úkol '{q.get('nazev')}'")
                        break

    result_list = list(quests_by_id.values())
    return result_list, logs

def build_quests_prompt_context(quests: List[dict]) -> str:
    """Sestaví kontext otevřených úkolů pro systémový prompt LLM."""
    active_quests = [q for q in quests if isinstance(q, dict) and q.get('stav') == 'aktivni']
    if not active_quests:
        return "[AKTUÁLNÍ ÚKOLY V DENÍKU HRÁČE]:\nHráč nemá žádné otevřené úkoly."

    lines = ["[AKTUÁLNÍ ÚKOLY V DENÍKU HRÁČE (PŘÍSNÝ ZÁKAZ DUPLIKACÍ!)]:\nTyto úkoly již hráč má. Pokud hráč pokračuje v řešení, odevzdává předmět nebo mluví se zadavatelem:"]
    for q in active_quests:
        q_id = q.get('id', 'quest_unknown')
        nazev = q.get('nazev', 'Neznámý úkol')
        zadavatel = f" (Zadavatel: {q.get('zadavatel')})" if q.get('zadavatel') else ""
        
        kroky = q.get('kroky', [])
        curr_step = "Pokračovat v pátrání"
        for k in kroky:
            if isinstance(k, dict) and not k.get('splneno'):
                curr_step = k.get('text', '')
                break
                
        lines.append(f"- ID: '{q_id}' | Název: '{nazev}'{zadavatel} | Cíl: {curr_step}")

    lines.append("\nPŘÍKAZ PRO MODEL:\n1. NIKDY nevytvářej nový úkol pro stejný problém! Použij existující ID výše.")
    lines.append("2. Pokud hráč splnil úkol (např. donesl předmět), vrať toto ID a nastav stav='splněno'. NIKDY nezakládej novou kartu v minulém čase!")
    lines.append("3. Běžné rozhovory NEMAJÍ úkol. Pokud hráč nepřijal novou významnou misi, vrať v `zmeny_stavu.ukoly` prázdný seznam `[]`.")
    return "\n".join(lines)
