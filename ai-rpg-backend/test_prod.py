import requests
r = requests.post("https://aelthgard-rpg.onrender.com/create-character", json={"name": "test_error_fetch", "race": "Půlork", "dnd_class": "Barbar", "stats": {}, "game_mode": "campaign"})
print(r.status_code, r.text)
