import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

old_history_loop = """        # Píprava konverzace
        contents = []
        for msg in history[-10:]: # Posledních 10 zpráv
            contents.append(
                types.Content(
                    role=msg["role"],
                    parts=[types.Part.from_text(text=msg["text"])]
                )
            )"""

new_history_loop = """        # Příprava konverzace - OPTIMALIZACE TOKENŮ
        contents = []
        # Omezíme historii na posledních 6 zpráv (3 tahy) a odstraníme JSON balast z paměti modelu
        for msg in history[-6:]: 
            if msg["role"] == "user":
                contents.append(
                    types.Content(role="user", parts=[types.Part.from_text(text=msg["text"])])
                )
            else:
                try:
                    import json
                    dm_data = json.loads(msg["text"])
                    # Ponecháme pouze příběh a dialogy, smažeme technické změny, obrázky a systémové logy
                    story_text = dm_data.get("vypravec", "")
                    for npc in dm_data.get("npc_dialogy", []):
                        story_text += f"\\n{npc.get('jmeno')}: {npc.get('text')}"
                    
                    contents.append(
                        types.Content(role="model", parts=[types.Part.from_text(text=story_text)])
                    )
                except:
                    # Fallback pro staré zprávy
                    contents.append(
                        types.Content(role="model", parts=[types.Part.from_text(text=msg["text"])])
                    )"""

# I need to use regex because diacritics in powershell are a mess
import re

content = re.sub(r'# P.*?prava konverzace\s+contents = \[\]\s+for msg in history\[-10:\]:.*?parts=\[types\.Part\.from_text\(text=msg\["text"\]\)\]\s+\)\s+\)', new_history_loop, content, flags=re.DOTALL)


with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Optimization injected!")
