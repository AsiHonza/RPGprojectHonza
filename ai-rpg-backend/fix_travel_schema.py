import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. Update StateChanges to include travel tracking
state_changes_addition = """
    travel_mode_set: bool = None
    travel_days_left_set: int = None
    travel_destination_set: str = None
"""
if "travel_mode_set" not in content:
    content = content.replace(
        'ukoly: List[Ukol] = Field(default=[])',
        'ukoly: List[Ukol] = Field(default=[])\n    travel_mode_set: bool = None\n    travel_days_left_set: int = None\n    travel_destination_set: str = None'
    )

# 2. Update the system prompt to use these new fields
content = content.replace(
    "ODEČTI 1 z 'travel_days_left'",
    "POUŽIJ POLE 'travel_days_left_set' a nastav tam (aktuální hodnota mínus jedna). Pokud klesne na 0, nastav 'travel_mode_set' na false a 'travel_destination_set' na prázdný řetězec."
)
content = content.replace(
    "Nastav state.travel_mode = true, state.travel_destination = 'Cíl' a state.travel_days_left = (číslo 2 až 5 podle dálky)",
    "Vyplň pole 'travel_mode_set' jako true, 'travel_destination_set' jako 'Název cíle' a 'travel_days_left_set' jako (číslo 2 až 5 podle dálky)"
)

# 3. Apply the changes in the /action route
apply_travel_logic = """
        # Aplikace zmen travel modu
        if zmeny.travel_mode_set is not None:
            state_dict['travel_mode'] = zmeny.travel_mode_set
        if zmeny.travel_days_left_set is not None:
            state_dict['travel_days_left'] = zmeny.travel_days_left_set
        if zmeny.travel_destination_set is not None:
            state_dict['travel_destination'] = zmeny.travel_destination_set
"""
if "zmeny.travel_mode_set is not None" not in content:
    content = content.replace(
        "state_dict['hp'] = max(0, min(100, state_dict.get('hp', 100) + zmeny.zivoty_zmena))",
        "state_dict['hp'] = max(0, min(100, state_dict.get('hp', 100) + zmeny.zivoty_zmena))\n" + apply_travel_logic
    )

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Schema fixed.")
