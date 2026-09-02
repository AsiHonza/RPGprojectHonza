import urllib.request
import json

data = json.dumps({"email": "janmlcak6@gmail.com", "name": "Zloprcek Smrťák"}).encode("utf-8")
req = urllib.request.Request("https://aelthgard-rpg.onrender.com/load-game", data=data, headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.read().decode("utf-8"))
