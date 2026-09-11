import random
import math
from perlin_noise import PerlinNoise

def hex_distance(q1, r1, q2, r2):
    return (abs(q1 - q2) + abs(q1 + r1 - q2 - r2) + abs(r1 - r2)) // 2

def get_neighbors(q, r, radius):
    dirs = [(1, 0), (1, -1), (0, -1), (-1, 0), (-1, 1), (0, 1)]
    neighbors = []
    for dq, dr in dirs:
        nq, nr = q + dq, r + dr
        if hex_distance(0, 0, nq, nr) <= radius:
            neighbors.append((nq, nr))
    return neighbors

CANONICAL_POIS = [
    {
        "q": 0, "r": 0,
        "name": "Oakhaven (Město)",
        "node_id": "oakhaven",
        "poi": "Capital",
        "terrain": "Plains",
        "kingdom_id": 1,
        "description": "Rušné pohraniční městečko na křižovatce obchodních cest. Vůně čerstvého chleba a kovárna."
    },
    {
        "q": 2, "r": -1,
        "name": "Stará křižovatka",
        "node_id": "crossroads",
        "poi": "Village",
        "terrain": "Plains",
        "kingdom_id": 1,
        "description": "Prastará křižovatka dlážděná omšelými valerijskými kvádry se zvětralým obeliskem."
    },
    {
        "q": -2, "r": -2,
        "name": "Opuštěný důl",
        "node_id": "old_mine",
        "poi": "Dungeon",
        "terrain": "Mountains",
        "kingdom_id": 6,
        "description": "Bývalý stříbrný a železný důl patřící pod dohled cechu z Železného Prahu."
    },
    {
        "q": 3, "r": -2,
        "name": "Temný hvozd",
        "node_id": "dark_forest",
        "poi": "Shrine",
        "terrain": "Forest",
        "kingdom_id": 3,
        "description": "Prastarý hvozd pod duchovní patronací bohyně Vyldie. Vlci a prastaré stromy."
    },
    {
        "q": 3, "r": 1,
        "name": "Ruiny kláštera",
        "node_id": "monastery_ruins",
        "poi": "Ruin",
        "terrain": "Forest",
        "kingdom_id": 1,
        "description": "Rozpadlé zbytky opatství sv. Judity zničeného během jediné noci."
    },
    {
        "q": 5, "r": -3,
        "name": "Skrytý tábor elfů",
        "node_id": "elf_camp",
        "poi": "Village",
        "terrain": "Forest",
        "kingdom_id": 3,
        "description": "Předsunutá základna lesních elfů postavená vysoko ve větvích gigantických tisů."
    }
]

