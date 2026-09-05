# Deterministický Smart Loot Engine podle D&D taxonomie a třídních preferencí
import random
import uuid
from typing import List, Dict, Optional

CLASS_PROFICIENCIES = {
    "Barbar": {"weapons": ["obouruční sekera", "obouruční meč", "válečné kladivo"], "armor": ["střední", "lehká"]},
    "Bard": {"weapons": ["rapír", "krátký meč", "dýka", "krátký luk"], "armor": ["lehká"]},
    "Klerik": {"weapons": ["palcát", "válečné kladivo", "dřevcový palcát"], "armor": ["střední", "těžká", "štít"]},
    "Druid": {"weapons": ["hůl", "dýka", "srp", "scimitar"], "armor": ["lehká", "střední", "dřevěný štít"]},
    "Bojovník": {"weapons": ["dlouhý meč", "obouruční meč", "bitevní sekera", "těžká kuše"], "armor": ["těžká", "střední", "lehká", "štít"]},
    "Mnich": {"weapons": ["hůl", "krátký meč", "dýka"], "armor": ["žádná", "róba"]},
    "Paladin": {"weapons": ["dlouhý meč", "válečné kladivo", "obouruční meč"], "armor": ["těžká", "štít"]},
    "Hraničář": {"weapons": ["dlouhý luk", "krátký meč", "dýka"], "armor": ["střední", "lehká"]},
    "Tulák": {"weapons": ["dýka", "rapír", "krátký luk", "lehká kuše"], "armor": ["lehká"]},
    "Čaroděj": {"weapons": ["hůl", "dýka"], "armor": ["róba"]},
    "Černokněžník": {"weapons": ["dýka", "hůl", "temná čepel"], "armor": ["lehká", "róba"]},
    "Kouzelník": {"weapons": ["hůl", "dýka"], "armor": ["róba"]}
}

ALL_CLASSES = list(CLASS_PROFICIENCIES.keys())

BASE_WEAPONS = [
    {"name": "Lovecká dýka", "type": "zbraň", "slot": "hlavní ruka", "icon": "Sword", "weaponType": "dýka", "damageDice": "1d4", "sell_price": 4},
    {"name": "Krátký meč", "type": "zbraň", "slot": "hlavní ruka", "icon": "Sword", "weaponType": "meč", "damageDice": "1d6", "sell_price": 10},
    {"name": "Dlouhý ocelový meč", "type": "zbraň", "slot": "hlavní ruka", "icon": "Sword", "weaponType": "meč", "damageDice": "1d8", "sell_price": 15},
    {"name": "Obouruční obouručák", "type": "zbraň", "slot": "obouruční", "icon": "Sword", "weaponType": "obouruční", "damageDice": "2d6", "sell_price": 30},
    {"name": "Bitevní sekera", "type": "zbraň", "slot": "hlavní ruka", "icon": "Sword", "weaponType": "sekera", "damageDice": "1d8", "sell_price": 12},
    {"name": "Válečné kladivo", "type": "zbraň", "slot": "hlavní ruka", "icon": "Sword", "weaponType": "kladivo", "damageDice": "1d8", "sell_price": 15},
    {"name": "Jasanová kouzelnická hůl", "type": "zbraň", "slot": "hlavní ruka", "icon": "Wand", "weaponType": "hůl", "damageDice": "1d6", "sell_price": 8},
    {"name": "Tisový dlouhý luk", "type": "zbraň", "slot": "obouruční", "icon": "Sword", "weaponType": "luk", "damageDice": "1d8", "sell_price": 25},
    {"name": "Lehká lovecká kuše", "type": "zbraň", "slot": "obouruční", "icon": "Sword", "weaponType": "kuše", "damageDice": "1d8", "sell_price": 20},
    {"name": "Kord šermíře", "type": "zbraň", "slot": "hlavní ruka", "icon": "Sword", "weaponType": "rapír", "damageDice": "1d8", "sell_price": 25}
]

