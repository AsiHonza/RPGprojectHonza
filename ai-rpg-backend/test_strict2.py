import json
try:
    json.loads('{"a": "b\nc"}')
    print("default accepted it")
except Exception as e:
    print("default failed", e)
