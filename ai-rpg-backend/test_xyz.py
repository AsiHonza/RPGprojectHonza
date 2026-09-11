import requests
r = requests.post("http://127.0.0.1:8000/create-character", json={"name": "test_unique_xyz123", "race": "Human", "dnd_class": "Fighter", "stats": {}, "game_mode": "campaign"})
print(r.status_code, r.text)
