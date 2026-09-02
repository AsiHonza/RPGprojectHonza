import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

delete_endpoint = """
class DeleteCharacterRequest(BaseModel):
    email: str
    name: str

@app.post("/delete-character")
async def delete_character(req: DeleteCharacterRequest):
    try:
        api_key = f"{req.email}#{req.name}"
        supabase.table("characters").delete().eq("api_key", api_key).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
"""

if "/delete-character" not in content:
    content = content.replace(
        'class SaveStateRequest(BaseModel):',
        delete_endpoint + '\nclass SaveStateRequest(BaseModel):'
    )

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("Delete endpoint added!")
