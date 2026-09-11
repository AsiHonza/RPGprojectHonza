import random
import uuid
from typing import Optional
from app.models.schemas import Item

def generate_loot(item_name: str, item_type: str, player_level: int, set_id: Optional[str] = None) -> Item:
    """
    Vygeneruje plnohodnotný Item objekt na základě hrubého popisu od AI.
    Řeší raritu, bonusy, cenu a ikony na základě player_level (zcela deterministicky).
    """
    # Base configuration
    rarity = "common"
    attack_bonus = 0
    defense_bonus = 0
    healing_amount = 0
    sell_price = 5
    
    # Ikony a sloty podle typu
    icon_map = {
        "zbraň": "Sword",
        "zbroj": "Shirt",
        "doplněk": "Ring",
        "lektvar": "Potion",
        "cennost": "Package"
    }
    icon = icon_map.get(item_type, "Package")
    
    slot_map = {
        "zbraň": "hlavní ruka",
        "zbroj": "hruď",
        "doplněk": "krk",
        "lektvar": "žádný",
        "cennost": "žádný"
    }
    slot = slot_map.get(item_type, "žádný")
    
    # Skálování podle úrovně
    if item_type in ["zbraň", "zbroj", "doplněk"]:
        # 1-3: common (občas uncommon)
        # 4-6: uncommon (občas rare)
        # 7+: rare/epic
        roll = random.randint(1, 100)
        if player_level <= 3:
            if roll > 90:
                rarity = "uncommon"
                bonus = 1
            else:
                rarity = "common"
                bonus = random.choice([0, 1])
        elif player_level <= 6:
            if roll > 85:
                rarity = "rare"
                bonus = 2
            elif roll > 30:
                rarity = "uncommon"
                bonus = 1
            else:
                rarity = "common"
                bonus = 1
        else:
            if roll > 90:
                rarity = "epic"
                bonus = 3
            elif roll > 50:
                rarity = "rare"
                bonus = 2
            else:
                rarity = "uncommon"
                bonus = 1
                
        if item_type == "zbraň":
            attack_bonus = bonus
            stats = f"Útok +{bonus}" if bonus > 0 else "Žádný bonus"
            sell_price = random.randint(10, 20) + (bonus * 15)
        elif item_type == "zbroj":
            defense_bonus = bonus
            stats = f"Obrana +{bonus}" if bonus > 0 else "Žádný bonus"
            sell_price = random.randint(15, 25) + (bonus * 20)
        else: # doplněk
            if random.choice([True, False]):
                attack_bonus = bonus
                stats = f"Útok +{bonus}" if bonus > 0 else ""
            else:
                defense_bonus = bonus
                stats = f"Obrana +{bonus}" if bonus > 0 else ""
            sell_price = random.randint(20, 40) + (bonus * 30)
            if not stats: stats = "Ozdobný"

    elif item_type == "lektvar":
        healing_amount = 25 + ((player_level // 2) * 10)
        stats = f"Léčení +{healing_amount} HP"
        sell_price = random.randint(10, 25)
    
    elif item_type == "cennost":
        stats = "Na prodej"
        sell_price = random.randint(5, 50 * max(1, player_level // 2))

    return Item(
        id=str(uuid.uuid4()),
        name=item_name,
        type=item_type,
        slot=slot,
        rarity=rarity,
        icon=icon,
        sell_price=sell_price,
        attack_bonus=attack_bonus,
        defense_bonus=defense_bonus,
        healing_amount=healing_amount,
        stats=stats,
        set_id=set_id
    )

def calculate_combat_rewards(enemy_count: int, player_level: int):
    """
    Deterministicky počítá XP a zlato za boj (dle úrovně).
    """
    base_xp = player_level * 15
    xp_reward = base_xp * max(1, enemy_count)
    
    base_gold_min = player_level * 2
    base_gold_max = player_level * 5
    gold_reward = sum([random.randint(base_gold_min, base_gold_max) for _ in range(max(1, enemy_count))])
    
    return xp_reward, gold_reward
