import requests

res = requests.post("https://aelthgard-rpg.onrender.com/create-character", json={
    "name": "TestMage123",
    "dnd_class": "Mage",
    "race": "Elf",
    "stats": "STR: 10, INT: 20",
    "email": "test@test.com",
    "api_key": "DUMMY"
})

print(res.json())
