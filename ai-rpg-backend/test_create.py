import json
from world_generator import generate_world_data

math_world = generate_world_data()

ai_world_data = {
    "main_plot": "Plot",
    "locations": [{"name": "L1", "q": 0, "r": 0}],
    "key_npcs": []
}

world_data = {
    "hexes": math_world.get("hex_grid", []),
    "pois": math_world["pois"],
    "main_plot": ai_world_data.get("main_plot"),
    "locations": ai_world_data.get("locations"),
    "key_npcs": ai_world_data.get("key_npcs")
}

if world_data and world_data.get("hexes"):
    center_hex = next((h for h in world_data["hexes"] if h["q"] == 0 and h["r"] == 0), world_data["hexes"][0])
    initial_location = {"q": center_hex["q"], "r": center_hex["r"], "biome": center_hex.get("terrain", "Plains")}

print("center:", center_hex)
