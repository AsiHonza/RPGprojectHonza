import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

target = """    try:
        api_key = f"{req.email}#{req.name}" if req.email else req.api_key
        db_key = api_key
        db_res = supabase.table("characters").select("history, name, race, dnd_class, state").eq("api_key", api_key).execute()"""

replacement = """    try:
        db_key = f"{req.email}#{req.name}"
        db_res = supabase.table("characters").select("history, name, race, dnd_class, state").eq("api_key", db_key).execute()"""

if target in content:
    content = content.replace(target, replacement)
    with codecs.open("main.py", "w", "utf-8") as f:
        f.write(content)
    print("Fixed play_action db_key mismatch!")
else:
    print("Target not found!")
