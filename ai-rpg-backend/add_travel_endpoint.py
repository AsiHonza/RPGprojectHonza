import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

# We will append the new models and endpoint to the end of the file.
new_code = """
class TravelRequest(BaseModel):
    email: str
    name: str
    target_q: int
    target_r: int

def hex_distance(q1, r1, q2, r2):
    return (abs(q1 - q2) + abs(q1 + r1 - q2 - r2) + abs(r1 - r2)) // 2

@app.post("/travel")
async def travel_action(req: TravelRequest):
    db_key = f"{req.email}#{req.name}"
    db_res = supabase.table("characters").select("state, history").eq("api_key", db_key).execute()
    if not db_res.data:
        raise HTTPException(status_code=404, detail="Character not found.")
        
    char_data = db_res.data[0]
    state = char_data.get("state", {})
    history = char_data.get("history", [])
    
    current_loc = state.get("playerLocation")
    if not current_loc:
        raise HTTPException(status_code=400, detail="Neznámá pozice hráče.")
        
    dist = hex_distance(current_loc["q"], current_loc["r"], req.target_q, req.target_r)
    if dist > 1:
        raise HTTPException(status_code=400, detail="Můžeš cestovat jen o 1 hex!")
        
    world_data = state.get("world_data", {})
    locations = world_data.get("locations", [])
    hex_grid = world_data.get("hex_grid", [])
    
    target_hex = next((h for h in hex_grid if h["q"] == req.target_q and h["r"] == req.target_r), None)
    if not target_hex:
        raise HTTPException(status_code=400, detail="Mimo mapu.")
        
    if target_hex["terrain"] in ["Ocean", "Mountains"]:
        raise HTTPException(status_code=400, detail="Tento terén je neprostupný.")
        
    # Deduct resources
    if state.get("rations", 0) < 1:
        # Penalize HP if out of food
        state["hp"] = max(1, state.get("hp", 100) - 10)
    else:
        state["rations"] = state.get("rations", 0) - 1
        
    state["day"] = state.get("day", 1) + 1
    state["playerLocation"] = {"q": req.target_q, "r": req.target_r}
    
    # Check for POI
    poi = next((l for l in locations if l["q"] == req.target_q and l["r"] == req.target_r), None)
    
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    import random
    encounter = random.random() < 0.25 # 25% chance of random encounter
    
    narrative_text = ""
    
    if poi:
        prompt = f'''Hráč (rasa: {state.get("race")}, třída: {state.get("dnd_class")}) dorazil do nové lokace:
Názav: {poi.get("nazev")}
Popis: {poi.get("popis")}
Napiš atmosférický první odstavec (pohled vypravěče), jak hráč přichází na toto místo. Max 4 věty. Nenuť ho do akce, jen popiš příchod a atmosféru.'''
        resp = client.models.generate_content(model='gemini-3.5-flash', contents=prompt)
        narrative_text = resp.text.strip()
    elif encounter:
        prompt = f'''Hráč (rasa: {state.get("race")}, třída: {state.get("dnd_class")}) cestuje divočinou. Terén: {target_hex["terrain"]}.
Vygeneruj NÁHODNÉ SETKÁNÍ. Může to být útok (goblini, bandité, vlci) nebo neutrální/zajímavá událost (potulný kupec, prastará socha).
Napiš to z pohledu Vypravěče a nech situaci otevřenou, ať hráč může reagovat. Max 4 věty.'''
        resp = client.models.generate_content(model='gemini-3.5-flash', contents=prompt)
        narrative_text = f"[NÁHODNÉ SETKÁNÍ na cestě]\n{resp.text.strip()}"
    else:
        narrative_text = f"Cesta přes {target_hex['terrain']} proběhla klidně. Utábořil ses a odpočinul si."

    # Add to history
    history.append({"role": "user", "content": f"[CESTOVÁNÍ] Přesun na hex ({req.target_q}, {req.target_r})"})
    history.append({"role": "model", "content": narrative_text})
    
    supabase.table("characters").update({
        "state": state,
        "history": history
    }).eq("api_key", db_key).execute()
    
    return {"status": "success", "state": state, "narrative": narrative_text}
"""

with codecs.open('main.py', 'a', 'utf-8') as f:
    f.write(new_code)
