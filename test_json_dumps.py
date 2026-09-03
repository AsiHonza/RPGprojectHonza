import json
popis_okoli = "You are in a dark forest."
intro_text = "Hello!"
initial_history = [
    {"role": "model", "text": json.dumps({"aktualni_region": "Začátek cesty", "popis_okoli": popis_okoli, "vypravec": intro_text, "nabizene_akce": ["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]}, ensure_ascii=False)}
]
print(initial_history)
