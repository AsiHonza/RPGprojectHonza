from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid

class Item(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(description="Název předmětu")
    description: str = Field(default="", description="Krátký popis nebo historie předmětu")
    type: str = Field(default="cennost", description="Typ: 'zbraň', 'zbroj', 'doplněk', 'lektvar', 'cennost'")
    slot: str = Field(default="žádný", description="Slot: 'hlavní ruka', 'druhá ruka', 'hruď', 'hlava', 'prsten', 'krk', 'žádný'")
    rarity: str = Field(default="common", description="Rarita: 'common', 'uncommon', 'rare', 'epic', 'legendary'")
    icon: str = Field(default="Package", description="Ikona: 'Sword', 'Shield', 'Shirt', 'Wand', 'Ring', 'Potion', 'Package'")
    sell_price: int = Field(default=5, description="Cena ve zlaťácích")
    attack_bonus: int = Field(default=0, description="Bonus k útoku (+1, +2)")
    defense_bonus: int = Field(default=0, description="Bonus k obraně/AC (+1, +2)")
    healing_amount: int = Field(default=0, description="Léčení pro lektvary (např. 25)")
    stats: str = Field(default="", description="Stručný přehled vlastností (např. 'Útok +1')")

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
    vztah: str = Field(description="Vztah k hraci")

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
    zname_postavy_zmena: List[NPCRecord] = Field(default=[])

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
    novy_zapis_do_deniku: Optional[str] = Field(default=None)
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

class AuthRequest(BaseModel):
    email: str

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

class ListCharactersRequest(BaseModel):
    email: str

class LoadGameRequest(BaseModel):
    email: str
    name: str

class DeleteCharacterRequest(BaseModel):
    email: str
    name: str

class SaveStateRequest(BaseModel):
    email: str
    name: str
    state: dict

class WorldLocation(BaseModel):
    id: str = Field(description="Unikatni ID")
    typ: str = Field(description="hlavni_mesto, mesto, vesnice, zajimavost")
    nazev: str
    popis: str
    tajemstvi_nebo_problem: str
    x: int
    y: int

class CampaignNPC(BaseModel):
    jmeno: str
    lokace_id: str
    popis: str
    skryty_motiv: str

class CampaignWorld(BaseModel):
    main_plot: str
    locations: List[WorldLocation]
    key_npcs: List[CampaignNPC]

class CharacterCreateRequest(BaseModel):
    name: str
    dnd_class: str
    race: str
    stats: dict
    email: str
    game_mode: str = "sandbox"
    api_key: str

class PlayerActionRequest(BaseModel):
    email: str
    name: str
    action: Optional[str] = None
    action_text: Optional[str] = None
    api_key: Optional[str] = "DUMMY"
    level: Optional[int] = 1
    stats: Optional[Dict[str, Any]] = None
    skills: Optional[List[Any]] = None

class TravelRequest(BaseModel):
    email: str
    name: str
    target_q: int
    target_r: int
    api_key: Optional[str] = "DUMMY"
    destination_q: Optional[int] = None
    destination_r: Optional[int] = None
    kingdom_id: Optional[str] = None
    biome: Optional[str] = None


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

dm_schema_dict = DMResponse.model_json_schema()
clean_schema(dm_schema_dict)
