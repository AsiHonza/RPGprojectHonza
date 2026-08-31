import codecs

backstory_code = """
class BackstoryRequest(BaseModel):
    api_key: str
    name: str
    race: str
    dnd_class: str
    keywords: str

class GenerateBackstoryResponse(BaseModel):
    appearance: str
    personality: str
    backstory: str

@app.post("/generate-backstory")
async def generate_backstory(req: BackstoryRequest):
    try:
        client = genai.Client(api_key=req.api_key)
        prompt = f"Vytvoř D&D pozadí pro postavu. Jméno: {req.name}, Rasa: {req.race}, Povolání: {req.dnd_class}. Klíčová slova od hráče: {req.keywords}."
        
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="Jsi expert na D&D lore. Vygeneruj přesně 3 věci: appearance (vzhled), personality (chování) a backstory (historie).",
                response_mime_type="application/json",
                response_schema=GenerateBackstoryResponse,
                temperature=0.8
            )
        )
        import json
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Chyba: {str(e)}")
"""

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace("class ListCharactersRequest", backstory_code + "\nclass ListCharactersRequest")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Backstory fixed!")
