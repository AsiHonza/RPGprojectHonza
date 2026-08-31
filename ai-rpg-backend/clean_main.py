import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

target = """class SaveStateRequest(BaseModel):
    email: str
    name: str
    state: dict

@app.post("/save-state")
async def save_state(req: SaveStateRequest):
    try:
        db_key = f"{req.email}#{req.name}"
        supabase.table("characters").update({
            "state": req.state
        }).eq("api_key", db_key).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Chyba při ukládání: {str(e)}")"""

if target in content:
    content = content.replace(target, "")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Duplicate save_state removed!")
