import json
import random
import math
from perlin_noise import PerlinNoise

WIDTH = 25
HEIGHT = 20
KINGDOMS_COUNT = 7

def get_hex_distance(r1, c1, r2, c2):
    # Convert offset to axial coordinates (odd-r horizontal layout)
    q1 = c1 - (r1 - (r1 & 1)) // 2
    r_1 = r1
    
    q2 = c2 - (r2 - (r2 & 1)) // 2
    r_2 = r2
    
    return (abs(q1 - q2) + abs(q1 + r_1 - q2 - r_2) + abs(r_1 - r_2)) // 2

def generate_map():
    # 1. Noise maps
    noise_elev = PerlinNoise(octaves=3, seed=random.randint(1, 100000))
    noise_moist = PerlinNoise(octaves=4, seed=random.randint(1, 100000))
    
    grid = []
    
    # 2. Base Terrain
    for r in range(HEIGHT):
        row = []
        for c in range(WIDTH):
            # normalized roughly -0.5 to 0.5, shift to 0 to 1
            e = noise_elev([c/WIDTH, r/HEIGHT]) + 0.5
            m = noise_moist([c/WIDTH, r/HEIGHT]) + 0.5
            
            # Simple clamping
            e = max(0, min(1, e))
            m = max(0, min(1, m))
            
            terrain = "plains"
            if e < 0.35:
                terrain = "ocean"
            elif e > 0.75:
                terrain = "mountains"
            else:
                if m < 0.4:
                    terrain = "wasteland"
                elif m > 0.65:
                    terrain = "swamp"
                elif m > 0.5:
                    terrain = "forest"
                else:
                    terrain = "plains"
                    
            row.append({
                "q": c - (r - (r & 1)) // 2, # Axial coords for Honeycomb
                "r": r,
                "row": r,
                "col": c,
                "terrain": terrain,
                "kingdom_id": None,
                "is_capital": False
            })
        grid.append(row)
        
    # 3. Find 7 Capitals (Must be land, spread out)
    land_hexes = [h for row in grid for h in row if h["terrain"] != "ocean" and h["terrain"] != "mountains"]
    capitals = []
    
    # Try to place capitals spread out
    attempts = 0
    while len(capitals) < KINGDOMS_COUNT and attempts < 1000:
        candidate = random.choice(land_hexes)
        attempts += 1
        
        # Check distance to other capitals
        too_close = False
        for cap in capitals:
            dist = get_hex_distance(candidate["row"], candidate["col"], cap["row"], cap["col"])
            if dist < 4:  # Minimum distance between kingdoms
                too_close = True
                break
                
        if not too_close:
            candidate["is_capital"] = True
            capitals.append(candidate)
            
    # If we couldn't find 7 spread out, just pick random remaining
    while len(capitals) < KINGDOMS_COUNT:
        candidate = random.choice([h for h in land_hexes if not h["is_capital"]])
        candidate["is_capital"] = True
        capitals.append(candidate)

    # 4. Voronoi expansion for borders (BFS from capitals)
    queue = []
    for i, cap in enumerate(capitals):
        cap["kingdom_id"] = i + 1
        queue.append((cap["row"], cap["col"], i + 1, 0)) # row, col, kingdom, cost
        
    # BFS
    visited = {}
    for cap in capitals:
        visited[(cap["row"], cap["col"])] = 0
        
    # Standard hex neighbor offsets for odd-r
    # Even rows: [0, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [1, 1]
    # Odd rows:  [-1, -1], [0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1]
    
    def get_neighbors(r, c):
        if r % 2 == 0:
            dirs = [(0, -1), (1, -1), (-1, 0), (1, 0), (0, 1), (1, 1)]
        else:
            dirs = [(-1, -1), (0, -1), (-1, 0), (1, 0), (-1, 1), (0, 1)]
            
        res = []
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < HEIGHT and 0 <= nc < WIDTH:
                res.append((nr, nc))
        return res

    while queue:
        # Sort by cost so it acts like Dijkstra
        queue.sort(key=lambda x: x[3])
        r, c, k_id, cost = queue.pop(0)
        
        for nr, nc in get_neighbors(r, c):
            neighbor = grid[nr][nc]
            
            # Water stops expansion (kingdoms don't spread over ocean easily)
            # Mountains are hard to cross
            if neighbor["terrain"] == "ocean":
                continue
                
            move_cost = 1
            if neighbor["terrain"] == "mountains":
                move_cost = 4
            elif neighbor["terrain"] == "swamp":
                move_cost = 2
                
            new_cost = cost + move_cost
            
            if (nr, nc) not in visited or new_cost < visited[(nr, nc)]:
                visited[(nr, nc)] = new_cost
                neighbor["kingdom_id"] = k_id
                queue.append((nr, nc, k_id, new_cost))
                
    # Visual Output Print
    icons = {
        "ocean": "~~",
        "plains": "..",
        "forest": "TT",
        "mountains": "^^",
        "swamp": ",,",
        "wasteland": "--"
    }
    
    print("\nTERRAIN MAP:")
    for r in range(HEIGHT):
        row_str = " " * (r % 2)
        for c in range(WIDTH):
            h = grid[r][c]
            if h["is_capital"]:
                row_str += "CC "
            else:
                row_str += icons[h["terrain"]] + " "
        print(row_str)
        
    print("\nKINGDOM MAP:")
    for r in range(HEIGHT):
        row_str = " " * (r % 2)
        for c in range(WIDTH):
            h = grid[r][c]
            if h["terrain"] == "ocean":
                row_str += "~~ "
            elif h["kingdom_id"] is not None:
                row_str += f"{h['kingdom_id']}K "
            else:
                row_str += "   "
        print(row_str)
        
if __name__ == "__main__":
    generate_map()
