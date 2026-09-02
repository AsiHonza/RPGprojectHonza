import random
import math
from perlin_noise import PerlinNoise

def generate_world_data(radius: int = 15):
    """
    Generuje hexagonální síť o daném poloměru (výchozí 15 = cca 30x30 hexů).
    Využívá Perlin noise pro výšku a vlhkost, čímž vznikají logické biomy.
    """
    # 1. Setup Perlin noise generators
    seed1 = random.randint(1, 100000)
    seed2 = random.randint(1, 100000)
    noise_elevation = PerlinNoise(octaves=3, seed=seed1)
    noise_moisture = PerlinNoise(octaves=3, seed=seed2)
    
    hex_grid = []
    poi_candidates = []
    
    # Generate Hexagonal Grid (axial coordinates)
    for q in range(-radius, radius + 1):
        r1 = max(-radius, -q - radius)
        r2 = min(radius, -q + radius)
        for r in range(r1, r2 + 1):
            # Normalizované souřadnice pro Perlin Noise
            nx = (q + radius) / (radius * 2)
            ny = (r + radius) / (radius * 2)
            
            elevation = noise_elevation([nx, ny])
            moisture = noise_moisture([nx, ny])
            
            # Determine terrain type
            terrain = "Plains"
            if elevation > 0.2:
                terrain = "Mountains"
            elif elevation > 0.05:
                terrain = "Hills"
            elif elevation < -0.2:
                terrain = "Swamp"
            else:
                if moisture > 0.1:
                    terrain = "Forest"
                elif moisture < -0.1:
                    terrain = "Desert"
                    
            hex_data = {
                "q": q,
                "r": r,
                "elevation": elevation,
                "moisture": moisture,
                "terrain": terrain,
                "is_poi": False,
                "has_road": False,
                "poi_type": None
            }
            hex_grid.append(hex_data)
            
            if terrain != "Mountains" and terrain != "Swamp":
                poi_candidates.append(hex_data)

    # 2. Add POIs (Points of Interest)
    # Rozprostřeme POI napříč obrovskou mapou. Dáme jich cca 10 hlavních, zbytek budou minoritní (přidávané později)
    num_pois = min(12, len(poi_candidates))
    pois = random.sample(poi_candidates, num_pois)
    poi_types = ['Capital', 'City', 'City', 'Ruins', 'Ruins', 'Village', 'Village', 'Village', 'Camp', 'Camp', 'Temple', 'Tower']
    
    for i, p in enumerate(pois):
        # Najdeme tento hex v gridu a označíme ho
        for h in hex_grid:
            if h["q"] == p["q"] and h["r"] == p["r"]:
                h["is_poi"] = True
                h["poi_type"] = poi_types[i] if i < len(poi_types) else 'Unknown'
                break
                
    # 3. Pathfinding (A*) to connect some POIs with roads
    def hex_distance(a, b):
        return (abs(a["q"] - b["q"]) + abs(a["q"] + a["r"] - b["q"] - b["r"]) + abs(a["r"] - b["r"])) / 2

    def get_neighbors(hex_data):
        directions = [(1, 0), (1, -1), (0, -1), (-1, 0), (-1, 1), (0, 1)]
        neighbors = []
        for dq, dr in directions:
            nq, nr = hex_data["q"] + dq, hex_data["r"] + dr
            # Najít souseda
            neighbor = next((h for h in hex_grid if h["q"] == nq and h["r"] == nr), None)
            if neighbor and neighbor["terrain"] != "Mountains": # Nelze stavět cesty přes hory
                neighbors.append(neighbor)
        return neighbors

    # Connect a few POIs together
    for i in range(len(pois) - 1):
        start = pois[i]
        end = pois[i+1]
        
        # Simple A*
        open_set = [start]
        came_from = {}
        g_score = {f"{h['q']},{h['r']}": float('inf') for h in hex_grid}
        g_score[f"{start['q']},{start['r']}"] = 0
        
        while open_set:
            # Sort by f_score (g_score + heuristic)
            open_set.sort(key=lambda h: g_score[f"{h['q']},{h['r']}"] + hex_distance(h, end))
            current = open_set.pop(0)
            
            if current["q"] == end["q"] and current["r"] == end["r"]:
                # Reconstruct path
                curr = current
                while f"{curr['q']},{curr['r']}" in came_from:
                    for h in hex_grid:
                        if h["q"] == curr["q"] and h["r"] == curr["r"]:
                            h["has_road"] = True
                            break
                    curr = came_from[f"{curr['q']},{curr['r']}"]
                break
                
            for neighbor in get_neighbors(current):
                # Penalty for swamps and hills
                cost = 1
                if neighbor["terrain"] == "Swamp": cost = 3
                if neighbor["terrain"] == "Hills": cost = 2
                
                tentative_g_score = g_score[f"{current['q']},{current['r']}"] + cost
                n_key = f"{neighbor['q']},{neighbor['r']}"
                if tentative_g_score < g_score[n_key]:
                    came_from[n_key] = current
                    g_score[n_key] = tentative_g_score
                    if neighbor not in open_set:
                        open_set.append(neighbor)

    # Simplified list for AI prompt (only major POIs so we don't blow up context limit)
    # The frontend gets all 900 hexes, but Gemini only gets the ~10 POIs to invent Lore for!
    poi_list_for_ai = [{"q": h["q"], "r": h["r"], "type": h["poi_type"], "terrain": h["terrain"]} for h in hex_grid if h["is_poi"]]

    return {
        "hex_radius": radius,
        "hex_grid": hex_grid,
        "pois": poi_list_for_ai
    }