BASE_ARMORS = [
    {"name": "Lněná tkadlcova róba", "type": "zbroj", "slot": "hruď", "icon": "Shirt", "armorType": "róba", "defense_bonus": 0, "flatDamageReduction": 0, "sell_price": 5},
    {"name": "Zesílená kožená kazajka", "type": "zbroj", "slot": "hruď", "icon": "Shield", "armorType": "lehká", "defense_bonus": 1, "flatDamageReduction": 0, "sell_price": 12},
    {"name": "Okovaná kroužková košile", "type": "zbroj", "slot": "hruď", "icon": "Shield", "armorType": "střední", "defense_bonus": 2, "flatDamageReduction": 1, "sell_price": 35},
    {"name": "Rytířská plátová zbroj", "type": "zbroj", "slot": "hruď", "icon": "Shield", "armorType": "těžká", "defense_bonus": 3, "flatDamageReduction": 2, "sell_price": 80},
    {"name": "Okrouhlý dubový štít", "type": "zbroj", "slot": "druhá ruka", "icon": "Shield", "armorType": "štít", "defense_bonus": 2, "flatDamageReduction": 0, "sell_price": 10},
    {"name": "Rytířský pavéz", "type": "zbroj", "slot": "druhá ruka", "icon": "Shield", "armorType": "štít", "defense_bonus": 3, "flatDamageReduction": 1, "sell_price": 30}
]

BASE_ACCESSORIES = [
    {"name": "Stříbrný prsten bdělosti", "type": "doplněk", "slot": "prsten", "icon": "Ring", "sell_price": 20},
    {"name": "Amulet vlčí síly", "type": "doplněk", "slot": "krk", "icon": "Ring", "sell_price": 25},
    {"name": "Kožený opasek nosiče", "type": "doplněk", "slot": "žádný", "icon": "Package", "sell_price": 15},
    {"name": "Prsten elementární ochrany", "type": "doplněk", "slot": "prsten", "icon": "Ring", "sell_price": 35}
]

BASE_POTIONS = [
    {"name": "Slabý léčivý lektvar", "type": "lektvar", "slot": "batoh", "icon": "Potion", "healing_amount": 25, "sell_price": 10, "rarity": "common", "description": "Obnoví 25 životů."},
    {"name": "Silný léčivý lektvar", "type": "lektvar", "slot": "batoh", "icon": "Potion", "healing_amount": 50, "sell_price": 25, "rarity": "uncommon", "description": "Obnoví 50 životů."},
    {"name": "Elixír plného zdraví", "type": "lektvar", "slot": "batoh", "icon": "Potion", "healing_amount": 100, "sell_price": 60, "rarity": "rare", "description": "Obnoví 100 životů."}
]

