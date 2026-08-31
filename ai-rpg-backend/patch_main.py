import codecs

with codecs.open('main.py', 'r', 'utf-8') as f:
    content = f.read()

list_characters_code = '''
class ListCharactersRequest(BaseModel):
    api_key: str

@app.post("/list-characters")
async def list_characters(req: ListCharactersRequest):
    try:
        db_res = supabase.table("characters").select("api_key, name, race, dnd_class, level, stats").ilike("api_key", f"{req.api_key}#%").execute()
        return {"status": "success", "characters": db_res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class LoadGameRequest'''

content = content.replace('class LoadGameRequest', list_characters_code)

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write(content)
print("Patch applied.")
