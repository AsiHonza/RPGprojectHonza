import requests

res = requests.post("https://ai-rpg-backend.onrender.com/load-game", json={
    "email": "janml@email.cz",
    "api_key": "DUMMY",
    "name": "testak Honzak"
})
data = res.json()
for i, msg in enumerate(data['character']['history']):
    if msg['role'] == 'model':
        print(f"\n--- MSG {i} ---")
        # Write to file to inspect raw bytes
        with open(f"msg_{i}.txt", "w", encoding="utf-8") as f:
            f.write(msg['text'])
        print(f"Saved msg_{i}.txt")
