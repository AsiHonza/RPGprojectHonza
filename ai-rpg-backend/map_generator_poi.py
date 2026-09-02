import json
import random
import sys
import codecs
from perlin_noise import PerlinNoise

sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

WIDTH = 25
HEIGHT = 20
KINGDOMS_COUNT = 7

def get_hex_distance(r1, c1, r2, c2):
    q1 = c1 - (r1 - (r1 & 1)) // 2
    r_1 = r1
    q2 = c2 - (r2 - (r2 & 1)) // 2
    r_2 = r2
    return (abs(q1 - q2) + abs(q1 + r_1 - q2 - r_2) + abs(r_1 - r_2)) // 2

def generate_map():
    noise_elev = PerlinNoise(octaves=3, seed=random.randint(1, 100000))
    noise_moist = PerlinNoise(octaves=4, seed=random.randint(1, 100000))
    
    grid = []
    
    for r in range(HEIGHT):
        row = []
        for c in range(WIDTH):
            e = max(0, min(1, noise_elev([c/WIDTH, r/HEIGHT]) + 0.5))
            m = max(0, min(1, noise_moist([c/WIDTH, r/HEIGHT]) + 0.5))
            
            if e < 0.35: terrain = "ocean"
            elif e > 0.75: terrain = "mountains"
            else:
                if m < 0.4: terrain = "wasteland"
                elif m > 0.65: terrain = "swamp"
                elif m > 0.5: terrain = "forest"
                else: terrain = "plains"
                    
            row.append({
                "row": r, "col": c,
                "terrain": terrain,
                "kingdom_id": None,
                "poi": None
            })
        grid.append(row)
        
    land_hexes = [h for row in grid for h in row if h["terrain"] not in ["ocean", "mountains"]]
    capitals = []
    
    attempts = 0
    while len(capitals) < KINGDOMS_COUNT and attempts < 2000:
        candidate = random.choice(land_hexes)
        attempts += 1
        too_close = any(get_hex_distance(candidate["row"], candidate["col"], cap["row"], cap["col"]) < 4 for cap in capitals)
        if not too_close:
            candidate["poi"] = "capital"
            capitals.append(candidate)
            
    while len(capitals) < KINGDOMS_COUNT:
        candidate = random.choice([h for h in land_hexes if h["poi"] != "capital"])
        candidate["poi"] = "capital"
        capitals.append(candidate)

    queue = []
    for i, cap in enumerate(capitals):
        cap["kingdom_id"] = i + 1
        queue.append((cap["row"], cap["col"], i + 1, 0))
        
    visited = {(cap["row"], cap["col"]): 0 for cap in capitals}
    
    def get_neighbors(r, c):
        dirs = [(0, -1), (1, -1), (-1, 0), (1, 0), (0, 1), (1, 1)] if r % 2 == 0 else [(-1, -1), (0, -1), (-1, 0), (1, 0), (-1, 1), (0, 1)]
        return [(r + dr, c + dc) for dr, dc in dirs if 0 <= r + dr < HEIGHT and 0 <= c + dc < WIDTH]

    while queue:
        queue.sort(key=lambda x: x[3])
        r, c, k_id, cost = queue.pop(0)
        
        for nr, nc in get_neighbors(r, c):
            neighbor = grid[nr][nc]
            if neighbor["terrain"] == "ocean": continue
                
            move_cost = 4 if neighbor["terrain"] == "mountains" else 2 if neighbor["terrain"] == "swamp" else 1
            new_cost = cost + move_cost
            
            if (nr, nc) not in visited or new_cost < visited[(nr, nc)]:
                visited[(nr, nc)] = new_cost
                neighbor["kingdom_id"] = k_id
                queue.append((nr, nc, k_id, new_cost))

    for k_id in range(1, KINGDOMS_COUNT + 1):
        k_hexes = [h for row in grid for h in row if h["kingdom_id"] == k_id and h["poi"] is None]
        random.shuffle(k_hexes)
        
        villages_placed = 0
        for h in k_hexes:
            if h["terrain"] in ["plains", "forest"] and h["poi"] is None:
                h["poi"] = "village"
                villages_placed += 1
            if villages_placed >= 3: break
                
        dungeons_placed = 0
        for h in k_hexes:
            if h["terrain"] in ["mountains", "swamp", "wasteland"] and h["poi"] is None:
                h["poi"] = "dungeon"
                dungeons_placed += 1
            if dungeons_placed >= random.randint(1, 2): break

        for h in k_hexes:
            if h["terrain"] != "ocean" and h["poi"] is None:
                h["poi"] = "shrine"
                break
                
        for h in k_hexes:
            if h["terrain"] in ["forest", "swamp"] and h["poi"] is None:
                h["poi"] = "ruin"
                break

    print("VYSLEDNA MRIZKA (25x20 HEXU)\n")
    print("Legenda Terenu:")
    print("~~ Oceán   .. Pláně   TT Les   ^^ Hory   ,, Bažiny   -- Pustina\n")
    print("Legenda POI (Lokací na mapě):")
    print("C  Hlavní město (Capital)   V  Vesnice (Village)   X  Dungeon   S  Svatyně (Shrine)   R  Ruiny\n")

    for r in range(HEIGHT):
        row_str = " " * (r % 2)
        for c in range(WIDTH):
            h = grid[r][c]
            icon = {"ocean":"~~", "plains":"..", "forest":"TT", "mountains":"^^", "swamp":",,", "wasteland":"--"}[h["terrain"]]
            
            if h["poi"] == "capital": icon = " C"
            elif h["poi"] == "village": icon = " V"
            elif h["poi"] == "dungeon": icon = " X"
            elif h["poi"] == "shrine": icon = " S"
            elif h["poi"] == "ruin": icon = " R"
            
            row_str += f"{icon:<3}"
        print(row_str)

    print("\n\n--- UKAZKA JSON DAT PRO JEDEN HEX (Co posleme AI) ---")
    sample_hex = [h for row in grid for h in row if h["poi"] == "village"][0]
    print(json.dumps(sample_hex, indent=2))
        
if __name__ == "__main__":
    generate_map()
