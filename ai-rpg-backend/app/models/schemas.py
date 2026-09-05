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
    id: Optional[str] = Field(default=None, description="Unikátní ID úkolu")
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
    vztah: str = Field(default="Neutrální", description="Vztah k hráči (Neutrální, Přátelský, Spojenec, Obezřetný, Nepřátelský)")
    povaha: Optional[str] = Field(default=None, description="Osobnost, tón řeči a manýry postavy (např. 'Podezíravý kupec, mluví šeptem a neustále si mne ruce')")
    motivace: Optional[str] = Field(default=None, description="Skrytá vnitřní potřeba či cíl postavy (např. 'Získat 30 zlaťáků na vyplacení bratra z vězení')")
    odhalene_tajemstvi: Optional[str] = Field(default=None, description="Tajemství nebo zranitelnost odhalená hráčem. Pokud dosud nebylo odhaleno, nechat null/prázdné")
    duvera: int = Field(default=0, description="Stupeň důvěry k hráči (-10 až +10)")

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

class CombatEnemy(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unikátní ID nepřítele")
    name: str = Field(description="Jméno nepřítele")
    hp: int = Field(description="Aktuální zdraví")
    max_hp: int = Field(description="Maximální zdraví")
    ac: int = Field(description="Obranné číslo (Armor Class)")
    intent: str = Field(default="attack", description="Záměr pro první kolo: 'attack', 'defend', 'heavy_attack', 'idle'")
    intentDamage: int = Field(default=0, description="Předpokládané zranění, pokud je intent attack")
    status: str = Field(default="none", description="Aktuální stav (none, bleeding, stunned, burning)")

class NPCDialog(BaseModel):
    jmeno: str
    pohlavi: str
    image_prompt: str
    text: str

class HexMutation(BaseModel):
    stav: Optional[str] = Field(default=None, description="Nový stav lokace: např. 'vycisteno', 'spojenci', 'zniceno', 'obchodni_cesta'")
    popis: Optional[str] = Field(default=None, description="Stručný popis změny na lokaci")

class DMResponse(BaseModel):
    nova_scena: bool = Field(default=False, description="Nastav na true POUZE pokud se radikálně změnilo prostředí nebo hráč vstoupil do nové budovy/lokace")
    typ_lokace: Optional[str] = Field(default=None, description="Vyplň pouze při změně lokace (mesto, vesnice, divocina, dungeon)")
    aktualni_region: Optional[str] = Field(default=None, description="Vyplň pouze při změně regionu")
    vyznamna_mista: Optional[List[PointOfInterest]] = Field(default=[], description="Vyplň POUZE při nova_scena: true, jinak nech prázdné")
    popis_okoli: Optional[str] = Field(default=None, description="Vyplň POUZE při nova_scena: true, jinak nech prázdné nebo null")
    image_prompt: Optional[str] = Field(default=None, description="Vyplň POUZE pokud je potřeba vygenerovat nový obrázek scény (při změně scény)")
    novy_zapis_do_deniku: Optional[str] = Field(default=None)
    vypravec: str
    npc_dialogy: List[NPCDialog] = []
    system_log: str
    zmeny_stavu: StateChanges
    nabizene_akce: List[str]
    v_boji: bool = Field(default=False, description="Pokud začal boj, nastav na true")
    nepratele: List[CombatEnemy] = Field(default=[], description="Seznam nepřátel v boji, pokud v_boji je true")
    dulezita_fakta: List[str] = Field(default=[], description="Trvalá fakta, sliby NPC, nová zjištění pro dlouhodobou paměť světa")
    reputace_zmena: Optional[Dict[str, int]] = Field(default=None, description="Změny reputace u frakcí, např. {'valerium': -5, 'solarian': 10}")
    hex_mutace: Optional[HexMutation] = Field(default=None, description="Pokud tato akce trvale změnila tento hex na mapě (např. vyčištěn dungeon)")
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
    email: Optional[str] = ""
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
    stats: Optional[dict] = None
    email: Optional[str] = "hrac@aelthgard.com"
    game_mode: Optional[str] = "campaign"
    api_key: Optional[str] = "DUMMY"
    backstory: Optional[Any] = ""

class PlayerActionRequest(BaseModel):
    email: str
    name: str
    action: Optional[str] = None
    action_text: Optional[str] = None
    api_key: Optional[str] = "DUMMY"
    level: Optional[int] = 1
    stats: Optional[Dict[str, Any]] = None
    skills: Optional[List[Any]] = None

class CombatResolutionRequest(BaseModel):
    email: str
    name: str
    api_key: Optional[str] = "DUMMY"
    combat_log: List[str]
    player_hp: int
    enemies: List[CombatEnemy]
    level: Optional[int] = 1
    dnd_class: Optional[str] = "Bojovník"

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