# Třídní artefakty (Epic a Legendary)
CLASS_ARTIFACTS = {
    "Barbar": [
        {"name": "Krvavá sekera berserkra", "type": "zbraň", "slot": "obouruční", "rarity": "epic", "icon": "Sword", "attack_bonus": 3, "damageDice": "2d6", "sell_price": 200, "statusAffliction": {"type": "bleeding", "chance": 0.5, "duration": 3, "damagePerTurn": 4}, "specialEffect": "Při Zuřivosti působí dvojnásobné krvácení.", "allowedClasses": ["Barbar"]},
        {"name": "Srdce divočiny", "type": "doplněk", "slot": "krk", "rarity": "legendary", "icon": "Ring", "defense_bonus": 2, "flatDamageReduction": 2, "sell_price": 450, "resistances": {"bleed": 0.5, "fire": 0.25}, "specialEffect": "Zranění pod 25% HP obnoví 15 HP za kolo.", "allowedClasses": ["Barbar"]}
    ],
    "Kouzelník": [
        {"name": "Hůl arcimága Aethelgarda", "type": "zbraň", "slot": "hlavní ruka", "rarity": "legendary", "icon": "Wand", "attack_bonus": 4, "damageDice": "1d8", "sell_price": 500, "statusAffliction": {"type": "burning", "chance": 0.6, "duration": 3, "damagePerTurn": 5}, "specialEffect": "Ohnivá koule zasahuje s +50% poloměrem a nespálí spojence.", "allowedClasses": ["Kouzelník"]},
        {"name": "Róba éterického poutníka", "type": "zbroj", "slot": "hruď", "rarity": "epic", "icon": "Shirt", "defense_bonus": 2, "sell_price": 280, "resistances": {"fire": 0.3, "cold": 0.3}, "specialEffect": "Kouzla mají o 1 AP nižší cenu jednou za kolo.", "allowedClasses": ["Kouzelník"]}
    ],
    "Tulák": [
        {"name": "Čepel stínů a zrady", "type": "zbraň", "slot": "hlavní ruka", "rarity": "epic", "icon": "Sword", "attack_bonus": 3, "damageDice": "1d6", "sell_price": 220, "statusAffliction": {"type": "poison", "chance": 0.7, "duration": 4, "damagePerTurn": 4}, "specialEffect": "Zákeřný útok ignoruje třídu zbroje cíle.", "allowedClasses": ["Tulák"]},
        {"name": "Plášť neviditelného kroku", "type": "zbroj", "slot": "hruď", "rarity": "legendary", "icon": "Shield", "defense_bonus": 3, "sell_price": 420, "specialEffect": "Útok ze skrytí je vždy automatický kritický zásah.", "allowedClasses": ["Tulák"]}
    ],
    "Bojovník": [
        {"name": "Drtič hradeb", "type": "zbraň", "slot": "obouruční", "rarity": "legendary", "icon": "Sword", "attack_bonus": 4, "damageDice": "2d6", "sell_price": 480, "statusAffliction": {"type": "stun", "chance": 0.35, "duration": 1, "damagePerTurn": 0}, "specialEffect": "Rozdrtí nepřátelský štít a sníží jeho AC o 3.", "allowedClasses": ["Bojovník"]},
        {"name": "Pavéz královské gardy", "type": "zbroj", "slot": "druhá ruka", "rarity": "epic", "icon": "Shield", "defense_bonus": 4, "flatDamageReduction": 2, "sell_price": 240, "specialEffect": "Odráží 30% fyzického zranění zpět na útočníka.", "allowedClasses": ["Bojovník"]}
    ],
    "Klerik": [
        {"name": "Palcát ranního úsvitu", "type": "zbraň", "slot": "hlavní ruka", "rarity": "epic", "icon": "Sword", "attack_bonus": 3, "damageDice": "1d8", "sell_price": 230, "statusAffliction": {"type": "burning", "chance": 0.4, "duration": 2, "damagePerTurn": 4}, "specialEffect": "Léčivá kouzla poskytují zasaženému 10 bodů dočasného štítu.", "allowedClasses": ["Klerik"]}
    ],
    "Paladin": [
        {"name": "Meč spravedlivého hněvu", "type": "zbraň", "slot": "hlavní ruka", "rarity": "legendary", "icon": "Sword", "attack_bonus": 4, "damageDice": "1d8", "sell_price": 460, "statusAffliction": {"type": "burning", "chance": 0.5, "duration": 3, "damagePerTurn": 5}, "specialEffect": "Božský úder zasáhne i všechny okolní nepřátele.", "allowedClasses": ["Paladin"]}
    ],
    "Hraničář": [
        {"name": "Mrazivý vítr severu", "type": "zbraň", "slot": "obouruční", "rarity": "legendary", "icon": "Sword", "attack_bonus": 4, "damageDice": "1d8", "sell_price": 450, "statusAffliction": {"type": "chill", "chance": 0.6, "duration": 2, "damagePerTurn": 3}, "specialEffect": "Střely z dálky zpomalují cíl a snižují jeho AP o 1.", "allowedClasses": ["Hraničář"]}
    ]
}

