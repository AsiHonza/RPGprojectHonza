import json
try:
    json.loads('{"a": "b\nc"}', strict=False)
    print("strict=False accepted it")
except Exception as e:
    print("strict=False failed", e)
