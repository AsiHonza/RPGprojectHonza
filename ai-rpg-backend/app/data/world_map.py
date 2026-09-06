WORLD_NODES = {
    "oakhaven": {
        "id": "oakhaven",
        "name": "Oakhaven (Město)",
        "type": "mesto",
        "x": 200,
        "y": 300,
        "description": "Nacházíš se v Oakhaven, rušném obchodním městečku na křižovatce obchodních cest. Vůně čerstvého chleba se tu mísí s pachem stájí. Kolem náměstí stojí bytelný hostinec 'U Zlomeného štítu' a nedaleko kovárna. Místní stráže se tváří ostražitě.",
        "connections": ["crossroads", "old_mine"]
    },
    "crossroads": {
        "id": "crossroads",
        "name": "Stará křižovatka",
        "type": "divocina",
        "x": 350,
        "y": 250,
        "description": "Došel jsi na rozcestí starých dlážděných cest. Kámen je zarostlý mechem a dřevěný ukazatel napůl sežraný hnilobou. Je tu podezřelý klid, sem tam jen krákne vrána.",
        "connections": ["oakhaven", "dark_forest", "ruins"]
    },
    "old_mine": {
        "id": "old_mine",
        "name": "Opuštěný důl",
        "type": "dungeon",
        "x": 100,
        "y": 200,
        "description": "Stojíš před temným ústím starého trpasličího dolu. Výdřeva už dávno ztrouchnivěla a z hlubin táhne ledový průvan, nesoucí pach plísně a... krve.",
        "connections": ["oakhaven"]
    },
    "dark_forest": {
        "id": "dark_forest",
        "name": "Temný hvozd",
        "type": "divocina",
        "x": 500,
        "y": 150,
        "description": "Stromy se tyčí do nebe jako pokroucené pařáty. Koruny jsou tak husté, že sem proniká jen minimum slunečního svitu. Z podrostu tě sledují oči, které nedokážeš identifikovat.",
        "connections": ["crossroads", "elven_camp"]
    },
    "ruins": {
        "id": "ruins",
        "name": "Ruiny kláštera",
        "type": "dungeon",
        "x": 400,
        "y": 400,
        "description": "Rozpadající se zdi kdysi hrdého kláštera pohlcuje břečťan. Sochy dávných bohů mají uražené tváře a mezi rozbitými náhrobky se valí podivná nazelenalá mlha.",
        "connections": ["crossroads"]
    },
    "elven_camp": {
        "id": "elven_camp",
        "name": "Skrytý tábor elfů",
        "type": "vesnice",
        "x": 650,
        "y": 80,
        "description": "Mezi stromy, téměř neviditelně, se rozkládají jemné dřevěné plošiny elfího tábora. Ve vzduchu voní byliny a elfí stráže s luky na tebe z výšky mlčky dohlíží.",
        "connections": ["dark_forest"]
    }
}

def get_node(node_id: str):
    return WORLD_NODES.get(node_id)
