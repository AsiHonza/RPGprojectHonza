from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
import os
from dotenv import load_dotenv
load_dotenv()
import json
import uuid

app = FastAPI(title="AI RPG Game Master API")
app.mount("/images", StaticFiles(directory="images"), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from supabase import create_client, Client
from google import genai
from google.genai import types
import asyncio

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

class Item(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    type: str
    slot: str
    stats_bonus: dict = {}

class Ukol(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nazev: str
    popis: str
    stav: str

class PointOfInterest(BaseModel):
    nazev: str
    ikona: str
    ma_ukol: bool

class StateChanges(BaseModel):
    zivoty_zmena: int = 0
    xp_zmena: int = Field(0)
    davky_jidla_zmena: int = Field(0)
    zlato_zmena: int = Field(0)
    spell_slots_zmena: int = Field(0)
    inventar_pridat: List[Item] = []
    inventar_odebrat_id: List[str] = []
    ukoly: List[Ukol] = Field(default=[])

class NPCDialog(BaseModel):
    jmeno: str
    pohlavi: str
    image_prompt: str
    text: str


def clean_schema(schema: dict):
    if isinstance(schema, dict):
        if "additionalProperties" in schema:
            del schema["additionalProperties"]
        for k, v in schema.items():
            clean_schema(v)
    elif isinstance(schema, list):
        for item in schema:
            clean_schema(item)
    return schema


class DMResponse(BaseModel):
    typ_lokace: str
    aktualni_region: str
    vyznamna_mista: List[PointOfInterest] = Field(default=[])
    popis_okoli: str
    image_prompt: str
    vypravec: str
    npc_dialogy: List[NPCDialog] = []
    system_log: str
    zmeny_stavu: StateChanges
    nabizene_akce: List[str]
    v_boji: bool = False
    nepratele: List[dict] = []
    dulezita_fakta: List[str] = Field(default=[])
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    image_error: Optional[str] = None


dm_schema_dict = DMResponse.model_json_schema()
clean_schema(dm_schema_dict)

class AuthRequest(BaseModel):
    email: str
    password: str

@app.post("/auth/register")
async def register(req: AuthRequest):
    try:
        # Dummy register, in a real app this would use supabase auth
        # But we were just using the email/pass directly or storing it
        # Actually, let's just return a success since Supabase handles users differently,
        # or just return a dummy api_key
        return {"status": "success", "api_key": f"{req.email}#DummyKey"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login")
async def login(req: AuthRequest):
    try:
        # Dummy login
        return {"status": "success", "api_key": f"{req.email}#DummyKey", "email": req.email, "name": "Player"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
        client = genai.Client(api_key=req.api_key if req.api_key and "DUMMY" not in req.api_key else os.environ.get("GEMINI_API_KEY"))
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

class ListCharactersRequest(BaseModel):
    email: str

@app.post("/list-characters")
async def list_characters(req: ListCharactersRequest):
    try:
        db_res = supabase.table("characters").select("api_key, name, race, dnd_class, stats, state").ilike("api_key", f"{req.email}#%").execute()
        return {"status": "success", "characters": db_res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class LoadGameRequest(BaseModel):
    email: str
    name: str

@app.post("/load-game")
async def load_game(req: LoadGameRequest):
    try:
        api_key = f"{req.email}#{req.name}"
        db_res = supabase.table("characters").select("*").eq("api_key", api_key).execute()
        if not db_res.data:
            raise HTTPException(status_code=404, detail="Character not found.")
        return {"status": "success", "character": db_res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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

class SaveStateRequest(BaseModel):
    email: str
    name: str
    state: dict

@app.post("/save-state")
async def save_state(req: SaveStateRequest):
    try:
        api_key = f"{req.email}#{req.name}"
        supabase.table("characters").update({"state": req.state}).eq("api_key", api_key).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class CharacterCreateRequest(BaseModel):
    name: str
    dnd_class: str
    race: str
    stats: dict
    email: str
    api_key: str

@app.post("/create-character")
async def create_character(req: CharacterCreateRequest):
    api_key = f"{req.email}#{req.name}"
    res = supabase.table("characters").select("api_key").eq("api_key", api_key).execute()
    if res.data:
        raise HTTPException(status_code=400, detail="Character already exists.")
    
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f'''
Jsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil novou postavu:
Jméno: {req.name}
Rasa: {req.race}
Třída: {req.dnd_class}
Staty: {req.stats}

Napiš poutavý první odstavec (intro), který postavu rovnou vrhne do děje. Zohledni její rasu a třídu. Nezačínej v obyčejné hospodě, začni např. na deštivé cestě, uprostřed lesa, u brány města nebo v nebezpečí.
Vrať POUZE json ve formátu:
{{
  "intro_text": "Text vypravěče (min 3 věty)...",
  "popis_okoli": "Stručný popis lokace (např. Temný les plný stínů a vlhka)"
}}
        '''
        response = model.generate_content(prompt)
        import json
        
        try:
            # Clean possible markdown block
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            data = json.loads(clean_text)
            intro_text = data.get("intro_text", "Mlha se rozestupuje...")
            popis_okoli = data.get("popis_okoli", "Neznámé místo.")
        except Exception:
            intro_text = response.text.strip()
            popis_okoli = "Neznámé místo."
            
    except Exception as e:
        intro_text = "Vítej ve světě Aethelgard. Mlha se pomalu rozestupuje a tvé dobrodružství právě začíná..."
        popis_okoli = "Zamlžený hvozd."
        
    initial_history = [
        {"role": "model", "text": f'''{{"aktualni_region": "Začátek cesty", "popis_okoli": "{popis_okoli}", "vypravec": "{intro_text}", "nabizene_akce": ["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]}}'''}
    ]
    state = {
        "hp": 100,
        "rations": 3,
        "inventory": [],
        "equipped": {},
        "skills": [],
        "quests": [],
        "locationType": "divocina",
        "currentRegion": "Neznámé končiny",
        "pointsOfInterest": [],
        "level": 1,
        "xp": 0
    }
    
    supabase.table("characters").insert({
        "api_key": api_key,
        "name": req.name,
        "dnd_class": req.dnd_class,
        "race": req.race,
        "state": state,
        "history": initial_history
    }).execute()
    
    return {"status": "success", "api_key": api_key, "message": "Úspěšně ses probudil v novém těle.", "intro_text": intro_text, "popis_okoli": popis_okoli}

class PlayerActionRequest(BaseModel):
    api_key: str
    email: str
    name: str
    action_text: str
    level: int = 1

async def retrieve_memories(api_key, action_text, client):
    return ""

async def store_memory(api_key, fakt, client):
    pass

@app.post("/action")
async def play_action(req: PlayerActionRequest):
    try:
        db_key = f"{req.email}#{req.name}"
        db_res = supabase.table("characters").select("history, name, race, dnd_class, state").eq("api_key", db_key).execute()
        if not db_res.data:
            raise HTTPException(status_code=404, detail="Postava nenalezena.")
        
        char_data = db_res.data[0]
        history = char_data.get("history", [])
        
        client = genai.Client(api_key=req.api_key if req.api_key and req.api_key != "DUMMY" else os.environ.get("GEMINI_API_KEY"))

        # Příprava konverzace - OPTIMALIZACE TOKENŮ
        contents = []
        # Omezíme historii na posledních 6 zpráv (3 tahy) a odstraníme JSON balast z paměti modelu
        for msg in history[-6:]: 
            if msg["role"] == "user":
                contents.append(
                    types.Content(role="user", parts=[types.Part.from_text(text=msg["text"])])
                )
            else:
                try:
                    import json
                    dm_data = json.loads(msg["text"])
                    # Ponecháme pouze příběh a dialogy, smažeme technické změny, obrázky a systémové logy
                    story_text = dm_data.get("vypravec", "")
                    for npc in dm_data.get("npc_dialogy", []):
                        story_text += f"\n{npc.get('jmeno')}: {npc.get('text')}"
                    
                    contents.append(
                        types.Content(role="model", parts=[types.Part.from_text(text=story_text)])
                    )
                except:
                    # Fallback pro staré zprávy
                    contents.append(
                        types.Content(role="model", parts=[types.Part.from_text(text=msg["text"])])
                    )
            
        relevant_memories = ""
        # Pidn aktuln akce s kontextem
        context_action = f"""[Dlouhodob pam (relevantn fakta z minulosti):]
{relevant_memories}

[Aktuln stav hry - neukazovat hri, pouze pro informaci PJ:]
{json.dumps(char_data.get('state', {}), ensure_ascii=False)}

[Akce hre:]
{req.action_text}
"""
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=context_action)]
            )
        )

        system_prompt = f"""Jsi Pán jeskyně ve fantasy světě Aethelgard. Hráč je momentálně na {req.level}. úrovni.

PRAVIDLA D&D 5e, OBTÍŽNOST (DC) A SELHÁNÍ:
- **Nešetři hráče!** Pokud dělá riskantní akci (průzkum, přesvědčování, skok), VŽDY urči adekvátní Obtížnost (DC). 
- Běžně používej **DC 15 (Střední)** pro běžné překážky a **DC 20 (Těžké)** nebo **DC 25 (Velmi těžké)** pro složité úkoly (např. luštění prastarých nápisů v ruinách musí být minimálně DC 18!). Vyhni se dávání triviálních DC 10.
- **Neboj se nechat hráče selhat!** Hra musí mít napětí a selhání tvoří příběh. Hráč musí nést následky (ztráta HP, spuštění pasti, rozčílení NPC).
- Vždy na pozadí virtuálně "hoď d20" a přičti příslušný stat. Výsledek porovnej s tvým DC. Do `system_log` vždy uveď hod a výsledek (např. "Hod na Vnímání: d20(8) + WIS(2) = 10 vs DC 15. Selhání.").

TAKTICKÝ BOJ A NEPŘÁTELÉ:
- Neodepisuj nepřítele hned, boj je na kola. Sleduj jejich HP, ZRAŇUJ HRÁČE. Nepřátelé útočí zpět, využívají prostředí a nejsou hloupí! Hráč nesmí vyhrát každý souboj bez škrábnutí.
- Nastav `v_boji` na true, pokud probíhá boj. Pečlivě vyplňuj seznam `nepratele` (jméno, hp, max_hp, status), aby to viděl hráč na obrazovce.

RŮZNORODÁ A AUTENTICKÁ NPC:
- Obyvatelstvo je různorodé (ženy, děti, starci, veteráni, podvodníci). Každé NPC má svou skrytou úroveň a logiku. 
- NPC NESOUHLASÍ s hráčem automaticky. Obyčejný sedlák před hrozbou uteče, ale elitní válečník hráče klidně zabije, pokud ho hráč urazí.

ODMĚNY A XP (EXTRÉMNĚ POMALÝ RŮST - DLOUHÁ KAMPAŇ):
- Uděluj `xp_zmena` POUZE za velmi významné události. Zlaté pravidlo: běžný pohyb a běžný rozhovor = 0 XP, odhalení důležitého tajemství = 10 XP, zabití monstra = 20-40 XP, splnění celého úkolu = 100-200 XP. Nechceme, aby hráč leveloval rychle.

VYPRÁVĚNÍ, MÍSTA A PUTOVÁNÍ (LOKACE):
- **Cestování:** Rychlé přesuny na povel hráče ("Jdu do města X") jsou ZAKÁZÁNY! Každé putování mezi městy/lokacemi přepne hru do režimu "divocina". Cesta musí trvat více tahů.
- **Náhodná setkání:** Během cesty MUSÍŠ generovat překážky: boje (vlci, bandité), logistické potíže (zlomené kolo, bouřka), příběhová setkání (potulný kupec, zraněný).
- **Typ lokace a Region:** Do `typ_lokace` dej vždy 'mesto', 'divocina', nebo 'dungeon'. Do `aktualni_region` dej hezký název oblasti, kde hráč zrovna je (např. 'Stříbrný les', 'Hlavní město').
- **Významná místa (Město a UI):** Pokud je hráč v `mesto`, MUSÍŠ vyplnit pole `vyznamna_mista` objekty (název, ikona, ma_ukol). Nastav `ma_ukol=True`, pokud se tam dá vzít quest (v UI se objeví vykřičník). V lese/pustině pole nech prázdné!
- **CESTOVÁNÍ A JÍDLO (Survival):** Když se hráč rozhodne cestovat (opustit město a jít jinam), PŘEPNI `typ_lokace` na 'divocina'. Změň `davky_jidla_zmena` na -1 (cesta stojí jídlo). Pokud hráč jídlo nemá, dej mu penalizaci (-10 HP, napiš to do system_log). Cestou VŽDY vygeneruj náhodné setkání (bandité, bouře, obchodník) a nenech ho dorazit hned do cíle!

ZÁZNAMY PRO FRONTEND:
- Do 'image_prompt' detailně popište aktuální scénu (bez textu). VŽDY NA KONEC PŘIDEJTE TENTO STYL: "style of detailed 2D painterly fantasy concept art, bright vibrant colors, majestic epic scale, cozy atmosphere, studio ghibli meets classic D&D illustrations". Do 'popis_okoli' stručně popište situaci.
- Do 'vypravec' pište (s velkým důrazem na epické, barevné, malířské fantasy popisy majestátních scenérií, detailů architektury a útulné atmosféry) š POUZE beletristické vyprávění světa – jak se situace odvíjí, jak reagují NPC, atmosféru. NIKDY sem nepsat technické detaily (čísla hodů, XP, poškození).
- Do 'system_log' zapiš VŠECHNY technické herní mechaniky odděleně: výsledky hodů kostkou (např. "Hod na Útok: d20=14 + STR 2 = 16 vs. Obrana 12 -> Zásah!"), způsobené/přijaté poškození, získané XP, level-up oznámení. Tento text se hráči NEBUDE číst nahlas.
- Pro NPC použij VÝHRADNĚ 'npc_dialogy' (pohlavi="muz"/"zena", image_prompt="detailed 2D painterly fantasy portrait, vibrant colors"). PŘÍSNÝ ZÁKAZ: Pokud jakákoliv postava promluví (přímá řeč), NESMÍ to být v textu 'vypravec'. Vypravěč slouží POUZE pro popis děje (např. "Garrick se na tebe podíval."). Samotná věta, kterou Garrick řekne, už MUSÍ být odděleně vložena do 'npc_dialogy'. Pokud mluví více postav, vlož do 'npc_dialogy' více objektů.

SPECIFIKA POSTAVY A NABIZENE AKCE:
- TRIDA A RASA: Hracova trida a rasa hraji OBROVSKOU roli. Obchodnici by meli nabizet predmety/kouzla pro hracovu tridu, a NPC by na ni meli reagovat.
- VZDY vygeneruj 3 az 5 "nabizenych akci" (v listu `nabizene_akce`), ktere davaji v dane situaci smysl (neomezuj se jen na 3, muze jich byt az 5).
- Z techto nabizenych akci generuj alespon jednu tak, aby byla unikatni pro hracovu tridu (napr. Bard muze nekoho okouzlit pisni, Zlodej pacit, Barbar pouzit silu).
"""

        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=dm_schema_dict,
                temperature=0.7,
            )
        )
        
        dm_json = json.loads(response.text)
        
        # --- Caching and Image Generation ---
        import unicodedata
        import re
        
        region = dm_json.get("aktualni_region", "nezname_konciny")
        slug = unicodedata.normalize('NFKD', region).encode('ascii', 'ignore').decode('ascii')
        slug = re.sub(r'[^a-z0-9]+', '_', slug.lower()).strip('_')
        if not slug:
            slug = "lokace_bez_jmena"
            
        filename = f"{slug}.jpg"
        filepath = os.path.join("images", filename)
        
        # Check if already cached
        if os.path.exists(filepath):
            dm_json["image_url"] = f"/images/{filename}"
        else:
            img_key = os.environ.get("GEMINI_IMAGE_API_KEY")
            img_prompt = dm_json.get("image_prompt")
            if img_key and img_prompt:
                try:
                    img_client = genai.Client(api_key=img_key)
                    img_res = img_client.models.generate_images(
                        model='imagen-3.0-generate-002',
                        prompt=img_prompt,
                        config=types.GenerateImagesConfig(
                            number_of_images=1,
                            output_mime_type="image/jpeg",
                            aspect_ratio="16:9"
                        )
                    )
                    if img_res.generated_images:
                        image_bytes = img_res.generated_images[0].image.image_bytes
                        with open(filepath, "wb") as img_file:
                            img_file.write(image_bytes)
                        dm_json["image_url"] = f"/images/{filename}"
                except Exception as img_e:
                    err_str = str(img_e).lower()
                    if "429" in err_str or "exhausted" in err_str or "quota" in err_str:
                        dm_json["image_error"] = "Vyčerpán denní limit pro obrázky. Zobrazuji černé pozadí."
                    else:
                        dm_json["image_error"] = f"Chyba: {str(img_e)}"

        
        # Uložení nových důležitých faktů do dlouhodobé paměti
        fakta = dm_json.get("dulezita_fakta", [])
        for fakt in fakta:
            await store_memory(db_key, fakt, client)
        
        # 3. Uložení upraveného stavu do DB
        updated_history = history + [
            {"role": "user", "text": req.action_text},
            {"role": "model", "text": response.text}

        ]
        
        # Uložíme pouze historii, samotný state si frontend uloží zvlášť přes /save-state, 
        # protože aplikuje level up a vybavení na své straně.
        supabase.table("characters").update({
            "history": updated_history
        }).eq("api_key", db_key).execute()
        
        return dm_json
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Chyba při komunikaci: {str(e)}")


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

class SaveStateRequest(BaseModel):
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
        raise HTTPException(status_code=400, detail=f"Chyba při ukládání: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Spuštění serveru
    uvicorn.run(app, host="127.0.0.1", port=8000)

from fastapi.responses import StreamingResponse
import edge_tts
import io

@app.get("/tts")
async def get_tts(text: str, voice: str = "cs-CZ-AntoninNeural"):
    try:
        communicate = edge_tts.Communicate(text, voice)
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]
        
        return StreamingResponse(io.BytesIO(audio_data), media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
