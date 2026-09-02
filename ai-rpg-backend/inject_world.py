import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

create_logic = """
    # Pokud hrac zvolil kampan, vygenerujeme svet
    world_data = None
    if req.game_mode == "campaign":
        try:
            import json
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            world_prompt = f"Vytvoř epický fantasy svět pro kampaň. Postava: {req.name}, Rasa: {req.race}, Třída: {req.dnd_class}. Vymysli epickou hlavní zápletku, unikátní mapu (seznam lokací s X a Y souřadnicemi 0-100) a klíčová NPC."
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=world_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=CampaignWorld,
                    temperature=0.9
                )
            )
            world_data = json.loads(response.text)
        except Exception as e:
            print("World gen error:", e)
            world_data = None

"""

# Insert right before state = {
if "world_data = None" not in content:
    content = content.replace("    state = {", create_logic + "    state = {")

# Insert world_data into state dict
if '"world_data": world_data' not in content:
    content = content.replace(
        '"zname_postavy": []',
        '"zname_postavy": [],\n        "world_data": world_data'
    )

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Injected.")
