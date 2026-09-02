import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

if '"world_data": world_data' not in content:
    content = content.replace(
        '"journal": [f"Vytvořil jsi postavu {req.name} (Rasa: {req.race}, Třída: {req.dnd_class}). Tvé dobrodružství začíná."]',
        '"journal": [f"Vytvořil jsi postavu {req.name} (Rasa: {req.race}, Třída: {req.dnd_class}). Tvé dobrodružství začíná."],\n        "zname_postavy": [],\n        "world_data": world_data'
    )

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("World data saved in state.")
