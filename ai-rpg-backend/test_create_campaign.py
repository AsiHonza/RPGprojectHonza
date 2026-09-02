import requests

url = "http://127.0.0.1:8000/create-character"
data = {
    "name": "AragornTest2",
    "dnd_class": "Hraničář",
    "race": "Člověk",
    "stats": {"str": 14, "dex": 16, "con": 12, "int": 10, "wis": 14, "cha": 10},
    "email": "test@test.com",
    "game_mode": "campaign",
    "api_key": ""
}
response = requests.post(url, json=data)
print(response.status_code)
try:
    j = response.json()
    if 'state' in j and 'world_data' in j['state'] and j['state']['world_data']:
        print("World Data generated! Hex count:", len(j['state']['world_data'].get('hex_grid', [])))
        print("POIs enriched by AI:", len(j['state']['world_data'].get('locations', [])))
        print("Main Plot:", j['state']['world_data'].get('main_plot'))
    else:
        print(j)
except Exception as e:
    print(e)
    print(response.text)
