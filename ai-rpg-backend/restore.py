# coding: utf-8
import codecs

top_part = """from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
import os
import json
import uuid

app = FastAPI(title="AI RPG Game Master API")

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

class ListCharactersRequest(BaseModel):
    email: str

@app.post("/list-characters")
async def list_characters(req: ListCharactersRequest):
    try:
        db_res = supabase.table("characters").select("api_key, name, race, dnd_class, level, stats").ilike("api_key", f"{req.email}#%").execute()
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
    res = supabase.table("characters").select("id").eq("api_key", api_key).execute()
    if res.data:
        raise HTTPException(status_code=400, detail="Character already exists.")
    
    initial_history = [
        {"role": "model", "text": '{"vypravec": "Vitej v Aethelgardu! Jake bude tve prvni rozhodnuti?", "nabizene_akce": ["Rozhlednout se"], "zmeny_stavu": {"xp_zmena": 0, "davky_jidla_zmena": 0, "zlato_zmena": 0, "spell_slots_zmena": 0, "inventar_pridat": [], "inventar_odebrat_id": [], "ukoly": []}, "typ_lokace": "mesto", "aktualni_region": "Pocatecni vesnice", "vyznamna_mista": [], "popis_okoli": "", "image_prompt": "", "npc_dialogy": [], "system_log": "", "v_boji": False, "nepratele": [], "dulezita_fakta": []}'}
    ]
    state = {
        "hp": 100,
        "rations": 3,
        "inventory": [],
        "equipped": {},
        "skills": [],
        "quests": [],
        "locationType": "mesto",
        "currentRegion": "Pocatecni vesnice",
        "pointsOfInterest": [],
        "level": 1,
        "xp": 0
    }
    
    supabase.table("characters").insert({
        "api_key": api_key,
        "name": req.name,
        "dnd_class": req.dnd_class,
        "race": req.race,
        "level": 1,
        "stats": req.stats,
        "state": state,
        "history": initial_history
    }).execute()
    return {"status": "success", "api_key": api_key}

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
        api_key = f"{req.email}#{req.name}" if req.email else req.api_key
        db_res = supabase.table("characters").select("history, name, race, dnd_class, state").eq("api_key", api_key).execute()
        if not db_res.data:
            raise HTTPException(status_code=404, detail="Postava nenalezena.")
        
        char_data = db_res.data[0]
        history = char_data.get("history", [])
        
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
"""

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

idx = content.find("        # P")
if idx != -1:
    tail = content[idx:]
    with codecs.open("main.py", "w", "utf-8") as f:
        f.write(top_part + "\n" + tail)
    print("Repaired!")
else:
    print("Could not find tail!")
