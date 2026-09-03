import random
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

class NPCRecord(BaseModel):
    jmeno: str
    lokace: str
    popis: str
    vztah: str = Field(description="Vztah k hráči (např. Přátelský, Neutrální, Nepřátelský, Zavázán, Zastrašený, atd.)")

class StateChanges(BaseModel):
    zivoty_zmena: int = 0
    xp_zmena: int = Field(0)
    davky_jidla_zmena: int = Field(0)
    zlato_zmena: int = Field(0)
    spell_slots_zmena: int = Field(0)
    inventar_pridat: List[Item] = []
    inventar_odebrat_id: List[str] = []
    ukoly: List[Ukol] = Field(default=[])
    travel_mode_set: Optional[bool] = None
    travel_days_left_set: Optional[int] = None
    travel_destination_set: Optional[str] = None
    zname_postavy_zmena: List[NPCRecord] = Field(default=[], description="Pokud hráč potká nové důležité NPC nebo se změní vztah s existujícím, přidej ho sem pro aktualizaci v paměti.")

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
    novy_zapis_do_deniku: Optional[str] = Field(default=None, description="Zásadní posun v ději. Napiš max 2 věty, které se zapíšou do hráčova deníku jako shrnutí (např. Zabil jsem vlka a zachránil vesnici). U běžných kroků nech prázdné.")
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
            model='gemini-3.6-flash',
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
        clean_email = req.email.strip()
        db_res = supabase.table("characters").select("api_key, name, race, dnd_class, stats, state").ilike("api_key", f"{clean_email}#%").execute()
        return {"status": "success", "characters": db_res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class LoadGameRequest(BaseModel):
    email: str
    name: str

@app.post("/load-game")
async def load_game(req: LoadGameRequest):
    try:
        clean_email = req.email.strip()
        clean_name = req.name.strip()
        api_key = f"{clean_email}#{clean_name}"
        db_res = supabase.table("characters").select("*").ilike("api_key", api_key).execute()
        if not db_res.data:
            # Fallback exact match
            db_res = supabase.table("characters").select("*").eq("api_key", api_key).execute()
            if not db_res.data:
                raise HTTPException(status_code=404, detail="Character not found.")
        char_data = db_res.data[0]
        state = char_data.get("state") or {}
        if not state.get("playerLocation") and state.get("world_data"):
            w_data = state.get("world_data")
            cap = next((p for p in w_data.get("pois", []) if p.get("type") == "Capital"), None)
            if cap:
                state["playerLocation"] = {"q": cap["q"], "r": cap["r"], "kingdom_id": cap.get("kingdom_id"), "biome": cap.get("terrain", "Plains")}
            elif w_data.get("hex_grid"):
                first_h = w_data["hex_grid"][0]
                state["playerLocation"] = {"q": first_h["q"], "r": first_h["r"], "kingdom_id": first_h.get("kingdom_id"), "biome": first_h.get("terrain", "Plains")}
            try:
                supabase.table("characters").update({"state": state}).eq("api_key", char_data["api_key"]).execute()
            except Exception as se:
                print("Could not auto-save repaired location:", se)
            char_data["state"] = state
        return {"status": "success", "character": char_data}
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

class WorldLocation(BaseModel):
    id: str = Field(description="Unikátní ID bez diakritiky, např. 'mesto_vranov'")
    typ: str = Field(description="'hlavni_mesto', 'mesto', 'vesnice', 'zajimavost'")
    nazev: str
    popis: str = Field(description="Veřejně známý popis místa.")
    tajemstvi_nebo_problem: str = Field(description="Skrytý problém, konflikt nebo tajemství lokace. (Hráč ho nezná!)")
    x: int = Field(description="X souřadnice na mapě (0-100)")
    y: int = Field(description="Y souřadnice na mapě (0-100)")

class CampaignNPC(BaseModel):
    jmeno: str
    lokace_id: str = Field(description="ID lokace, kde se nachází.")
    popis: str
    skryty_motiv: str = Field(description="Skutečná motivace nebo tajemství postavy. (Hráč ho nezná!)")


class CampaignWorld(BaseModel):
    main_plot: str = Field(description="Hlavní epická zápletka kampaně.")
    locations: List[WorldLocation] = Field(description="1-2 hlavni_mesto, 3-4 mesto, 4-8 vesnice, 3-5 zajimavost (rozmístěné po celé mapě 0-100).")
    key_npcs: List[CampaignNPC] = Field(description="3-5 klíčových NPC (vůdci, padouši, zadavatelé úkolů) spjatých s kampaní.")

class CharacterCreateRequest(BaseModel):
    name: str
    dnd_class: str
    race: str
    stats: dict
    email: str
    game_mode: str = "sandbox"

    api_key: str


CLASS_TEMPLATES = {
    "Barbar": {
        "inventory": [
            {"id": "c_greataxe", "icon": "Sword", "name": "Obouruční sekera", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d12", "sell_price": 20, "description": "Těžká obouruční sekera."},
            {"id": "c_rags", "icon": "Shirt", "name": "Kožené hadry", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 0", "sell_price": 1, "description": "Barbar nepotřebuje zbroj."}
        ],
        "equipped": {"hlava": None, "hruď": "c_rags", "hlavní ruka": "c_greataxe", "druhá ruka": None, "prsten": None, "krk": None},
        "available_skills": [
            {"id": "rage", "name": "Zuřivost", "desc": "Dočasně zvýší poškození a fyzickou odolnost (Aktivní)."},
            {"id": "reckless", "name": "Bezohledný útok", "desc": "Výhoda na útok, ale nepřátelé mají výhodu proti tobě (Aktivní)."},
            {"id": "toughness", "name": "Zarputilost", "desc": "Tvé maximální zdraví se zvýší (Pasivní)."}
        ],
        "starting_skills": [{"id": "rage", "name": "Zuřivost", "desc": "Dočasně zvýší poškození a fyzickou odolnost (Aktivní)."}]
    },
    "Bard": {
        "inventory": [
            {"id": "c_rapier", "icon": "Sword", "name": "Rapír", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d8", "sell_price": 15, "description": "Elegantní zbraň pro šermíře."},
            {"id": "c_leather", "icon": "Shirt", "name": "Kožená zbroj", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 1", "sell_price": 10, "description": "Základní ochrana."}
        ],
        "equipped": {"hlava": None, "hruď": "c_leather", "hlavní ruka": "c_rapier", "druhá ruka": None, "prsten": None, "krk": None},
        "available_skills": [
            {"id": "mockery", "name": "Jízlivý posměch", "desc": "Způsobí psychické zranění a nevýhodu na útok nepřítele (Cantrip)."},
            {"id": "inspiration", "name": "Bardická inspirace", "desc": "Zlepší další hod spojence nebo tvůj vlastní (Aktivní)."},
            {"id": "charm", "name": "Kouzlo osobnosti", "desc": "Velká výhoda při vyjednávání s NPC (Pasivní)."}
        ],
        "starting_skills": [{"id": "mockery", "name": "Jízlivý posměch", "desc": "Způsobí psychické zranění a nevýhodu na útok nepřítele (Cantrip)."}]
    },
    "Klerik": {
        "inventory": [
            {"id": "c_mace", "icon": "Sword", "name": "Palcát", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d6", "sell_price": 10, "description": "Těžká zbraň drtící kosti."},
            {"id": "c_shield", "icon": "Shield", "name": "Dřevěný štít", "slot": "druhá ruka", "type": "zbroj", "stats": "Obrana: +1", "sell_price": 10, "description": "Extra obrana."},
            {"id": "c_chainshirt", "icon": "Shirt", "name": "Kroužková košile", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 2", "sell_price": 20, "description": "Pevná obrana pro kněze."}
        ],
        "equipped": {"hlava": None, "hruď": "c_chainshirt", "hlavní ruka": "c_mace", "druhá ruka": "c_shield", "prsten": None, "krk": None},
        "available_skills": [
            {"id": "sacredflame", "name": "Posvátný plamen", "desc": "Ožehne cíl zářivou svatou energií (Cantrip)."},
            {"id": "healingword", "name": "Léčivé slovo", "desc": "Okamžitě obnoví menší množství HP tobě nebo spojenci (Magie)."},
            {"id": "turnundead", "name": "Odvracení nemrtvých", "desc": "Zastraší a zažene nemrtvé bytosti (Aktivní)."}
        ],
        "starting_skills": [{"id": "sacredflame", "name": "Posvátný plamen", "desc": "Ožehne cíl zářivou svatou energií (Cantrip)."}]
    },
    "Druid": {
        "inventory": [
            {"id": "c_staff", "icon": "Wand", "name": "Dřevěná hůl", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d6", "sell_price": 5, "description": "Pevná hůl z dubového dřeva."},
            {"id": "c_leather", "icon": "Shirt", "name": "Kožená zbroj", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 1", "sell_price": 10, "description": "Základní ochrana."}
        ],
        "equipped": {"hlava": None, "hruď": "c_leather", "hlavní ruka": "c_staff", "druhá ruka": None, "prsten": None, "krk": None},
        "available_skills": [
            {"id": "shillelagh", "name": "Šillelagh", "desc": "Posílí tvou hůl magií přírody pro mnohem větší poškození (Cantrip)."},
            {"id": "wildshape", "name": "Zvířecí podoba", "desc": "Promění tě v šelmu (vlk, medvěd) na jeden souboj (Aktivní)."},
            {"id": "entangle", "name": "Propletení", "desc": "Ze země vyraší kořeny, které znehybní nepřátele (Magie)."}
        ],
        "starting_skills": [{"id": "shillelagh", "name": "Šillelagh", "desc": "Posílí tvou hůl magií přírody pro mnohem větší poškození (Cantrip)."}]
    },
    "Bojovník": {
        "inventory": [
            {"id": "c_longsword", "icon": "Sword", "name": "Dlouhý meč", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d8", "sell_price": 15, "description": "Univerzální smrtící čepel."},
            {"id": "c_shield", "icon": "Shield", "name": "Dřevěný štít", "slot": "druhá ruka", "type": "zbroj", "stats": "Obrana: +1", "sell_price": 10, "description": "Extra obrana."},
            {"id": "c_chainmail", "icon": "Shirt", "name": "Kroužková zbroj", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 3", "sell_price": 30, "description": "Těžká zbroj."}
        ],
        "equipped": {"hlava": None, "hruď": "c_chainmail", "hlavní ruka": "c_longsword", "druhá ruka": "c_shield", "prsten": None, "krk": None},
        "available_skills": [
            {"id": "secondwind", "name": "Druhý dech", "desc": "Obnoví ti v boji část zdraví (Aktivní)."},
            {"id": "actionsurge", "name": "Akční vlna", "desc": "Umožní ti zaútočit dvakrát v jednom kole (Aktivní)."},
            {"id": "defense", "name": "Mistr obrany", "desc": "Vyhnutí se útoku je snadnější (Pasivní)."}
        ],
        "starting_skills": [{"id": "secondwind", "name": "Druhý dech", "desc": "Obnoví ti v boji část zdraví (Aktivní)."}]
    },
    "Mnich": {
        "inventory": [
            {"id": "c_staff", "icon": "Wand", "name": "Hůl", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d6", "sell_price": 5, "description": "Lehká hůl."},
            {"id": "c_robes", "icon": "Shirt", "name": "Mnišský oděv", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 0", "sell_price": 2, "description": "Neomezuje v pohybu."}
        ],
        "equipped": {"hlava": None, "hruď": "c_robes", "hlavní ruka": "c_staff", "druhá ruka": None, "prsten": None, "krk": None},
        "available_skills": [
            {"id": "flurry", "name": "Příval ran", "desc": "Série bleskových úderů pěstmi jako extra útok (Aktivní)."},
            {"id": "patient", "name": "Trpělivá obrana", "desc": "Soustředíš se výhradně na uhýbání, nepřátelé tě těžko zasáhnou (Aktivní)."},
            {"id": "deflect", "name": "Odražení střel", "desc": "Umíš holýma rukama chytat a odrážet letící šípy (Pasivní)."}
        ],
        "starting_skills": [{"id": "flurry", "name": "Příval ran", "desc": "Série bleskových úderů pěstmi jako extra útok (Aktivní)."}]
    },
    "Paladin": {
        "inventory": [
            {"id": "c_warhammer", "icon": "Sword", "name": "Válečné kladivo", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d8", "sell_price": 15, "description": "Zbraň spravedlnosti."},
            {"id": "c_shield", "icon": "Shield", "name": "Kovový štít", "slot": "druhá ruka", "type": "zbroj", "stats": "Obrana: +1", "sell_price": 15, "description": "Extra obrana."},
            {"id": "c_chainmail", "icon": "Shirt", "name": "Kroužková zbroj", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 3", "sell_price": 30, "description": "Těžká zbroj."}
        ],
        "equipped": {"hlava": None, "hruď": "c_chainmail", "hlavní ruka": "c_warhammer", "druhá ruka": "c_shield", "prsten": None, "krk": None},
        "available_skills": [
            {"id": "smite", "name": "Božský úder", "desc": "Tvůj zbraňový útok získá obrovské radiantní (svaté) poškození (Magie)."},
            {"id": "layonhands", "name": "Vkládání rukou", "desc": "Léčivý dotyk obnovující větší množství zdraví (Aktivní)."},
            {"id": "aura", "name": "Aura ochrany", "desc": "Ty a tvoji spojenci lépe odoláváte magii (Pasivní)."}
        ],
        "starting_skills": [{"id": "smite", "name": "Božský úder", "desc": "Tvůj zbraňový útok získá obrovské radiantní (svaté) poškození (Magie)."}]
    },
    "Hraničář": {
        "inventory": [
            {"id": "c_longbow", "icon": "Sword", "name": "Dlouhý luk", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d8", "sell_price": 25, "description": "Vynikající luk pro střelbu na dálku."},
            {"id": "c_dagger", "icon": "Sword", "name": "Lovecká dýka", "slot": "druhá ruka", "type": "zbraň", "stats": "Poškození: 1d4", "sell_price": 10, "description": "Záložní zbraň."},
            {"id": "c_leather", "icon": "Shirt", "name": "Kožená zbroj", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 1", "sell_price": 10, "description": "Základní ochrana."}
        ],
        "equipped": {"hlava": None, "hruď": "c_leather", "hlavní ruka": "c_longbow", "druhá ruka": "c_dagger", "prsten": None, "krk": None},
        "available_skills": [
            {"id": "huntersmark", "name": "Značka lovce", "desc": "Označí cíl. Útoky proti němu působí bonusové zranění (Magie)."},
            {"id": "companion", "name": "Zvířecí společník", "desc": "Povolá na pomoc cvičené zvíře (Aktivní)."},
            {"id": "survivalist", "name": "Přežití v divočině", "desc": "Výrazně lepší šance při orientaci, lovu a hledání stop (Pasivní)."}
        ],
        "starting_skills": [{"id": "huntersmark", "name": "Značka lovce", "desc": "Označí cíl. Útoky proti němu působí bonusové zranění (Magie)."}]
    },
    "Tulák": {
        "inventory": [
            {"id": "c_dagger1", "icon": "Sword", "name": "Jedovatá dýka", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d4", "sell_price": 20, "description": "Ostrá a nebezpečná."},
            {"id": "c_dagger2", "icon": "Sword", "name": "Dýka do levé ruky", "slot": "druhá ruka", "type": "zbraň", "stats": "Poškození: 1d4", "sell_price": 10, "description": "Skvělá na dorážení."},
            {"id": "c_leather", "icon": "Shirt", "name": "Temná kožená zbroj", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 1", "sell_price": 15, "description": "Neomezuje a splývá s nocí."}
        ],
        "equipped": {"hlava": None, "hruď": "c_leather", "hlavní ruka": "c_dagger1", "druhá ruka": "c_dagger2", "prsten": None, "krk": None},
        "available_skills": [
            {"id": "sneakattack", "name": "Zákeřný útok", "desc": "Pokud nečekaně zaútočíš, způsobíš smrtící bonusové zranění (Pasivní)."},
            {"id": "cunning", "name": "Šikovná akce", "desc": "Můžeš uhýbat, schovat se nebo rychle utéct (Aktivní)."},
            {"id": "lockpicking", "name": "Mistr zloděj", "desc": "Páčení zámků a vybírání kapes s obrovskou výhodou (Pasivní)."}
        ],
        "starting_skills": [{"id": "sneakattack", "name": "Zákeřný útok", "desc": "Pokud nečekaně zaútočíš, způsobíš smrtící bonusové zranění (Pasivní)."}]
    },
    "Čaroděj": {
        "inventory": [
            {"id": "c_dagger", "icon": "Sword", "name": "Dýka krystalová", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d4", "sell_price": 15, "description": "Záložní zbraň pro případ nouze."},
            {"id": "c_robes", "icon": "Shirt", "name": "Roba ze snových vláken", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 0", "sell_price": 10, "description": "Jemná magická látka."}
        ],
        "equipped": {"hlava": None, "hruď": "c_robes", "hlavní ruka": "c_dagger", "druhá ruka": None, "prsten": None, "krk": None},
        "available_skills": [
            {"id": "firebolt", "name": "Ohnivá střela", "desc": "Vyšle mocný ohnivý projektil (Cantrip)."},
            {"id": "quicken", "name": "Zrychlené kouzlo", "desc": "Umožní ti zakouzlit velmi rychle (Aktivní)."},
            {"id": "shield", "name": "Magický štít", "desc": "Jako reakci vytvoříš bariéru odrážející útoky (Magie)."}
        ],
        "starting_skills": [{"id": "firebolt", "name": "Ohnivá střela", "desc": "Vyšle mocný ohnivý projektil (Cantrip)."}]
    },
    "Černokněžník": {
        "inventory": [
            {"id": "c_dagger", "icon": "Sword", "name": "Dýka s runou", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d4", "sell_price": 15, "description": "Zbraň propojená s tvým patronem."},
            {"id": "c_robes", "icon": "Shirt", "name": "Temná roba", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 0", "sell_price": 10, "description": "Oděv utkaný ze stínů."}
        ],
        "equipped": {"hlava": None, "hruď": "c_robes", "hlavní ruka": "c_dagger", "druhá ruka": None, "prsten": None, "krk": None},
        "available_skills": [
            {"id": "eldritchblast", "name": "Mrazivý paprsek", "desc": "Ikonický útok praskající temnou energií (Cantrip)."},
            {"id": "hellish", "name": "Pekelná odplata", "desc": "Pokud jsi zraněn, útočník vzplane (Magie)."},
            {"id": "darkvision", "name": "Ďáblovo vidění", "desc": "Perfektní vidění ve tmě a magické temnotě (Pasivní)."}
        ],
        "starting_skills": [{"id": "eldritchblast", "name": "Mrazivý paprsek", "desc": "Ikonický útok praskající temnou energií (Cantrip)."}]
    },
    "Kouzelník": {
        "inventory": [
            {"id": "c_wand", "icon": "Wand", "name": "Magická hůlka", "slot": "hlavní ruka", "type": "zbraň", "stats": "Poškození: 1d4", "sell_price": 20, "description": "Ohnisko pro tvá kouzla."},
            {"id": "c_robes", "icon": "Shirt", "name": "Učenecká roba", "slot": "hruď", "type": "zbroj", "stats": "Obrana: 0", "sell_price": 10, "description": "Pohodlný oděv na studium knížek."}
        ],
        "equipped": {"hlava": None, "hruď": "c_robes", "hlavní ruka": "c_wand", "druhá ruka": None, "prsten": None, "krk": None},
        "available_skills": [
            {"id": "rayoffrost", "name": "Mrazivý dotek", "desc": "Vrhne ledový paprsek, který zpomalí cíl (Cantrip)."},
            {"id": "magicmissile", "name": "Magická střela", "desc": "Tři magické šipky, které vždy neomylně zasáhnou cíl (Magie)."},
            {"id": "magearmor", "name": "Mágova zbroj", "desc": "Magicky zvýší tvou obranu (Magie)."}
        ],
        "starting_skills": [{"id": "rayoffrost", "name": "Mrazivý dotek", "desc": "Vrhne ledový paprsek, který zpomalí cíl (Cantrip)."}]
    }
}

@app.post("/create-character")
async def create_character(req: CharacterCreateRequest):
    api_key = f"{req.email}#{req.name}"
    res = supabase.table("characters").select("api_key").eq("api_key", api_key).execute()
    if res.data:
        raise HTTPException(status_code=400, detail="Character already exists.")
    
    # 1. Vygenerujeme svet
    world_data = None
    if req.game_mode == "campaign":
        try:
            import json
            import world_generator
            
            math_world = world_generator.generate_world_data()
            
            client = genai.Client(api_key=req.api_key if req.api_key and "DUMMY" not in req.api_key else os.environ.get("GEMINI_API_KEY"))
            world_prompt = f"""
NAVRHUJEŠ WORLD BIBLE PRO HIGH FANTASY KAMPAŇ (AELTHGARD).

ABSOLUTNÍ PRAVIDLA SVĚTA:
1. Tón: Mix Fable a Zaklínače (Pohádkový vizuál, ale dospělé, krvavé a zkorumpované problémy).
2. Magie: Nedá se učit. Je to "Probuzení", vzácný dar nebo kletba od bohů. Jsou to "Vyvolení".
3. Zjevení: Bohové (Solarian - Řád a Krev, Vyldia - Příroda a Chaos, Kull - Stíny a Lži) se začínají zjevovat lidem.
4. Království: Kontinent je rozdělen na 7 království. 

Zde jsou základní archetypy 7 království (kingdom_id 1 až 7):
  1K (Valerijské Impérium): Upadající Impérium (Zkorumpovaná šlechta)
  2K (Svatá říše Solariova): Teokracie (Náboženští fanatici Řádu)
  3K (Kmeny z Hlubokých hvozdů): Divoké Kmeny (Přeživší v bažinách/lesích, krevní rituály)
  4K (Svobodná města): Obchodní Gildy (Žoldáci a peníze, žádný král)
  5K (Karanténní Zóna): Magická pustina, zamořená monstry
  6K (Železný Práh): Severní Hradba (Militarizovaná stráž před zlem)
  7K (Tajemné Útočiště): Izolované útočiště Vyvolených (Mágové)

  DŮLEŽITÉ: Ve výstupech (názvech lokací ani popisech) NIKDY nepoužívej generické názvy jako "Království 6". Místo toho vždy použij název dané frakce/území z tohoto seznamu (např. Železný Práh).

Tady je JSON se všemi body zájmu (POI) na vygenerované mapě:
{json.dumps(math_world['pois'], ensure_ascii=False)}

Tvým úkolem je vrátit POUZE validní JSON (žádný markdown, žádné komentáře). Vygeneruj MAXIMÁLNĚ 5 nejzajímavějších lokací a 5 klíčových NPC s následující strukturou:
{{
  "main_plot": "Krátký popis hlavní zápletky světa (1 odstavec)",
  "locations": [
    {{"id": 1, "name": "Město X", "description": "Popis města a co se tam děje", "ruler": "Kdo tam vládne"}}
  ],
  "key_npcs": [
    {{"name": "Jméno", "role": "Frakce/Role", "motive": "Co chce?"}}
  ]
}}
"""
            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=world_prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            ai_world_data = json.loads(clean_text)
            
            # Merge math world and AI lore
            world_data = {
                "hex_grid": math_world.get("hex_grid", []),
                "pois": math_world["pois"],
                "main_plot": ai_world_data.get("main_plot"),
                "locations": ai_world_data.get("locations"),
                "key_npcs": ai_world_data.get("key_npcs")
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Chyba při generování světa: {str(e)}")

    # 1b. Určíme startovní pozici hráče (hlavní město náhodného království)
    initial_location = None
    start_kingdom_name = "Začátek cesty"
    if world_data and world_data.get("pois"):
        import random
        capitals = [p for p in world_data["pois"] if p.get("type") == "Capital"]
        if capitals:
            start_poi = random.choice(capitals)
            initial_location = {"q": start_poi["q"], "r": start_poi["r"], "biome": start_poi.get("terrain", "Plains"), "kingdom_id": start_poi.get("kingdom_id")}
        else:
            center_hex = world_data.get("hex_grid", [{}])[0]
            initial_location = {"q": center_hex.get("q", 0), "r": center_hex.get("r", 0), "biome": center_hex.get("terrain", "Plains")}

    # 2. Vygenerujeme Intro pomoci sveta
    try:
        client = genai.Client(api_key=req.api_key if req.api_key and "DUMMY" not in req.api_key else os.environ.get("GEMINI_API_KEY"))
        world_context = ""
        if world_data:
            import json

            kingdom_names = {
                1: "Valerijské Impérium", 2: "Svatá Říše Solariova", 3: "Kmeny z Hlubokých hvozdů",
                4: "Svobodná města", 5: "Karanténní Zóna", 6: "Železný Práh", 7: "Tajemné Útočiště"
            }
            start_kingdom_id = initial_location.get("kingdom_id") if initial_location else 1
            start_kingdom_name = kingdom_names.get(start_kingdom_id, "Neznámé království")
            
            world_context = f"""
[HRAJE SE PŘÍBĚHOVÁ KAMPAŇ]: Zamotej postavu rovnou do vygenerované zápletky tohoto světa!
Zápletka: {world_data.get('main_plot')}
Místo startu: Hráč právě začíná ve frakci/království {start_kingdom_name} (Souřadnice: {initial_location['q']}, {initial_location['r']}).
Klíčová NPC: {json.dumps(world_data.get('key_npcs'), ensure_ascii=False)}

KRITICKÝ POŽADAVEK NA INTRO:
1. Nejprve ve 2-3 větách atmosféricky představ dané království a jeho aktuální náladu či napětí.
2. IHNED potom vhoď postavu do konkrétní dramatické události přímo před jejíma očima (in media res)! Může to být:
   - Náhlé oslovení od zoufalého měšťana, uprchlíka, strážného nebo zraněného posla.
   - Nečekaný konflikt, rvačka, útok bestie nebo přepadení.
   - Nález podezřelého předmětu, tajemného svitku či mrtvoly s klíčem.
   - Zásah fanatické inkvizice nebo kultistů vyvolávající paniku v davu.
3. Nech situaci otevřenou a napínavou, aby postava musela okamžitě reagovat!
4. Vygeneruj přesně 3 smysluplné, konkrétní nabízené akce reagující na tuto situaci.
"""
        
        prompt = f'''
Jsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil novou postavu:
Jméno: {req.name}
Rasa: {req.race}
Třída: {req.dnd_class}
Staty: {req.stats}
{world_context}

Vrať POUZE json ve formátu:
{{
  "intro_text": "Text vypravěče (atmosférické představení království + okamžitá dramatická událost/konflikt/dialog)...",
  "popis_okoli": "Stručný popis lokace",
  "nabizene_akce": ["Konkrétní reakce 1 na událost", "Konkrétní reakce 2 (využití schopnosti či povolání)", "Konkrétní reakce 3 (alternativní přístup)"]
}}
'''
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        import json
        
        try:
            clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
            data = json.loads(clean_text)
            intro_text = data.get("intro_text", "Mlha se rozestupuje...")
            popis_okoli = data.get("popis_okoli", "Neznámé místo.")
            nabizene_akce = data.get("nabizene_akce", ["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"])
            if not isinstance(nabizene_akce, list) or len(nabizene_akce) == 0:
                nabizene_akce = ["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]
        except Exception:
            intro_text = response.text.strip()
            popis_okoli = "Neznámé místo."
            nabizene_akce = ["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chyba při generování intro textu: {str(e)}")
        
    initial_history = [
        {"role": "model", "text": json.dumps({"aktualni_region": start_kingdom_name if world_data else "Začátek cesty", "popis_okoli": popis_okoli, "vypravec": intro_text, "nabizene_akce": nabizene_akce}, ensure_ascii=False)}
    ]

    # Nacteni tridnich dat
    cls_data = CLASS_TEMPLATES.get(req.dnd_class, CLASS_TEMPLATES["Bojovník"]) # fallback

    state = {
        "hp": 100,
        "max_hp": 100,
        "level": 1,
        "xp": 0,
        "inventory": cls_data["inventory"],
        "gold": 15,
        "skills": cls_data["starting_skills"],
        "active_quests": [],
        "completed_quests": [],
        "stats": req.stats,
        "equipped": cls_data["equipped"],
        "world_data": world_data,
        "playerLocation": initial_location,
        "rations": 3
    }
    
    supabase.table("characters").insert({
        "api_key": api_key,
        "name": req.name,
        "dnd_class": req.dnd_class,
        "race": req.race,
        "state": state,
        "history": initial_history
    }).execute()
    
    return {"status": "success", "api_key": api_key, "message": "Úspěšně ses probudil v novém těle.", "intro_text": intro_text, "popis_okoli": popis_okoli, "state": state}


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
        state_dict = char_data.get('state', {})
        travel_days_left = state_dict.get("travel_days_left", 0)
        is_traveling = state_dict.get("travel_mode", False) or travel_days_left > 0

        world_data = state_dict.get('world_data')
        world_prompt_str = ""
        if world_data:
            world_prompt_str = f"\n[TOTO JE ŘÍZENÝ SANDBOX! Svět je pevně dán:]\nZápletka: {world_data.get('main_plot', '')}\nLokace: {json.dumps(world_data.get('locations', []), ensure_ascii=False)}\nKlíčová NPC: {json.dumps(world_data.get('key_npcs', []), ensure_ascii=False)}\n\n[KRITICKÉ PRAVIDLO PRO TAJEMSTVÍ]: Všechna 'tajemstvi_nebo_problem' a 'skryty_motiv' jsou před hráčem PŘÍSNĚ SKRYTÁ. Nesmíš je hráči vyžvanit v úvodním popisu lokace! Hráč na ně musí přijít sám pomocí průzkumu, dedukce nebo dialogů s NPC.\n"
            # Automatický výpočet vzdálenosti při cestování, pokud AI zadá cíl
            # (Tohle vyřešíme později, teď jen dáme AI mapu)

        
        travel_prompt = ""
        if is_traveling:
            roll = random.randint(1, 20)
            if roll <= 5:
                enc = "Klidná cesta. ŽÁDNÝ BOJ ANI HROZBA. Popiš pouze krásu či ponurost krajiny, počasí a nechej hráče urazit kus cesty."
            elif roll <= 9:
                enc = "Objev zajímavé lokace. Hráč narazí na opuštěné či tajuplné místo (ruiny, stará svatyně, podivný strom). Žádný přímý útok, nech ho zkoumat."
            elif roll <= 13:
                enc = "Fyzická překážka. Do cesty se postavila nebezpečná překážka (stržený most, bouře, bažina). Hráč musí vymyslet, jak ji překonat."
            elif roll <= 16:
                enc = "Sociální setkání. Hráč potká cestovatele (kupec, prchající člověk, poutník). Žádná monstra."
            elif roll <= 19:
                enc = "Bojové přepadení! Hráč je napaden monstrem nebo bandity unikátními pro tento region. Vytvoř boj."
            else:
                enc = "Epická vzácná událost. Obrovská hrozba nebo magická anomálie. Scéna musí brát dech."
            
            travel_prompt = f"\n[SYSTÉMOVÝ HOD NA SETKÁNÍ PRO TENTO TAH: {roll}]\nPŘÍSNÝ PŘÍKAZ: Tvoje vyprávění V TOMTO TAHU se musí točit výhradně kolem tohoto scénáře: {enc}\nPOUŽIJ POLE 'travel_days_left_set' a nastav tam (aktuální hodnota mínus jedna). Pokud klesne na 0, nastav 'travel_mode_set' na false a 'travel_destination_set' na prázdný řetězec. ODEČTI 1 z 'rations'.\n\nPokud text akce začíná na [OOC/MYŠLENKA], ignoruj hod a nic neodečítej!"
        else:
            travel_prompt = "\n[SYSTÉM: CESTOVÁNÍ]: Pokud hráč vyslovil přání odejít daleko do jiné lokace, ZAHÁJÍŠ CESTOVÁNÍ. Vyplň pole 'travel_mode_set' jako true, 'travel_destination_set' jako 'Název cíle' a 'travel_days_left_set' jako (číslo 2 až 5 podle dálky). V tomto tahu pouze popiš, že vyráží. (Pokud používá OOC, ignoruj to)."

            
        relevant_memories = ""
        # Pidn aktuln akce s kontextem
        context_action = f"""[Dlouhodob pam (relevantn fakta z minulosti):]
{relevant_memories}
  {world_prompt_str}


[Známé postavy a vztahy (PAMATUJ SI!):]
{json.dumps(char_data.get('state', {}).get('zname_postavy', []), ensure_ascii=False)}

[Aktuální stav hry - neukazovat hráči, pouze pro informaci PJ:]
{json.dumps(char_data.get('state', {}), ensure_ascii=False)}

{travel_prompt}

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

MĚSTA A BEZPEČNÁ MÍSTA (Urban Encounters & Safe Zones):
- Při spánku v hostinci nebo odpočinku NEGNERUJ pasti ani bojová přepadení (žádné nečekané pavučiny při spánku!). Nech hráče v klidu zotavit.
- Náhodná setkání VE MĚSTĚ by měla být zajímavá, ale NEBOJOVÁ: např. žebrák s tajnou mapou, kapsář (test obratnosti), hádka dvou kupců, nebo NPC, které nabídne vedlejší quest.
- Smrtící pasti, monstra a bojová přepadení patří VÝHRADNĚ do divočiny a dungeonů!

VNITŘNÍ MYŠLENKY A KONTROLY (OOC):
- Pokud text akce hráče začíná na [OOC/MYŠLENKA], znamená to, že si hráč pouze interně rekapituluje stav nebo o něčem přemýšlí. V takovém případě ZASTAV ČAS. Neposouvej děj, nevyvolávej žádné události ani reakce okolí. Zůstaň ve stávající scéně a pouze stručně popiš výsledek jeho úvahy či kontroly.

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
            model='gemini-3.6-flash',
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

class TravelRequest(BaseModel):
    email: str
    name: str
    target_q: int
    target_r: int
    api_key: str = "DUMMY"

def hex_distance(q1, r1, q2, r2):
    return (abs(q1 - q2) + abs(q1 + r1 - q2 - r2) + abs(r1 - r2)) // 2

@app.post("/travel")
async def travel_action(req: TravelRequest):
    try:
        db_key = f"{req.email}#{req.name}"
        db_res = supabase.table("characters").select("state, history").eq("api_key", db_key).execute()
        if not db_res.data:
            raise HTTPException(status_code=404, detail="Postava nenalezena.")
            
        char_data = db_res.data[0]
        state = char_data.get("state", {})
        history = char_data.get("history", [])
        world_data = state.get("world_data", {})
        locations = world_data.get("locations", [])
        hex_grid = world_data.get("hex_grid", [])
        
        current_loc = state.get("playerLocation")
        if not current_loc and world_data:
            cap = next((p for p in world_data.get("pois", []) if p.get("type") == "Capital"), None)
            if cap:
                current_loc = {"q": cap["q"], "r": cap["r"], "kingdom_id": cap.get("kingdom_id"), "biome": cap.get("terrain", "Plains")}
            elif hex_grid:
                first_h = hex_grid[0]
                current_loc = {"q": first_h["q"], "r": first_h["r"], "kingdom_id": first_h.get("kingdom_id"), "biome": first_h.get("terrain", "Plains")}
            state["playerLocation"] = current_loc

        if not current_loc:
            raise HTTPException(status_code=400, detail="Neznámá pozice hráče na mapě.")
            
        dist = hex_distance(current_loc["q"], current_loc["r"], req.target_q, req.target_r)
        if dist > 1:
            raise HTTPException(status_code=400, detail="Můžeš cestovat jen o 1 hex!")
            
        target_hex = next((h for h in hex_grid if h["q"] == req.target_q and h["r"] == req.target_r), None)
        if not target_hex:
            raise HTTPException(status_code=400, detail="Cíl leží mimo známou mapu.")
            
        if target_hex.get("terrain") in ["Ocean"]:
            raise HTTPException(status_code=400, detail="Oceán je neprostupný.")
            
        if target_hex.get("terrain") in ["Swamp", "Wasteland", "Desert", "Mountains"] and state.get("rations", 0) < 2:
            raise HTTPException(status_code=400, detail="Do nehostinného terénu potřebuješ alespoň 2 dávky zásob jídla.")
            
        # Deduct resources & rules of travel
        system_logs = []
        if state.get("rations", 0) < 1:
            penalty = 10
            state["hp"] = max(1, state.get("hp", 100) - penalty)
            system_logs.append(f"Hladovění při cestě: -{penalty} HP (žádné zásoby jídla!).")
        else:
            state["rations"] = max(0, state.get("rations", 1) - 1)
            system_logs.append("Spotřebována 1 dávka jídla na den cesty.")
            
        state["day"] = state.get("day", 1) + 1
        system_logs.append(f"Uplynul 1 den cesty (Den {state['day']}).")
        
        # Update player location
        state["playerLocation"] = {
            "q": req.target_q,
            "r": req.target_r,
            "kingdom_id": target_hex.get("kingdom_id"),
            "biome": target_hex.get("terrain", "Plains")
        }
        
        # Check for POI
        poi = next((l for l in locations if l.get("id") == f"{req.target_q}_{req.target_r}" or (l.get("q") == req.target_q and l.get("r") == req.target_r)), None)
        raw_poi = None
        if not poi and world_data.get("pois"):
            raw_poi = next((p for p in world_data["pois"] if p["q"] == req.target_q and p["r"] == req.target_r), None)
            
        dest_name = (poi.get("name") or poi.get("nazev")) if poi else (raw_poi.get("name") if raw_poi else f"{target_hex.get('terrain', 'Divočina')}")
        
        client = genai.Client(api_key=req.api_key if getattr(req, "api_key", None) and "DUMMY" not in req.api_key else os.environ.get("GEMINI_API_KEY"))
        
        prompt = f"""Hráč v D&D RPG (rasa: {state.get('race', 'Člověk')}, povolání: {state.get('dnd_class', 'Bojovník')}) se právě přesunul na mapě:
Cílový terén: {target_hex.get('terrain')}
Známý bod zájmu (POI): {json.dumps(poi or raw_poi, ensure_ascii=False) if (poi or raw_poi) else 'Běžná divočina/krajina'}
Hlavní zápletka světa: {world_data.get('main_plot', '')}

Vytvoř atmosférický popis cesty a příchodu pro Vypravěče a nabídni 3 smysluplné akce.
Vrať POUZE validní JSON:
{{
  "vypravec": "Atmosférické vylíčení cesty z pohledu vypravěče (3-4 věty). Co hráč cestou viděl, jaké bylo počasí a jaké tajemství či překážka se objevila při příchodu.",
  "popis_okoli": "Stručný popis nové oblasti (1-2 věty).",
  "nabizene_akce": ["První logická akce (průzkum / opatrnost)", "Druhá akce (využití schopnosti / kempování)", "Třetí odvážná akce"],
  "image_prompt": "vibrant fantasy landscape concept art of {target_hex.get('terrain')} in Aethelgard, detailed 2D painterly style, high quality"
}}"""

        try:
            resp = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            clean_text = resp.text.strip().removeprefix('```json').removesuffix('```').strip()
            ai_data = json.loads(clean_text)
        except Exception as ge:
            print("Gemini travel generate error:", ge)
            ai_data = {
                "vypravec": f"Po celodenní cestě jsi dorazil do oblasti {target_hex.get('terrain', 'divočiny')}. Krajina kolem tebe je tichá, vítr šelestí v trávě a na obzoru se stahují mračna.",
                "popis_okoli": f"Krajina: {target_hex.get('terrain', 'Pláně')}.",
                "nabizene_akce": ["Důkladně prozkoumat nejbližší okolí", "Rozdělat tábor a odpočinout si", "Připravit si zbraň a postupovat obezřetně"],
                "image_prompt": f"fantasy landscape {target_hex.get('terrain')}"
            }

        narrative_text = ai_data.get("vypravec", "")
        popis_okoli = ai_data.get("popis_okoli", f"Oblast: {target_hex.get('terrain')}")
        nabizene_akce = ai_data.get("nabizene_akce", ["Prozkoumat okolí", "Rozdělat tábor", "Jít dál"])
        image_prompt = ai_data.get("image_prompt", "")
        system_log_text = " | ".join(system_logs)

        # Append to narrative history
        history.append({"role": "user", "content": f"[CESTOVÁNÍ] Cesta do: {dest_name} ({req.target_q}, {req.target_r})"})
        history.append({"role": "model", "content": narrative_text})

        state["currentLocationDesc"] = popis_okoli
        state["popis_okoli"] = popis_okoli

        supabase.table("characters").update({
            "state": state,
            "history": history
        }).eq("api_key", db_key).execute()

        return {
            "status": "success",
            "state": state,
            "narrative": narrative_text,
            "popis_okoli": popis_okoli,
            "nabizene_akce": nabizene_akce,
            "image_prompt": image_prompt,
            "system_log": system_log_text,
            "destination_name": dest_name,
            "terrain_name": target_hex.get("terrain")
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Travel error:", e)
        raise HTTPException(status_code=500, detail=str(e))