def roll_rarity(level: int) -> str:
    roll = random.randint(1, 100)
    if level <= 2:
        return "uncommon" if roll <= 20 else "common"
    elif level <= 4:
        if roll <= 5: return "rare"
        if roll <= 35: return "uncommon"
        return "common"
    elif level <= 7:
        if roll <= 2: return "legendary"
        if roll <= 12: return "epic"
        if roll <= 35: return "rare"
        return "uncommon"
    else:
        if roll <= 8: return "legendary"
        if roll <= 25: return "epic"
        if roll <= 60: return "rare"
        return "uncommon"

def generate_smart_item(level: int, player_class: str) -> Dict:
    rarity = roll_rarity(level)
    
    # 80% suitable for class, 20% other class for selling
    is_for_class = random.random() < 0.8
    target_class = player_class if is_for_class else random.choice(ALL_CLASSES)
    
    # Check if we should drop an iconic artifact
    if rarity in ["epic", "legendary"] and target_class in CLASS_ARTIFACTS and random.random() < 0.6:
        artifacts = CLASS_ARTIFACTS[target_class]
        matching = [a for a in artifacts if a.get("rarity") == rarity]
        if matching:
            art = random.choice(matching).copy()
            art["id"] = str(uuid.uuid4())
            return art

    # Otherwise generate base item
    category_roll = random.random()
    if category_roll < 0.45:
        base = random.choice(BASE_WEAPONS).copy()
    elif category_roll < 0.8:
        base = random.choice(BASE_ARMORS).copy()
    else:
        base = random.choice(BASE_ACCESSORIES).copy()

    base["id"] = str(uuid.uuid4())
    base["rarity"] = rarity

    # Apply rarity multipliers
    stat_mod = 0
    if rarity == "uncommon": stat_mod = 1
    elif rarity == "rare": stat_mod = 2
    elif rarity == "epic": stat_mod = 3
    elif rarity == "legendary": stat_mod = 4

    if base.get("type") == "zbraň":
        base["attack_bonus"] = stat_mod
        base["sell_price"] = int(base.get("sell_price", 10) * (1 + stat_mod * 1.5))
        # Status effect chance on higher rarity
        if rarity in ["rare", "epic", "legendary"] and random.random() < 0.6:
            eff_type = random.choice(["burning", "bleeding", "poison", "chill"])
            base["statusAffliction"] = {
                "type": eff_type,
                "chance": min(0.8, 0.2 + stat_mod * 0.15),
                "duration": 2 if stat_mod <= 2 else 3,
                "damagePerTurn": stat_mod + 1
            }
            prefix = {"burning": "Planoucí", "bleeding": "Krvavý", "poison": "Otrávený", "chill": "Mrazivý"}.get(eff_type, "")
            base["name"] = f"{prefix} {base['name']}"
    elif base.get("type") == "zbroj":
        base["defense_bonus"] = base.get("defense_bonus", 1) + (1 if stat_mod >= 2 else 0)
        base["flatDamageReduction"] = base.get("flatDamageReduction", 0) + (1 if stat_mod >= 3 else 0)
        base["sell_price"] = int(base.get("sell_price", 15) * (1 + stat_mod * 1.5))
        if rarity in ["rare", "epic", "legendary"]:
            res_elem = random.choice(["fire", "cold", "poison", "bleed"])
            base["resistances"] = {res_elem: round(min(0.75, 0.15 * stat_mod), 2)}
            base["name"] = f"Zesílená {base['name']}"
    else:
        base["sell_price"] = int(base.get("sell_price", 20) * (1 + stat_mod * 2))

    return base

def generate_loot(enemies: List[str], player_level: int, player_class: Optional[str] = None) -> List[Dict]:
    loot = []
    p_class = player_class or "Bojovník"
    
    # 1. Guaranteed or high chance potion/consumable
    if random.random() < 0.75:
        potion = random.choice(BASE_POTIONS).copy()
        potion["id"] = str(uuid.uuid4())
        loot.append(potion)
        
    # 2. Smart equipment drop
    num_equipment = 1 if len(enemies) <= 2 else random.randint(1, 2)
    for _ in range(num_equipment):
        item = generate_smart_item(player_level, p_class)
        loot.append(item)

    return loot
