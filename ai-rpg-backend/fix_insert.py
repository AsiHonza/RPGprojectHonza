import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

target = """    supabase.table("characters").insert({
        "api_key": api_key,
        "name": req.name,
        "dnd_class": req.dnd_class,
        "race": req.race,
        "level": 1,
        "stats": req.stats,
        "state": state,
        "history": initial_history
    }).execute()"""

replacement = """    supabase.table("characters").insert({
        "api_key": api_key,
        "name": req.name,
        "dnd_class": req.dnd_class,
        "race": req.race,
        "state": state,
        "history": initial_history
    }).execute()"""

if target in content:
    content = content.replace(target, replacement)
    with codecs.open("main.py", "w", "utf-8") as f:
        f.write(content)
    print("Fixed insert columns!")
else:
    print("Target not found!")
