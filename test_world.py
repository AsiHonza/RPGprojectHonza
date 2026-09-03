import sys
sys.path.append('./ai-rpg-backend')
from ai_rpg_backend.world_generator import generate_world_data
world = generate_world_data()
print("Success")
