import re

path = "app/routers/game.py"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

race_dict = """
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
"""

code = code.replace(
    "req_level = req.level or 1",
    race_dict + "\n        req_level = req.level or 1"
)

summary_replace = """- Závod / Rasa: {player_race} (Rasová schopnost: {race_trait}. Respektuj tuto vlastnost v narativu a reakcích NPC!)"""

code = code.replace(
    "- Úroveň: {req_level} | Životy:",
    summary_replace + "\n- Úroveň: {req_level} | Životy:"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)

print("Patched game.py!")
