import json
from pathlib import Path

# Paths to generated data
GENERATED_DIR = Path(__file__).resolve().parent / "generated"
WORLD_MAP_FILE = GENERATED_DIR / "world_map.json"
NPCS_FILE = GENERATED_DIR / "npcs.json"
QUESTS_FILE = GENERATED_DIR / "quests.json"
FACTIONS_FILE = GENERATED_DIR / "factions.json"
LORE_FILE = GENERATED_DIR / "lore_context.json"

def _load_json(file_path: Path, default: dict) -> dict:
    if file_path.exists():
        try:
            return json.loads(file_path.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
    return default

# Fallback nodes if generated file is missing
_FALLBACK_NODES = {
    "oakhaven": {
        "id": "oakhaven",
        "name": "Oakhaven (Město)",
        "type": "mesto",
        "x": 20,
        "y": 50,
        "description": "Nacházíš se v Oakhaven, rušném obchodním městečku na křižovatce obchodních cest. Vůně čerstvého chleba se tu mísí s pachem stájí. Kolem náměstí stojí bytelný hostinec 'U Zlomeného štítu' a nedaleko kovárna. Místní stráže se tváří ostražitě.",
        "connections": ["crossroads", "old_mine"],
        "npcs": ["boris_mlynar", "strazmistr_aldric"],
        "quests": ["Q001", "Q101"]
    },
    "crossroads": {
        "id": "crossroads",
        "name": "Stará křižovatka",
        "type": "divocina",
        "x": 45,
        "y": 35,
        "description": "Došel jsi na rozcestí starých dlážděných cest. Kámen je zarostlý mechem a dřevěný ukazatel napůl sežraný hnilobou. Je tu podezřelý klid, sem tam jen krákne vrána.",
        "connections": ["oakhaven", "dark_forest", "monastery_ruins"],
        "npcs": [],
        "quests": ["Q001"]
    },
    "old_mine": {
        "id": "old_mine",
        "name": "Opuštěný důl",
        "type": "dungeon",
        "x": 10,
        "y": 30,
        "description": "Stojíš před temným ústím starého trpasličího dolu. Výdřeva už dávno ztrouchnivěla a z hlubin táhne ledový průvan, nesoucí pach plísně a... krve.",
        "connections": ["oakhaven"],
        "npcs": [],
        "quests": []
    },
    "dark_forest": {
        "id": "dark_forest",
        "name": "Temný hvozd",
        "type": "divocina",
        "x": 70,
        "y": 20,
        "description": "Stromy se tyčí do nebe jako pokroucené pařáty. Koruny jsou tak husté, že sem proniká jen minimum slunečního svitu. Z podrostu tě sledují oči, které nedokážeš identifikovat.",
        "connections": ["crossroads", "elf_camp"],
        "npcs": [],
        "quests": ["Q101"]
    },
    "monastery_ruins": {
        "id": "monastery_ruins",
        "name": "Ruiny kláštera",
        "type": "dungeon",
        "x": 65,
        "y": 55,
        "description": "Rozpadající se zdi kdysi hrdého kláštera pohlcuje břečťan. Sochy dávných bohů mají uražené tváře a mezi rozbitými náhrobky se valí podivná nazelenalá mlha.",
        "connections": ["crossroads"],
        "npcs": [],
        "quests": []
    },
    "elf_camp": {
        "id": "elf_camp",
        "name": "Skrytý tábor elfů",
        "type": "vesnice",
        "x": 90,
        "y": 15,
        "description": "Mezi stromy, téměř neviditelně, se rozkládají jemné dřevěné plošiny elfího tábora. Ve vzduchu voní byliny a elfí stráže s luky na tebe z výšky mlčky dohlíží.",
        "connections": ["dark_forest"],
        "npcs": [],
        "quests": []
    }
}

def get_all_nodes() -> dict:
    return _load_json(WORLD_MAP_FILE, _FALLBACK_NODES)

def get_node(node_id: str):
    nodes = get_all_nodes()
    return nodes.get(node_id)

def get_all_npcs() -> dict:
    return _load_json(NPCS_FILE, {})

def get_npc(npc_id: str):
    return get_all_npcs().get(npc_id)

def get_all_quests() -> dict:
    return _load_json(QUESTS_FILE, {})

def get_quest(quest_id: str):
    return get_all_quests().get(quest_id)

def get_all_factions() -> dict:
    return _load_json(FACTIONS_FILE, {})

def get_lore_context() -> dict:
    return _load_json(LORE_FILE, {})

