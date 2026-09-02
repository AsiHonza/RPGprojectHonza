import random
import math
from perlin_noise import PerlinNoise

KINGDOMS = [
    {"id": "aurelie", "name": "Zlaté Císařství (Aurelie)", "base_terrain": "Plains"},
    {"id": "eldarion", "name": "Hvozd Stínů (Eldarion)", "base_terrain": "Forest"},
    {"id": "krag", "name": "Železné Vrcholky (Krag)", "base_terrain": "Mountains"},
    {"id": "gloomfen", "name": "Bažiny Zmaru (Gloomfen)", "base_terrain": "Swamp"},
    {"id": "aethel", "name": "Spálené Pustiny (Aethel)", "base_terrain": "Desert"},
    {"id": "free_cities", "name": "Azurové Pobřeží", "base_terrain": "Hills"},
    {"id": "the_scar", "name": "Mrtvá Zóna", "base_terrain": "Wasteland"} # Mrtvá zóna - můžeme mapovat na specifickou barvu na FE
]

def hex_distance(q1, r1, q2, r2):
    return (abs(q1 - q2) + abs(q1 + r1 - q2 - r2) + abs(r1 - r2)) / 2

def generate_world_data(radius: int = 15):
    """
    Generuje 30x30 hex mapu rozdělenou do 7 politických regionů (Voronoi).
    Každý region má specifický biom a své hlavní město.
    """
    hex_grid = []
    
    # 1. Vygenerovat prázdný grid
    for q in range(-radius, radius + 1):
        r1 = max(-radius, -q - radius)
        r2 = min(radius, -q + radius)
        for r in range(r1, r2 + 1):
            hex_grid.append({
                "q": q,
                "r": r,
                "terrain": "Plains",
                "region_id": None,
                "region_name": None,
                "is_poi": False,
                "has_road": False,
                "poi_type": None
            })

    # 2. Vybrat 7 vzdálených seedů pro království
    # The Scar uprostřed, zbytek dokola
    seeds = []
    # Index 6 je The Scar
    scar_hex = next(h for h in hex_grid if h["q"] == 0 and h["r"] == 0)
    seeds.append({"hex": scar_hex, "kingdom": KINGDOMS[6]})
    
    # Pro zbylých 6 království je rozložíme v kruhu zhruba ve vzdálenosti 10 od středu
    angle_step = 360 / 6
    for i in range(6):
        angle = math.radians(i * angle_step + random.uniform(-10, 10))
        dist = random.randint(8, 12)
        
        # approximate q, r from angle and distance
        # q = x * 2/3 / size, r = (-x / 3 + sqrt(3)/3 * y) / size... zjednodušíme
        # axial from polar:
        q = int(round(dist * math.cos(angle)))
        r = int(round(dist * math.sin(angle) - q/2))
        
        # clamp to bounds
        if q < -radius: q = -radius
        if q > radius: q = radius
        if r < -radius: r = -radius
        if r > radius: r = radius
        if q + r < -radius: r = -radius - q
        if q + r > radius: r = radius - q
        
        # Najít nejbližší hex, co reálně existuje v gridu
        closest_hex = min(hex_grid, key=lambda h: hex_distance(q, r, h["q"], h["r"]))
        seeds.append({"hex": closest_hex, "kingdom": KINGDOMS[i]})

    # 3. Voronoi - přiřadit každý hex k nejbližšímu seedu
    noise_elevation = PerlinNoise(octaves=5, seed=random.randint(1, 1000))
    
    for h in hex_grid:
        closest_seed = min(seeds, key=lambda s: hex_distance(h["q"], h["r"], s["hex"]["q"], s["hex"]["r"]))
        h["region_id"] = closest_seed["kingdom"]["id"]
        h["region_name"] = closest_seed["kingdom"]["name"]
        
        # Základní terén regionu + menší Perlin noise pro variabilitu
        base_terrain = closest_seed["kingdom"]["base_terrain"]
        nx = (h["q"] + radius) / (radius * 2)
        ny = (h["r"] + radius) / (radius * 2)
        local_noise = noise_elevation([nx, ny])
        
        # Aplikace variability
        if base_terrain == "Wasteland":
            h["terrain"] = "Mountains" if local_noise > 0.2 else "Swamp" if local_noise < -0.2 else "Wasteland"
        elif local_noise > 0.3:
            h["terrain"] = "Mountains" # Všude můžou být hory
        elif local_noise < -0.3 and base_terrain != "Desert":
            h["terrain"] = "Swamp"
        else:
            h["terrain"] = base_terrain

    # 4. Generování POI v regionech
    poi_list_for_ai = []
    
    for seed in seeds:
        region = seed["kingdom"]
        region_hexes = [h for h in hex_grid if h["region_id"] == region["id"] and h["terrain"] != "Mountains"]
        if not region_hexes:
            region_hexes = [h for h in hex_grid if h["region_id"] == region["id"]]
            
        # 1. Hlavní město na místě seedu (nebo nejbližším možném)
        capital = seed["hex"]
        capital["is_poi"] = True
        capital["poi_type"] = "Capital"
        poi_list_for_ai.append({"q": capital["q"], "r": capital["r"], "type": "Capital", "terrain": capital["terrain"], "region": region["name"]})
        
        # 2. Přidat 1-2 Vesnice/Města a 1-2 Ruiny do regionu
        available = [h for h in region_hexes if not h["is_poi"]]
        if available:
            towns = random.sample(available, min(2, len(available)))
            for t in towns:
                t["is_poi"] = True
                t["poi_type"] = random.choice(["City", "Village"])
                # Nechceme přetížit AI prompt, pošleme jen 1 další POI per region
            if len(towns) > 0:
                p = towns[0]
                poi_list_for_ai.append({"q": p["q"], "r": p["r"], "type": p["poi_type"], "terrain": p["terrain"], "region": region["name"]})

    # Cesty (A*) propojující města (Zjednodušeno pro rychlost)
    # ... ponecháme zatím prázdné nebo jen propojíme hlavní města
    return {
        "hex_radius": radius,
        "hex_grid": hex_grid,
        "pois": poi_list_for_ai
    }
