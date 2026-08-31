import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

pattern = re.compile(r'class SaveStateRequest\(BaseModel\):.*?return \{"status": "success"\}', re.DOTALL)

new_code = '''class SaveStateRequest(BaseModel):
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
        return {"status": "success"}'''

content = pattern.sub(new_code, content)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Saved state fixed.")
