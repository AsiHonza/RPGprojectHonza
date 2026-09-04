import random
import uuid
from typing import List, Dict

COMMON_LOOT = [
    {"name": "Zrezivělá dýka", "description": "Stará, ale stále ostrá dýka.", "type": "zbraň", "slot": "hlavní ruka", "rarity": "common", "icon": "Sword", "sell_price": 2, "attack_bonus": 1},
    {"name": "Dřevěný štít", "description": "Rozštípaný štít po padlém bojovníkovi.", "type": "zbroj", "slot": "druhá ruka", "rarity": "common", "icon": "Shield", "sell_price": 5, "defense_bonus": 1},
    {"name": "Slabý léčivý lektvar", "description": "Červená tekutina nevalné chuti.", "type": "lektvar", "slot": "batoh", "rarity": "common", "icon": "Potion", "sell_price": 10, "healing_amount": 20},
    {"name": "Krysí oháňka", "description": "Trofej ze zabité krysy.", "type": "surovina", "slot": "batoh", "rarity": "common", "icon": "Package", "sell_price": 1},
    {"name": "Kožený měšec", "description": "Prázdný měšec, ale kůže je dobrá.", "type": "surovina", "slot": "batoh", "rarity": "common", "icon": "Package", "sell_price": 2},
    {"name": "Obyčejná halena", "description": "Potrhaná košile.", "type": "zbroj", "slot": "hruď", "rarity": "common", "icon": "Shield", "sell_price": 2, "defense_bonus": 1}
]

UNCOMMON_LOOT = [
    {"name": "Ocelový meč", "description": "Dobře vyvážený meč standardní kvality.", "type": "zbraň", "slot": "hlavní ruka", "rarity": "uncommon", "icon": "Sword", "sell_price": 25, "attack_bonus": 2},
    {"name": "Kroužková košile", "description": "Spolehlivá ochrana proti sečným ranám.", "type": "zbroj", "slot": "hruď", "rarity": "uncommon", "icon": "Shield", "sell_price": 40, "defense_bonus": 2},
    {"name": "Silný léčivý lektvar", "description": "Hustý červený lektvar.", "type": "lektvar", "slot": "batoh", "rarity": "uncommon", "icon": "Potion", "sell_price": 25, "healing_amount": 50},
    {"name": "Vlčí tesák", "description": "Ostrý zub, často používaný jako talisman.", "type": "surovina", "slot": "batoh", "rarity": "uncommon", "icon": "Package", "sell_price": 15}
]

RARE_LOOT = [
    {"name": "Runová čepel", "description": "Meč, jehož čepel slabě modře světélkuje.", "type": "zbraň", "slot": "hlavní ruka", "rarity": "rare", "icon": "Sword", "sell_price": 150, "attack_bonus": 4},
    {"name": "Plátová zbroj strážce", "description": "Těžká zbroj zdobená znaky starého rodu.", "type": "zbroj", "slot": "hruď", "rarity": "rare", "icon": "Shield", "sell_price": 200, "defense_bonus": 4},
    {"name": "Lektvar vitality", "description": "Obnoví veškeré síly.", "type": "lektvar", "slot": "batoh", "rarity": "rare", "icon": "Potion", "sell_price": 100, "healing_amount": 150},
    {"name": "Dračí šupina", "description": "Tvrdá a horká na dotek.", "type": "surovina", "slot": "batoh", "rarity": "rare", "icon": "Package", "sell_price": 250}
]

def generate_loot(enemies: List[str], player_level: int) -> List[Dict]:
    loot = []
    
    num_items = random.randint(0, max(1, len(enemies)))
    
    for _ in range(num_items):
        roll = random.randint(1, 100)
        rare_chance = 1 + (player_level // 3)
        uncommon_chance = 10 + (player_level)
        
        if roll <= rare_chance:
            pool = RARE_LOOT
        elif roll <= rare_chance + uncommon_chance:
            pool = UNCOMMON_LOOT
        else:
            pool = COMMON_LOOT
            
        item_template = random.choice(pool)
        item = item_template.copy()
        item['id'] = str(uuid.uuid4())
        
        base_price = item['sell_price']
        item['sell_price'] = max(1, base_price + random.randint(-base_price//5, base_price//5))
        
        loot.append(item)
        
    if not loot and random.random() < 0.5:
        item = random.choice(COMMON_LOOT).copy()
        item['id'] = str(uuid.uuid4())
        loot.append(item)
        
    return loot
