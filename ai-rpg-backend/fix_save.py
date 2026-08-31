import codecs

with codecs.open('main.py', 'r', 'utf-8') as f:
    content = f.read()

# Fix 1: Add name to SaveStateRequest
old_save_req = '''class SaveStateRequest(BaseModel):
    api_key: str
    state: dict'''
new_save_req = '''class SaveStateRequest(BaseModel):
    api_key: str
    name: str
    state: dict'''
content = content.replace(old_save_req, new_save_req)

# Fix 2: Update play_action db save
old_play_save = '''        supabase.table("characters").update({
            "history": updated_history
        }).eq("api_key", req.api_key).execute()'''
new_play_save = '''        supabase.table("characters").update({
            "history": updated_history
        }).eq("api_key", f"{req.api_key}#{req.name}").execute()'''
content = content.replace(old_play_save, new_play_save)

# Fix 3: Update save_state db save
old_state_save = '''        supabase.table("characters").update({
            "state": req.state
        }).eq("api_key", req.api_key).execute()'''
new_state_save = '''        supabase.table("characters").update({
            "state": req.state
        }).eq("api_key", f"{req.api_key}#{req.name}").execute()'''
content = content.replace(old_state_save, new_state_save)

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write(content)
print('Fixed backend updates!')
