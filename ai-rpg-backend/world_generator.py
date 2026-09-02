import math
import random
from perlin_noise import PerlinNoise
from collections import deque
import heapq

# Axial coordinates (q, r)
HEX_DIRECTIONS = [
    (1, 0), (1, -1), (0, -1),
    (-1, 0), (-1, 1), (0, 1)
]

def get_neighbors(q, r):
    return [(q + dq, r + dr) for dq, dr in HEX_DIRECTIONS]

def generate_hex_grid(radius=10):
    """
    Generates a hexagonal grid of given radius.
    radius=10 means the map spans from -10 to +10 on q and r axes, roughly circular.
    Returns a dict mapping (q,r) -> terrain_info
    """
    noise_elev = PerlinNoise(octaves=3, seed=random.randint(1, 100000))
    noise_moist = PerlinNoise(octaves=3, seed=random.randint(1, 100000))

    grid = {}
    for q in range(-radius, radius + 1):
        for r in range(max(-radius, -q - radius), min(radius, -q + radius) + 1):
            # Scale coordinates for noise
            nx, ny = q / radius, r / radius
            
            # Map [-0.5, 0.5] roughly to [0, 1]
            elev = (noise_elev([nx, ny]) + 0.5)
            moist = (noise_moist([nx, ny]) + 0.5)

            # Terrain mapping
            terrain = "Plains"
            move_cost = 1
            if elev < 0.3:
                if moist > 0.6:
                    terrain = "Swamp"
                    move_cost = 3
                else:
                    terrain = "Plains"
            elif elev > 0.7:
                terrain = "Mountains"
                move_cost = 5
            else:
                if moist < 0.4:
                    terrain = "Desert"
                    move_cost = 2
                elif moist > 0.6:
                    terrain = "Forest"
                    move_cost = 2
                else:
                    terrain = "Hills"
                    move_cost = 2
                    
            grid[(q, r)] = {
                "q": q,
                "r": r,
                "terrain": terrain,
                "has_road": False,
                "is_poi": False,
                "poi_type": None,
                "cost": move_cost
            }
    return grid

def find_path(grid, start, goal):
    """A* pathfinding on hex grid"""
    frontier = []
    heapq.heappush(frontier, (0, start))
    came_from = {start: None}
    cost_so_far = {start: 0}

    def heuristic(a, b):
        return (abs(a[0] - b[0]) + abs(a[0] + a[1] - b[0] - b[1]) + abs(a[1] - b[1])) / 2

    while frontier:
        _, current = heapq.heappop(frontier)

        if current == goal:
            break

        for next_hex in get_neighbors(*current):
            if next_hex not in grid:
                continue
            
            # Water or impassable mountains could have cost infinity, for now mountains just cost 5
            new_cost = cost_so_far[current] + grid[next_hex]["cost"]
            if next_hex not in cost_so_far or new_cost < cost_so_far[next_hex]:
                cost_so_far[next_hex] = new_cost
                priority = new_cost + heuristic(next_hex, goal)
                heapq.heappush(frontier, (priority, next_hex))
                came_from[next_hex] = current

    # Reconstruct path
    path = []
    if goal in came_from:
        curr = goal
        while curr != start:
            path.append(curr)
            curr = came_from[curr]
        path.reverse()
    return path

def generate_world_data():
    radius = 6 # approx 127 hexes total
    grid = generate_hex_grid(radius)
    
    # Pick POIs
    # Filter valid POI hexes (no mountains maybe?)
    valid_pois = [k for k, v in grid.items() if v["terrain"] not in ["Mountains"]]
    
    # Pick 5 POIs
    poi_coords = random.sample(valid_pois, min(5, len(valid_pois)))
    poi_types = ["City", "City", "Ruins", "Camp", "Tower"]
    random.shuffle(poi_types)
    
    pois = []
    for (q, r), ptype in zip(poi_coords, poi_types):
        grid[(q, r)]["is_poi"] = True
        grid[(q, r)]["poi_type"] = ptype
        pois.append({"q": q, "r": r, "terrain": grid[(q, r)]["terrain"], "type": ptype})
        
    # Connect POIs with A*
    for i in range(len(pois) - 1):
        start = (pois[i]["q"], pois[i]["r"])
        end = (pois[i+1]["q"], pois[i+1]["r"])
        path = find_path(grid, start, end)
        for hex_coord in path:
            grid[hex_coord]["has_road"] = True
            
    # Serialize grid to list
    grid_list = list(grid.values())
    
    return {
        "hex_radius": radius,
        "grid": grid_list,
        "pois": pois
    }

if __name__ == "__main__":
    w = generate_world_data()
    print(f"Generated {len(w['grid'])} hexes, {len(w['pois'])} POIs.")
