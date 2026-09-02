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

def generate_world_data(radius: int = 15, kingdoms_count: int = 7):
    # 1. Initialize Hex Grid
    hex_grid = {}
    noise_elev = PerlinNoise(octaves=4, seed=random.randint(1, 100000))
    noise_moist = PerlinNoise(octaves=4, seed=random.randint(1, 100000))

    for q in range(-radius, radius + 1):
        r1 = max(-radius, -q - radius)
        r2 = min(radius, -q + radius)
        for r in range(r1, r2 + 1):
            # Normalize coordinates for noise
            nx = (q + radius) / (radius * 2)
            ny = (r + radius) / (radius * 2)
            
            e = max(0, min(1, noise_elev([nx, ny]) + 0.5))
            m = max(0, min(1, noise_moist([nx, ny]) + 0.5))
            
            if e < 0.35: terrain = "Ocean"
            elif e > 0.75: terrain = "Mountains"
            else:
                if m < 0.4: terrain = "Wasteland"
                elif m > 0.65: terrain = "Swamp"
                elif m > 0.5: terrain = "Forest"
                else: terrain = "Plains"

            hex_grid[(q, r)] = {
                "q": q, "r": r,
                "terrain": terrain,
                "kingdom_id": None,
                "poi": None
            }

    # 2. Select Capitals
    land_hexes = [h for h in hex_grid.values() if h["terrain"] not in ["Ocean", "Mountains"]]
    capitals = []
    
    attempts = 0
    while len(capitals) < kingdoms_count and attempts < 2000:
        candidate = random.choice(land_hexes)
        attempts += 1
        too_close = any(hex_distance(candidate["q"], candidate["r"], cap["q"], cap["r"]) < 6 for cap in capitals)
        if not too_close:
            candidate["poi"] = "Capital"
            capitals.append(candidate)
            
    while len(capitals) < kingdoms_count:
        candidate = random.choice([h for h in land_hexes if h["poi"] != "Capital"])
        candidate["poi"] = "Capital"
        capitals.append(candidate)

    # 3. Voronoi Expansion (A*)
    queue = []
    for i, cap in enumerate(capitals):
        cap["kingdom_id"] = i + 1
        queue.append((cap["q"], cap["r"], i + 1, 0))
        
    visited = {(cap["q"], cap["r"]): 0 for cap in capitals}

    while queue:
        queue.sort(key=lambda x: x[3])
        q, r, k_id, cost = queue.pop(0)
        
        for nq, nr in get_neighbors(q, r, radius):
            neighbor = hex_grid[(nq, nr)]
            if neighbor["terrain"] == "Ocean": continue
                
            move_cost = 4 if neighbor["terrain"] == "Mountains" else 2 if neighbor["terrain"] == "Swamp" else 1
            new_cost = cost + move_cost
            
            if (nq, nr) not in visited or new_cost < visited[(nq, nr)]:
                visited[(nq, nr)] = new_cost
                neighbor["kingdom_id"] = k_id
                queue.append((nq, nr, k_id, new_cost))

    # 4. Scatter POIs per Kingdom
    for k_id in range(1, kingdoms_count + 1):
        k_hexes = [h for h in hex_grid.values() if h["kingdom_id"] == k_id and h["poi"] is None]
        random.shuffle(k_hexes)
        
        # Villages
        villages = 0
        for h in k_hexes:
            if h["terrain"] in ["Plains", "Forest"] and h["poi"] is None:
                h["poi"] = "Village"
                villages += 1
            if villages >= random.randint(2, 3): break
                
        # Dungeons
        dungeons = 0
        for h in k_hexes:
            if h["terrain"] in ["Mountains", "Swamp", "Wasteland"] and h["poi"] is None:
                h["poi"] = "Dungeon"
                dungeons += 1
            if dungeons >= random.randint(1, 2): break

        # Shrine
        for h in k_hexes:
            if h["terrain"] != "Ocean" and h["poi"] is None:
                h["poi"] = "Shrine"
                break
                
        # Ruin
        for h in k_hexes:
            if h["terrain"] in ["Forest", "Swamp", "Wasteland"] and h["poi"] is None:
                h["poi"] = "Ruin"
                break

    # Prepare final output
    pois = []
    for h in hex_grid.values():
        if h["poi"] is not None:
            pois.append({
                "q": h["q"],
                "r": h["r"],
                "type": h["poi"],
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
