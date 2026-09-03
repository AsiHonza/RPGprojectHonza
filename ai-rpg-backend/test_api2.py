import requests

res = requests.post("https://ai-rpg-backend.onrender.com/load-game", json={
    "email": "DUMMY",
    "api_key": "DUMMY",
    "name": "testak Honzak"
})
print("Status:", res.status_code)
print(res.text[:500])