def generate_world_data(radius: int = 7, kingdoms_count: int = 3):
    """
    Generates the Act 1 world map: Oakhaven Valley.
    - Default radius: 7 (~169 hexes)
    - Center (0, 0) is deterministically locked to Oakhaven (Capital of region, Kingdom 1)
    - Canonical locations from Obsidian are placed at fixed strategic coordinates
    - Mountain and water borders ring the valley at radius >= 6
    """
    hex_grid = {}
    noise_elev = PerlinNoise(octaves=3, seed=random.randint(1, 100000))
    noise_moist = PerlinNoise(octaves=3, seed=random.randint(1, 100000))

    # Fast map lookup for canonical points
    canon_map = {(p["q"], p["r"]): p for p in CANONICAL_POIS}

    # 1. Initialize Hex Grid
    for q in range(-radius, radius + 1):
        r1 = max(-radius, -q - radius)
        r2 = min(radius, -q + radius)
        for r in range(r1, r2 + 1):
            dist_from_center = hex_distance(0, 0, q, r)
            
            # Canonical override
            if (q, r) in canon_map:
                c = canon_map[(q, r)]
                hex_grid[(q, r)] = {
                    "q": q, "r": r,
                    "terrain": c["terrain"],
                    "kingdom_id": c["kingdom_id"],
                    "poi": c["poi"],
                    "name": c["name"],
                    "node_id": c.get("node_id"),
                    "description": c.get("description")
                }
                continue

            # Natural valley border: Ring the outer edge (radius >= 6) with mountains / impassable peaks
            if dist_from_center >= radius - 1:
                # 80% chance of mountains forming the natural valley wall
                if random.random() < 0.75:
                    terrain = "Mountains"
                elif random.random() < 0.5:
                    terrain = "Forest"
                else:
                    terrain = "Wasteland"
            else:
                # Internal valley terrain via Perlin noise
                nx = (q + radius) / (radius * 2)
                ny = (r + radius) / (radius * 2)
                e = max(0, min(1, noise_elev([nx, ny]) + 0.5))
                m = max(0, min(1, noise_moist([nx, ny]) + 0.5))

                # Mountains in high elevation, forest in moist areas, plains elsewhere
                if e > 0.8:
                    terrain = "Mountains"
                elif m > 0.55:
                    terrain = "Forest"
                elif m < 0.25 and e < 0.35:
                    terrain = "Swamp"
                else:
                    terrain = "Plains"

            hex_grid[(q, r)] = {
                "q": q, "r": r,
                "terrain": terrain,
                "kingdom_id": 1,  # Default to Kingdom 1 (Valerijské Impérium)
                "poi": None,
                "name": None,
                "node_id": None,
                "description": None
            }

    # 2. Territorial Voronoi for Kingdoms (Kingdom 1: Valerijské Impérium, 3: Kmeny z hvozdu, 6: Železný Práh)
    queue = [
        (0, 0, 1, 0),      # Oakhaven -> Valerijské Impérium
        (4, -3, 3, 0),     # Dark Forest / Elf Camp -> Kmeny z hvozdu
        (-3, -2, 6, 0),    # Old Mine -> Železný Práh border
    ]
    visited = {(q, r): 0 for q, r, _, _ in queue}

    while queue:
        queue.sort(key=lambda x: x[3])
        q, r, k_id, cost = queue.pop(0)

        for nq, nr in get_neighbors(q, r, radius):
            neighbor = hex_grid.get((nq, nr))
            if not neighbor: continue
            
            # Don't overwrite canonical POI kingdom assignments
            if (nq, nr) in canon_map:
                continue

            move_cost = 4 if neighbor["terrain"] == "Mountains" else 2 if neighbor["terrain"] == "Forest" else 1
            new_cost = cost + move_cost

            if (nq, nr) not in visited or new_cost < visited[(nq, nr)]:
                visited[(nq, nr)] = new_cost
                neighbor["kingdom_id"] = k_id
                queue.append((nq, nr, k_id, new_cost))

    # 3. Scatter 2-3 Minor Wild POIs (Shrines, Camps, Ruins)
    open_hexes = [
        h for h in hex_grid.values() 
        if h["poi"] is None 
        and hex_distance(0, 0, h["q"], h["r"]) > 1 
        and hex_distance(0, 0, h["q"], h["r"]) < radius - 1
    ]
    random.shuffle(open_hexes)

    minor_types = [
        ("Shrine", "Svatyně Solariana u cesty", "Malý oltář s věčným plamenem, kde pocestní zanechávají měďáky pro bezpečný návrat."),
        ("Ruin", "Zbořená strážní věž", "Kamenný základ staré valerijské hlásky, dnes zarostlý trním a vřesem."),
        ("Village", "Opuková samota", "Hlouček dřevěných chatrčí uhlířů a dřevorubců na kraji lesa.")
    ]

    for p_type, p_name, p_desc in minor_types:
        if open_hexes:
            target = open_hexes.pop()
            target["poi"] = p_type
            target["name"] = p_name
            target["description"] = p_desc

    # 4. Prepare POI List
    pois = []
    for h in hex_grid.values():
        if h["poi"] is not None:
            pois.append({
                "q": h["q"],
                "r": h["r"],
                "type": h["poi"],
                "name": h.get("name"),
                "node_id": h.get("node_id"),
                "description": h.get("description"),
                "terrain": h["terrain"],
                "kingdom_id": h["kingdom_id"]
            })

    return {
        "hex_radius": radius,
        "hex_grid": list(hex_grid.values()),
        "pois": pois
    }

if __name__ == "__main__":
    world = generate_world_data()
    print(f"Generated {len(world['hex_grid'])} hexes and {len(world['pois'])} POIs.")
    for p in world['pois']:
        print(f"  - [{p['q']}, {p['r']}] {p.get('name')} ({p['type']}) - Kingdom {p['kingdom_id']}")
